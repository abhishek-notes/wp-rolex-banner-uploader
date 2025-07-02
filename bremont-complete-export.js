#!/usr/bin/env node

const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const { WP_USER, APP_PASSWORD, WP_URL } = process.env;

async function fetchCompleteProductData() {
  try {
    console.log('📦 CREATING COMPREHENSIVE BREMONT PRODUCT EXPORT...\n');
    console.log('Fetching all product data including images, metadata, descriptions, and categories...\n');
    
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
    
    console.log(`Found ${bremontProducts.length} Bremont products. Extracting complete data...\n`);
    
    // Extract comprehensive data for each product
    const completeProductData = bremontProducts.map(product => {
      // Extract reference number from description
      const refMatch = product.description.match(/Ref No: ([A-Z0-9-]+)/);
      const referenceNumber = refMatch ? refMatch[1] : 'Not found in description';
      
      // Process all images
      const imageData = product.images.map(img => ({
        id: img.id,
        name: img.name,
        src: img.src,
        alt: img.alt || 'No alt text',
        dateCreated: img.date_created,
        dateModified: img.date_modified
      }));
      
      // Extract all category data
      const categoryData = product.categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug
      }));
      
      // Determine collection
      const collection = categoryData.find(c => 
        ['Terra Nova', 'Altitude', 'Supermarine'].includes(c.name)
      )?.name || 'No collection';
      
      return {
        // Basic Information
        id: product.id,
        name: product.name,
        slug: product.slug,
        permalink: product.permalink,
        dateCreated: product.date_created,
        dateModified: product.date_modified,
        status: product.status,
        
        // SKU and Reference
        sku: product.sku || 'NOT SET',
        referenceNumber: referenceNumber,
        skuMatchesRef: product.sku === referenceNumber,
        
        // Categories
        collection: collection,
        categories: categoryData,
        
        // Images
        hasImages: product.images.length > 0,
        imageCount: product.images.length,
        featuredImage: imageData[0] || null,
        allImages: imageData,
        
        // Content
        shortDescription: product.short_description,
        shortDescriptionLength: product.short_description.length,
        fullDescription: product.description,
        fullDescriptionLength: product.description.length,
        descriptionHasRef: product.description.includes('Ref No:'),
        
        // SEO and Meta
        metaData: product.meta_data,
        
        // Pricing (if set)
        price: product.price || 'Not set',
        regularPrice: product.regular_price || 'Not set',
        
        // Stock
        stockStatus: product.stock_status,
        manageStock: product.manage_stock,
        stockQuantity: product.stock_quantity,
        
        // Attributes
        attributes: product.attributes,
        
        // Tags
        tags: product.tags.map(tag => ({ id: tag.id, name: tag.name, slug: tag.slug })),
        
        // Variations (if any)
        type: product.type,
        variations: product.variations
      };
    });
    
    // Sort by reference number for easier verification
    completeProductData.sort((a, b) => a.referenceNumber.localeCompare(b.referenceNumber));
    
    // Create summary statistics
    const summary = {
      totalProducts: completeProductData.length,
      collections: {
        terraNova: completeProductData.filter(p => p.collection === 'Terra Nova').length,
        altitude: completeProductData.filter(p => p.collection === 'Altitude').length,
        supermarine: completeProductData.filter(p => p.collection === 'Supermarine').length
      },
      skuStatus: {
        withSKU: completeProductData.filter(p => p.sku !== 'NOT SET').length,
        withoutSKU: completeProductData.filter(p => p.sku === 'NOT SET').length,
        skuMatchesRef: completeProductData.filter(p => p.skuMatchesRef).length
      },
      imageStatus: {
        withImages: completeProductData.filter(p => p.hasImages).length,
        withoutImages: completeProductData.filter(p => !p.hasImages).length,
        withAltText: completeProductData.filter(p => p.featuredImage && p.featuredImage.alt !== 'No alt text').length
      },
      referenceNumbers: {
        found: completeProductData.filter(p => p.referenceNumber !== 'Not found in description').length,
        notFound: completeProductData.filter(p => p.referenceNumber === 'Not found in description').length,
        unique: new Set(completeProductData.map(p => p.referenceNumber)).size
      }
    };
    
    // Create the comprehensive export
    const completeExport = {
      exportMetadata: {
        timestamp: new Date().toISOString(),
        exportedFrom: WP_URL,
        totalProducts: completeProductData.length,
        exportPurpose: 'Complete Bremont catalog verification with another AI'
      },
      summary: summary,
      products: completeProductData,
      referenceList: completeProductData.map(p => ({
        id: p.id,
        name: p.name,
        ref: p.referenceNumber,
        sku: p.sku,
        hasImage: p.hasImages
      }))
    };
    
    // Save the comprehensive export
    const filename = 'bremont-complete-export-for-verification.json';
    fs.writeFileSync(filename, JSON.stringify(completeExport, null, 2));
    
    console.log(`✅ EXPORT COMPLETE!\n`);
    console.log(`📄 File created: ${filename}`);
    console.log(`📊 Total products exported: ${completeProductData.length}`);
    console.log(`🖼️  Products with images: ${summary.imageStatus.withImages}`);
    console.log(`🏷️  Products with SKUs: ${summary.skuStatus.withSKU}`);
    console.log(`📌 Unique reference numbers: ${summary.referenceNumbers.unique}`);
    
    // Also create a simplified CSV for quick review
    const csvHeaders = 'ID,Name,Reference,SKU,Collection,Has Image,Image URL,Alt Text,Date Created';
    const csvRows = completeProductData.map(p => {
      const imageUrl = p.featuredImage ? p.featuredImage.src : 'No image';
      const altText = p.featuredImage ? p.featuredImage.alt : 'No image';
      return `${p.id},"${p.name}",${p.referenceNumber},${p.sku},${p.collection},${p.hasImages ? 'Yes' : 'No'},"${imageUrl}","${altText}",${p.dateCreated}`;
    });
    const csvContent = [csvHeaders, ...csvRows].join('\n');
    
    fs.writeFileSync('bremont-complete-export-summary.csv', csvContent);
    console.log(`📊 Summary CSV also created: bremont-complete-export-summary.csv`);
    
    // List any products without images for reference
    const noImageProducts = completeProductData.filter(p => !p.hasImages);
    if (noImageProducts.length > 0) {
      console.log(`\n⚠️  Products without images (${noImageProducts.length}):`);
      noImageProducts.forEach(p => console.log(`   - ${p.id}: ${p.name} (${p.referenceNumber})`));
    }
    
    // List any products without SKUs for reference
    const noSkuProducts = completeProductData.filter(p => p.sku === 'NOT SET');
    if (noSkuProducts.length > 0) {
      console.log(`\n⚠️  Products without SKUs (${noSkuProducts.length}):`);
      noSkuProducts.forEach(p => console.log(`   - ${p.id}: ${p.name} (${p.referenceNumber})`));
    }
    
    console.log('\n📦 All data exported successfully! Ready for verification.');
    
  } catch (err) {
    console.error('Export failed:', err.response?.data?.message || err.message);
  }
}

fetchCompleteProductData();