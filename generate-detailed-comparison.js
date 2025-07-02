#!/usr/bin/env node

const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

const { WP_USER, APP_PASSWORD, WP_URL } = process.env;

async function generateDetailedComparison() {
  console.log('=== GENERATING DETAILED COMPARISON ===\n');
  
  // Read WordPress products
  const wpProducts = JSON.parse(fs.readFileSync('all-bremont-products.json', 'utf-8'));
  
  // Read and parse reference document
  const codeSyntax = fs.readFileSync('code-syntax-bremont.txt', 'utf-8');
  
  // Extract all products from reference document with complete details
  const productSections = codeSyntax.split(/(?=Product \d+:)/);
  const referenceProducts = [];
  
  productSections.forEach(section => {
    if (!section.trim() || !section.includes('Product')) return;
    
    // Extract basic info
    const titleMatch = section.match(/Product \d+: ([^\n]+)\(WordPress Post Title: ([^\)]+)\)/);
    if (!titleMatch) return;
    
    const originalTitle = titleMatch[1].trim();
    const wpTitle = titleMatch[2].trim();
    
    // Extract reference number
    const refMatch = section.match(/Ref No: ([A-Z0-9-]+)/);
    const refNumber = refMatch ? refMatch[1] : null;
    
    // Extract description
    const descMatch = section.match(/Generated html\s*\n([\s\S]+?)(?=\n\n<b>Functions|$)/);
    const description = descMatch ? descMatch[1].trim() : '';
    
    // Extract functions
    const functionsMatch = section.match(/<b>Functions<\/b>\s*\n([\s\S]+?)(?=\n\n<b>Movement|$)/);
    const functions = functionsMatch ? functionsMatch[1].trim() : '';
    
    // Extract movement details
    const movementMatch = section.match(/<b>Movement<\/b>\s*\n([\s\S]+?)(?=\n\n<b>Case|$)/);
    const movement = movementMatch ? movementMatch[1].trim() : '';
    
    // Extract case specifications
    const caseMatch = section.match(/<b>Case specifications<\/b>\s*\n([\s\S]+?)(?=\n\n<b>Dial|$)/);
    const caseSpecs = caseMatch ? caseMatch[1].trim() : '';
    
    // Extract dial specifications
    const dialMatch = section.match(/<b>Dial and Hands specifications<\/b>\s*\n([\s\S]+?)(?=\n\n<b>Crystal|$)/);
    const dialSpecs = dialMatch ? dialMatch[1].trim() : '';
    
    // Extract other specs
    const crystalMatch = section.match(/<b>Crystal<\/b>\s*\n([\s\S]+?)(?=\n\n<b>Water|$)/);
    const crystal = crystalMatch ? crystalMatch[1].trim() : '';
    
    const waterMatch = section.match(/<b>Water Resistance<\/b>\s*\n([\s\S]+?)(?=\n\n<strong>Strap|<b>Weight|$)/);
    const waterResistance = waterMatch ? waterMatch[1].trim() : '';
    
    const strapMatch = section.match(/<strong>Strap<\/strong>\s*\n([\s\S]+?)(?=\n\n<b>Weight|$)/);
    const strap = strapMatch ? strapMatch[1].trim() : '';
    
    const weightMatch = section.match(/<b>Weight<\/b>\s*\n([\s\S]+?)(?=\n\n<span|$)/);
    const weight = weightMatch ? weightMatch[1].trim() : '';
    
    referenceProducts.push({
      originalTitle,
      wpTitle,
      refNumber,
      description,
      functions,
      movement,
      caseSpecs,
      dialSpecs,
      crystal,
      waterResistance,
      strap,
      weight,
      fullSection: section
    });
  });
  
  console.log(`Found ${referenceProducts.length} products in reference document\n`);
  
  // Create detailed comparison
  const comparison = {
    timestamp: new Date().toISOString(),
    referenceProducts: referenceProducts.length,
    wpProducts: wpProducts.length,
    comparisons: []
  };
  
  // Compare each reference product with WordPress products
  referenceProducts.forEach((refProduct, index) => {
    console.log(`\n=== ${index + 1}. ${refProduct.wpTitle} ===`);
    console.log(`Reference Number: ${refProduct.refNumber}`);
    
    // Find matching WordPress product by title or reference
    const wpMatches = wpProducts.filter(wp => {
      const titleMatch = wp.name.toLowerCase() === refProduct.wpTitle.toLowerCase();
      const refMatch = wp.images[0]?.includes(refProduct.refNumber);
      return titleMatch || refMatch;
    });
    
    console.log(`WordPress matches found: ${wpMatches.length}`);
    
    if (wpMatches.length === 0) {
      console.log('❌ NO MATCHING WORDPRESS PRODUCT FOUND');
      comparison.comparisons.push({
        refProduct: refProduct.wpTitle,
        refNumber: refProduct.refNumber,
        wpProduct: null,
        status: 'MISSING_IN_WP',
        issues: ['Product missing in WordPress']
      });
    } else if (wpMatches.length > 1) {
      console.log('⚠️  MULTIPLE MATCHES FOUND:');
      wpMatches.forEach(wp => console.log(`   - ID ${wp.id}: ${wp.name}`));
      comparison.comparisons.push({
        refProduct: refProduct.wpTitle,
        refNumber: refProduct.refNumber,
        wpProduct: wpMatches.map(wp => `${wp.id}: ${wp.name}`),
        status: 'DUPLICATE_IN_WP',
        issues: ['Multiple WordPress products for same reference']
      });
    } else {
      const wpProduct = wpMatches[0];
      console.log(`✓ Found: ID ${wpProduct.id}: ${wpProduct.name}`);
      
      // Detailed comparison
      const issues = [];
      const fixes = {};
      
      // Title comparison
      if (wpProduct.name !== refProduct.wpTitle) {
        issues.push(`Title mismatch: "${wpProduct.name}" should be "${refProduct.wpTitle}"`);
        fixes.name = refProduct.wpTitle;
      }
      
      // SKU comparison
      if (wpProduct.sku !== refProduct.refNumber) {
        issues.push(`SKU mismatch: "${wpProduct.sku}" should be "${refProduct.refNumber}"`);
        fixes.sku = refProduct.refNumber;
      }
      
      // Image reference comparison
      const wpImageRef = wpProduct.images[0]?.match(/([A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+)/)?.[1];
      if (wpImageRef !== refProduct.refNumber) {
        issues.push(`Image ref mismatch: "${wpImageRef}" should be "${refProduct.refNumber}"`);
        fixes.imageRef = refProduct.refNumber;
      }
      
      // Build complete expected description
      const expectedDescription = buildCompleteDescription(refProduct);
      fixes.description = expectedDescription;
      
      if (issues.length > 0) {
        console.log('   Issues found:');
        issues.forEach(issue => console.log(`     - ${issue}`));
      } else {
        console.log('   ✅ All fields match reference');
      }
      
      comparison.comparisons.push({
        refProduct: refProduct.wpTitle,
        refNumber: refProduct.refNumber,
        wpProduct: {
          id: wpProduct.id,
          name: wpProduct.name,
          sku: wpProduct.sku,
          images: wpProduct.images
        },
        status: issues.length > 0 ? 'NEEDS_UPDATE' : 'CORRECT',
        issues,
        fixes
      });
    }
  });
  
  // Check for WordPress products not in reference
  console.log('\n=== WORDPRESS PRODUCTS NOT IN REFERENCE ===');
  const orphanedProducts = wpProducts.filter(wp => {
    const wpImageRef = wp.images[0]?.match(/([A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+)/)?.[1];
    return !referenceProducts.some(ref => ref.refNumber === wpImageRef);
  });
  
  orphanedProducts.forEach(wp => {
    const wpImageRef = wp.images[0]?.match(/([A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+)/)?.[1];
    console.log(`❓ ID ${wp.id}: ${wp.name} (Ref: ${wpImageRef})`);
    comparison.comparisons.push({
      refProduct: null,
      refNumber: wpImageRef,
      wpProduct: {
        id: wp.id,
        name: wp.name,
        sku: wp.sku
      },
      status: 'NOT_IN_REFERENCE',
      issues: ['Product exists in WordPress but not in reference document']
    });
  });
  
  // Save detailed comparison
  fs.writeFileSync('detailed-comparison.json', JSON.stringify(comparison, null, 2));
  
  // Summary
  console.log('\n=== SUMMARY ===');
  const needsUpdate = comparison.comparisons.filter(c => c.status === 'NEEDS_UPDATE').length;
  const missing = comparison.comparisons.filter(c => c.status === 'MISSING_IN_WP').length;
  const duplicates = comparison.comparisons.filter(c => c.status === 'DUPLICATE_IN_WP').length;
  const orphaned = comparison.comparisons.filter(c => c.status === 'NOT_IN_REFERENCE').length;
  const correct = comparison.comparisons.filter(c => c.status === 'CORRECT').length;
  
  console.log(`Products needing updates: ${needsUpdate}`);
  console.log(`Products missing in WordPress: ${missing}`);
  console.log(`Duplicate products in WordPress: ${duplicates}`);
  console.log(`WordPress products not in reference: ${orphaned}`);
  console.log(`Correct products: ${correct}`);
  
  console.log('\nDetailed comparison saved to detailed-comparison.json');
  
  return comparison;
}

function buildCompleteDescription(refProduct) {
  let html = '';
  
  if (refProduct.description) {
    html += refProduct.description + '\n\n';
  }
  
  if (refProduct.functions) {
    html += '<b>Functions</b>\n\n' + refProduct.functions + '\n\n';
  }
  
  if (refProduct.movement) {
    html += '<b>Movement</b>\n\n' + refProduct.movement + '\n\n';
  }
  
  if (refProduct.caseSpecs) {
    html += '<b>Case specifications</b>\n\n' + refProduct.caseSpecs + '\n\n';
  }
  
  if (refProduct.dialSpecs) {
    html += '<b>Dial and Hands specifications</b>\n\n' + refProduct.dialSpecs + '\n\n';
  }
  
  if (refProduct.crystal) {
    html += '<b>Crystal</b>\n\n' + refProduct.crystal + '\n\n';
  }
  
  if (refProduct.waterResistance) {
    html += '<b>Water Resistance</b>\n\n' + refProduct.waterResistance + '\n\n';
  }
  
  if (refProduct.strap) {
    html += '<strong>Strap</strong>\n\n' + refProduct.strap + '\n\n';
  }
  
  if (refProduct.weight) {
    html += '<b>Weight</b>\n\n' + refProduct.weight + '\n\n';
  }
  
  // Add hidden tags
  if (refProduct.refNumber) {
    html += `<span style="display: none;">Tags : Ref No: ${refProduct.refNumber}</span>`;
  }
  
  return html.trim();
}

generateDetailedComparison();