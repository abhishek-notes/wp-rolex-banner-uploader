#!/usr/bin/env node

const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const { WP_USER, APP_PASSWORD, WP_URL } = process.env;

async function fetchAllBremontForVerification() {
  try {
    console.log('🔍 Fetching all Bremont products for verification...');
    
    const response = await axios.get(`${WP_URL}/wp-json/wc/v3/products`, {
      params: {
        per_page: 50,
        orderby: 'date',
        order: 'desc'
      },
      headers: {
        Authorization: `Basic ${Buffer.from(`${WP_USER}:${APP_PASSWORD}`).toString('base64')}`
      }
    });
    
    // Filter for Bremont products
    const bremontProducts = response.data.filter(p => {
      const hasBremont = p.categories && p.categories.some(cat => cat.name === 'Bremont');
      const hasBremotnInName = p.name.includes('Terra Nova') || 
                              p.name.includes('Altitude') || 
                              p.name.includes('Supermarine');
      return hasBremont || hasBremotnInName;
    });
    
    console.log(`Found ${bremontProducts.length} Bremont products`);
    
    // Create detailed verification data
    const verificationData = {
      timestamp: new Date().toISOString(),
      totalProducts: bremontProducts.length,
      products: []
    };
    
    bremontProducts.forEach((product, index) => {
      // Extract reference number from image name or description
      const imageRef = product.images[0]?.name?.match(/([A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+)/)?.[1] || 
                     product.description?.match(/Ref No: ([A-Z0-9-]+)/)?.[1] || 'Not found';
      
      const productData = {
        index: index + 1,
        id: product.id,
        name: product.name,
        sku: product.sku || 'Not set',
        referenceNumber: imageRef,
        dateCreated: product.date_created,
        categories: product.categories.map(cat => cat.name),
        images: {
          count: product.images.length,
          featured: product.images[0] ? {
            id: product.images[0].id,
            name: product.images[0].name,
            src: product.images[0].src,
            alt: product.images[0].alt || 'Not set'
          } : null,
          allImages: product.images.map(img => ({
            id: img.id,
            name: img.name,
            alt: img.alt || 'Not set'
          }))
        },
        description: {
          length: product.description.length,
          preview: product.description.substring(0, 200) + '...',
          hasFunctions: product.description.includes('<b>Functions</b>'),
          hasMovement: product.description.includes('<b>Movement</b>'),
          hasCaseSpecs: product.description.includes('<b>Case specifications</b>'),
          hasDialSpecs: product.description.includes('<b>Dial and Hands specifications</b>'),
          hasRefTag: product.description.includes('Ref No:'),
          fullDescription: product.description
        },
        shortDescription: product.short_description || 'Not set',
        permalink: product.permalink
      };
      
      verificationData.products.push(productData);
    });
    
    // Group by collection for easier review
    const collections = {
      'Terra Nova': [],
      'Altitude': [],
      'Supermarine': [],
      'Other': []
    };
    
    verificationData.products.forEach(p => {
      if (p.name.includes('Terra Nova')) collections['Terra Nova'].push(p);
      else if (p.name.includes('Altitude')) collections['Altitude'].push(p);
      else if (p.name.includes('Supermarine')) collections['Supermarine'].push(p);
      else collections['Other'].push(p);
    });
    
    // Save detailed JSON for technical review
    fs.writeFileSync('bremont-verification-detailed.json', JSON.stringify(verificationData, null, 2));
    
    // Create human-readable verification report
    let report = '# BREMONT PRODUCTS VERIFICATION REPORT\n';
    report += `Generated: ${new Date().toISOString()}\n`;
    report += `Total Products: ${verificationData.totalProducts}\n\n`;
    
    Object.keys(collections).forEach(collectionName => {
      if (collections[collectionName].length > 0) {
        report += `## ${collectionName} Collection (${collections[collectionName].length} products)\n\n`;
        
        collections[collectionName].forEach(product => {
          report += `### ${product.index}. ${product.name}\n`;
          report += `- **Product ID**: ${product.id}\n`;
          report += `- **Reference Number**: ${product.referenceNumber}\n`;
          report += `- **SKU**: ${product.sku}\n`;
          report += `- **Categories**: ${product.categories.join(', ')}\n`;
          report += `- **Created**: ${product.dateCreated}\n`;
          
          report += `\n**Images (${product.images.count}):**\n`;
          if (product.images.featured) {
            report += `- Featured Image ID: ${product.images.featured.id}\n`;
            report += `- Image Name: ${product.images.featured.name}\n`;
            report += `- Alt Text: ${product.images.featured.alt}\n`;
            report += `- Image URL: ${product.images.featured.src}\n`;
          } else {
            report += `- No featured image\n`;
          }
          
          report += `\n**Description (${product.description.length} characters):**\n`;
          report += `- Has Functions: ${product.description.hasFunctions ? '✅' : '❌'}\n`;
          report += `- Has Movement: ${product.description.hasMovement ? '✅' : '❌'}\n`;
          report += `- Has Case Specs: ${product.description.hasCaseSpecs ? '✅' : '❌'}\n`;
          report += `- Has Dial Specs: ${product.description.hasDialSpecs ? '✅' : '❌'}\n`;
          report += `- Has Ref Tag: ${product.description.hasRefTag ? '✅' : '❌'}\n`;
          report += `- Preview: ${product.description.preview}\n`;
          
          report += `\n**Links:**\n`;
          report += `- Product URL: ${product.permalink}\n`;
          
          report += `\n---\n\n`;
        });
      }
    });
    
    // Add summary section
    report += `## SUMMARY\n\n`;
    
    const withFunctions = verificationData.products.filter(p => p.description.hasFunctions).length;
    const withMovement = verificationData.products.filter(p => p.description.hasMovement).length;
    const withCaseSpecs = verificationData.products.filter(p => p.description.hasCaseSpecs).length;
    const withDialSpecs = verificationData.products.filter(p => p.description.hasDialSpecs).length;
    const withRefTags = verificationData.products.filter(p => p.description.hasRefTag).length;
    const withImages = verificationData.products.filter(p => p.images.count > 0).length;
    const withAltText = verificationData.products.filter(p => p.images.featured?.alt && p.images.featured.alt !== 'Not set').length;
    
    report += `**Content Completeness:**\n`;
    report += `- Products with Functions: ${withFunctions}/${verificationData.totalProducts}\n`;
    report += `- Products with Movement specs: ${withMovement}/${verificationData.totalProducts}\n`;
    report += `- Products with Case specs: ${withCaseSpecs}/${verificationData.totalProducts}\n`;
    report += `- Products with Dial specs: ${withDialSpecs}/${verificationData.totalProducts}\n`;
    report += `- Products with Ref tags: ${withRefTags}/${verificationData.totalProducts}\n`;
    
    report += `\n**Image Completeness:**\n`;
    report += `- Products with images: ${withImages}/${verificationData.totalProducts}\n`;
    report += `- Products with alt text: ${withAltText}/${verificationData.totalProducts}\n`;
    
    report += `\n**Collection Breakdown:**\n`;
    Object.keys(collections).forEach(col => {
      if (collections[col].length > 0) {
        report += `- ${col}: ${collections[col].length} products\n`;
      }
    });
    
    fs.writeFileSync('BREMONT_VERIFICATION_REPORT.md', report);
    
    console.log('\n✅ Verification files created:');
    console.log('📄 BREMONT_VERIFICATION_REPORT.md - Human-readable report');
    console.log('📄 bremont-verification-detailed.json - Technical data');
    console.log('');
    console.log('📊 QUICK SUMMARY:');
    console.log(`Total products: ${verificationData.totalProducts}`);
    console.log(`Terra Nova: ${collections['Terra Nova'].length}`);
    console.log(`Altitude: ${collections['Altitude'].length}`);
    console.log(`Supermarine: ${collections['Supermarine'].length}`);
    console.log(`Products with complete descriptions: ${withFunctions}`);
    console.log(`Products with images: ${withImages}`);
    
  } catch (err) {
    console.error('Error:', err.response?.data?.message || err.message);
  }
}

fetchAllBremontForVerification();