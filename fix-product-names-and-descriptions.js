#!/usr/bin/env node

const axios = require('axios');
require('dotenv').config();

const { WP_USER, APP_PASSWORD, WP_URL } = process.env;

// Correct product names from the master document
const CORRECT_PRODUCT_NAMES = {
  // Terra Nova Collection
  'TN40-DT-SS-BK-B': 'Terra Nova 40.5 Date',
  'TN40-JH-SS-BK-B': 'Terra Nova 40.5 Jumping Hour',
  'TN40-PWR-SS-BK-L-S': 'Terra Nova 40.5 Turning Bezel Power Reserve Black',
  'TN40-PWR-SS-BL-B': 'Terra Nova 40.5 Turning Bezel Power Reserve',
  'TN40-DT-SS-GN-L-S': 'Terra Nova 40.5 Date, Green Dial',
  'TN42-CHR-SS-BK-L-S': 'Terra Nova 42.5 Chronograph, Leather Strap',
  'TN42-CHR-BZ-GN-L-S': 'Terra Nova 42.5 Chronograph Bronze',
  'TN42-CHR-SS-BK-B': 'Terra Nova 42.5 Chronograph, Bracelet',
  'TN38-ND-SS-PK-B': 'Terra Nova 38 \'Pink\'',
  
  // Altitude Collection - THESE NEED FIXING
  'ALT39-DT-SS-BK-B': 'Altitude 39 Date, Black Dial, Steel Bracelet',
  'ALT39-DT-SS-BK-L-S': 'Altitude 39 Date, Black Dial, Leather Strap',
  'ALT39-DT-SS-SI-L-S': 'Altitude 39 Date, Silver Dial, Leather Strap',
  'ALT42-CHR-G-SS-BK-B': 'Altitude Chronograph GMT',
  'ALT42-CHR-G-SS-BK-L-S': 'Altitude Chronograph GMT, Black Dial, Leather Strap',
  'ALT42-CHR-G-SS-SI-B': 'Altitude Chronograph GMT, Silver Dial, Steel Bracelet',
  'ALT42-MT-TI-BKBK-B': 'Altitude MB Meteor, Black Dial, Ti Bracelet',
  'ALT42-MT-TI-BKBK-L-S': 'Altitude MB Meteor, Black Dial, Leather Strap',
  'ALT42-MT-TI-SITI-B': 'Altitude MB Meteor, Silver Dial, Ti Bracelet',
  'ALT42-MT-TI-SITI-L-S': 'Altitude MB Meteor, Silver Dial, Leather Strap',
  
  // Supermarine Collection
  'SM40-DT-SS-BK-B': 'Supermarine 300M Date, Black Dial, Bracelet',
  'SM40-DT-SS-BK-R-S': 'Supermarine 300M Date, Black Dial, Rubber Strap',
  'SM40-ND-SS-BL-B': 'Supermarine 300M, Blue Dial, Bracelet',
  'SM40-ND-SS-GN-B': 'Supermarine 300M, Green Dial, Bracelet',
  'SM40-GMT-SS-GNBK-G': 'Supermarine 300M GMT "Tundra" Green',
  'SM40-GMT-SS-BLBK-B': 'Supermarine 300M GMT "Glacier" Blue',
  'SM40-DT-BI-BR-B': 'Supermarine 300M Date Bi-Colour, Bracelet',
  'SM43-DT-SS-BK-B': 'Supermarine 500m',
  'SM43-DT-SS-BK-R-S': 'Supermarine 500m, Black Rubber Strap',
  'SM43-DT-BKCER-BK-N-S': 'Supermarine Full Ceramic Tactical Black, NATO Strap'
};

async function fixProductNamesAndDescriptions() {
  try {
    console.log('🔧 FIXING PRODUCT NAMES AND REMOVING TOP-LINE DESCRIPTIONS...\n');
    
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
    
    console.log(`Found ${bremontProducts.length} Bremont products to fix\n`);
    
    let nameFixCount = 0;
    let descriptionFixCount = 0;
    
    for (const product of bremontProducts) {
      const updates = {};
      let needsUpdate = false;
      
      // Extract reference number
      const refMatch = product.description.match(/Ref No: ([A-Z0-9-]+)/);
      const referenceNumber = refMatch ? refMatch[1] : null;
      
      // Check if product name needs fixing
      if (referenceNumber && CORRECT_PRODUCT_NAMES[referenceNumber]) {
        const correctName = CORRECT_PRODUCT_NAMES[referenceNumber];
        if (product.name !== correctName) {
          console.log(`📝 Product ${product.id}: Fixing name`);
          console.log(`   Current: "${product.name}"`);
          console.log(`   Correct: "${correctName}"`);
          updates.name = correctName;
          nameFixCount++;
          needsUpdate = true;
        }
      }
      
      // Remove the top-line product name from description
      // This regex will match <p><strong>Any Product Name</strong></p> at the beginning
      const descriptionWithoutTopLine = product.description.replace(
        /^<p><strong>[^<]+<\/strong><\/p>\n?/,
        ''
      );
      
      if (descriptionWithoutTopLine !== product.description) {
        console.log(`📝 Product ${product.id}: Removing top-line description`);
        updates.description = descriptionWithoutTopLine;
        descriptionFixCount++;
        needsUpdate = true;
      }
      
      // Apply updates if needed
      if (needsUpdate) {
        try {
          await axios.put(`${WP_URL}/wp-json/wc/v3/products/${product.id}`, updates, {
            auth: {
              username: WP_USER,
              password: APP_PASSWORD
            }
          });
          
          console.log(`  ✅ Updated successfully\n`);
          
        } catch (err) {
          console.log(`  ❌ Failed: ${err.response?.data?.message || err.message}\n`);
        }
        
        await new Promise(resolve => setTimeout(resolve, 300));
      }
    }
    
    console.log('\n📊 SUMMARY:');
    console.log(`Total products checked: ${bremontProducts.length}`);
    console.log(`Product names fixed: ${nameFixCount}`);
    console.log(`Top-line descriptions removed: ${descriptionFixCount}`);
    console.log(`\n✅ All fixes applied!`);
    
  } catch (err) {
    console.error('Error:', err.response?.data?.message || err.message);
  }
}

fixProductNamesAndDescriptions();