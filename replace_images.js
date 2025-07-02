#!/usr/bin/env node
/**
 * replace_images.js
 *
 * Fetch the first N media items from a WP site and replace their files
 * with local images in new-images/*, matching by slug.
 * Keeps existing metadata (alt, title, caption, description) intact.
 *
 * Usage:
 *   node replace_images.js
 *
 * Env vars:
 *   WP_USER, APP_PASSWORD, WP_URL
 */
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const stringSimilarity = require('string-similarity');
require('dotenv').config();

// Config
const WP_USER = process.env.WP_USER;
const APP_PASSWORD = process.env.APP_PASSWORD;
const WP_URL = process.env.WP_URL; // e.g. https://example.com
const PER_PAGE = 100;
const MAX_ITEMS = 50;
// Fuzzy matching thresholds
const THRESHOLD = 0.3;        // minimal similarity to accept a match
const AMBIGUITY_DELTA = 0.1;  // minimal difference between top two scores

if (!WP_USER || !APP_PASSWORD || !WP_URL) {
  console.error('Missing WP_USER, APP_PASSWORD or WP_URL in environment');
  process.exit(1);
}

// Fetch the first MAX_ITEMS media items via WP REST API
async function fetchMediaItems() {
  let items = [];
  let page = 1;
  console.log(`Fetching up to ${MAX_ITEMS} media items...`);
  while (items.length < MAX_ITEMS) {
    try {
      const res = await axios.get(
        `${WP_URL}/wp-json/wp/v2/media`,
        {
          auth: { username: WP_USER, password: APP_PASSWORD },
          params: { per_page: PER_PAGE, page, orderby: 'date', order: 'desc' },
          timeout: 30000,
        }
      );
      const data = res.data;
      if (!Array.isArray(data) || data.length === 0) break;
      items.push(...data.map(m => {
        // extract plain metadata
        const title = (m.title?.rendered || '').replace(/<[^>]*>/g, '').trim();
        const alt_text = (m.alt_text || '').trim();
        const caption = (m.caption?.rendered || '').replace(/<[^>]*>/g, '').trim();
        return { id: m.id, slug: m.slug, title, alt_text, caption };
      }));
      console.log(`  Page ${page}: fetched ${data.length}, total ${items.length}`);
      if (data.length < PER_PAGE) break;
      page++;
    } catch (err) {
      if (err.response && err.response.status === 400) break;
      throw err;
    }
  }
  return items.slice(0, MAX_ITEMS);
}

// Slugify: remove diacritics, lowercase, replace non-alnum with hyphens
function slugify(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove diacritics
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')     // replace non-alnum with hyphen
    .replace(/^-+|-+$/g, '');        // trim hyphens
}

// Read all local image files under new-images/*
function getNewImageFiles() {
  const base = path.join(__dirname, 'new-images');
  if (!fs.existsSync(base)) {
    console.error(`Directory not found: ${base}`);
    process.exit(1);
  }
  const files = [];
  for (const dirent of fs.readdirSync(base, { withFileTypes: true })) {
    if (!dirent.isDirectory()) continue;
    const dirPath = path.join(base, dirent.name);
    for (const fname of fs.readdirSync(dirPath)) {
      const filePath = path.join(dirPath, fname);
      if (fs.statSync(filePath).isFile()) {
        files.push({ fileName: fname, filePath });
      }
    }
  }
  return files;
}

// Attempt to match a local file to a media item using fuzzy metadata matching
function matchMediaItem(fileName, mediaItems) {
  const name = path.basename(fileName, path.extname(fileName));
  // prepare key: slugify and strip common suffixes/leading digits
  let key = slugify(name);
  const suffixes = ['-soldier-web','-soldier-w','-soldier','-soldat','-web','-w','-scaled'];
  for (const s of suffixes) {
    if (key.endsWith(s)) key = key.slice(0, -s.length);
  }
  key = key.replace(/^[0-9]+-/, '');
  // compute similarity scores against each media item's metadata
  const scored = mediaItems.map(m => {
    const text = [
      m.slug.replace(/-/g, ' '),
      m.title,
      m.alt_text,
      m.caption
    ].join(' ').toLowerCase();
    const score = stringSimilarity.compareTwoStrings(key.toLowerCase(), text);
    return { media: m, score };
  });
  scored.sort((a, b) => b.score - a.score);
  const best = scored[0];
  const second = scored[1];
  if (!best || best.score < THRESHOLD) {
    console.warn(`No fuzzy match for ${fileName}, best candidate ${best?.media.slug || 'none'} (${(best?.score || 0).toFixed(2)})`);
    return null;
  }
  if (second && best.score - second.score < AMBIGUITY_DELTA) {
    console.warn(`Ambiguous fuzzy match for ${fileName}: top ${best.media.slug} (${best.score.toFixed(2)}), next ${second.media.slug} (${second.score.toFixed(2)})`);
    return null;
  }
  return best.media;
}

// Replace the remote media file via WP REST API
async function replaceMediaFile(mediaId, filePath) {
  const url = `${WP_URL}/wp-json/wp/v2/media/${mediaId}`;
  const form = new FormData();
  form.append('file', fs.createReadStream(filePath));
  const headers = form.getHeaders();
  const token = Buffer.from(`${WP_USER}:${APP_PASSWORD}`).toString('base64');
  headers.Authorization = `Basic ${token}`;
  const res = await axios.post(url, form, {
    headers,
    maxContentLength: Infinity,
    maxBodyLength: Infinity
  });
  return res.data;
}

// Main execution
(async () => {
  try {
    const mediaItems = await fetchMediaItems();
    console.log(`Total media fetched: ${mediaItems.length}`);
    const newFiles = getNewImageFiles();
    console.log(`Local new-images files: ${newFiles.length}`);
    const matches = [];
    const unmatched = [];
    for (const f of newFiles) {
      const m = matchMediaItem(f.fileName, mediaItems);
      if (m) matches.push({ ...f, mediaId: m.id, mediaSlug: m.slug });
      else unmatched.push(f);
    }
    console.log(`Matched: ${matches.length}, Unmatched: ${unmatched.length}`);
    for (const { fileName, filePath, mediaId } of matches) {
      try {
        await replaceMediaFile(mediaId, filePath);
        console.log(`Replaced: ${fileName} -> media ${mediaId}`);
      } catch (err) {
        console.error(`Error replacing ${fileName} (ID: ${mediaId}):`, err.message || err);
      }
    }
    if (unmatched.length) {
      console.warn('Unmatched files:');
      unmatched.forEach(u => console.warn(`  - ${u.fileName}`));
    }
  } catch (err) {
    console.error('Fatal error:', err.response?.data || err.message || err);
    process.exit(1);
  }
})();