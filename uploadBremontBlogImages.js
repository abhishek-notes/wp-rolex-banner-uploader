#!/usr/bin/env node

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

// WordPress configuration
const WP_URL = process.env.WP_URL;
const WP_USER = process.env.WP_USER;
const APP_PASSWORD = process.env.APP_PASSWORD;

// Image metadata mapping
const imageMetadata = {
  'A British Legacy Lands in Canada.png': {
    filename: 'Bremont-Blog-founders-nick-giles-english-aircraft-content-Palladio.jpg',
    title: 'Bremont Blog - Nick and Giles English Founders with Aircraft - Palladio Jewellers',
    alt_text: 'Bremont founders Nick and Giles English standing by vintage aircraft - Bremont at Palladio Jewellers Vancouver',
    caption: 'Bremont founders Nick and Giles English honoring their aviation heritage - Available at Palladio Jewellers Official Retailer',
    description: 'Blog content image featuring Bremont watch founders Nick and Giles English with their heritage aircraft, representing the British watchmaking legacy now available at Palladio Jewellers, Vancouver\'s premier luxury watch retailer.'
  },
  'From London to British Columbia- Time Redefined.png': {
    filename: 'Bremont-Blog-altitude-collection-aviation-watch-content-Palladio.jpg',
    title: 'Bremont Blog - Altitude Collection Aviation Watch - Palladio Jewellers',
    alt_text: 'Bremont Altitude chronograph watch with aviation background - Bremont at Palladio Jewellers Vancouver',
    caption: 'Bremont Altitude Collection - Built to explore the skies - Available at Palladio Jewellers Official Retailer',
    description: 'Blog content image showcasing the Bremont Altitude aviation chronograph watch with aircraft silhouette, representing British engineering excellence now available at Palladio Jewellers in Vancouver.'
  },
  'Now Available at Palladio Jewellers.jpg': {
    filename: 'Bremont-Blog-altitude-automatic-bracelet-showcase-content-Palladio.jpg',
    title: 'Bremont Blog - Altitude Automatic Watch on Bracelet - Now at Palladio Jewellers',
    alt_text: 'Bremont Altitude automatic watch on steel bracelet - Now available at Palladio Jewellers Vancouver',
    caption: 'Bremont Altitude Automatic - British watchmaking excellence now at Palladio Jewellers Official Retailer',
    description: 'Blog content image featuring the Bremont Altitude automatic watch on steel bracelet with Bremont compass logo, announcing availability at Palladio Jewellers, Vancouver\'s destination for luxury timepieces.'
  },
  'Palladio_Introducing Bremont at Palladio_Blogs Hompage Thumbnail.jpg': {
    filename: 'Bremont-Blog-Hub-introducing-bremont-Feature-Palladio.jpg',
    title: 'Bremont Blog Hub - Introducing Bremont at Palladio Feature Image - Official Retailer',
    alt_text: 'Bremont at Palladio Jewellers - Introducing Bremont Blog Hub Feature',
    caption: 'Introducing Bremont Blog Hub Feature - British Watchmaking at Palladio Jewellers Vancouver',
    description: 'Hub feature image for the Introducing Bremont blog showcasing aviation-inspired British watchmaking excellence now available at Palladio Jewellers, Official Bremont Retailer in Vancouver.'
  },
  'Palladio_Introducing Bremont at Palladio_Top banners.jpg': {
    filename: 'Bremont-Blog-british-aviation-heritage-banner-desktop-Palladio.jpg',
    title: 'Introducing Bremont at Palladio Blog - Desktop Banner - British Aviation Heritage',
    alt_text: 'Bremont at Palladio Jewellers - British aviation heritage with RAF jet and parachutist - Desktop Banner',
    caption: 'Introducing Bremont - British Aviation Heritage - Palladio Jewellers Official Retailer Vancouver',
    description: 'Desktop banner image for Introducing Bremont blog featuring RAF jet and British parachutist, celebrating the aviation heritage of Bremont watches now available at Palladio Jewellers in Vancouver.'
  },
  'Timepieces That Tell More Than Time_Youtube Video Thumbnail.jpg': {
    filename: 'Bremont-Blog-lifestyle-collection-youtube-thumbnail-Palladio.jpg',
    title: 'Bremont Blog - Timepieces That Tell More Than Time - YouTube Video Thumbnail - Palladio Jewellers',
    alt_text: 'Bremont watches lifestyle collection - YouTube video thumbnail - Palladio Jewellers Vancouver',
    caption: 'Bremont Timepieces That Tell More Than Time - Watch the story at Palladio Jewellers',
    description: 'YouTube video thumbnail showcasing Bremont watches in action across land, ice, and air environments, highlighting the versatility of British watchmaking now available at Palladio Jewellers Vancouver.'
  },
  'Why Bremont Belongs Here.jpg': {
    filename: 'Bremont-Blog-british-canadian-heritage-flags-content-Palladio.jpg',
    title: 'Bremont Blog - British and Canadian Heritage Connection - Palladio Jewellers',
    alt_text: 'British and Canadian flags together symbolizing Bremont heritage - Palladio Jewellers Vancouver',
    caption: 'British-Canadian Heritage - Why Bremont Belongs at Palladio Jewellers Vancouver',
    description: 'Blog content image featuring British and Canadian flags together, symbolizing the shared heritage and values that make Bremont a perfect addition to Palladio Jewellers\' curated collection in Vancouver.'
  }
};

