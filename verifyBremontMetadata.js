#!/usr/bin/env node

require('dotenv').config();
const axios = require('axios');

const WP_URL = process.env.WP_URL;
const WP_USER = process.env.WP_USER;
const APP_PASSWORD = process.env.APP_PASSWORD;

// Image IDs to verify
const imageIds = [28861, 28865, 28867, 28868, 28877];

async function verifyImageMetadata(imageId) {
  try {
    const authHeader = Buffer.from(`${WP_USER}:${APP_PASSWORD}`).toString('base64');
    
    const response = await axios.get(
      `${WP_URL}/wp-json/wp/v2/media/${imageId}`,
      {
        headers: {
          'Authorization': `Basic ${authHeader}`
        }
      }
    );

    const image = response.data;
    
    console.log(`\n📸 Image ID: ${imageId}`);
    console.log(`Filename: ${image.source_url.split('/').pop()}`);
    console.log(`Title: ${image.title.rendered || 'None'}`);
    console.log(`Alt Text: ${image.alt_text || 'None'}`);
    console.log(`Caption: ${image.caption.rendered ? image.caption.rendered.replace(/<[^>]*>/g, '').trim() : 'None'}`);
    console.log(`Description: ${image.description.rendered ? image.description.rendered.replace(/<[^>]*>/g, '').trim() : 'None'}`);
    console.log('---');
    
    return {
      id: imageId,
      hasAllMetadata: !!(image.title.rendered && image.alt_text && image.caption.rendered && image.description.rendered)
    };

  } catch (error) {
    console.error(`❌ Error checking image ID ${imageId}:`, error.message);
    return {
      id: imageId,
      hasAllMetadata: false,
      error: error.message
    };
  }
}

async function main() {
  console.log('🔍 Verifying Bremont Banner Metadata...\n');

  if (!WP_URL || !WP_USER || !APP_PASSWORD) {
    console.error('❌ Error: WordPress credentials not found in .env file');
    process.exit(1);
  }

  const results = [];
  
  for (const imageId of imageIds) {
    const result = await verifyImageMetadata(imageId);
    results.push(result);
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  // Summary
  console.log('\n📊 Verification Summary:');
  const complete = results.filter(r => r.hasAllMetadata);
  const incomplete = results.filter(r => !r.hasAllMetadata && !r.error);
  const errors = results.filter(r => r.error);
  
  console.log(`✅ Complete metadata: ${complete.length}/${imageIds.length}`);
  console.log(`⚠️  Incomplete metadata: ${incomplete.length}/${imageIds.length}`);
  console.log(`❌ Errors: ${errors.length}/${imageIds.length}`);
  
  if (incomplete.length > 0) {
    console.log('\n⚠️  Images with incomplete metadata:');
    incomplete.forEach(r => console.log(`- ID: ${r.id}`));
  }
}

main().catch(console.error);