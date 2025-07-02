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
const { imageSize } = require("image-size");
require("dotenv").config();

// --- 1. Configuration & Setup ---
const { WP_USER, APP_PASSWORD, WP_URL } = process.env;
const SOURCE_DIR = "source-images";
const PROCESSED_DIR = "processed-images";

if (!WP_USER || !APP_PASSWORD || !WP_URL) {
    console.error("❌ Fatal: A required variable in your .env file is missing.");
    console.error("Required: WP_USER, APP_PASSWORD, WP_URL");
    process.exit(1);
}
if (!fs.existsSync(SOURCE_DIR)) {
    console.log(`📂 Creating source directory: ./${SOURCE_DIR}`);
    fs.mkdirSync(SOURCE_DIR);
}

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
        // Extract dimensions from filename if available (e.g. 3360x840)
        const dimensionMatch = file.match(/(\d{3,4})x(\d{3,4})/);
        let dims = null;
        
        if (dimensionMatch) {
            dims = { width: parseInt(dimensionMatch[1]), height: parseInt(dimensionMatch[2]) };
            console.log(`   - Reading: ${file} (${dims.width}x${dims.height})`);
        } else {
            // Try to read with image-size as fallback
            try {
                dims = imageSize(filePath);
                console.log(`   - Reading: ${file} (${dims.width}x${dims.height})`);
            } catch (e) {
                console.warn(`Could not read dimensions for ${file}. Error:`, e.message);
                continue;
            }
        }
        
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
    }

    if (!desktopFile || !mobileFile) {
        throw new Error("Could not identify both a desktop and a mobile image. Please check the files in './source-images'.");
    }

    return { desktopFile, mobileFile, modelNumber };
}


// --- 3. Metadata Generation & Upload Logic ---
function generateMetadata(type, options) {
    console.log(`\n🤖 Generating metadata for ${type} banners...`);
    let metadataBatch = [];

    if (type === 'monthly') {
        const { month, collection, modelNumber, desktopFile, mobileFile } = options;
        const collectionHyphenated = collection.replace(/\s+/g, '-');
        
        // Generate 4 variants for monthly banners
        const variants = [
            { variant: 'Desktop', type: 'Monthly', source: desktopFile },
            { variant: 'Mobile', type: 'Monthly', source: mobileFile },
            { variant: 'Discover-Page-Desktop', type: 'Discover Page', source: desktopFile },
            { variant: 'Discover-Page-Mobile', type: 'Discover Page', source: mobileFile }
        ];

        variants.forEach(v => {
            const isDiscover = v.variant.includes('Discover');
            const deviceType = v.variant.includes('Desktop') ? 'Desktop' : 'Mobile';
            
            metadataBatch.push({
                originalPath: v.source.path,
                newFilename: `Rolex-at-Palladio-${month}-${v.variant}-Banner-${collectionHyphenated}_${modelNumber}.jpg`,
                title: `Rolex at Palladio Jewellers in Vancouver - Official Rolex Retailer - ${collection} ${modelNumber} - ${month} ${v.type} Banner ${deviceType}`,
                alt: `Rolex at Palladio Jewellers - ${collection} - ${month} ${v.type} Banner ${deviceType}`,
                caption: `Palladio Jewellers - Official Rolex Retailer - Vancouver - ${month} ${v.variant.replace('-', ' ')} Banner - ${collection} ${modelNumber}`,
                description: isDiscover 
                    ? `Discover-page ${deviceType.toLowerCase()} banner for the ${month} Rolex ${collection} feature at Palladio Jewellers, Official Rolex Retailer in Vancouver.`
                    : `${deviceType} banner for the ${month} "Watch of the Month," the Rolex ${collection}, at Palladio Jewellers, Official Rolex Retailer in Vancouver.`
            });
        });
    } else if (type === 'blog') {
        const { title, hyphenatedTitle, desktopFile, mobileFile } = options;
        
        // Generate 2 variants for blog banners
        const variants = [
            { variant: 'Desktop', source: desktopFile },
            { variant: 'Mobile', source: mobileFile }
        ];

        variants.forEach(v => {
            metadataBatch.push({
                originalPath: v.source.path,
                newFilename: `Rolex-at-Palladio-${hyphenatedTitle}-${v.variant}-Banner.jpg`,
                title: `${title} - Official Rolex Retailer in Vancouver - Palladio Jewellers`,
                alt: `${title} - Banner at Palladio Jewellers - ${v.variant}`,
                caption: `Palladio Jewellers - Official Rolex Retailer - Vancouver - ${title} Banner`,
                description: `A ${v.variant.toLowerCase()} banner for the blog post "${title}" at Palladio Jewellers, an Official Rolex Retailer in Vancouver.`
            });
        });
    }

    console.log("✅ Generated metadata for " + metadataBatch.length + " items.");
    return metadataBatch;
}

async function processAndUpload(metadataBatch) {
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
        
        const metadataBatch = generateMetadata('monthly', {
            month: argv.month,
            collection: argv.collection,
            modelNumber,
            desktopFile,
            mobileFile
        });
        
        await processAndUpload(metadataBatch);
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

        const metadataBatch = generateMetadata('blog', {
            title: argv.title,
            hyphenatedTitle,
            desktopFile,
            mobileFile
        });
        
        await processAndUpload(metadataBatch);
    })
    .demandCommand(1, "You must specify a command: 'monthly' or 'blog'.")
    .help()
    .alias('help', 'h')
    .strict()
    .argv;