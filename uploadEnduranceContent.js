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

// Content mapping for Endurance blog images
const contentMapping = {
    'DAYT25zs_00542': {
        subject: 'Rolex Cosmograph Daytona',
        context: 'Endurance Racing',
        description: 'Rolex Cosmograph Daytona - the official timepiece of endurance racing'
    },
    'LEMANS_2406aw_0393-LEMANS20js_11892_XL': {
        subject: 'Le Mans 24 Hours',
        context: 'Endurance Racing Championship',
        description: 'Le Mans 24 Hours - the ultimate test of endurance in motorsport'
    },
    'jchadwick2503bh_301': {
        subject: 'Jamie Chadwick',
        context: 'Endurance Racing Champion',
        description: 'Jamie Chadwick - professional racing driver and Rolex ambassador'
    },
    'lemans17js_0048': {
        subject: 'Le Mans Circuit',
        context: 'Endurance Racing Venue',
        description: 'Le Mans racing circuit - home of the legendary 24-hour endurance race'
    },
    'tkristensen2501cc_1568_upsized_rvb-lemans14js_8025': {
        subject: 'Tom Kristensen',
        context: 'Le Mans Legend',
        description: 'Tom Kristensen - nine-time Le Mans winner and endurance racing legend'
    },
    'rolex-collection_banner-the-cosmograph-daytona-cover_m126508-0008': {
        subject: 'Cosmograph Daytona Collection',
        context: 'Endurance Racing Cover',
        description: 'Rolex Cosmograph Daytona M126508-0008 - featured timepiece for endurance racing'
    }
};

function generateMetadata(filename, orientation) {
    const baseKey = Object.keys(contentMapping).find(key => filename.includes(key));
    if (!baseKey) {
        return {
            subject: 'Endurance Racing',
            context: 'Rolex Motorsport',
            description: 'Rolex and endurance racing motorsport'
        };
    }
    
    const content = contentMapping[baseKey];
    const orientationSuffix = orientation === 'landscape' ? 'Landscape' : 'Portrait';
    
    return {
        title: `Endurance Blog - ${content.subject} - ${orientationSuffix} - Rolex at Palladio Jewellers`,
        alt: `Rolex at Palladio Jewellers - Endurance Blog - ${content.subject} ${orientationSuffix}`,
        caption: `${content.subject} - Endurance Blog - Palladio Jewellers Official Rolex Retailer`,
        description: `${orientationSuffix} image of ${content.description} for the Endurance blog at Palladio Jewellers, Official Rolex Retailer in Vancouver.`
    };
}

function generateFilename(originalFilename) {
    const orientation = originalFilename.includes('landscape') ? 'landscape' : 'portrait';
    const baseKey = Object.keys(contentMapping).find(key => originalFilename.includes(key));
    
    if (baseKey) {
        const content = contentMapping[baseKey];
        const subjectSlug = content.subject.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-');
        return `Endurance-Blog-${subjectSlug}-${orientation}-Rolex-Palladio.jpg`;
    }
    
    return `Endurance-Blog-content-${orientation}-Rolex-Palladio.jpg`;
}

async function uploadImage(filePath) {
    try {
        const filename = path.basename(filePath);
        const orientation = filename.includes('landscape') ? 'landscape' : 'portrait';
        const newFilename = generateFilename(filename);
        const metadata = generateMetadata(filename, orientation);
        
        console.log(`📤 Uploading: ${filename} → ${newFilename}`);
        
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath), newFilename);
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
        
        console.log(`   ✅ Success: ${newFilename} (ID: ${response.data.id})`);
        return {
            success: true,
            id: response.data.id,
            filename: newFilename,
            originalFilename: filename
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
    
    console.log(`🚀 Starting upload of ${files.length} Endurance blog content images...\n`);
    
    const results = [];
    for (const file of files) {
        const result = await uploadImage(file);
        results.push(result);
        await new Promise(resolve => setTimeout(resolve, 500)); // Small delay between uploads
    }
    
    console.log('\n--- 📊 UPLOAD SUMMARY ---');
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);
    
    console.log(`✅ Successful: ${successful.length}/${results.length}`);
    if (successful.length > 0) {
        console.log('\nWordPress Media IDs:');
        successful.forEach(result => {
            console.log(`   • ${result.filename} (ID: ${result.id})`);
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
    
    console.log('\n🎉 Endurance blog content upload complete!');
}

main().catch(console.error);