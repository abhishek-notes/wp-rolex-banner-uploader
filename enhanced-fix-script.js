#!/usr/bin/env node

const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

const { WP_USER, APP_PASSWORD, WP_URL } = process.env;

// Read reference document and build complete descriptions
function buildDescriptionMap() {
  const codeSyntax = fs.readFileSync('code-syntax-bremont.txt', 'utf-8');
  const productSections = codeSyntax.split(/(?=Product \d+:)/);
  const descriptionMap = {};
  
  productSections.forEach(section => {
    if (!section.trim() || !section.includes('Product')) return;
    
    const refMatch = section.match(/Ref No: ([A-Z0-9-]+)/);
    if (!refMatch) return;
    
    const refNumber = refMatch[1];
    
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
    
    // Build complete description
    let completeDescription = '';
    
    if (description) completeDescription += description + '\n\n';
    if (functions) completeDescription += '<b>Functions</b>\n\n' + functions + '\n\n';
    if (movement) completeDescription += '<b>Movement</b>\n\n' + movement + '\n\n';
    if (caseSpecs) completeDescription += '<b>Case specifications</b>\n\n' + caseSpecs + '\n\n';
    if (dialSpecs) completeDescription += '<b>Dial and Hands specifications</b>\n\n' + dialSpecs + '\n\n';
    if (crystal) completeDescription += '<b>Crystal</b>\n\n' + crystal + '\n\n';
    if (waterResistance) completeDescription += '<b>Water Resistance</b>\n\n' + waterResistance + '\n\n';
    if (strap) completeDescription += '<strong>Strap</strong>\n\n' + strap + '\n\n';
    if (weight) completeDescription += '<b>Weight</b>\n\n' + weight + '\n\n';
    
    // Add hidden tags
    completeDescription += `<span style="display: none;">Tags : Ref No: ${refNumber}</span>`;
    
    descriptionMap[refNumber] = completeDescription.trim();
  });
  
  return descriptionMap;
}

async function executeEnhancedFixes() {
  console.log('🔧 EXECUTING ENHANCED BREMONT PRODUCT FIXES...');
  console.log('⚠️  THIS WILL MODIFY YOUR WORDPRESS PRODUCTS!');
  console.log('');
  
  const descriptionMap = buildDescriptionMap();
  const fixPlan = JSON.parse(fs.readFileSync('fix-plan.json', 'utf-8'));
  
  let successCount = 0;
  let failCount = 0;
  
  console.log('=== UPDATING PRODUCTS WITH COMPLETE DESCRIPTIONS ===');
  
  for (const update of fixPlan.updates) {
    try {
      console.log(`\nUpdating Product ID ${update.id}: ${update.currentName}`);
      
      const updateData = {};
      
      if (update.fixes.name) {
        updateData.name = update.fixes.name;
        console.log(`  → Name: ${update.fixes.name}`);
      }
      
      if (update.fixes.sku) {
        updateData.sku = update.fixes.sku;
        console.log(`  → SKU: ${update.fixes.sku}`);
      }
      
      // Add complete description from reference
      if (descriptionMap[update.refNumber]) {
        updateData.description = descriptionMap[update.refNumber];
        console.log(`  → Description: Updated with complete reference content (${descriptionMap[update.refNumber].length} chars)`);
      } else {
        console.log(`  ⚠️  Warning: No description found for ${update.refNumber}`);
      }
      
      const response = await axios.put(`${WP_URL}/wp-json/wc/v3/products/${update.id}`, updateData, {
        headers: {
          Authorization: `Basic ${Buffer.from(`${WP_USER}:${APP_PASSWORD}`).toString('base64')}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`  ✅ Updated successfully`);
      successCount++;
      
    } catch (err) {
      console.error(`  ❌ Failed: ${err.response?.data?.message || err.message}`);
      failCount++;
    }
  }
  
  // Handle duplicates - keep first, mark others for deletion
  console.log('\n=== HANDLING DUPLICATE PRODUCTS ===');
  
  // Group duplicates by reference number
  const duplicateGroups = {};
  const wpProducts = JSON.parse(fs.readFileSync('all-bremont-products.json', 'utf-8'));
  
  wpProducts.forEach(product => {
    const imageRef = product.images[0]?.match(/([A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+)/)?.[1];
    if (imageRef) {
      if (!duplicateGroups[imageRef]) duplicateGroups[imageRef] = [];
      duplicateGroups[imageRef].push(product);
    }
  });
  
  // Find and report duplicates
  Object.keys(duplicateGroups).forEach(refNumber => {
    const products = duplicateGroups[refNumber];
    if (products.length > 1) {
      console.log(`\n🔍 Found ${products.length} products with reference ${refNumber}:`);
      products.forEach((p, index) => {
        console.log(`   ${index + 1}. ID ${p.id}: ${p.name} ${index === 0 ? '(KEEP)' : '(CONSIDER DELETE)'}`);
      });
    }
  });
  
  console.log('\n=== SUMMARY ===');
  console.log(`✅ Successful updates: ${successCount}`);
  console.log(`❌ Failed updates: ${failCount}`);
  console.log(`\n📝 Products missing from WordPress: ${fixPlan.missing.length}`);
  
  if (fixPlan.missing.length > 0) {
    console.log('\nMissing products that need to be created:');
    fixPlan.missing.forEach(m => {
      console.log(`  - ${m.name} (${m.refNumber})`);
    });
  }
  
  if (successCount > 0) {
    console.log('\n🎉 Products updated successfully with complete descriptions!');
  }
  
  console.log('\n📋 MANUAL TASKS REMAINING:');
  console.log('1. Review duplicate products and delete unnecessary ones');
  console.log('2. Create missing products using the reference document');
  console.log('3. Update images for products with incorrect image references');
  console.log('4. Verify all products have correct categories assigned');
}

// Safety check
console.log('⚠️  ENHANCED BREMONT PRODUCT FIXER');
console.log('This script will:');
console.log('- Update product names, SKUs, and complete descriptions');
console.log('- Use reference document as source of truth');
console.log('- Handle duplicate detection');
console.log('');
console.log('To execute, run: node enhanced-fix-script.js --confirm');

if (process.argv.includes('--confirm')) {
  executeEnhancedFixes();
} else {
  console.log('\nAdd --confirm flag to execute the fixes.');
  console.log('\nBefore running, make sure you have:');
  console.log('1. Reviewed the fix-plan.json');
  console.log('2. Backed up your WordPress database');
  console.log('3. Tested on a staging environment');
}