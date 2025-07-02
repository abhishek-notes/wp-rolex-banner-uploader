#!/usr/bin/env node

require('dotenv').config();
const axios = require('axios');

const WP_URL = process.env.WP_URL;
const WP_USER = process.env.WP_USER;
const APP_PASSWORD = process.env.APP_PASSWORD;

async function findBremontBanners() {
  try {
    const authHeader = Buffer.from(`${WP_USER}:${APP_PASSWORD}`).toString('base64');
    
    // Get recent media uploads
    const response = await axios.get(`${WP_URL}/wp-json/wp/v2/media`, {
      headers: {
        'Authorization': `Basic ${authHeader}`
      },
      params: {
        per_page: 50,
        orderby: 'date',
        order: 'desc'
      }
    });

    console.log('🔍 Searching for Bremont banner images...\n');
    
    const bremontImages = response.data.filter(media => {
      const filename = media.source_url.split('/').pop().toLowerCase();
      const title = media.title.rendered.toLowerCase();
      
      return (
        filename.includes('bremont') || 
        title.includes('bremont') ||
        filename.includes('banner') && (
          filename.includes('bremont') ||
          title.includes('bremont')
        )
      );
    });

    if (bremontImages.length === 0) {
      console.log('❌ No Bremont banner images found in recent uploads');
      return;
    }

    console.log(`📸 Found ${bremontImages.length} Bremont image(s):\n`);
    
    bremontImages.forEach(image => {
      console.log(`ID: ${image.id}`);
      console.log(`Title: ${image.title.rendered}`);
      console.log(`Filename: ${image.source_url.split('/').pop()}`);
      console.log(`Alt Text: ${image.alt_text || 'None'}`);
      console.log(`Caption: ${image.caption.rendered || 'None'}`);
      console.log(`Description: ${image.description.rendered || 'None'}`);
      console.log(`Upload Date: ${image.date}`);
      console.log(`URL: ${image.source_url}`);
      console.log('---');
    });

    // Save results for further processing
    const results = {
      found: bremontImages.length,
      images: bremontImages.map(img => ({
        id: img.id,
        title: img.title.rendered,
        filename: img.source_url.split('/').pop(),
        alt_text: img.alt_text,
        caption: img.caption.rendered,
        description: img.description.rendered,
        date: img.date,
        url: img.source_url
      }))
    };

    require('fs').writeFileSync('bremont-banner-analysis.json', JSON.stringify(results, null, 2));
    console.log('\n📄 Results saved to bremont-banner-analysis.json');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

findBremontBanners();