#!/usr/bin/env node

const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const { WP_USER, APP_PASSWORD, WP_URL } = process.env;

async function analyzeAndFixImageMetadata() {
  try {
    console.log('🔍 Fetching first 150 images for metadata analysis...');
    
    const response = await axios.get(`${WP_URL}/wp-json/wp/v2/media`, {
      params: {
        per_page: 100,
        orderby: 'date',
        order: 'desc'
      },
      headers: {
        Authorization: `Basic ${Buffer.from(`${WP_USER}:${APP_PASSWORD}`).toString('base64')}`
      }
    });
    
    // Get second batch
    const response2 = await axios.get(`${WP_URL}/wp-json/wp/v2/media`, {
      params: {
        per_page: 50,
        orderby: 'date',
        order: 'desc',
        offset: 100
      },
      headers: {
        Authorization: `Basic ${Buffer.from(`${WP_USER}:${APP_PASSWORD}`).toString('base64')}`
      }
    });
    
    const allImages = [...response.data, ...response2.data];
    console.log(`Found ${allImages.length} images`);
    
    // Analyze images with good metadata patterns
    const imagesWithMetadata = allImages.filter(img => 
      img.alt_text && 
      img.caption?.rendered && 
      img.description?.rendered &&
      img.title?.rendered.includes('Palladio')
    );
    
    const imagesWithoutMetadata = allImages.filter(img => 
      !img.alt_text || 
      !img.caption?.rendered || 
      !img.description?.rendered ||
      !img.title?.rendered.includes('Palladio')
    );
    
    console.log(`Images with proper metadata: ${imagesWithMetadata.length}`);
    console.log(`Images needing metadata fixes: ${imagesWithoutMetadata.length}`);
    
    // Analyze patterns from good metadata
    console.log('\n🔍 Analyzing metadata patterns from well-formatted images...');
    
    const patterns = {
      bremont: [],
      rolex: [],
      other: []
    };
    
    imagesWithMetadata.slice(0, 10).forEach(img => {
      const title = img.title.rendered;
      const alt = img.alt_text;
      const caption = img.caption.rendered;
      const description = img.description.rendered;
      
      if (title.toLowerCase().includes('bremont')) {
        patterns.bremont.push({ title, alt, caption, description, filename: img.slug });
      } else if (title.toLowerCase().includes('rolex')) {
        patterns.rolex.push({ title, alt, caption, description, filename: img.slug });
      } else {
        patterns.other.push({ title, alt, caption, description, filename: img.slug });
      }
    });
    
    console.log('\n📋 METADATA PATTERNS FOUND:');
    
    if (patterns.bremont.length > 0) {
      console.log('\n🔍 BREMONT PATTERN EXAMPLE:');
      const example = patterns.bremont[0];
      console.log(`Title: ${example.title}`);
      console.log(`Alt: ${example.alt}`);
      console.log(`Caption: ${example.caption}`);
      console.log(`Description: ${example.description}`);
    }
    
    if (patterns.rolex.length > 0) {
      console.log('\n🔍 ROLEX PATTERN EXAMPLE:');
      const example = patterns.rolex[0];
      console.log(`Title: ${example.title}`);
      console.log(`Alt: ${example.alt}`);
      console.log(`Caption: ${example.caption}`);
      console.log(`Description: ${example.description}`);
    }
    
    // Generate metadata for images that need it
    console.log('\n🔧 Generating metadata for images that need it...');
    
    const fixesNeeded = [];
    
    imagesWithoutMetadata.forEach(img => {
      const filename = img.slug || img.title.rendered;
      const sourceUrl = img.source_url;
      
      // Determine if it's Bremont, Rolex, or other brand
      let metadata = null;
      
      if (filename.toLowerCase().includes('bremont') || filename.toLowerCase().includes('terra') || 
          filename.toLowerCase().includes('altitude') || filename.toLowerCase().includes('supermarine')) {
        metadata = generateBremontMetadata(filename, img);
      } else if (filename.toLowerCase().includes('rolex')) {
        metadata = generateRolexMetadata(filename, img);
      } else if (filename.toLowerCase().includes('endurance') || filename.toLowerCase().includes('banner')) {
        metadata = generateBannerMetadata(filename, img);
      }
      
      if (metadata) {
        fixesNeeded.push({
          id: img.id,
          currentTitle: img.title.rendered,
          currentAlt: img.alt_text || 'Not set',
          currentCaption: img.caption.rendered || 'Not set',
          currentDescription: img.description.rendered || 'Not set',
          newMetadata: metadata,
          filename: filename,
          sourceUrl: sourceUrl
        });
      }
    });
    
    console.log(`\n📊 Generated metadata for ${fixesNeeded.length} images`);
    
    // Save analysis and fixes
    const analysisData = {
      timestamp: new Date().toISOString(),
      totalImages: allImages.length,
      imagesWithMetadata: imagesWithMetadata.length,
      imagesNeedingFixes: fixesNeeded.length,
      patterns: patterns,
      fixes: fixesNeeded.slice(0, 50) // Limit to first 50 for review
    };
    
    fs.writeFileSync('image-metadata-analysis.json', JSON.stringify(analysisData, null, 2));
    
    console.log('\n📄 Analysis saved to image-metadata-analysis.json');
    console.log(`First ${Math.min(50, fixesNeeded.length)} fixes included for review`);
    
    // Ask for confirmation before proceeding
    console.log('\n⚠️  Ready to update image metadata. Review the analysis file first.');
    console.log('To proceed with updates, run:');
    console.log('node fix-image-metadata.js --execute');
    
    if (process.argv.includes('--execute')) {
      await executeMetadataFixes(fixesNeeded.slice(0, 50));
    }
    
  } catch (err) {
    console.error('Error:', err.response?.data?.message || err.message);
  }
}

