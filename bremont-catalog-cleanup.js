#!/usr/bin/env node

const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const { WP_USER, APP_PASSWORD, WP_URL } = process.env;

// Step 1: Delete 10 products
const PRODUCTS_TO_DELETE = [28640, 28638, 28681, 28636, 28679, 28634, 28670, 28668, 28666, 28652];

// Step 2: Fix 9 live products  
const PRODUCTS_TO_FIX = [
  {
    id: 28685,
    referenceNumber: 'TN40-PWR-SS-BK-L-S',
    slug: 'terra-nova-40-5-turning-bezel-power-reserve-black',
    collection: 'Terra Nova'
  },
  {
    id: 28683,
    referenceNumber: 'TN40-PWR-SS-BL-B', 
    slug: 'terra-nova-40-5-turning-bezel-power-reserve',
    collection: 'Terra Nova'
  },
  {
    id: 28642,
    referenceNumber: 'TN40-DT-SS-GN-L-S',
    slug: 'terra-nova-40-5-date-green-dial',
    collection: 'Terra Nova'
  },
  {
    id: 28632,
    referenceNumber: 'TN42-CHR-SS-BK-L-S',
    slug: 'terra-nova-42-5-chronograph-leather-strap',
    collection: 'Terra Nova'
  },
  {
    id: 28629,
    referenceNumber: 'TN42-CHR-BZ-GN-L-S',
    slug: 'terra-nova-42-5-chronograph-bronze',
    collection: 'Terra Nova'
  },
  {
    id: 28662,
    referenceNumber: 'ALT42-CHR-G-SS-BK-L-S',
    title: 'Altitude Chronograph GMT, Black Dial, Leather Strap',
    slug: 'altitude-chronograph-gmt-black-leather',
    collection: 'Altitude'
  },
  {
    id: 28658,
    referenceNumber: 'SM40-ND-SS-BL-B',
    title: 'Supermarine 300M, Blue Dial, Bracelet',
    slug: 'supermarine-300m-blue-bracelet',
    collection: 'Supermarine'
  },
  {
    id: 28656,
    referenceNumber: 'SM40-DT-SS-BK-R-S',
    collection: 'Supermarine'
  },
  {
    id: 28650,
    referenceNumber: 'SM43-DT-SS-BK-R-S',
    collection: 'Supermarine'
  },
  {
    id: 28646,
    referenceNumber: 'SM43-DT-BKCER-BK-N-S',
    collection: 'Supermarine'
  }
];

