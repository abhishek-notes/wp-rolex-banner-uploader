#!/usr/bin/env node

const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const { WP_USER, APP_PASSWORD, WP_URL } = process.env;

async function fetchCurrentBremontData() {
  try {
    console.log('🔍 Fetching all current Bremont products from WordPress...');
    
    // Fetch all products and filter for Bremont
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
    
    // Filter for Bremont products
    const allProducts = response.data;
    const products = allProducts.filter(product => 
      product.categories.some(cat => cat.name.toLowerCase().includes('bremont'))
    );
    console.log(`Found ${products.length} Bremont products`);
    
    // Extract detailed product information
    const productData = products.map(product => {
      // Extract reference number from description (hidden span tag)
      const refMatch = product.description.match(/Ref No: ([A-Z0-9-]+)/);
      const referenceNumber = refMatch ? refMatch[1] : 'Not found';
      
      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        sku: product.sku || 'Not set',
        referenceNumber: referenceNumber,
        status: product.status,
        dateCreated: product.date_created,
        categories: product.categories.map(cat => cat.name),
        featuredImage: product.images[0] ? {
          id: product.images[0].id,
          name: product.images[0].name,
          alt: product.images[0].alt,
          src: product.images[0].src
        } : null,
        shortDescription: product.short_description,
        descriptionLength: product.description.length,
        productUrl: product.permalink
      };
    });
    
    // Sort by ID descending (newest first)
    productData.sort((a, b) => b.id - a.id);
    
    // Create comprehensive analysis
    const analysis = {
      timestamp: new Date().toISOString(),
      totalProducts: productData.length,
      products: productData,
      duplicateAnalysis: findDuplicates(productData),
      referenceIssues: findReferenceIssues(productData),
      summary: {
        withValidRef: productData.filter(p => p.referenceNumber !== 'Not found').length,
        withSKU: productData.filter(p => p.sku !== 'Not set').length,
        withImages: productData.filter(p => p.featuredImage).length
      }
    };
    
    // Save to file
    fs.writeFileSync('current-bremont-analysis.json', JSON.stringify(analysis, null, 2));
    
    // Create comparison file based on the issues provided
    await createComparisonFile(productData);
    
    console.log(`\n📄 Current data saved to: current-bremont-analysis.json`);
    console.log(`📋 Comparison file created: bremont-cleanup-plan.json`);
    
    // Display summary
    console.log(`\n📊 CURRENT STATUS:`);
    console.log(`Total products: ${analysis.totalProducts}`);
    console.log(`With valid ref numbers: ${analysis.summary.withValidRef}`);
    console.log(`With SKUs: ${analysis.summary.withSKU}`);
    console.log(`With images: ${analysis.summary.withImages}`);
    
    if (analysis.duplicateAnalysis.length > 0) {
      console.log(`\n⚠️  Found ${analysis.duplicateAnalysis.length} sets of duplicates`);
    }
    
  } catch (err) {
    console.error('Error:', err.response?.data?.message || err.message);
  }
}

function findDuplicates(products) {
  const refGroups = {};
  
  products.forEach(product => {
    const ref = product.referenceNumber;
    if (ref !== 'Not found') {
      if (!refGroups[ref]) {
        refGroups[ref] = [];
      }
      refGroups[ref].push(product.id);
    }
  });
  
  return Object.entries(refGroups)
    .filter(([ref, ids]) => ids.length > 1)
    .map(([ref, ids]) => ({ referenceNumber: ref, duplicateIds: ids }));
}

function findReferenceIssues(products) {
  const issues = [];
  
  products.forEach(product => {
    const ref = product.referenceNumber;
    if (ref === 'Not found') {
      issues.push({
        id: product.id,
        issue: 'No reference number found',
        current: ref
      });
    }
  });
  
  return issues;
}

