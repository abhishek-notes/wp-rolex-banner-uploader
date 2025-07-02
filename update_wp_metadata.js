/**
 * update_wp_metadata.js
 * Reads rolex_metadata_updates.csv and pushes alt text, title, caption,
 * and description updates to WordPress via the REST API.
 *
 * Usage:
 * node update_wp_metadata.js
 * # with .env file containing WP_USER, APP_PASSWORD, WP_URL
 */

require("dotenv").config()
const fs = require("fs")
const path = require("path")
const axios = require("axios")
const { parse } = require("csv-parse/sync") // Use synchronous parser

// --- Configuration ---
const WP_USER = process.env.WP_USER
const APP_PASSWORD = process.env.APP_PASSWORD
const WP_URL = process.env.WP_URL?.replace(/\/$/, "") // Remove trailing slash if present
const CSV_FILE = "rolex_metadata_updates.csv"

// Rate limiting (adjust as needed)
const REQUEST_DELAY_MS = 500 // Delay between requests in milliseconds

// --- Validation ---
if (!WP_USER || !APP_PASSWORD || !WP_URL) {
	console.error(
		"❌ Error: WP_USER, APP_PASSWORD, or WP_URL missing. Check your .env file."
	)
	process.exit(1)
}
if (!fs.existsSync(CSV_FILE)) {
	console.error(`❌ Error: Cannot find CSV file: ${CSV_FILE}`)
	process.exit(1)
}

// --- Authentication ---
const token = Buffer.from(`${WP_USER}:${APP_PASSWORD}`).toString("base64")
const headers = {
	Authorization: `Basic ${token}`,
	"Content-Type": "application/json",
}

// --- Read CSV ---
let records = []
try {
	const csvData = fs.readFileSync(path.resolve(__dirname, CSV_FILE))
	records = parse(csvData, {
		columns: true,
		skip_empty_lines: true,
		trim: true, // Trim whitespace from fields
	})
	console.log(`ℹ️ Found ${records.length} records in ${CSV_FILE}`)
} catch (err) {
	console.error(`❌ Error reading or parsing CSV file: ${err.message}`)
	process.exit(1)
}

// --- Helper Function for Delay ---
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// --- Main Update Logic ---
;(async () => {
	console.log("🚀 Starting metadata update process...")
	let successCount = 0
	let errorCount = 0

	for (let i = 0; i < records.length; i++) {
		const record = records[i]
		const mediaId = record.id
		const apiUrl = `${WP_URL}/wp-json/wp/v2/media/${mediaId}`

		// --- Input Validation for Record ---
		if (!mediaId || isNaN(parseInt(mediaId))) {
			console.warn(`⚠️ Skipping record ${i + 1}: Invalid or missing ID.`)
			errorCount++
			continue
		}
		// Check if all generated fields are present, even if empty string is valid
		if (
			typeof record.generated_alt_text === "undefined" ||
			typeof record.generated_title === "undefined" ||
			typeof record.generated_caption === "undefined" ||
			typeof record.generated_description === "undefined"
		) {
			console.warn(
				`⚠️ Skipping record ${
					i + 1
				} (ID: ${mediaId}): One or more generated fields missing in CSV row.`
			)
			errorCount++
			continue
		}

		const payload = {
			alt_text: record.generated_alt_text || "", // Ensure empty string if null/undefined
			title: record.generated_title || "",
			caption: record.generated_caption || "",
			description: record.generated_description || "",
		}

		try {
			console.log(`⏳ Updating ID: ${mediaId}... (${i + 1}/${records.length})`)
			const response = await axios.post(apiUrl, payload, { headers }) // Use POST for update as per WP REST API v2

			if (response.status === 200 || response.status === 201) {
				console.log(
					`✅ Success: Updated ID ${mediaId}. Alt: "${payload.alt_text}", Title: "${payload.title}"`
				)
				successCount++
			} else {
				console.warn(
					`⚠️ Warning: Update for ID ${mediaId} returned status ${response.status}. Response: ${response.data}`
				)
				errorCount++
			}
		} catch (err) {
			console.error(
				`❌ Error updating ID ${mediaId}:`,
				err.response?.data?.message || err.message
			)
			errorCount++
		}

		// Wait before the next request to avoid overwhelming the server
		if (i < records.length - 1) {
			await wait(REQUEST_DELAY_MS)
		}
	}

	console.log("\n--- Update Summary ---")
	console.log(`✅ Successful updates: ${successCount}`)
	console.log(`❌ Failed/Skipped updates: ${errorCount}`)
	console.log("🏁 Metadata update process finished.")
})()