// Step 3: Create 8 new products
const NEW_PRODUCTS = [
  {
    title: 'Altitude MB Meteor, Black Dial, Ti Bracelet',
    referenceNumber: 'ALT42-MT-TI-BKBK-B',
    collection: 'Altitude',
    strap: 'bracelet'
  },
  {
    title: 'Altitude MB Meteor, Black Dial, Leather Strap', 
    referenceNumber: 'ALT42-MT-TI-BKBK-L-S',
    collection: 'Altitude',
    strap: 'leather'
  },
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

async function step1_deleteProducts() {
  console.log('🗑️ STEP 1: Deleting 10 duplicate/obsolete products...\n');
  
  let successCount = 0;
  let failCount = 0;
  
  for (const productId of PRODUCTS_TO_DELETE) {
    try {
      console.log(`Deleting product ${productId}...`);
      
      await axios.delete(`${WP_URL}/wp-json/wc/v3/products/${productId}`, {
        params: { force: true },
        auth: {
          username: WP_USER,
          password: APP_PASSWORD
        }
      });
      
      console.log(`  ✅ Deleted product ${productId}`);
      successCount++;
      
    } catch (err) {
      console.log(`  ❌ Failed to delete ${productId}: ${err.response?.data?.message || err.message}`);
      failCount++;
    }
    
    await new Promise(resolve => setTimeout(resolve, 300));
  }
  
  console.log(`\n📊 STEP 1 COMPLETE:`);
  console.log(`✅ Successfully deleted: ${successCount}`);
  console.log(`❌ Failed to delete: ${failCount}\n`);
  
  return { successCount, failCount };
}

async function step2_fixProducts() {
  console.log('🔧 STEP 2: Fixing 9 live products...\n');
  
  let successCount = 0;
  let failCount = 0;
  
  for (const product of PRODUCTS_TO_FIX) {
    try {
      console.log(`Fixing product ${product.id}...`);
      
      // Get current product to update description with new ref
      const currentProduct = await axios.get(`${WP_URL}/wp-json/wc/v3/products/${product.id}`, {
        auth: { username: WP_USER, password: APP_PASSWORD }
      });
      
      const updates = {
        sku: product.referenceNumber
      };
      
      if (product.title) {
        updates.name = product.title;
      }
      
      if (product.slug) {
        updates.slug = product.slug;
      }
      
      // Update description to include correct reference number
      if (currentProduct.data.description) {
        updates.description = currentProduct.data.description.replace(
          /Ref No: [A-Z0-9-]+/,
          `Ref No: ${product.referenceNumber}`
        );
      }
      
      // Set categories - get category IDs first
      const categories = await getCategoryIds(['Bremont', product.collection, 'Watch']);
      updates.categories = categories;
      
      await axios.put(`${WP_URL}/wp-json/wc/v3/products/${product.id}`, updates, {
        auth: {
          username: WP_USER,
          password: APP_PASSWORD
        }
      });
      
      // Update featured image alt text if needed
      if (currentProduct.data.images[0] && !currentProduct.data.images[0].alt) {
        const altText = `Bremont ${product.title || currentProduct.data.name} – ${product.referenceNumber}`;
        await updateImageAlt(currentProduct.data.images[0].id, altText);
      }
      
      console.log(`  ✅ Fixed product ${product.id}`);
      successCount++;
      
    } catch (err) {
      console.log(`  ❌ Failed to fix ${product.id}: ${err.response?.data?.message || err.message}`);
      failCount++;
    }
    
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  console.log(`\n📊 STEP 2 COMPLETE:`);
  console.log(`✅ Successfully fixed: ${successCount}`);
  console.log(`❌ Failed to fix: ${failCount}\n`);
  
  return { successCount, failCount };
}

async function step3_createProducts() {
  console.log('🆕 STEP 3: Creating 8 new products...\n');
  
  let successCount = 0;
  let failCount = 0;
  
  for (const newProduct of NEW_PRODUCTS) {
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
  
  console.log(`\n📊 STEP 3 COMPLETE:`);
  console.log(`✅ Successfully created: ${successCount}`);
  console.log(`❌ Failed to create: ${failCount}\n`);
  
  return { successCount, failCount };
}

async function step4_verify() {
  console.log('✅ STEP 4: Verifying final catalog...\n');
  
  try {
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
    
    console.log(`Total Bremont products found: ${bremontProducts.length}`);
    
    // Check for duplicates
    const refs = bremontProducts.map(p => {
      const match = p.description.match(/Ref No: ([A-Z0-9-]+)/);
      return match ? match[1] : 'No ref';
    });
    
    const duplicates = refs.filter((ref, index) => refs.indexOf(ref) !== index);
    
    console.log(`Unique reference numbers: ${new Set(refs).size}`);
    console.log(`Duplicate references: ${duplicates.length > 0 ? duplicates.join(', ') : 'None'}`);
    
    const verification = {
      totalProducts: bremontProducts.length,
      uniqueRefs: new Set(refs).size,
      duplicates: duplicates,
      withSKUs: bremontProducts.filter(p => p.sku).length,
      withImages: bremontProducts.filter(p => p.images.length > 0).length
    };
    
    return { bremontProducts, verification };
    
  } catch (err) {
    console.error('Verification failed:', err.message);
    return null;
  }
}

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

async function updateImageAlt(imageId, altText) {
  try {
    await axios.post(`${WP_URL}/wp-json/wp/v2/media/${imageId}`, {
      alt_text: altText
    }, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${WP_USER}:${APP_PASSWORD}`).toString('base64')}`,
        'Content-Type': 'application/json'
      }
    });
  } catch (err) {
    console.log(`Warning: Could not update alt text for image ${imageId}`);
  }
}

async function runCleanup() {
  try {
    console.log('🚀 BREMONT CATALOG CLEANUP STARTING...\n');
    console.log('Following the step-by-step playbook exactly as specified.\n');
    
    const results = {
      timestamp: new Date().toISOString(),
      steps: {}
    };
    
    // Step 1: Delete duplicates
    results.steps.step1 = await step1_deleteProducts();
    
    // Step 2: Fix existing products
    results.steps.step2 = await step2_fixProducts();
    
    // Step 3: Create new products  
    results.steps.step3 = await step3_createProducts();
    
    // Step 4: Verify results
    const verification = await step4_verify();
    
    if (verification) {
      results.steps.step4 = verification.verification;
      
      // Step 5: Export final catalog
      fs.writeFileSync('bremont-final-catalog.json', JSON.stringify({
        timestamp: new Date().toISOString(),
        totalProducts: verification.bremontProducts.length,
        verification: verification.verification,
        products: verification.bremontProducts.map(p => ({
          id: p.id,
          name: p.name,
          sku: p.sku,
          slug: p.slug,
          referenceNumber: p.description.match(/Ref No: ([A-Z0-9-]+)/)?.[1] || 'Not found',
          categories: p.categories.map(c => c.name),
          featuredImage: p.images[0] ? {
            id: p.images[0].id,
            alt: p.images[0].alt,
            src: p.images[0].src
          } : null
        }))
      }, null, 2));
      
      console.log('📄 Final catalog exported to: bremont-final-catalog.json');
    }
    
    // Save cleanup log
    fs.writeFileSync('bremont-cleanup-log.json', JSON.stringify(results, null, 2));
    
    console.log('\n🎉 CLEANUP COMPLETE!');
    console.log('📋 Summary:');
    console.log(`- Deleted: ${results.steps.step1.successCount}/10 products`);
    console.log(`- Fixed: ${results.steps.step2.successCount}/9 products`); 
    console.log(`- Created: ${results.steps.step3.successCount}/8 products`);
    if (verification) {
      console.log(`- Final catalog: ${verification.verification.totalProducts} products`);
      console.log(`- Target achieved: ${verification.verification.totalProducts === 29 ? '✅ YES' : '❌ NO'}`);
    }
    
  } catch (err) {
    console.error('Cleanup failed:', err.message);
  }
}

runCleanup();