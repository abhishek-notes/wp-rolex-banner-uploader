#!/usr/bin/env node

const axios = require('axios');
require('dotenv').config();

const { WP_USER, APP_PASSWORD, WP_URL } = process.env;

async function removeAllToplineStrong() {
  try {
    console.log('🔍 REMOVING ALL TOP-LINE <strong> PRODUCT NAMES FROM DESCRIPTIONS...\n');
    
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
    
    console.log(`Checking ${bremontProducts.length} Bremont products...\n`);
    
    let fixedCount = 0;
    
    for (const product of bremontProducts) {
      // Check for any <p><strong>Product Name</strong></p> or <p><strong>Product Name</strong><br /> at the beginning
      const hasToplineStrong = product.description.match(/^<p><strong>[^<]+<\/strong>(<\/p>|<br \/>)/);
      
      if (hasToplineStrong) {
        console.log(`📝 Product ${product.id}: ${product.name}`);
        console.log(`   Found top-line: "${hasToplineStrong[0]}"`);
        
        try {
          // Remove the top-line strong element - handles both </p> and <br /> endings
          const updatedDescription = product.description.replace(
            /^<p><strong>[^<]+<\/strong>(<\/p>\n?|<br \/>\n?)/,
            ''
          );
          
          await axios.put(`${WP_URL}/wp-json/wc/v3/products/${product.id}`, {
            description: updatedDescription
          }, {
            auth: {
              username: WP_USER,
              password: APP_PASSWORD
            }
          });
          
          console.log(`   ✅ Removed top-line strong element\n`);
          fixedCount++;
          
        } catch (err) {
          console.log(`   ❌ Failed: ${err.response?.data?.message || err.message}\n`);
        }
        
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
    
    console.log('📊 REMOVAL SUMMARY:');
    console.log(`Total products checked: ${bremontProducts.length}`);
    console.log(`Top-line strong elements removed: ${fixedCount}`);
    
    if (fixedCount === 0) {
      console.log('\n✅ No top-line <strong> elements found!');
    } else {
      console.log(`\n✅ Successfully removed ${fixedCount} top-line strong elements!`);
    }
    
  } catch (err) {
    console.error('Error:', err.response?.data?.message || err.message);
  }
}

removeAllToplineStrong();