function generateBremontMetadata(filename, imageData) {
  // Extract collection and model info from filename
  let collection = 'Bremont';
  let model = '';
  
  if (filename.includes('terranova') || filename.includes('terra-nova')) {
    collection = 'Terra Nova';
    if (filename.includes('chronograph')) model = 'Chronograph';
    else if (filename.includes('date')) model = 'Date';
    else if (filename.includes('jumping')) model = 'Jumping Hour';
    else if (filename.includes('power')) model = 'Power Reserve';
  } else if (filename.includes('altitude')) {
    collection = 'Altitude';
    if (filename.includes('chronograph') || filename.includes('chr')) model = 'Chronograph GMT';
    else if (filename.includes('meteor')) model = 'MB Meteor';
    else if (filename.includes('date')) model = 'Date';
  } else if (filename.includes('supermarine')) {
    collection = 'Supermarine';
    if (filename.includes('300m') || filename.includes('s300')) model = '300M';
    else if (filename.includes('500m')) model = '500M';
    else if (filename.includes('ceramic')) model = 'Full Ceramic Tactical Black';
  }
  
  const productName = model ? `${collection} ${model}` : collection;
  
  return {
    title: `Bremont at Palladio Jewellers in Vancouver - Official Bremont Retailer - ${productName}`,
    alt_text: `Bremont ${productName} at Palladio Jewellers`,
    caption: `Palladio Jewellers - Official Bremont Retailer - Vancouver - ${productName}`,
    description: `${productName} image at Palladio Jewellers, Official Bremont Retailer in Vancouver.`
  };
}

function generateRolexMetadata(filename, imageData) {
  // Extract Rolex model info
  let model = 'Rolex';
  
  if (filename.includes('cosmograph') || filename.includes('daytona')) {
    model = 'Cosmograph Daytona';
  } else if (filename.includes('endurance')) {
    model = 'Endurance';
  }
  
  return {
    title: `Rolex at Palladio Jewellers in Vancouver - Official Rolex Retailer - ${model}`,
    alt_text: `Rolex ${model} at Palladio Jewellers`,
    caption: `Palladio Jewellers - Official Rolex Retailer - Vancouver - ${model}`,
    description: `${model} image at Palladio Jewellers, Official Rolex Retailer in Vancouver.`
  };
}

function generateBannerMetadata(filename, imageData) {
  let brandName = 'Luxury Watch';
  let type = 'Banner';
  
  if (filename.includes('bremont')) brandName = 'Bremont';
  else if (filename.includes('rolex')) brandName = 'Rolex';
  
  if (filename.includes('endurance')) type = 'Endurance Banner';
  else if (filename.includes('desktop')) type = 'Desktop Banner';
  else if (filename.includes('mobile')) type = 'Mobile Banner';
  
  return {
    title: `${brandName} at Palladio Jewellers in Vancouver - Official ${brandName} Retailer - ${type}`,
    alt_text: `${brandName} ${type} at Palladio Jewellers`,
    caption: `Palladio Jewellers - Official ${brandName} Retailer - Vancouver - ${type}`,
    description: `${type} for ${brandName} at Palladio Jewellers, Official ${brandName} Retailer in Vancouver.`
  };
}

async function executeMetadataFixes(fixes) {
  console.log('\n🔧 EXECUTING METADATA FIXES...');
  
  let successCount = 0;
  let failCount = 0;
  
  for (const fix of fixes) {
    try {
      console.log(`\n📝 Updating Image ID ${fix.id}: ${fix.filename}`);
      
      const response = await axios.post(`${WP_URL}/wp-json/wp/v2/media/${fix.id}`, fix.newMetadata, {
        headers: {
          Authorization: `Basic ${Buffer.from(`${WP_USER}:${APP_PASSWORD}`).toString('base64')}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log(`  ✅ Updated successfully`);
      console.log(`  📝 New title: ${fix.newMetadata.title.substring(0, 60)}...`);
      successCount++;
      
      // Small delay to prevent overwhelming server
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (err) {
      console.error(`  ❌ Failed: ${err.response?.data?.message || err.message}`);
      failCount++;
    }
  }
  
  console.log('\n📊 METADATA UPDATE SUMMARY:');
  console.log(`✅ Successful updates: ${successCount}`);
  console.log(`❌ Failed updates: ${failCount}`);
  console.log(`📄 Total processed: ${fixes.length}`);
}

// Run the analysis
analyzeAndFixImageMetadata();