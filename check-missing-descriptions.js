#!/usr/bin/env node

const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const { WP_USER, APP_PASSWORD, WP_URL } = process.env;

async function checkMissingDescriptions() {
  try {
    console.log('🔍 CHECKING FOR PRODUCTS WITH MISSING OR SHORT DESCRIPTIONS...\n');
    
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
    
    // Products that should have minimal descriptions (recently created)
    const newProductIds = [28801, 28802, 28803, 28804, 28805, 28806, 28807, 28808];
    
    const productsNeedingDescriptions = [];
    
    for (const product of bremontProducts) {
      // Check description length and content
      const hasMinimalDescription = product.description.length < 500;
      const hasOnlyBasicContent = product.description.includes('Available at Palladio Jewellers') && 
                                  !product.description.includes('<b>Functions</b>');
      
      if (hasMinimalDescription || hasOnlyBasicContent) {
        const refMatch = product.description.match(/Ref No: ([A-Z0-9-]+)/);
        const ref = refMatch ? refMatch[1] : 'Not found';
        
        productsNeedingDescriptions.push({
          id: product.id,
          name: product.name,
          ref: ref,
          descriptionLength: product.description.length,
          isNewProduct: newProductIds.includes(product.id)
        });
        
        console.log(`⚠️  Product ${product.id}: ${product.name}`);
        console.log(`   Ref: ${ref}`);
        console.log(`   Description length: ${product.description.length} chars`);
        console.log(`   Type: ${newProductIds.includes(product.id) ? 'Newly created product' : 'Existing product'}`);
        console.log(`   Current content: ${product.description.substring(0, 100)}...\n`);
      }
    }
    
    console.log(`\n📊 SUMMARY:`);
    console.log(`Total products needing full descriptions: ${productsNeedingDescriptions.length}`);
    
    // Save list for updating
    if (productsNeedingDescriptions.length > 0) {
      fs.writeFileSync('products-needing-descriptions.json', JSON.stringify(productsNeedingDescriptions, null, 2));
      console.log(`\n📄 List saved to: products-needing-descriptions.json`);
      
      // Show which references we need from the syntax file
      console.log(`\n📋 References needed from syntax file:`);
      productsNeedingDescriptions.forEach(p => {
        console.log(`- ${p.ref}: ${p.name}`);
      });
    }
    
  } catch (err) {
    console.error('Error:', err.response?.data?.message || err.message);
  }
}

checkMissingDescriptions();