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
  'rolex-land-dweller-wmdial_2411uf_001-landscape.jpg': {
    filename: 'Innovation-Blog-land-dweller-honeycomb-dials-landscape-Rolex-Palladio.jpg',
    title: 'Land-Dweller Blog - Honeycomb Dials Innovation - Landscape - Rolex at Palladio Jewellers',
    alt_text: 'Rolex at Palladio Jewellers - Land-Dweller Blog - Honeycomb Dial Innovation Landscape',
    caption: 'Land-Dweller Honeycomb Dial Innovation - Opening New Horizons - Palladio Jewellers Official Rolex Retailer',
    description: 'Landscape image showcasing the innovative honeycomb motif dials of the Rolex Land-Dweller collection for the Opening New Horizons blog at Palladio Jewellers, Official Rolex Retailer in Vancouver.'
  },
  'rolex-land-dweller-wmdial_2411uf_001-portait.jpg': {
    filename: 'Innovation-Blog-land-dweller-honeycomb-dials-portrait-Rolex-Palladio.jpg',
    title: 'Land-Dweller Blog - Honeycomb Dials Innovation - Portrait - Rolex at Palladio Jewellers',
    alt_text: 'Rolex at Palladio Jewellers - Land-Dweller Blog - Honeycomb Dial Innovation Portrait',
    caption: 'Land-Dweller Honeycomb Dial Innovation - Opening New Horizons - Palladio Jewellers Official Rolex Retailer',
    description: 'Portrait image showcasing the innovative honeycomb motif dials of the Rolex Land-Dweller collection for the Opening New Horizons blog at Palladio Jewellers, Official Rolex Retailer in Vancouver.'
  },
  'rolex-land-dweller-rfederer_2411ab_1-landscape.jpg': {
    filename: 'Innovation-Blog-land-dweller-roger-federer-ambassador-landscape-Rolex-Palladio.jpg',
    title: 'Land-Dweller Blog - Roger Federer Ambassador - Landscape - Rolex at Palladio Jewellers',
    alt_text: 'Rolex at Palladio Jewellers - Land-Dweller Blog - Roger Federer Ambassador Landscape',
    caption: 'Roger Federer - Land-Dweller Ambassador - Opening New Horizons - Palladio Jewellers Official Rolex Retailer',
    description: 'Landscape image featuring Roger Federer as Rolex Land-Dweller ambassador for the Opening New Horizons blog at Palladio Jewellers, Official Rolex Retailer in Vancouver.'
  },
  'rolex-land-dweller-rfederer_2411ab_1-portrait.jpg': {
    filename: 'Innovation-Blog-land-dweller-roger-federer-ambassador-portrait-Rolex-Palladio.jpg',
    title: 'Land-Dweller Blog - Roger Federer Ambassador - Portrait - Rolex at Palladio Jewellers',
    alt_text: 'Rolex at Palladio Jewellers - Land-Dweller Blog - Roger Federer Ambassador Portrait',
    caption: 'Roger Federer - Land-Dweller Ambassador - Opening New Horizons - Palladio Jewellers Official Rolex Retailer',
    description: 'Portrait image featuring Roger Federer as Rolex Land-Dweller ambassador for the Opening New Horizons blog at Palladio Jewellers, Official Rolex Retailer in Vancouver.'
  },
  'rolex-land-dweller-m127334-0001_2501fj_001-landscape.jpg': {
    filename: 'Innovation-Blog-land-dweller-white-rolesor-m127334-landscape-Rolex-Palladio.jpg',
    title: 'Land-Dweller Blog - White Rolesor M127334-0001 - Landscape - Rolex at Palladio Jewellers',
    alt_text: 'Rolex at Palladio Jewellers - Land-Dweller Blog - White Rolesor M127334-0001 Landscape',
    caption: 'Land-Dweller White Rolesor M127334-0001 - Opening New Horizons - Palladio Jewellers Official Rolex Retailer',
    description: 'Landscape image of the Rolex Land-Dweller White Rolesor M127334-0001 with urban skyline for the Opening New Horizons blog at Palladio Jewellers, Official Rolex Retailer in Vancouver.'
  },
  'rolex-land-dweller-m127334-0001_2501fj_001-portait.jpg': {
    filename: 'Innovation-Blog-land-dweller-white-rolesor-m127334-portrait-Rolex-Palladio.jpg',
    title: 'Land-Dweller Blog - White Rolesor M127334-0001 - Portrait - Rolex at Palladio Jewellers',
    alt_text: 'Rolex at Palladio Jewellers - Land-Dweller Blog - White Rolesor M127334-0001 Portrait',
    caption: 'Land-Dweller White Rolesor M127334-0001 - Opening New Horizons - Palladio Jewellers Official Rolex Retailer',
    description: 'Portrait image of the Rolex Land-Dweller White Rolesor M127334-0001 with urban skyline for the Opening New Horizons blog at Palladio Jewellers, Official Rolex Retailer in Vancouver.'
  },
  'rolex-land-dweller-m127334-0001_m127285tbr-0002_2411uf_001-landscape.jpg': {
    filename: 'Innovation-Blog-land-dweller-dual-models-comparison-landscape-Rolex-Palladio.jpg',
    title: 'Land-Dweller Blog - Dual Models Comparison - Landscape - Rolex at Palladio Jewellers',
    alt_text: 'Rolex at Palladio Jewellers - Land-Dweller Blog - Dual Models Comparison Landscape',
    caption: 'Land-Dweller Dual Models - White Rolesor & Everose Gold - Palladio Jewellers Official Rolex Retailer',
    description: 'Landscape image comparing two Land-Dweller models showcasing contemporary design innovation for the Opening New Horizons blog at Palladio Jewellers, Official Rolex Retailer in Vancouver.'
  },
  'rolex-land-dweller-m127334-0001_m127285tbr-0002_2411uf_001-portrait.jpg': {
    filename: 'Innovation-Blog-land-dweller-dual-models-comparison-portrait-Rolex-Palladio.jpg',
    title: 'Land-Dweller Blog - Dual Models Comparison - Portrait - Rolex at Palladio Jewellers',
    alt_text: 'Rolex at Palladio Jewellers - Land-Dweller Blog - Dual Models Comparison Portrait',
    caption: 'Land-Dweller Dual Models - White Rolesor & Everose Gold - Palladio Jewellers Official Rolex Retailer',
    description: 'Portrait image comparing two Land-Dweller models showcasing contemporary design innovation for the Opening New Horizons blog at Palladio Jewellers, Official Rolex Retailer in Vancouver.'
  },
  'rolex-land-dweller-m127285tbr-0002_2501fj_002-landscape.jpg': {
    filename: 'Innovation-Blog-land-dweller-everose-gold-bracelet-landscape-Rolex-Palladio.jpg',
    title: 'Land-Dweller Blog - Everose Gold Flat Jubilee Bracelet - Landscape - Rolex at Palladio Jewellers',
    alt_text: 'Rolex at Palladio Jewellers - Land-Dweller Blog - Everose Gold Flat Jubilee Bracelet Landscape',
    caption: 'Land-Dweller Everose Gold Flat Jubilee Bracelet - Opening New Horizons - Palladio Jewellers Official Rolex Retailer',
    description: 'Landscape image of the Rolex Land-Dweller in Everose gold with innovative Flat Jubilee bracelet for the Opening New Horizons blog at Palladio Jewellers, Official Rolex Retailer in Vancouver.'
  },
  'rolex-land-dweller-m127285tbr-0002_2501fj_002-portrait.jpg': {
    filename: 'Innovation-Blog-land-dweller-everose-gold-bracelet-portrait-Rolex-Palladio.jpg',
    title: 'Land-Dweller Blog - Everose Gold Flat Jubilee Bracelet - Portrait - Rolex at Palladio Jewellers',
    alt_text: 'Rolex at Palladio Jewellers - Land-Dweller Blog - Everose Gold Flat Jubilee Bracelet Portrait',
    caption: 'Land-Dweller Everose Gold Flat Jubilee Bracelet - Opening New Horizons - Palladio Jewellers Official Rolex Retailer',
    description: 'Portrait image of the Rolex Land-Dweller in Everose gold with innovative Flat Jubilee bracelet for the Opening New Horizons blog at Palladio Jewellers, Official Rolex Retailer in Vancouver.'
  },
  'rolex-land-dweller-m127285tbr-0002_2501fj_004-landscape.jpg': {
    filename: 'Innovation-Blog-land-dweller-everose-gold-detail-landscape-Rolex-Palladio.jpg',
    title: 'Land-Dweller Blog - Everose Gold Detail Shot - Landscape - Rolex at Palladio Jewellers',
    alt_text: 'Rolex at Palladio Jewellers - Land-Dweller Blog - Everose Gold Detail Landscape',
    caption: 'Land-Dweller Everose Gold M127285TBR-0002 Detail - Opening New Horizons - Palladio Jewellers Official Rolex Retailer',
    description: 'Landscape detail image of the Rolex Land-Dweller Everose gold M127285TBR-0002 showcasing craftsmanship for the Opening New Horizons blog at Palladio Jewellers, Official Rolex Retailer in Vancouver.'
  },
  'rolex-land-dweller-m127285tbr-0002_2501fj_004-portait.jpg': {
    filename: 'Innovation-Blog-land-dweller-everose-gold-detail-portrait-Rolex-Palladio.jpg',
    title: 'Land-Dweller Blog - Everose Gold Detail Shot - Portrait - Rolex at Palladio Jewellers',
    alt_text: 'Rolex at Palladio Jewellers - Land-Dweller Blog - Everose Gold Detail Portrait',
    caption: 'Land-Dweller Everose Gold M127285TBR-0002 Detail - Opening New Horizons - Palladio Jewellers Official Rolex Retailer',
    description: 'Portrait detail image of the Rolex Land-Dweller Everose gold M127285TBR-0002 showcasing craftsmanship for the Opening New Horizons blog at Palladio Jewellers, Official Rolex Retailer in Vancouver.'
  },
  'rolex-land-dweller-np25-lancia-fusee-still_50k_rv-landscape.jpg': {
    filename: 'Innovation-Blog-land-dweller-calibre-7135-movement-landscape-Rolex-Palladio.jpg',
    title: 'Land-Dweller Blog - Calibre 7135 Movement Innovation - Landscape - Rolex at Palladio Jewellers',
    alt_text: 'Rolex at Palladio Jewellers - Land-Dweller Blog - Calibre 7135 Movement Landscape',
    caption: 'Land-Dweller Calibre 7135 Movement - 5 Hz Innovation - Palladio Jewellers Official Rolex Retailer',
    description: 'Landscape image of the revolutionary Calibre 7135 movement with Dynapulse escapement for the Opening New Horizons blog at Palladio Jewellers, Official Rolex Retailer in Vancouver.'
  },
  'rolex-land-dweller-np25-lancia-fusee-still_50k_rv-portrait.jpg': {
    filename: 'Innovation-Blog-land-dweller-calibre-7135-movement-portrait-Rolex-Palladio.jpg',
    title: 'Land-Dweller Blog - Calibre 7135 Movement Innovation - Portrait - Rolex at Palladio Jewellers',
    alt_text: 'Rolex at Palladio Jewellers - Land-Dweller Blog - Calibre 7135 Movement Portrait',
    caption: 'Land-Dweller Calibre 7135 Movement - 5 Hz Innovation - Palladio Jewellers Official Rolex Retailer',
    description: 'Portrait image of the revolutionary Calibre 7135 movement with Dynapulse escapement for the Opening New Horizons blog at Palladio Jewellers, Official Rolex Retailer in Vancouver.'
  },
  'rolex-land-dweller-np25-lancia-solar-still_50k_rvb-landscape.jpg': {
    filename: 'Innovation-Blog-land-dweller-dynapulse-escapement-landscape-Rolex-Palladio.jpg',
    title: 'Land-Dweller Blog - Dynapulse Escapement Technology - Landscape - Rolex at Palladio Jewellers',
    alt_text: 'Rolex at Palladio Jewellers - Land-Dweller Blog - Dynapulse Escapement Landscape',
    caption: 'Land-Dweller Dynapulse Escapement - Silicon Innovation - Palladio Jewellers Official Rolex Retailer',
    description: 'Landscape image showcasing the innovative Dynapulse escapement with silicon components for the Opening New Horizons blog at Palladio Jewellers, Official Rolex Retailer in Vancouver.'
  },
  'rolex-land-dweller-np25-lancia-solar-still_50k_rvb-portrait.jpg': {
    filename: 'Innovation-Blog-land-dweller-dynapulse-escapement-portrait-Rolex-Palladio.jpg',
    title: 'Land-Dweller Blog - Dynapulse Escapement Technology - Portrait - Rolex at Palladio Jewellers',
    alt_text: 'Rolex at Palladio Jewellers - Land-Dweller Blog - Dynapulse Escapement Portrait',
    caption: 'Land-Dweller Dynapulse Escapement - Silicon Innovation - Palladio Jewellers Official Rolex Retailer',
    description: 'Portrait image showcasing the innovative Dynapulse escapement with silicon components for the Opening New Horizons blog at Palladio Jewellers, Official Rolex Retailer in Vancouver.'
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
  console.log('🚀 Starting Rolex Land-Dweller Blog Images Upload...\n');

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
  const resultsFile = `rolex-land-dweller-upload-results-${new Date().toISOString().replace(/:/g, '-')}.json`;
  fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
  console.log(`\n📄 Results saved to ${resultsFile}`);
}

// Run the script
main().catch(console.error);