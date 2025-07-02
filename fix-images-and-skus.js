#!/usr/bin/env node

const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { WP_USER, APP_PASSWORD, WP_URL } = process.env;

// Products that need SKUs removed
const PRODUCTS_TO_REMOVE_SKU = [
  { id: 28672, name: 'Altitude 39 Date, Black Dial, Leather Strap' },
  { id: 28660, name: 'Altitude Chronograph GMT' },
  { id: 28664, name: 'Altitude Chronograph GMT, Silver Dial, Steel Bracelet' },
  { id: 28654, name: 'Supermarine 300M Date, Black Dial, Bracelet' },
  { id: 28648, name: 'Supermarine 500m' },
  { id: 28644, name: 'Terra Nova 38 Pink' },
  { id: 28624, name: 'Terra Nova 42.5 Chronograph, Bracelet' }
];

// Products that need images - mapping to existing images we can use
const PRODUCTS_NEEDING_IMAGES = [
  {
    id: 28801,
    name: 'Altitude MB Meteor, Black Dial, Ti Bracelet',
    useImageFrom: 'Bremont_Altitude_MBMeteor_ALT42-MT-TI-BKBK-B.webp',
    localPath: '/workspace/images/Bremont_Processed_901x1201_WEBP_IMPROVED_TRANSPARENT/Bremont_Altitude_MBMeteor_ALT42-MT-TI-BKBK-B.webp'
  },
  {
    id: 28802,
    name: 'Altitude MB Meteor, Black Dial, Leather Strap',
    useImageFrom: 'Bremont_Altitude_MBMeteorLeather_ALT42-MT-TI-BKBK-L-S.webp',
    localPath: '/workspace/images/Bremont_Processed_901x1201_WEBP_IMPROVED_TRANSPARENT/Bremont_Altitude_MBMeteorLeather_ALT42-MT-TI-BKBK-L-S.webp'
  },
  {
    id: 28803,
    name: 'Altitude MB Meteor, Silver Dial, Ti Bracelet',
    useImageFrom: 'Bremont_Altitude_MBMeteorSilverBracelet_ALT42-MT-TI-SITI-B.webp',
    localPath: '/workspace/images/Bremont_Processed_901x1201_WEBP_IMPROVED_TRANSPARENT/Bremont_Altitude_MBMeteorSilverBracelet_ALT42-MT-TI-SITI-B.webp'
  },
  {
    id: 28804,
    name: 'Altitude MB Meteor, Silver Dial, Leather Strap',
    useImageFrom: 'Bremont_Altitude_MBMeteorSilverLeather_ALT42-MT-TI-SITI-L-S.webp',
    localPath: '/workspace/images/Bremont_Processed_901x1201_WEBP_IMPROVED_TRANSPARENT/Bremont_Altitude_MBMeteorSilverLeather_ALT42-MT-TI-SITI-L-S.webp'
  },
  {
    id: 28805,
    name: 'Supermarine 300M GMT "Tundra" Green',
    useImageFrom: 'Bremont_Supermarine_GMT_SM40-GMT-SS-GNBK-G.webp',
    localPath: '/workspace/images/Bremont_Processed_901x1201_WEBP_IMPROVED_TRANSPARENT/Bremont_Supermarine_GMT_SM40-GMT-SS-GNBK-G.webp'
  },
  {
    id: 28806,
    name: 'Supermarine 300M GMT "Glacier" Blue',
    useImageFrom: 'Bremont_Supermarine_GMT_SM40-SS-BLBK-B.webp',
    localPath: '/workspace/images/Bremont_Processed_901x1201_WEBP_IMPROVED_TRANSPARENT/Bremont_Supermarine_GMT_SM40-SS-BLBK-B.webp'
  },
  {
    id: 28807,
    name: 'Supermarine 300M, Green Dial, Bracelet',
    useImageFrom: 'Bremont_Supermarine-S300green-SM40-ND-SS-GN-B.webp',
    localPath: '/workspace/images/Bremont_Processed_901x1201_WEBP_IMPROVED_TRANSPARENT/Bremont_Supermarine-S300green-SM40-ND-SS-GN-B.webp'
  },
  {
    id: 28808,
    name: 'Supermarine 300M Date Bi-Colour, Bracelet',
    useImageFrom: 'Bremont_Supermarine_SM40-DT-BI-BR-B.webp',
    localPath: '/workspace/images/Bremont_Processed_901x1201_WEBP_IMPROVED_TRANSPARENT/Bremont_Supermarine_SM40-DT-BI-BR-B.webp'
  }
];

