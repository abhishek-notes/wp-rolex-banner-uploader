#!/usr/bin/env node

const axios = require('axios');
require('dotenv').config();

const { WP_USER, APP_PASSWORD, WP_URL } = process.env;

async function fixMeterCapitalization() {
  try {
    console.log('🔧 FIXING METER CAPITALIZATION IN PRODUCT TITLES (300M → 300m, 500M → 500m)...\n');
    
    // Fetch all Bremont products
    const response = await axios.get(`${WP_URL}/wp-json/wc/v3/products`, {
      params: {
        per_page: 100,
        orderby: 'date',
        order: 'desc'
      },
      auth: {
        username: WP_USER,
        password: APP_PASSWORD
      }
    });
    
    const bremontProducts = response.data.filter(product => 
      product.categories.some(cat => cat.name.toLowerCase().includes('bremont'))
    );
    
    console.log(`Found ${bremontProducts.length} Bremont products to check...\n`);
    
    let fixedCount = 0;
    const productsToFix = [];
    
    // First, show what will be changed
    for (const product of bremontProducts) {
      // Check if title contains 300M or 500M
      if (product.name.includes('300M') || product.name.includes('500M')) {
        const newName = product.name.replace(/300M/g, '300m').replace(/500M/g, '500m');
        productsToFix.push({
          id: product.id,
          currentName: product.name,
          newName: newName
        });
      }
    }
    
    if (productsToFix.length === 0) {
      console.log('✅ No products found with "300M" or "500M" in their titles.');
      return;
    }
    
    console.log(`📋 Found ${productsToFix.length} products to update:\n`);
    productsToFix.forEach((p, index) => {
      console.log(`${index + 1}. Product ${p.id}:`);
      console.log(`   Current: "${p.currentName}"`);
      console.log(`   New:     "${p.newName}"\n`);
    });
    
    console.log('🚀 Proceeding with updates...\n');
    
    // Now update them
    for (const product of productsToFix) {
      try {
        await axios.put(`${WP_URL}/wp-json/wc/v3/products/${product.id}`, {
          name: product.newName
        }, {
          auth: {
            username: WP_USER,
            password: APP_PASSWORD
          }
        });
        
        console.log(`✅ Updated product ${product.id}: ${product.newName}`);
        fixedCount++;
        
      } catch (err) {
        console.log(`❌ Failed to update product ${product.id}: ${err.response?.data?.message || err.message}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    console.log(`\n📊 SUMMARY:`);
    console.log(`Products checked: ${bremontProducts.length}`);
    console.log(`Products updated: ${fixedCount}/${productsToFix.length}`);
    
    if (fixedCount === productsToFix.length) {
      console.log('\n✅ All meter capitalizations fixed successfully!');
    }
    
  } catch (err) {
    console.error('Error:', err.response?.data?.message || err.message);
  }
}

fixMeterCapitalization();