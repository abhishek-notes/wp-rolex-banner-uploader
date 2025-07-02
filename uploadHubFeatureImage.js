#!/usr/bin/env node

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

const WP_URL = process.env.WP_URL;
const WP_USER = process.env.WP_USER;
const APP_PASSWORD = process.env.APP_PASSWORD;

if (!WP_URL || !WP_USER || !APP_PASSWORD) {
    console.error('❌ Missing required environment variables: WP_URL, WP_USER, APP_PASSWORD');
    process.exit(1);
}

function generateHubFeatureMetadata(filename) {
    // Detect if this is the Endurance hub feature image
    if (filename.toLowerCase().includes('endurance') && filename.toLowerCase().includes('le_mans')) {
        return {
            title: 'Endurance Blog Hub - Le Mans 24 Hours Feature Image - Rolex at Palladio Jewellers - Official Rolex Retailer',
            alt: 'Rolex at Palladio Jewellers - Endurance Blog Hub - Le Mans 24 Hours Feature',
            caption: 'Endurance Blog Hub Feature - Le Mans 24 Hours - Palladio Jewellers Official Rolex Retailer Vancouver',
            description: 'Hub feature image for the Endurance blog showcasing the Le Mans 24 Hours endurance racing championship at Palladio Jewellers, Official Rolex Retailer in Vancouver. This thumbnail represents the blog section covering Rolex\'s partnership with endurance motorsport.',
            newFilename: 'Endurance-Blog-Hub-Le-Mans-24hr-Feature-Rolex-Palladio.jpg'
        };
    }
    
    // Default fallback for other hub images
    return {
        title: 'Blog Hub Feature Image - Rolex at Palladio Jewellers - Official Rolex Retailer',
        alt: 'Rolex at Palladio Jewellers - Blog Hub Feature',
        caption: 'Blog Hub Feature - Palladio Jewellers Official Rolex Retailer Vancouver',
        description: 'Feature image for blog hub section at Palladio Jewellers, Official Rolex Retailer in Vancouver.',
        newFilename: 'Blog-Hub-Feature-Rolex-Palladio.jpg'
    };
}

async function uploadHubImage(filePath) {
    try {
        const filename = path.basename(filePath);
        const metadata = generateHubFeatureMetadata(filename);
        
        console.log(`📤 Uploading Hub Feature: ${filename} → ${metadata.newFilename}`);
        console.log(`   📏 Detected as hub/thumbnail feature image`);
        
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath), metadata.newFilename);
        formData.append('title', metadata.title);
        formData.append('alt_text', metadata.alt);
        formData.append('caption', metadata.caption);
        formData.append('description', metadata.description);
        
        const response = await axios.post(`${WP_URL}/wp-json/wp/v2/media`, formData, {
            headers: {
                ...formData.getHeaders(),
                'Authorization': `Basic ${Buffer.from(`${WP_USER}:${APP_PASSWORD}`).toString('base64')}`
            }
        });
        
        console.log(`   ✅ Success: ${metadata.newFilename} (ID: ${response.data.id})`);
        console.log(`   🔗 WordPress URL: ${response.data.source_url}`);
        
        return {
            success: true,
            id: response.data.id,
            filename: metadata.newFilename,
            originalFilename: filename,
            url: response.data.source_url
        };
        
    } catch (error) {
        console.error(`   ❌ Failed: ${path.basename(filePath)} - ${error.message}`);
        return {
            success: false,
            error: error.message,
            filename: path.basename(filePath)
        };
    }
}

async function main() {
    const sourceDir = './source-images';
    
    if (!fs.existsSync(sourceDir)) {
        console.error(`❌ Source directory '${sourceDir}' does not exist`);
        process.exit(1);
    }
    
    const files = fs.readdirSync(sourceDir)
        .filter(file => file.toLowerCase().endsWith('.jpg'))
        .map(file => path.join(sourceDir, file));
    
    if (files.length === 0) {
        console.error(`❌ No JPG files found in '${sourceDir}'`);
        process.exit(1);
    }
    
    console.log(`🚀 Starting upload of ${files.length} hub feature image(s)...\n`);
    
    const results = [];
    for (const file of files) {
        const result = await uploadHubImage(file);
        results.push(result);
    }
    
    console.log('\n--- 📊 HUB FEATURE UPLOAD SUMMARY ---');
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    console.log(`✅ Successful: ${successful.length}/${results.length}`);
    if (successful.length > 0) {
        console.log('\nHub Feature Images:');
        successful.forEach(result => {
            console.log(`   • ${result.filename} (ID: ${result.id})`);
            console.log(`     URL: ${result.url}`);
        });
    }
    
    if (failed.length > 0) {
        console.log(`\n❌ Failed: ${failed.length}/${results.length}`);
        failed.forEach(result => {
            console.log(`   • ${result.filename}: ${result.error}`);
        });
    }
    
    // Cleanup source files on success
    if (successful.length === results.length) {
        console.log('\n🧹 Cleaning up source files...');
        files.forEach(file => fs.unlinkSync(file));
        console.log('   ✅ Source files cleaned up');
    }
    
    console.log('\n🎉 Hub feature image upload complete!');
}

main().catch(console.error);