async function processAndUploadImage(sourceFile, metadata) {
  const sourcePath = path.join('source-images', sourceFile);
  
  try {
    // Upload to WordPress
    console.log(`📤 Uploading ${sourceFile} as ${metadata.filename}...`);
    const form = new FormData();
    form.append('file', fs.createReadStream(sourcePath), metadata.filename);
    form.append('title', metadata.title);
    form.append('alt_text', metadata.alt_text);
    form.append('caption', metadata.caption);
    form.append('description', metadata.description);
    
    const authHeader = Buffer.from(`${WP_USER}:${APP_PASSWORD}`).toString('base64');
    
    const response = await axios.post(
      `${WP_URL}/wp-json/wp/v2/media`,
      form,
      {
        headers: {
          'Authorization': `Basic ${authHeader}`,
          ...form.getHeaders()
        }
      }
    );

    console.log(`✅ Uploaded successfully! Media ID: ${response.data.id}`);
    
    return {
      success: true,
      id: response.data.id,
      url: response.data.source_url,
      filename: metadata.filename
    };

  } catch (error) {
    console.error(`❌ Error processing ${sourceFile}:`, error.message);
    return {
      success: false,
      filename: sourceFile,
      error: error.message
    };
  }
}

async function main() {
  console.log('🚀 Starting Bremont Blog Images Upload...\n');

  if (!WP_URL || !WP_USER || !APP_PASSWORD) {
    console.error('❌ Error: WordPress credentials not found in .env file (WP_URL, WP_USER, APP_PASSWORD)');
    process.exit(1);
  }

  const results = [];
  
  for (const [sourceFile, metadata] of Object.entries(imageMetadata)) {
    if (fs.existsSync(path.join('source-images', sourceFile))) {
      const result = await processAndUploadImage(sourceFile, metadata);
      results.push(result);
      console.log('---');
    } else {
      console.log(`⚠️  Warning: ${sourceFile} not found in source-images/`);
    }
  }

  // Summary
  console.log('\n📊 Upload Summary:');
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Successful: ${successful.length}`);
  console.log(`❌ Failed: ${failed.length}`);
  
  if (successful.length > 0) {
    console.log('\n📸 Uploaded Images:');
    successful.forEach(r => {
      console.log(`- ${r.filename}`);
      console.log(`  ID: ${r.id}`);
      console.log(`  URL: ${r.url}`);
    });
  }

  // Clean up source images
  if (successful.length > 0) {
    console.log('\n🧹 Cleaning up source images...');
    for (const [sourceFile, metadata] of Object.entries(imageMetadata)) {
      const sourcePath = path.join('source-images', sourceFile);
      if (fs.existsSync(sourcePath) && results.find(r => r.filename === metadata.filename && r.success)) {
        fs.unlinkSync(sourcePath);
        console.log(`✅ Removed ${sourceFile}`);
      }
    }
  }

  // Save results
  const resultsFile = `bremont-blog-upload-results-${new Date().toISOString().replace(/:/g, '-')}.json`;
  fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
  console.log(`\n📄 Results saved to ${resultsFile}`);
}

// Run the script
main().catch(console.error);