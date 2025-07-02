#!/usr/bin/env node

const axios = require('axios');
require('dotenv').config();

const { WP_USER, APP_PASSWORD, WP_URL } = process.env;

async function quickMetadataFix() {
  try {
    console.log('🚀 QUICK IMAGE METADATA FIX');
    console.log('📋 Processing remaining images in batches...\n');
    
    // Get images that still need metadata
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
    
    // Filter for images without proper metadata
    const needsFixing = response.data.filter(img => 
      !img.alt_text || 
      !img.caption?.rendered || 
      !img.title?.rendered.includes('Palladio')
    );
    
    console.log(`Found ${needsFixing.length} images that need metadata fixes`);
    
    let successCount = 0;
    let skipCount = 0;
    
    for (let i = 0; i < Math.min(30, needsFixing.length); i++) {
      const img = needsFixing[i];
      const filename = img.slug || img.title.rendered.toLowerCase();
      
      let metadata = null;
      
      // Generate appropriate metadata based on filename
      if (filename.includes('bremont') || filename.includes('terra') || 
          filename.includes('altitude') || filename.includes('supermarine')) {
        metadata = generateBremontMeta(filename);
      } else if (filename.includes('rolex')) {
        metadata = generateRolexMeta(filename);
      } else if (filename.includes('banner') || filename.includes('endurance')) {
        metadata = generateBannerMeta(filename);
      }
      
      if (metadata) {
        try {
          console.log(`${i + 1}/${Math.min(30, needsFixing.length)} Updating: ${filename.substring(0, 50)}...`);
          
          await axios.post(`${WP_URL}/wp-json/wp/v2/media/${img.id}`, metadata, {
            headers: {
              Authorization: `Basic ${Buffer.from(`${WP_USER}:${APP_PASSWORD}`).toString('base64')}`,
              'Content-Type': 'application/json'
            }
          });
          
          console.log(`  ✅ Updated ID ${img.id}`);
          successCount++;
          
        } catch (err) {
          console.log(`  ❌ Failed ID ${img.id}: ${err.response?.data?.message || err.message}`);
        }
      } else {
        console.log(`${i + 1}/${Math.min(30, needsFixing.length)} Skipping: ${filename.substring(0, 50)}... (unknown type)`);
        skipCount++;
      }
      
      // Small delay
      await new Promise(resolve => setTimeout(resolve, 300));
    }
    
    console.log(`\n📊 BATCH COMPLETE:`);
    console.log(`✅ Successfully updated: ${successCount}`);
    console.log(`⏭️  Skipped: ${skipCount}`);
    console.log(`📄 Total processed: ${Math.min(30, needsFixing.length)}`);
    
  } catch (err) {
    console.error('Error:', err.response?.data?.message || err.message);
  }
}

function generateBremontMeta(filename) {
  let collection = 'Bremont';
  let model = '';
  
  if (filename.includes('terranova') || filename.includes('terra-nova')) {
    collection = 'Terra Nova';
    if (filename.includes('chronograph') || filename.includes('chr')) model = 'Chronograph';
    else if (filename.includes('date') || filename.includes('dt')) model = 'Date';
    else if (filename.includes('jumping') || filename.includes('jh')) model = 'Jumping Hour';
    else if (filename.includes('power') || filename.includes('pwr')) model = 'Power Reserve';
  } else if (filename.includes('altitude')) {
    collection = 'Altitude';
    if (filename.includes('chronograph') || filename.includes('chr')) model = 'Chronograph GMT';
    else if (filename.includes('meteor') || filename.includes('mt')) model = 'MB Meteor';
    else if (filename.includes('date') || filename.includes('dt')) model = 'Date';
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

function generateRolexMeta(filename) {
  let model = 'Rolex';
  
  if (filename.includes('cosmograph') || filename.includes('daytona')) {
    model = 'Cosmograph Daytona';
  } else if (filename.includes('endurance')) {
    model = 'Endurance';
  } else if (filename.includes('banner')) {
    model = 'Banner';
  }
  
  return {
    title: `Rolex at Palladio Jewellers in Vancouver - Official Rolex Retailer - ${model}`,
    alt_text: `Rolex ${model} at Palladio Jewellers`,
    caption: `Palladio Jewellers - Official Rolex Retailer - Vancouver - ${model}`,
    description: `${model} image at Palladio Jewellers, Official Rolex Retailer in Vancouver.`
  };
}

function generateBannerMeta(filename) {
  let type = 'Banner';
  let brand = 'Luxury Watch';
  
  if (filename.includes('bremont')) brand = 'Bremont';
  else if (filename.includes('rolex')) brand = 'Rolex';
  
  if (filename.includes('endurance')) type = 'Endurance Banner';
  else if (filename.includes('desktop')) type = 'Desktop Banner';
  else if (filename.includes('mobile')) type = 'Mobile Banner';
  
  return {
    title: `${brand} at Palladio Jewellers in Vancouver - Official ${brand} Retailer - ${type}`,
    alt_text: `${brand} ${type} at Palladio Jewellers`,
    caption: `Palladio Jewellers - Official ${brand} Retailer - Vancouver - ${type}`,
    description: `${type} for ${brand} at Palladio Jewellers, Official ${brand} Retailer in Vancouver.`
  };
}

quickMetadataFix();