async function createComparisonFile(currentProducts) {
  // Issues from the user's analysis
  const cleanupPlan = {
    timestamp: new Date().toISOString(),
    duplicatesToRemove: [
      {
        referenceNumber: 'TN40-DT-SS-BK-B',
        duplicateIds: [28689, 28640],
        action: 'Keep latest (28689), delete 28640'
      },
      {
        referenceNumber: 'TN40-JH-SS-BK-B',
        duplicateIds: [28687, 28638],
        action: 'Keep 28687, delete 28638'
      },
      {
        referenceNumber: 'TN40-PWR-SS-BK-L',
        duplicateIds: [28685, 28681, 28636],
        action: 'All invalid - missing -S suffix. Fix one to TN40-PWR-SS-BK-L-S'
      },
      {
        referenceNumber: 'TN40-PWR-SS-BL-B',
        duplicateIds: [28683, 28679, 28634],
        action: 'Keep 28683, delete others'
      },
      {
        referenceNumber: 'ALT42-MT-TI-BKBK-L',
        duplicateIds: [28670, 28668, 28666],
        action: 'All invalid - delete all, recreate correct Meteor variants'
      },
      {
        referenceNumber: 'SM40-ND-SS-BL-S',
        duplicateIds: [28658, 28652],
        action: 'Keep 28658, delete 28652'
      }
    ],
    incorrectProducts: [
      { id: 28642, currentRef: 'TN40-DT-SS-GN-L', correctRef: 'TN40-DT-SS-GN-L-S', action: 'Fix reference' },
      { id: 28632, currentRef: 'TN42-CHR-SS-BK-L', correctRef: 'TN42-CHR-SS-BK-L-S', action: 'Fix reference' },
      { id: 28629, currentRef: 'TN42-CHR-BZ-GN-L', correctRef: 'TN42-CHR-BZ-GN-L-S', action: 'Fix reference' },
      { id: 28662, currentRef: 'ALT42-CHR-G-SS-BK', correctRef: 'ALT42-CHR-G-SS-BK-L-S', action: 'Fix reference and title' },
      { id: 28658, issue: 'Wrong title', action: 'Rename to "Supermarine 300M, Blue Dial, Bracelet"' },
      { id: 28652, currentRef: 'SM40-ND-SS-BL-S', correctRef: 'SM40-DT-BI-BR-B', action: 'Replace entirely - wrong model' },
      { id: 28656, currentRef: 'SM40-DT-SS-BK-R', correctRef: 'SM40-DT-SS-BK-R-S', action: 'Fix reference' },
      { id: 28650, currentRef: 'SM43-DT-SS-BK-R', correctRef: 'SM43-DT-SS-BK-R-S', action: 'Fix reference' },
      { id: 28646, currentRef: 'SM43-DT-BKCER-BK-N', correctRef: 'SM43-DT-BKCER-BK-N-S', action: 'Fix reference' }
    ],
    missingProducts: [
      { collection: 'Altitude', title: 'MB Meteor, Black Dial, Ti Bracelet', ref: 'ALT42-MT-TI-BKBK-B' },
      { collection: 'Altitude', title: 'MB Meteor, Silver Dial, Ti Bracelet', ref: 'ALT42-MT-TI-SITI-B' },
      { collection: 'Altitude', title: 'MB Meteor, Silver Dial, Leather Strap', ref: 'ALT42-MT-TI-SITI-L-S' },
      { collection: 'Altitude', title: 'Chronograph GMT, Black Dial, Leather Strap', ref: 'ALT42-CHR-G-SS-BK-L-S' },
      { collection: 'Supermarine', title: '300M GMT "Tundra" Green', ref: 'SM40-GMT-SS-GNBK-G' },
      { collection: 'Supermarine', title: '300M GMT "Glacier" Blue', ref: 'SM40-GMT-SS-BLBK-B' },
      { collection: 'Supermarine', title: '300M, Green Dial, Bracelet (no-date)', ref: 'SM40-ND-SS-GN-B' },
      { collection: 'Supermarine', title: '300M Date Bi-Colour, Bracelet', ref: 'SM40-DT-BI-BR-B' }
    ],
    currentProducts: currentProducts.map(p => ({
      id: p.id,
      name: p.name,
      referenceNumber: p.referenceNumber,
      status: 'current'
    }))
  };
  
  fs.writeFileSync('bremont-cleanup-plan.json', JSON.stringify(cleanupPlan, null, 2));
}

fetchCurrentBremontData();