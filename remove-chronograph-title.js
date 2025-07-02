#!/usr/bin/env node

const axios = require('axios');
require('dotenv').config();

const { WP_USER, APP_PASSWORD, WP_URL } = process.env;

async function removeChronographTitle() {
  try {
    console.log('🔍 SEARCHING FOR "Bremont Terra Nova Chronograph – 42.5mm" IN PRODUCT CONTENT...\n');
    
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
    
    console.log(`Found ${bremontProducts.length} Bremont products to check\n`);
    
    let foundCount = 0;
    let fixedCount = 0;
    
    for (const product of bremontProducts) {
      // Check if the description contains the text to remove
      if (product.description && product.description.includes('Bremont Terra Nova Chronograph – 42.5mm')) {
        foundCount++;
        console.log(`Found in product ${product.id}: ${product.name}`);
        
        try {
          // Remove the text from the description
          const updatedDescription = product.description.replace(/Bremont Terra Nova Chronograph – 42\.5mm/g, '');
          
          // Update the product
          await axios.put(`${WP_URL}/wp-json/wc/v3/products/${product.id}`, {
            description: updatedDescription
          }, {
            auth: {
              username: WP_USER,
              password: APP_PASSWORD
            }
          });
          
          console.log(`  ✅ Removed from product ${product.id}\n`);
          fixedCount++;
          
        } catch (err) {
          console.log(`  ❌ Failed to update product ${product.id}: ${err.response?.data?.message || err.message}\n`);
        }
        
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
    
    console.log('\n📊 SUMMARY:');
    console.log(`Total products checked: ${bremontProducts.length}`);
    console.log(`Products containing the text: ${foundCount}`);
    console.log(`Products successfully fixed: ${fixedCount}`);
    
    if (foundCount === 0) {
      console.log('\n✅ No products found with "Bremont Terra Nova Chronograph – 42.5mm" in their content.');
    } else if (fixedCount === foundCount) {
      console.log('\n✅ All instances successfully removed!');
    }
    
  } catch (err) {
    console.error('Error:', err.response?.data?.message || err.message);
  }
}

removeChronographTitle();