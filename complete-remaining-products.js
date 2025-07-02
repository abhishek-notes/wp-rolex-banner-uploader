#!/usr/bin/env node

const axios = require('axios');
require('dotenv').config();

const { WP_USER, APP_PASSWORD, WP_URL } = process.env;

// Remaining 6 products to create (2 already created: 28801, 28802)
const REMAINING_PRODUCTS = [
  {
    title: 'Altitude MB Meteor, Silver Dial, Ti Bracelet',
    referenceNumber: 'ALT42-MT-TI-SITI-B', 
    collection: 'Altitude',
    strap: 'bracelet'
  },
  {
    title: 'Altitude MB Meteor, Silver Dial, Leather Strap',
    referenceNumber: 'ALT42-MT-TI-SITI-L-S',
    collection: 'Altitude', 
    strap: 'leather'
  },
  {
    title: 'Supermarine 300M GMT "Tundra" Green',
    referenceNumber: 'SM40-GMT-SS-GNBK-G',
    collection: 'Supermarine',
    strap: 'fabric'
  },
  {
    title: 'Supermarine 300M GMT "Glacier" Blue', 
    referenceNumber: 'SM40-GMT-SS-BLBK-B',
    collection: 'Supermarine',
    strap: 'bracelet'
  },
  {
    title: 'Supermarine 300M, Green Dial, Bracelet',
    referenceNumber: 'SM40-ND-SS-GN-B',
    collection: 'Supermarine',
    strap: 'bracelet'
  },
  {
    title: 'Supermarine 300M Date Bi-Colour, Bracelet',
    referenceNumber: 'SM40-DT-BI-BR-B',
    collection: 'Supermarine', 
    strap: 'bracelet'
  }
];

async function getCategoryIds(categoryNames) {
  const categoryIds = [];
  
  for (const categoryName of categoryNames) {
    try {
      const response = await axios.get(`${WP_URL}/wp-json/wc/v3/products/categories`, {
        params: { search: categoryName },
        auth: { username: WP_USER, password: APP_PASSWORD }
      });
      
      const category = response.data.find(cat => 
        cat.name.toLowerCase() === categoryName.toLowerCase()
      );
      
      if (category) {
        categoryIds.push({ id: category.id });
      }
    } catch (err) {
      console.log(`Warning: Could not find category ${categoryName}`);
    }
  }
  
  return categoryIds;
}

async function createRemainingProducts() {
  console.log('🆕 Creating remaining 6 products to complete the 29-SKU catalog...\n');
  
  let successCount = 0;
  let failCount = 0;
  
  for (const newProduct of REMAINING_PRODUCTS) {
    try {
      console.log(`Creating: ${newProduct.title}...`);
      
      const categories = await getCategoryIds(['Bremont', newProduct.collection, 'Watch']);
      
      const productData = {
        name: newProduct.title,
        type: 'simple',
        status: 'publish',
        sku: newProduct.referenceNumber,
        categories: categories,
        description: `<p><strong>${newProduct.title}</strong></p><p>Available at Palladio Jewellers, Official Bremont Retailer in Vancouver.</p><p><span style="display: none;">Tags : Ref No: ${newProduct.referenceNumber}</span></p>`,
        short_description: `${newProduct.title} available at Palladio Jewellers, Official Bremont Retailer in Vancouver.`,
        slug: newProduct.title.toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
      };
      
      const response = await axios.post(`${WP_URL}/wp-json/wc/v3/products`, productData, {
        auth: {
          username: WP_USER,
          password: APP_PASSWORD
        }
      });
      
      console.log(`  ✅ Created product ${response.data.id}: ${newProduct.title}`);
      successCount++;
      
    } catch (err) {
      console.log(`  ❌ Failed to create ${newProduct.title}: ${err.response?.data?.message || err.message}`);
      failCount++;
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`\n📊 REMAINING PRODUCTS CREATION COMPLETE:`);
  console.log(`✅ Successfully created: ${successCount}`);
  console.log(`❌ Failed to create: ${failCount}\n`);
  
  return { successCount, failCount };
}

async function updateMissingSKUs() {
  console.log('🔧 Updating missing SKUs for existing products...\n');
  
  // Products that still need SKUs set
  const PRODUCTS_TO_UPDATE_SKU = [
    { id: 28689, sku: 'TN40-DT-SS-BK-B' },
    { id: 28687, sku: 'TN40-JH-SS-BK-B' },
    { id: 28674, sku: 'ALT39-DT-SS-SI-L-S' },
    { id: 28673, sku: 'ALT39-DT-SS-BK-B' },
    { id: 28672, sku: 'ALT39-DT-SS-BK-L-S' },
    { id: 28664, sku: 'ALT42-CHR-G-SS-SI-B' },
    { id: 28660, sku: 'ALT42-CHR-G-SS-BK-B' },
    { id: 28654, sku: 'SM40-DT-SS-BK-B' },
    { id: 28648, sku: 'SM43-DT-SS-BK-B' },
    { id: 28644, sku: 'TN38-ND-SS-PK-B' },
    { id: 28624, sku: 'TN42-CHR-SS-BK-B' }
  ];
  
  let successCount = 0;
  
  for (const product of PRODUCTS_TO_UPDATE_SKU) {
    try {
      await axios.put(`${WP_URL}/wp-json/wc/v3/products/${product.id}`, {
        sku: product.sku
      }, {
        auth: { username: WP_USER, password: APP_PASSWORD }
      });
      
      console.log(`  ✅ Updated SKU for product ${product.id}: ${product.sku}`);
      successCount++;
      
    } catch (err) {
      console.log(`  ❌ Failed to update SKU for ${product.id}: ${err.message}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 200));
  }
  
  console.log(`\n📊 SKU UPDATE COMPLETE: ${successCount} products updated\n`);
  return successCount;
}

async function runCompletion() {
  console.log('🎯 COMPLETING BREMONT CATALOG CLEANUP...\n');
  
  // Create remaining products
  const createResults = await createRemainingProducts();
  
  // Update missing SKUs
  const skuResults = await updateMissingSKUs();
  
  console.log('🎉 COMPLETION SUMMARY:');
  console.log(`- New products created: ${createResults.successCount}/6`);
  console.log(`- SKUs updated: ${skuResults}/11`);
  console.log('\n✅ Ready for final verification!');
}

runCompletion();