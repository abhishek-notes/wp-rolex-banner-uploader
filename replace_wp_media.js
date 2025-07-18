#!/usr/bin/env node
/**
 * replace_wp_media.js
 *
 * Fetch the first N media items from a WP site and replace their files
 * with local images in new-images/*, matching by slug.
 * Keeps existing metadata (alt, title, caption, description) intact.
 *
 * Usage:
 *   node replace_wp_media.js
 *
 * Env vars:
 *   WP_USER, APP_PASSWORD, WP_URL
 */
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

// Config
const WP_USER = process.env.WP_USER;
const APP_PASSWORD = process.env.APP_PASSWORD;
const WP_URL = process.env.WP_URL; // e.g. https://example.com
const PER_PAGE = 100;
const MAX_ITEMS = 50;

if (!WP_USER || !APP_PASSWORD || !WP_URL) {
  console.error('Missing WP_USER, APP_PASSWORD or WP_URL in environment');
  process.exit(1);
}

// Basic auth header for axios
function authHeader() {
  return {
    auth: { username: WP_USER, password: APP_PASSWORD }
  };
}

// Fetch the first MAX_ITEMS media items
async function fetchMediaItems() {
  let items = [];
  let page = 1;
  console.log(`Fetching up to ${MAX_ITEMS} media items...`);
  while (items.length < MAX_ITEMS) {
    try {
      const res = await axios.get(
        `${WP_URL}/wp-json/wp/v2/media`,
        Object.assign({
          params: { per_page: PER_PAGE, page, orderby: 'date', order: 'desc' },
          timeout: 30000
        }, authHeader())
      );
      const data = res.data;
      if (!Array.isArray(data) || data.length === 0) break;
      items = items.concat(data.map(m => ({ id: m.id, slug: m.slug })));
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

// Slugify a string: lowercase, remove diacritics, replace non-alnum with hyphens
function slugify(str) {
  return str
    .normalize('NFD')
    .replace(/[ -]/g, c => c) // ensure ascii fallback
    .replace(/[ -]/g, '')
    .replace(/[ -]/g, '')
    .replace(/[ -]/g, '')
    .replace(/[ -]/g, '')
    .replace(/[ -]/g, '')
    .replace(/[ -]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Read all new image files under new-images/*
function getNewImageFiles() {
  const base = path.join(__dirname, 'new-images');
  if (!fs.existsSync(base)) {
    console.error(`Directory not found: ${base}`);
    process.exit(1);
  }
  const files = [];
  for (const dirent of fs.readdirSync(base, { withFileTypes: true })) {
    if (!dirent.isDirectory()) continue;
    const sub = path.join(base, dirent.name);
    for (const fname of fs.readdirSync(sub)) {
      const fpath = path.join(sub, fname);
      if (fs.statSync(fpath).isFile()) {
        files.push({ fileName: fname, filePath: fpath });
      }
    }
  }
  return files;
}

// Match a local file to a media item by slug matching
function matchMediaItem(fileName, mediaItems) {
  let name = path.basename(fileName, path.extname(fileName));
  let fileSlug = slugify(name);
  // remove common suffixes
  const suffixes = ['-soldier-web','-soldier-w','-soldier','-soldat','-web','-w','-scaled'];
  for (const s of suffixes) {
    if (fileSlug.endsWith(s)) fileSlug = fileSlug.slice(0, -s.length);
  }
  // strip leading digits
  fileSlug = fileSlug.replace(/^[0-9]+-/, '');
  // find candidates
  const candidates = mediaItems.filter(m => m.slug.includes(fileSlug));
  if (candidates.length === 1) return candidates[0];
  if (candidates.length > 1) {
    console.warn(`Ambiguous match for ${fileName} (slug: ${fileSlug}): [${candidates.map(m=>m.slug).join(', ')}]`);
    return null;
  }
  console.warn(`No match for ${fileName} (slug: ${fileSlug})`);
  return null;
}

// Replace the media item's file with the local file
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

// Main
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