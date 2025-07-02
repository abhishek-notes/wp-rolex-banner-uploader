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
    
    // Extract product title
    const titleMatch = section.match(/Product \d+: ([^\n]+)\(WordPress Post Title: ([^\)]+)\)/);
    const productTitle = titleMatch ? titleMatch[2].trim() : '';
    
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
    
    descriptionMap[refNumber] = {
      description: completeDescription.trim(),
      productTitle: productTitle
    };
  });
  
  return descriptionMap;
}

// Find correct image in the images folder
async function findCorrectImage(refNumber) {
  console.log(`    🔍 Looking for image with reference: ${refNumber}`);
  
  // Look for images in the processed folder first
  const processedPath = '/workspace/images/Bremont_Processed_901x1201_WEBP_IMPROVED_TRANSPARENT';
  
  try {
    const files = fs.readdirSync(processedPath);
    
    // Look for exact match first
    let matchingFile = files.find(file => file.includes(refNumber) && file.endsWith('.webp'));
    
    if (!matchingFile) {
      // Try without the last segment (for cases like ALT39-DT-SS-BK-L vs ALT39-DT-SS-BK-L-S)
      const baseRef = refNumber.split('-').slice(0, -1).join('-');
      matchingFile = files.find(file => file.includes(baseRef) && file.endsWith('.webp'));
    }
    
    if (matchingFile) {
      const fullPath = `${processedPath}/${matchingFile}`;
      console.log(`    ✅ Found correct image: ${matchingFile}`);
      return { found: true, path: fullPath, filename: matchingFile };
    } else {
      console.log(`    ❌ No matching image found for ${refNumber}`);
      return { found: false, refNumber };
    }
  } catch (err) {
    console.log(`    ❌ Error searching for images: ${err.message}`);
    return { found: false, refNumber };
  }
}

