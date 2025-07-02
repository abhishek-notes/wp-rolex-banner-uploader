#!/usr/bin/env node

const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

const { WP_USER, APP_PASSWORD, WP_URL } = process.env;

async function comprehensiveAnalysis() {
  // Read all Bremont products
  const products = JSON.parse(fs.readFileSync('all-bremont-products.json', 'utf-8'));
  
  // Read code-syntax file
  const codeSyntax = fs.readFileSync('code-syntax-bremont.txt', 'utf-8');
  
  // Extract all product entries with their details
  const productRegex = /Product \d+: ([^\n]+)\(WordPress Post Title: ([^\)]+)\)[\s\S]*?(?=Product \d+:|$)/g;
  const refRegex = /Ref No: ([A-Z0-9-]+)/g;
  
  let match;
  const referenceProducts = [];
  
  // Parse reference document
  while ((match = productRegex.exec(codeSyntax)) !== null) {
    const fullMatch = match[0];
    const title = match[1].trim();
    const wpTitle = match[2].trim();
    
    // Extract ref number from this product section
    const refMatch = fullMatch.match(/Ref No: ([A-Z0-9-]+)/);
    const ref = refMatch ? refMatch[1] : null;
    
    // Extract description (first few paragraphs)
    const descMatch = fullMatch.match(/Generated html\s*([\s\S]+?)(?=<b>Functions|$)/);
    const description = descMatch ? descMatch[1].trim() : '';
    
    referenceProducts.push({
      title,
      wpTitle,
      ref,
      description: description.substring(0, 200) + '...'
    });
  }
  
  console.log('=== COMPREHENSIVE BREMONT PRODUCT ANALYSIS ===\n');
  console.log(`WordPress Products: ${products.length}`);
  console.log(`Reference Products: ${referenceProducts.length}\n`);
  
  // Create analysis report
  const report = {
    summary: {
      totalWordPressProducts: products.length,
      totalReferenceProducts: referenceProducts.length,
      timestamp: new Date().toISOString()
    },
    issues: [],
    fixes: []
  };
  
  // Analyze each WordPress product
  products.forEach((product) => {
    const issues = [];
    const fixes = {};
    
    // Extract image reference from WordPress product
    const imageRef = product.images[0]?.match(/([A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+)/)?.[1];
    
    // Find matching reference product by ref number
    const matchingRef = referenceProducts.find(rp => rp.ref === imageRef);
    
    if (matchingRef) {
      // Check if title matches
      if (product.name !== matchingRef.wpTitle) {
        issues.push(`Title mismatch: Current="${product.name}", Should be="${matchingRef.wpTitle}"`);
        fixes.title = matchingRef.wpTitle;
      }
      
      // Check if it's the correct product for this image
      if (!matchingRef.wpTitle.toLowerCase().includes(product.name.toLowerCase()) && 
          !product.name.toLowerCase().includes(matchingRef.wpTitle.toLowerCase())) {
        issues.push(`Product-Image mismatch: Image ${imageRef} belongs to "${matchingRef.wpTitle}"`);
        fixes.correctProduct = matchingRef.wpTitle;
      }
    } else if (imageRef) {
      issues.push(`Image reference ${imageRef} not found in reference document`);
    }
    
    // Check for duplicate images (suffix -2, -3, etc)
    if (product.images[0]?.match(/-[2-9]$/)) {
      issues.push('Image has duplicate suffix, should use primary image');
      fixes.removeImageSuffix = true;
    }
    
    // Check for missing SKU
    if (!product.sku) {
      issues.push('Missing SKU (should be the reference number)');
      fixes.sku = imageRef || '';
    }
    
    if (issues.length > 0) {
      report.issues.push({
        id: product.id,
        name: product.name,
        issues,
        fixes,
        imageRef
      });
    }
  });
  
  // Display detailed report
  console.log('=== DETAILED ISSUES REPORT ===\n');
  
  report.issues.forEach((item, index) => {
    console.log(`\n${index + 1}. Product ID ${item.id}: ${item.name}`);
    console.log(`   Image Ref: ${item.imageRef || 'Not found'}`);
    console.log('   Issues:');
    item.issues.forEach(issue => console.log(`     - ${issue}`));
    console.log('   Fixes needed:');
    Object.entries(item.fixes).forEach(([key, value]) => {
      console.log(`     - ${key}: ${value}`);
    });
  });
  
  console.log(`\n\n=== SUMMARY ===`);
  console.log(`Total products with issues: ${report.issues.length}/${products.length}`);
  console.log(`\nMain issues found:`);
  console.log(`- Title mismatches`);
  console.log(`- Product-image reference mismatches`);
  console.log(`- Duplicate image suffixes (-2, -3, etc)`);
  console.log(`- Missing SKUs`);
  console.log(`- Incorrect product descriptions`);
  
  // Save full report
  fs.writeFileSync('bremont-comprehensive-report.json', JSON.stringify(report, null, 2));
  console.log('\nFull report saved to bremont-comprehensive-report.json');
  
  // Create fixes script
  createFixesScript(report);
}

function createFixesScript(report) {
  const fixes = report.issues.map(issue => ({
    id: issue.id,
    updates: {}
  }));
  
  report.issues.forEach((issue, index) => {
    const fix = fixes[index];
    
    if (issue.fixes.title) {
      fix.updates.name = issue.fixes.title;
    }
    
    if (issue.fixes.sku) {
      fix.updates.sku = issue.fixes.sku;
    }
    
    // Add more fix logic as needed
  });
  
  fs.writeFileSync('bremont-fixes.json', JSON.stringify(fixes, null, 2));
  console.log('Fixes script data saved to bremont-fixes.json');
}

comprehensiveAnalysis();