async function removeSKUs() {
  console.log('🗑️  REMOVING SKUs FROM 7 PRODUCTS...\n');
  
  let successCount = 0;
  
  for (const product of PRODUCTS_TO_REMOVE_SKU) {
    try {
      console.log(`Removing SKU from product ${product.id}: ${product.name}...`);
      
      await axios.put(`${WP_URL}/wp-json/wc/v3/products/${product.id}`, {
        sku: ''
      }, {
        auth: {
          username: WP_USER,
          password: APP_PASSWORD
        }
      });
      
      console.log(`  ✅ SKU removed from product ${product.id}`);
      successCount++;
      
    } catch (err) {
      console.log(`  ❌ Failed to remove SKU from ${product.id}: ${err.response?.data?.message || err.message}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  console.log(`\n📊 SKU REMOVAL COMPLETE: ${successCount}/7 successful\n`);
  return successCount;
}

async function uploadImageForProduct(productId, imagePath, altText, title) {
  try {
    // First, check if the image file exists
    if (!fs.existsSync(imagePath)) {
      console.log(`  ⚠️  Image file not found: ${imagePath}`);
      return null;
    }
    
    // Read the image file
    const imageBuffer = fs.readFileSync(imagePath);
    const fileName = path.basename(imagePath);
    
    // Create form data for upload
    const FormData = require('form-data');
    const form = new FormData();
    form.append('file', imageBuffer, fileName);
    form.append('alt_text', altText);
    form.append('title', title);
    form.append('caption', `Palladio Jewellers - Official Bremont Retailer - Vancouver - ${title}`);
    form.append('description', `${title} image at Palladio Jewellers, Official Bremont Retailer in Vancouver.`);
    
    // Upload to WordPress Media Library
    const uploadResponse = await axios.post(`${WP_URL}/wp-json/wp/v2/media`, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Basic ${Buffer.from(`${WP_USER}:${APP_PASSWORD}`).toString('base64')}`
      }
    });
    
    const mediaId = uploadResponse.data.id;
    console.log(`  📸 Image uploaded successfully. Media ID: ${mediaId}`);
    
    // Set as featured image for the product
    await axios.put(`${WP_URL}/wp-json/wc/v3/products/${productId}`, {
      images: [{
        id: mediaId,
        position: 0
      }]
    }, {
      auth: {
        username: WP_USER,
        password: APP_PASSWORD
      }
    });
    
    console.log(`  ✅ Featured image set for product ${productId}`);
    return mediaId;
    
  } catch (err) {
    console.error(`  ❌ Failed to upload image: ${err.response?.data?.message || err.message}`);
    return null;
  }
}

async function addImages() {
  console.log('🖼️  ADDING IMAGES TO 8 PRODUCTS...\n');
  
  let successCount = 0;
  let notFoundCount = 0;
  
  for (const product of PRODUCTS_NEEDING_IMAGES) {
    console.log(`\nProcessing product ${product.id}: ${product.name}`);
    
    const altText = `Bremont ${product.name} at Palladio Jewellers`;
    const title = `Bremont at Palladio Jewellers in Vancouver - Official Bremont Retailer - ${product.name}`;
    
    // Check if the suggested image exists
    if (fs.existsSync(product.localPath)) {
      const result = await uploadImageForProduct(product.id, product.localPath, altText, title);
      if (result) {
        successCount++;
      }
    } else {
      console.log(`  ⚠️  Suggested image not found: ${product.localPath}`);
      notFoundCount++;
      
      // Try to find an alternative image
      console.log(`  🔍 Looking for alternative images...`);
      
      // List available images in the directory
      const imageDir = '/workspace/images/Bremont_Processed_901x1201_WEBP_IMPROVED_TRANSPARENT/';
      if (fs.existsSync(imageDir)) {
        const files = fs.readdirSync(imageDir);
        const relevantFiles = files.filter(f => {
          const lowerFile = f.toLowerCase();
          const lowerProductName = product.name.toLowerCase();
          
          // Check for relevant keywords
          if (lowerProductName.includes('meteor') && lowerFile.includes('meteor')) return true;
          if (lowerProductName.includes('gmt') && lowerFile.includes('gmt')) return true;
          if (lowerProductName.includes('green') && lowerFile.includes('green')) return true;
          if (lowerProductName.includes('bi-colour') && lowerFile.includes('bi')) return true;
          
          return false;
        });
        
        if (relevantFiles.length > 0) {
          console.log(`  📁 Found ${relevantFiles.length} potentially relevant images:`);
          relevantFiles.forEach(f => console.log(`     - ${f}`));
        }
      }
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`\n📊 IMAGE UPLOAD COMPLETE:`);
  console.log(`✅ Successfully uploaded: ${successCount}/8`);
  console.log(`⚠️  Images not found: ${notFoundCount}/8`);
  
  return { successCount, notFoundCount };
}

async function runFixes() {
  console.log('🔧 FIXING IMAGES AND REMOVING SKUs...\n');
  console.log('Following user instructions: Update images for 8 products, remove SKUs from 7 products\n');
  
  // Step 1: Remove SKUs
  const skuResults = await removeSKUs();
  
  // Step 2: Add images
  const imageResults = await addImages();
  
  console.log('\n🎉 ALL TASKS COMPLETE!');
  console.log(`📊 Final Summary:`);
  console.log(`- SKUs removed: ${skuResults}/7`);
  console.log(`- Images uploaded: ${imageResults.successCount}/8`);
  
  if (imageResults.notFoundCount > 0) {
    console.log(`\n⚠️  Note: ${imageResults.notFoundCount} suggested images were not found.`);
    console.log('You may need to upload these manually or provide the correct image paths.');
  }
}

runFixes();