// Upload image to WordPress with proper metadata
async function uploadImageToWordPress(imagePath, filename, refNumber, productTitle) {
  try {
    console.log(`    📤 Uploading image: ${filename}`);
    
    const form = new (require('form-data'))();
    form.append('file', fs.createReadStream(imagePath), filename);
    
    // Create proper metadata like existing Bremont images
    const cleanTitle = `Bremont at Palladio Jewellers in Vancouver - Official Bremont Retailer - ${productTitle}`;
    const altText = `Bremont ${productTitle} at Palladio Jewellers`;
    const caption = `Palladio Jewellers - Official Bremont Retailer - Vancouver - ${productTitle}`;
    const description = `${productTitle} image at Palladio Jewellers, Official Bremont Retailer in Vancouver.`;
    
    form.append('title', cleanTitle);
    form.append('alt_text', altText);
    form.append('caption', caption);
    form.append('description', description);
    
    const response = await axios.post(`${WP_URL}/wp-json/wp/v2/media`, form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Basic ${Buffer.from(`${WP_USER}:${APP_PASSWORD}`).toString('base64')}`
      },
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });
    
    console.log(`    ✅ Image uploaded with metadata (ID: ${response.data.id})`);
    console.log(`    📝 Title: ${cleanTitle}`);
    console.log(`    📝 Alt: ${altText}`);
    
    return response.data.id;
  } catch (err) {
    console.error(`    ❌ Failed to upload image: ${err.response?.data?.message || err.message}`);
    return null;
  }
}

async function executeFinalFixesWithMetadata() {
  console.log('🔧 EXECUTING FINAL BREMONT PRODUCT FIXES WITH PROPER IMAGE METADATA...');
  console.log('✅ SKUs will be left unchanged (as requested)');
  console.log('✅ Images will be corrected with proper metadata');
  console.log('✅ Descriptions will be updated with complete content');
  console.log('');
  
  const descriptionMap = buildDescriptionMap();
  const fixPlan = JSON.parse(fs.readFileSync('fix-plan.json', 'utf-8'));
  
  let successCount = 0;
  let failCount = 0;
  let imageUpdateCount = 0;
  
  console.log('=== UPDATING PRODUCTS WITH CORRECT IMAGES AND METADATA ===');
  
  // Process only the remaining products (starting from where we left off)
  const remainingUpdates = fixPlan.updates.slice(10); // Continue from where we left off
  
  for (const update of remainingUpdates) {
    try {
      console.log(`\n🔄 Processing Product ID ${update.id}: ${update.currentName}`);
      
      const updateData = {};
      
      // Update name if needed
      if (update.fixes.name) {
        updateData.name = update.fixes.name;
        console.log(`  → Name: ${update.fixes.name}`);
      }
      
      // Skip SKU updates as requested
      console.log(`  → SKU: Keeping current value (as requested)`);
      
      // Update description with complete content
      if (descriptionMap[update.refNumber]) {
        updateData.description = descriptionMap[update.refNumber].description;
        console.log(`  → Description: Updated with complete reference content (${descriptionMap[update.refNumber].description.length} chars)`);
      } else {
        console.log(`  ⚠️  Warning: No description found for ${update.refNumber}`);
      }
      
      // Handle image correction with proper metadata
      if (update.fixes.imageRef || update.refNumber) {
        const targetRef = update.fixes.imageRef || update.refNumber;
        const imageResult = await findCorrectImage(targetRef);
        
        if (imageResult.found) {
          const productTitle = descriptionMap[update.refNumber]?.productTitle || update.currentName;
          
          // Upload the correct image with proper metadata
          const mediaId = await uploadImageToWordPress(
            imageResult.path, 
            imageResult.filename, 
            targetRef,
            productTitle
          );
          
          if (mediaId) {
            updateData.featured_media = mediaId;
            updateData.images = [{ id: mediaId }];
            console.log(`  → Image: Updated with proper metadata (Media ID: ${mediaId})`);
            imageUpdateCount++;
          }
        } else {
          console.log(`  ⚠️  Could not find correct image for ${targetRef}`);
        }
      }
      
      // Execute the update
      const response = await axios.put(`${WP_URL}/wp-json/wc/v3/products/${update.id}`, updateData, {
        headers: {
          Authorization: `Basic ${Buffer.from(`${WP_USER}:${APP_PASSWORD}`).toString('base64')}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`  ✅ Product updated successfully`);
      successCount++;
      
      // Add a small delay to prevent overwhelming the server
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (err) {
      console.error(`  ❌ Failed to update product: ${err.response?.data?.message || err.message}`);
      failCount++;
    }
  }
  
  console.log('\n=== FINAL SUMMARY ===');
  console.log(`✅ Products processed in this batch: ${remainingUpdates.length}`);
  console.log(`✅ Successful product updates: ${successCount}`);
  console.log(`❌ Failed product updates: ${failCount}`);
  console.log(`📸 Images updated with metadata: ${imageUpdateCount}`);
  console.log(`📝 Total products in fix plan: ${fixPlan.updates.length}`);
  
  if (successCount > 0) {
    console.log('\n🎉 Bremont products updated successfully!');
    console.log('✅ Product names corrected to match reference document');
    console.log('✅ Complete descriptions added with all specifications');
    console.log('✅ Images corrected with proper WordPress metadata');
    console.log('✅ SKUs left unchanged as requested');
  }
  
  console.log('\n📋 REMAINING TASKS:');
  console.log('1. Review and delete duplicate products');
  console.log('2. Create the 7 missing products using reference document');
  console.log('3. Verify all products display correctly on website');
}

// Safety check and execution
console.log('🚀 FINAL BREMONT PRODUCT FIXER WITH METADATA');
console.log('This script will:');
console.log('- ✅ Update product names to match reference document');
console.log('- ✅ Add complete descriptions with all specifications');
console.log('- ✅ Upload correct images with proper WordPress metadata');
console.log('- ✅ Add title, alt text, caption, and description to images');
console.log('- ✅ Skip SKU updates (as requested)');
console.log('');

if (process.argv.includes('--execute')) {
  executeFinalFixesWithMetadata();
} else {
  console.log('To execute the fixes, run:');
  console.log('node final-fix-script-with-metadata.js --execute');
  console.log('');
  console.log('⚠️  This will continue from where the previous script left off');
}