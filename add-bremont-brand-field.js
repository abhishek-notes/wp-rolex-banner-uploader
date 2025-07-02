#!/usr/bin/env node

const axios = require('axios');
require('dotenv').config();

const { WP_USER, APP_PASSWORD, WP_URL } = process.env;

async function addBremontBrandField() {
  try {
    console.log('🏷️  ADDING "Bremont" TO BRAND CUSTOM FIELD FOR ALL PRODUCTS...\n');
    
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
    
    console.log(`Found ${bremontProducts.length} Bremont products to update...\n`);
    
    let successCount = 0;
    let alreadySetCount = 0;
    
    for (const product of bremontProducts) {
      // Check if Brand field is already set to Bremont
      const brandField = product.meta_data.find(meta => meta.key === 'brand' || meta.key === 'Brand');
      
      if (brandField && brandField.value === 'Bremont') {
        console.log(`✓ Product ${product.id}: Brand already set to "Bremont"`);
        alreadySetCount++;
        continue;
      }
      
      console.log(`📝 Product ${product.id}: ${product.name}`);
      
      try {
        // Add/Update the Brand meta field
        await axios.put(`${WP_URL}/wp-json/wc/v3/products/${product.id}`, {
          meta_data: [
            ...product.meta_data.filter(meta => meta.key !== 'brand' && meta.key !== 'Brand'),
            {
              key: 'brand',
              value: 'Bremont'
            }
          ]
        }, {
          auth: {
            username: WP_USER,
            password: APP_PASSWORD
          }
        });
        
        console.log(`   ✅ Brand field set to "Bremont"`);
        successCount++;
        
      } catch (err) {
        console.log(`   ❌ Failed: ${err.response?.data?.message || err.message}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    console.log('\n📊 BRAND FIELD UPDATE SUMMARY:');
    console.log(`Total products checked: ${bremontProducts.length}`);
    console.log(`Brand field updated: ${successCount}`);
    console.log(`Already had Bremont brand: ${alreadySetCount}`);
    console.log(`Total with Bremont brand: ${successCount + alreadySetCount}`);
    
    if (successCount + alreadySetCount === bremontProducts.length) {
      console.log('\n✅ All products now have "Bremont" brand field set!');
    }
    
  } catch (err) {
    console.error('Error:', err.response?.data?.message || err.message);
  }
}

addBremontBrandField();