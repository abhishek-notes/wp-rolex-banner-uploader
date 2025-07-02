#!/usr/bin/env node

require('dotenv').config();
const axios = require('axios');

const WP_URL = process.env.WP_URL;
const WP_USER = process.env.WP_USER;
const APP_PASSWORD = process.env.APP_PASSWORD;

// Homepage banner metadata updates
const bannerUpdates = {
  28865: { // Mobile Banner
    title: 'Bremont at Palladio - Homepage Mobile Banner - British Watchmaking Excellence',
    alt_text: 'Bremont at Palladio Jewellers - Homepage Mobile Banner - British Watchmaking Excellence Vancouver',
    caption: 'Introducing Bremont - British Watchmaking Excellence - Now at Palladio Jewellers Official Retailer Vancouver',
    description: 'Mobile homepage banner introducing Bremont British watchmaking excellence now available at Palladio Jewellers, Official Bremont Retailer in Vancouver. Featuring the timeless bond between British heritage and Canadian values.'
  },
  28861: { // Desktop Banner
    title: 'Bremont at Palladio - Homepage Desktop Banner - British Watchmaking Excellence',
    alt_text: 'Bremont at Palladio Jewellers - Homepage Desktop Banner - British Watchmaking Excellence Vancouver',
    caption: 'Introducing Bremont - British Watchmaking Excellence - Now at Palladio Jewellers Official Retailer Vancouver',
    description: 'Desktop homepage banner introducing Bremont British watchmaking excellence now available at Palladio Jewellers, Official Bremont Retailer in Vancouver. Celebrating the timeless bond between British heritage and Canadian craftsmanship values.'
  },
  28877: { // Wayfinder Logo Black
    title: 'Bremont Wayfinder Logo Black - Brand Identity - Palladio Jewellers',
    alt_text: 'Bremont Wayfinder Logo Black - Brand Identity at Palladio Jewellers Vancouver',
    caption: 'Bremont Wayfinder Logo - British Watch Brand Identity - Palladio Jewellers Official Retailer',
    description: 'Bremont Wayfinder compass logo in black representing British watchmaking navigation and precision, supporting brand identity at Palladio Jewellers, Official Bremont Retailer in Vancouver.'
  },
  28868: { // Wayfinder Logo
    title: 'Bremont Wayfinder Logo - Brand Identity - Palladio Jewellers',
    alt_text: 'Bremont Wayfinder Logo - Brand Identity at Palladio Jewellers Vancouver',
    caption: 'Bremont Wayfinder Logo - British Watch Brand Identity - Palladio Jewellers Official Retailer',
    description: 'Bremont Wayfinder compass logo representing British watchmaking navigation and precision heritage, supporting brand identity at Palladio Jewellers, Official Bremont Retailer in Vancouver.'
  },
  28867: { // Wayfinder Logo (duplicate)
    title: 'Bremont Wayfinder Logo - Brand Identity - Palladio Jewellers',
    alt_text: 'Bremont Wayfinder Logo - Brand Identity at Palladio Jewellers Vancouver',
    caption: 'Bremont Wayfinder Logo - British Watch Brand Identity - Palladio Jewellers Official Retailer',
    description: 'Bremont Wayfinder compass logo representing British watchmaking navigation and precision heritage, supporting brand identity at Palladio Jewellers, Official Bremont Retailer in Vancouver.'
  }
};

async function updateImageMetadata(imageId, metadata) {
  try {
    const authHeader = Buffer.from(`${WP_USER}:${APP_PASSWORD}`).toString('base64');
    
    console.log(`📝 Updating metadata for image ID: ${imageId}`);
    
    const response = await axios.post(
      `${WP_URL}/wp-json/wp/v2/media/${imageId}`,
      {
        title: metadata.title,
        alt_text: metadata.alt_text,
        caption: metadata.caption,
        description: metadata.description
      },
      {
        headers: {
          'Authorization': `Basic ${authHeader}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log(`✅ Successfully updated metadata for image ID: ${imageId}`);
    console.log(`   Title: ${metadata.title}`);
    console.log(`   Alt Text: ${metadata.alt_text}`);
    console.log('---');
    
    return {
      success: true,
      id: imageId,
      title: metadata.title
    };

  } catch (error) {
    console.error(`❌ Error updating image ID ${imageId}:`, error.response?.data || error.message);
    return {
      success: false,
      id: imageId,
      error: error.message
    };
  }
}

async function main() {
  console.log('🚀 Starting Bremont Banner Metadata Updates...\n');

  if (!WP_URL || !WP_USER || !APP_PASSWORD) {
    console.error('❌ Error: WordPress credentials not found in .env file');
    process.exit(1);
  }

  const results = [];
  
  for (const [imageId, metadata] of Object.entries(bannerUpdates)) {
    const result = await updateImageMetadata(parseInt(imageId), metadata);
    results.push(result);
    
    // Add small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  // Summary
  console.log('\n📊 Update Summary:');
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Successful: ${successful.length}`);
  console.log(`❌ Failed: ${failed.length}`);
  
  if (successful.length > 0) {
    console.log('\n📸 Updated Images:');
    successful.forEach(r => {
      console.log(`- ID: ${r.id} - ${r.title}`);
    });
  }

  if (failed.length > 0) {
    console.log('\n❌ Failed Updates:');
    failed.forEach(r => {
      console.log(`- ID: ${r.id} - ${r.error}`);
    });
  }

  // Save results
  const resultsFile = `bremont-banner-metadata-updates-${new Date().toISOString().replace(/:/g, '-')}.json`;
  require('fs').writeFileSync(resultsFile, JSON.stringify(results, null, 2));
  console.log(`\n📄 Results saved to ${resultsFile}`);
}

main().catch(console.error);