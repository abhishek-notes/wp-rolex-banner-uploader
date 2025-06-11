#!/usr/bin/env node
/**
 * autoUploader.js
 *
 * An intelligent, autonomous script for generating and uploading Rolex banners to WordPress.
 * Scans a `source-images` directory, identifies files by dimension, extracts metadata,
 * uses an AI to generate filenames/tags, and uploads everything.
 *
 * --- USAGE ---
 *
 * For Monthly Banners:
 * node autoUploader.js monthly --collection "Cosmograph Daytona" [--month "June"]
 *
 * For Blog Post Banners:
 * node autoUploader.js blog --title "Rolex and the Vienna Philharmonic"
 *
 * Place your 2 source images (1 desktop, 1 mobile) in the `source-images` folder before running.
 */

// --- Core Dependencies ---
const fs = require("fs");
const path = require("path");
const axios = require("axios");
const FormData = require("form-data");
const yargs = require("yargs/yargs");
const { hideBin } = require("yargs/helpers");
const Anthropic = require("@anthropic-ai/sdk");
const imageSize = require("image-size");
require("dotenv").config();

// --- 1. Configuration & Setup ---
const { WP_USER, APP_PASSWORD, WP_URL, ANTHROPIC_API_KEY } = process.env;
const SOURCE_DIR = "source-images";
const PROCESSED_DIR = "processed-images";

if (!WP_USER || !APP_PASSWORD || !WP_URL || !ANTHROPIC_API_KEY) {
    console.error("❌ Fatal: A required variable in your .env file is missing.");
    console.error("Required: WP_USER, APP_PASSWORD, WP_URL, ANTHROPIC_API_KEY");
    process.exit(1);
}
if (!fs.existsSync(SOURCE_DIR)) {
    console.log(`📂 Creating source directory: ./${SOURCE_DIR}`);
    fs.mkdirSync(SOURCE_DIR);
}

const anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });

// --- 2. File Intelligence: Identify Source Files ---
function findAndIdentifySourceFiles() {
    console.log(`\n🔍 Scanning './${SOURCE_DIR}' for images...`);
    const files = fs.readdirSync(SOURCE_DIR).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));

    if (files.length < 2) {
        throw new Error(`Expected at least 2 image files in './${SOURCE_DIR}', but found ${files.length}. Please add the desktop and mobile banner images.`);
    }
    if (files.length > 2) {
        console.warn(`⚠️ Warning: Found ${files.length} images. The script will only process the first identified desktop and mobile files.`);
    }

    let desktopFile, mobileFile, modelNumber;

    for (const file of files) {
        const filePath = path.join(SOURCE_DIR, file);
        try {
            const dims = imageSize(filePath);
            // Heuristic: Desktop banners are significantly wider than they are tall.
            if ((dims.width / dims.height) > 2 && !desktopFile) {
                desktopFile = { path: filePath, name: file };
                console.log(`   - Identified Desktop: ${file} (${dims.width}x${dims.height})`);
            } else if (!mobileFile) {
                mobileFile = { path: filePath, name: file };
                console.log(`   - Identified Mobile:  ${file} (${dims.width}x${dims.height})`);
            }

            // Extract model number (e.g., M126518LN-0014) from filename
            const match = file.match(/(M\d{5,}[A-Z\d-]*)/i);
            if (match && !modelNumber) {
                modelNumber = match[0];
                console.log(`   - Extracted Model #:  ${modelNumber}`);
            }

        } catch (e) {
            console.warn(`Could not read dimensions for ${file}. Skipping.`);
        }
    }

    if (!desktopFile || !mobileFile) {
        throw new Error("Could not identify both a desktop and a mobile image. Please check the files in './source-images'.");
    }

    return { desktopFile, mobileFile, modelNumber };
}


// --- 3. AI Interaction & Upload Logic ---
async function runAiAndUpload(prompt) {
    console.log(`\n🤖 Asking AI to generate metadata...`);
    let metadataBatch;
    try {
        const msg = await anthropic.messages.create({
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 2048,
            messages: [{ role: "user", content: prompt }],
        });
        const jsonResponse = msg.content[0].text;
        metadataBatch = JSON.parse(jsonResponse);
        console.log("✅ AI responded successfully. Received metadata for " + metadataBatch.length + " items.");
    } catch (error) {
        console.error("❌ Fatal: Error calling AI API:", error.message);
        process.exit(1);
    }
    
    // Process and upload the batch
    if (!fs.existsSync(PROCESSED_DIR)) fs.mkdirSync(PROCESSED_DIR);
    
    console.log("\n--- 📤 Processing and Uploading to WordPress ---");
    let uploadSuccess = 0, uploadFail = 0;

    for (const item of metadataBatch) {
        const destinationPath = path.join(PROCESSED_DIR, item.newFilename);
        fs.copyFileSync(item.originalPath, destinationPath); // Copy from source to processed with new name
        
        const form = new FormData();
        form.append("file", fs.createReadStream(destinationPath), item.newFilename);
        form.append("title", item.title);
        form.append("alt_text", item.alt);
        form.append("caption", item.caption);
        form.append("description", item.description);

        try {
            const response = await axios.post(`${WP_URL}/wp-json/wp/v2/media`, form, {
                headers: { ...form.getHeaders(), Authorization: `Basic ${Buffer.from(`${WP_USER}:${APP_PASSWORD}`).toString("base64")}` },
                maxContentLength: Infinity,
                maxBodyLength: Infinity,
            });
            console.log(`   ✅ Uploaded: ${item.newFilename} (ID: ${response.data.id})`);
            uploadSuccess++;
        } catch (err) {
            console.error(`   ❌ FAILED to upload ${item.newFilename}: ${err.response?.data?.message || err.message}`);
            uploadFail++;
        }
    }
    
    // Cleanup
    if (uploadSuccess > 0) {
        console.log("\n🧹 Cleaning up source files...");
        metadataBatch.forEach(item => {
            if (fs.existsSync(item.originalPath)) fs.unlinkSync(item.originalPath);
        });
        console.log("   - Done.");
    }
    
    console.log("\n--- ✨ Process Complete ✨ ---");
    console.log(`   - Successful Uploads: ${uploadSuccess}`);
    console.log(`   - Failed/Skipped: ${uploadFail}`);
    console.log("----------------------------");
}

