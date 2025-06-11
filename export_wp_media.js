#!/usr/bin/env node
/**
 * export_wp_media.js
 * Fetch the 500 most‑recent media items from a WP site
 * and save their metadata to JSON + CSV.
 *
 * Usage:
 *   node export_wp_media.js
 *
 * Env vars (or hard‑code like your upload script):
 *   WP_USER, APP_PASSWORD, WP_URL   – same as before
 */

const fs = require("fs")
const path = require("path")
const axios = require("axios")
require("dotenv").config()

// ────────────────────────────────────
// 1. Config – pull from env or hard‑code
// ────────────────────────────────────
const WP_USER = process.env.WP_USER
const APP_PASSWORD = process.env.APP_PASSWORD
const WP_URL = process.env.WP_URL

const PER_PAGE = 100 // WP max
const MAX_ITEMS = 500 // adjust if you want more/less

// ────────────────────────────────────
// 2. Helpers
// ────────────────────────────────────
function authHeader() {
	const token = Buffer.from(`${WP_USER}:${APP_PASSWORD}`).toString("base64")
	return { Authorization: `Basic ${token}` }
}

function mediaEndpoint(page = 1) {
	const url = `${WP_URL}/wp-json/wp/v2/media`
	return axios.get(url, {
		params: {
			per_page: PER_PAGE,
			page,
			orderby: "date",
			order: "desc",
		},
		headers: authHeader(),
		timeout: 30000,
	})
}

// ────────────────────────────────────
// 3. Fetch loop
// ────────────────────────────────────
async function fetchAllMedia() {
	let page = 1
	let items = []

	console.log("⏳ Fetching media…")

	while (items.length < MAX_ITEMS) {
		try {
			const res = await mediaEndpoint(page)
			const batch = res.data

			if (!Array.isArray(batch) || batch.length === 0) break
			items = items.concat(batch)

			console.log(`   • Page ${page}: +${batch.length}`)

			if (batch.length < PER_PAGE) break // reached last page
			page += 1
		} catch (err) {
			// WP returns 400 beyond the last page; bail gracefully
			if (err.response?.status === 400) break
			throw err
		}
	}

	return items.slice(0, MAX_ITEMS)
}

// ────────────────────────────────────
// 4. Main
// ────────────────────────────────────
;(async () => {
	try {
		const media = await fetchAllMedia()
		console.log(`✅ Pulled ${media.length} items`)

		// Extract the fields we need
		const rows = media.map((m) => ({
			id: m.id,
			slug: m.slug,
			filename: m.media_details?.file || path.basename(m.source_url || ""),
			source_url: m.source_url,
			alt_text: m.alt_text,
			title: m.title?.rendered || "",
			caption: m.caption?.rendered || "",
			description: m.description?.rendered || "",
			date: m.date,
			mime_type: m.mime_type,
		}))

		// Write JSON
		fs.writeFileSync("wp_images.json", JSON.stringify(rows, null, 2), "utf8")
		console.log("📝  Saved wp_images.json")

		// Simple CSV (no external deps)
		const csvHeader =
			"id,slug,filename,source_url,alt_text,title,caption,description,date,mime_type\n"
		const csvRows = rows
			.map((r) =>
				[
					r.id,
					r.slug,
					r.filename,
					r.source_url,
					r.alt_text,
					r.title,
					r.caption,
					r.description,
					r.date,
					r.mime_type,
				]
					.map(
						(field) => `"${String(field || "").replace(/"/g, '""')}"` // CSV‑escape quotes
					)
					.join(",")
			)
			.join("\n")

		fs.writeFileSync("wp_images.csv", csvHeader + csvRows, "utf8")
		console.log("📝  Saved wp_images.csv")
	} catch (err) {
		console.error("❌  Error:", err.response?.data?.message || err.message)
		process.exit(1)
	}
})()
