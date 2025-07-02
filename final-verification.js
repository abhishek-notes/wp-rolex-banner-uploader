#!/usr/bin/env node

const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const { WP_USER, APP_PASSWORD, WP_URL } = process.env;

async function finalVerification() {
  try {
    console.log('✅ STEP 4: FINAL VERIFICATION OF BREMONT CATALOG\n');
    
    // Fetch all current Bremont products
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
    
    console.log(`📊 FINAL CATALOG STATUS:`);
    console.log(`Total Bremont products: ${bremontProducts.length}`);
    
    // Extract and analyze reference numbers
    const productAnalysis = bremontProducts.map(product => {
      const refMatch = product.description.match(/Ref No: ([A-Z0-9-]+)/);
      const referenceNumber = refMatch ? refMatch[1] : 'Not found';
      
      return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        sku: product.sku || 'Not set',
        referenceNumber: referenceNumber,
        categories: product.categories.map(c => c.name),
        hasImage: product.images.length > 0,
        imageAlt: product.images[0]?.alt || 'Not set',
        dateCreated: product.date_created
      };
    });
    
    // Check for duplicates
    const refs = productAnalysis.map(p => p.referenceNumber).filter(ref => ref !== 'Not found');
    const uniqueRefs = new Set(refs);
    const duplicates = refs.filter((ref, index) => refs.indexOf(ref) !== index);
    
    console.log(`Unique reference numbers: ${uniqueRefs.size}`);
    console.log(`Duplicate references: ${duplicates.length > 0 ? duplicates.join(', ') : 'None ✅'}`);
    console.log(`Products with SKUs: ${productAnalysis.filter(p => p.sku !== 'Not set').length}/${bremontProducts.length}`);
    console.log(`Products with images: ${productAnalysis.filter(p => p.hasImage).length}/${bremontProducts.length}`);
    console.log(`Products with alt text: ${productAnalysis.filter(p => p.imageAlt !== 'Not set').length}/${bremontProducts.length}`);
    
    // Check by collection
    const collections = {
      'Terra Nova': productAnalysis.filter(p => p.categories.includes('Terra Nova')),
      'Altitude': productAnalysis.filter(p => p.categories.includes('Altitude')),
      'Supermarine': productAnalysis.filter(p => p.categories.includes('Supermarine'))
    };
    
    console.log(`\n📋 COLLECTION BREAKDOWN:`);
    console.log(`Terra Nova: ${collections['Terra Nova'].length} products`);
    console.log(`Altitude: ${collections['Altitude'].length} products`);
    console.log(`Supermarine: ${collections['Supermarine'].length} products`);
    
    // Target verification
    const targetAchieved = bremontProducts.length === 29 && duplicates.length === 0;
    console.log(`\n🎯 TARGET ACHIEVED: ${targetAchieved ? '✅ YES' : '❌ NO'}`);
    
    if (targetAchieved) {
      console.log('🎉 Perfect! Catalog matches the 29-SKU master list exactly.');
    } else {
      console.log(`⚠️  Expected 29 products with no duplicates, got ${bremontProducts.length} products with ${duplicates.length} duplicates.`);
    }
    
    // Create final catalog export
    const finalCatalog = {
      timestamp: new Date().toISOString(),
      totalProducts: bremontProducts.length,
      targetAchieved: targetAchieved,
      verification: {
        uniqueReferences: uniqueRefs.size,
        duplicateReferences: duplicates,
        withSKUs: productAnalysis.filter(p => p.sku !== 'Not set').length,
        withImages: productAnalysis.filter(p => p.hasImage).length,
        withAltText: productAnalysis.filter(p => p.imageAlt !== 'Not set').length
      },
      collections: {
        terraNova: collections['Terra Nova'].length,
        altitude: collections['Altitude'].length,
        supermarine: collections['Supermarine'].length
      },
      products: productAnalysis.sort((a, b) => a.referenceNumber.localeCompare(b.referenceNumber))
    };
    
    // Export final catalog
    fs.writeFileSync('bremont-final-catalog.json', JSON.stringify(finalCatalog, null, 2));
    console.log(`\n📄 Final catalog exported to: bremont-final-catalog.json`);
    
    // Create CSV for human review
    const csvHeaders = 'ID,Title,Reference,SKU,Slug,Collection,Has Image,Alt Text';
    const csvRows = productAnalysis.map(p => {
      const collection = p.categories.find(c => ['Terra Nova', 'Altitude', 'Supermarine'].includes(c)) || 'Other';
      return `${p.id},"${p.name}",${p.referenceNumber},${p.sku},"${p.slug}",${collection},${p.hasImage ? 'Yes' : 'No'},"${p.imageAlt}"`;
    });
    const csvContent = [csvHeaders, ...csvRows].join('\n');
    
    fs.writeFileSync('bremont-final-catalog.csv', csvContent);
    console.log(`📊 CSV export created: bremont-final-catalog.csv`);
    
    // Show any remaining issues
    const issues = [];
    
    if (duplicates.length > 0) {
      issues.push(`${duplicates.length} duplicate reference numbers`);
    }
    
    const missingSkus = productAnalysis.filter(p => p.sku === 'Not set');
    if (missingSkus.length > 0) {
      issues.push(`${missingSkus.length} products missing SKUs`);
      console.log(`\nProducts missing SKUs:`);
      missingSkus.forEach(p => console.log(`- ${p.id}: ${p.name}`));
    }
    
    const missingImages = productAnalysis.filter(p => !p.hasImage);
    if (missingImages.length > 0) {
      issues.push(`${missingImages.length} products missing images`);
      console.log(`\nProducts missing images:`);
      missingImages.forEach(p => console.log(`- ${p.id}: ${p.name}`));
    }
    
    if (issues.length === 0) {
      console.log(`\n🎊 CLEANUP COMPLETE! No remaining issues found.`);
    } else {
      console.log(`\n⚠️  REMAINING ISSUES: ${issues.join(', ')}`);
    }
    
    console.log(`\n📈 CLEANUP SUMMARY:`);
    console.log(`- Started with: 31 products (with duplicates)`);
    console.log(`- Deleted: 10 duplicate/obsolete products`);
    console.log(`- Fixed: 10 existing products`);
    console.log(`- Created: 8 new products`);
    console.log(`- Final result: ${bremontProducts.length} products`);
    console.log(`- Target: 29 unique SKUs ${targetAchieved ? '✅ ACHIEVED' : '❌ NOT YET'}`);
    
  } catch (err) {
    console.error('Verification failed:', err.response?.data?.message || err.message);
  }
}

finalVerification();