// --- 4. Command-Line Interface Definition ---
yargs(hideBin(process.argv))
    .command('monthly', 'Generate and upload a monthly "Watch of the Month" banner', (yargs) => {
        return yargs
            .option('collection', {
                alias: 'c', type: 'string',
                description: 'The Rolex collection name (e.g., "Cosmograph Daytona")',
                demandOption: true,
            })
            .option('month', {
                alias: 'm', type: 'string',
                description: 'The full month name (defaults to current month)',
                default: new Date().toLocaleString('default', { month: 'long' }),
            });
    }, async (argv) => {
        const { desktopFile, mobileFile, modelNumber } = findAndIdentifySourceFiles();
        if (!modelNumber) {
            throw new Error("Could not automatically extract a model number (e.g., M12345-0001) from the filenames in './source-images'.");
        }
        
        const prompt = `
            You are a WordPress assistant for "Palladio Jewellers."
            Generate metadata for a monthly banner for 4 variants (Homepage Desktop/Mobile, Discover Page Desktop/Mobile).
            
            --- DETAILS ---
            - Month: ${argv.month}
            - Collection Name: ${argv.collection}
            - Model Number: ${modelNumber}
            - Source for Desktop variants: ${desktopFile.path}
            - Source for Mobile variants: ${mobileFile.path}

            --- PATTERNS ---
            - Filename: Rolex-at-Palladio-{Month}-{Homepage/Discover-Page}-{Desktop/Mobile}-Banner-{CollectionName-Hyphenated}_{ModelNumber}.jpg
            - Alt Text: Rolex at Palladio Jewellers - {Collection Name} - {Month} {Monthly/Discover Page} Banner {Desktop/Mobile}
            - Title: Rolex at Palladio Jewellers in Vancouver - Official Rolex Retailer - {Collection Name} {ModelNumber} - {Month} {Monthly/Discover Page} Banner {Desktop/Mobile}
            - Caption: Palladio Jewellers - Official Rolex Retailer - Vancouver - {Month} {Desktop/Mobile/Discover Page Desktop/Discover Page Mobile} Banner - {Collection Name} {ModelNumber}
            - Description (Homepage): {Desktop/Mobile} banner for the {Month} "Watch of the Month," the Rolex {Collection Name}, at Palladio Jewellers, Official Rolex Retailer in Vancouver.
            - Description (Discover Page): Discover-page {desktop/mobile} banner for the {Month} Rolex {Collection Name} feature at Palladio Jewellers, Official Rolex Retailer in Vancouver.
            
            --- OUTPUT ---
            Respond with ONLY a valid JSON array of 4 objects. Each object must contain: originalPath, newFilename, title, alt, caption, description. Use the correct source path for desktop vs. mobile.
        `;
        await runAiAndUpload(prompt);
    })
    .command('blog', 'Generate and upload a banner for a blog post', (yargs) => {
        return yargs.option('title', {
            alias: 't', type: 'string',
            description: 'The title of the blog post (e.g., "The Rolex SailGP Championship")',
            demandOption: true,
        });
    }, async (argv) => {
        const { desktopFile, mobileFile } = findAndIdentifySourceFiles();
        const hyphenatedTitle = argv.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

        const prompt = `
            You are a WordPress assistant for "Palladio Jewellers."
            Generate metadata for a blog post banner for 2 variants (Desktop/Mobile).

            --- DETAILS ---
            - Blog Title: ${argv.title}
            - Hyphenated Title for Filename: ${hyphenatedTitle}
            - Source for Desktop variant: ${desktopFile.path}
            - Source for Mobile variant: ${mobileFile.path}

            --- PATTERNS ---
            - Filename: Rolex-at-Palladio-${hyphenatedTitle}-{Desktop/Mobile}-Banner.jpg
            - Alt Text: ${argv.title} - Banner at Palladio Jewellers - {Desktop/Mobile}
            - Title: ${argv.title} - Official Rolex Retailer in Vancouver - Palladio Jewellers
            - Caption: Palladio Jewellers - Official Rolex Retailer - Vancouver - ${argv.title} Banner
            - Description: A {desktop/mobile} banner for the blog post "${argv.title}" at Palladio Jewellers, an Official Rolex Retailer in Vancouver.
            
            --- OUTPUT ---
            Respond with ONLY a valid JSON array of 2 objects. Each object must contain: originalPath, newFilename, title, alt, caption, description. Use the correct source path for desktop vs. mobile.
        `;
        await runAiAndUpload(prompt);
    })
    .demandCommand(1, "You must specify a command: 'monthly' or 'blog'.")
    .help()
    .alias('help', 'h')
    .strict()
    .argv;