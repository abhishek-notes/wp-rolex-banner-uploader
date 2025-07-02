#!/usr/bin/env node

const axios = require('axios');
require('dotenv').config();

const { WP_USER, APP_PASSWORD, WP_URL } = process.env;

async function checkRemainingIssues() {
  try {
    console.log('🔍 CHECKING FOR ANY REMAINING TOP-LINE DESCRIPTIONS...\n');
    
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
    
    let issuesFound = 0;
    
    for (const product of bremontProducts) {
      // Check for any <p><strong> at the beginning
      if (product.description.match(/^<p><strong>[^<]+<\/strong><\/p>/)) {
        issuesFound++;
        console.log(`⚠️  Product ${product.id}: ${product.name}`);
        const match = product.description.match(/^<p><strong>([^<]+)<\/strong><\/p>/);
        console.log(`   Contains top-line: "${match[1]}"`);
        console.log(`   First 200 chars: ${product.description.substring(0, 200)}...\n`);
      }
      
      // Also check for "Bremont Terra Nova" in the description content
      if (product.description.includes('Bremont Terra Nova') && !product.name.includes('Terra Nova')) {
        console.log(`⚠️  Product ${product.id}: ${product.name}`);
        console.log(`   Contains "Bremont Terra Nova" in description but product is not Terra Nova\n`);
      }
    }
    
    if (issuesFound === 0) {
      console.log('✅ No products found with top-line descriptions!');
      console.log('✅ All descriptions are clean.');
    } else {
      console.log(`\n📊 Found ${issuesFound} products that still have issues.`);
    }
    
    // Also check product names match exactly
    console.log('\n🔍 CHECKING PRODUCT NAMES...\n');
    
    const EXPECTED_NAMES = {
      'ALT42-MT-TI-BKBK-B': 'Altitude MB Meteor, Black Dial, Ti Bracelet',
      'ALT42-MT-TI-BKBK-L-S': 'Altitude MB Meteor, Black Dial, Leather Strap',
      'ALT42-MT-TI-SITI-B': 'Altitude MB Meteor, Silver Dial, Ti Bracelet',
      'ALT42-MT-TI-SITI-L-S': 'Altitude MB Meteor, Silver Dial, Leather Strap'
    };
    
    for (const product of bremontProducts) {
      const refMatch = product.description.match(/Ref No: ([A-Z0-9-]+)/);
      const ref = refMatch ? refMatch[1] : null;
      
      if (ref && EXPECTED_NAMES[ref] && product.name !== EXPECTED_NAMES[ref]) {
        console.log(`❌ Product ${product.id} name mismatch:`);
        console.log(`   Current: "${product.name}"`);
        console.log(`   Expected: "${EXPECTED_NAMES[ref]}"`);
      }
    }
    
  } catch (err) {
    console.error('Error:', err.response?.data?.message || err.message);
  }
}

checkRemainingIssues();