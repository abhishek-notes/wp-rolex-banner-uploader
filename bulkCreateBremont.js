require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { cloneProductComplete } = require('./cloneProductComplete');

// Helper functions
function generateMetaDescription(name, keyFeatures) {
    const cleanName = name.replace(/Bremont\s+/i, '');
    return `Experience the Bremont ${cleanName}. ${keyFeatures} at Palladio Jewellers.`;
}

function findProductImage(refNo, productName) {
    const imageDir = './images/Bremont_Processed_901x1201_WEBP_IMPROVED_TRANSPARENT/';
    
    try {
        const files = fs.readdirSync(imageDir);
        
        // Try multiple matching strategies
        const strategies = [
            // Strategy 1: Full ref match
            (file) => file.toLowerCase().includes(refNo.toLowerCase()),
            
            // Strategy 2: Clean ref match (remove dashes/underscores)
            (file) => {
                const cleanRef = refNo.replace(/[-_]/g, '').toLowerCase();
                const cleanFile = file.replace(/[-_]/g, '').toLowerCase();
                return cleanFile.includes(cleanRef);
            },
            
            // Strategy 3: Partial ref match
            (file) => {
                const refParts = refNo.split('-');
                return refParts.some(part => 
                    part.length > 2 && file.toLowerCase().includes(part.toLowerCase())
                );
            },
            
            // Strategy 4: Product name keywords
            (file) => {
                const nameKeywords = productName.toLowerCase()
                    .replace(/bremont\s+/i, '')
                    .split(/[\s-]+/);
                
                return nameKeywords.some(keyword => 
                    keyword.length > 3 && file.toLowerCase().includes(keyword)
                );
            }
        ];
        
        for (const strategy of strategies) {
            const matchedFile = files.find(strategy);
            if (matchedFile) {
                return path.join(imageDir, matchedFile);
            }
        }
        
        return null;
    } catch (error) {
        console.warn(`Could not read image directory: ${error.message}`);
        return null;
    }
}

// Simplified product data - key info only for bulk processing
const BREMONT_QUICK_CREATE = [
    // Remaining Terra Nova products (we already have 2 Bronze variants)
    {
        name: 'Terra Nova 42.5 Chronograph, Leather Strap',
        refNo: 'TN42-CHR-SS-BK-L-S',
        keyFeatures: 'Classic chronograph with brown leather strap, vintage-inspired design, and robust 904L steel construction'
    },
    {
        name: 'Terra Nova 40.5 Turning Bezel Power Reserve',
        refNo: 'TN40-PWR-SS-BL-B', 
        keyFeatures: 'Field watch with power reserve indicator, blue gradient dial, compass bezel, and premium steel construction'
    },
    {
        name: 'Terra Nova 40.5 Turning Bezel Power Reserve Black',
        refNo: 'TN40-PWR-SS-BK-L-S',
        keyFeatures: 'Field watch with power reserve complication, black dial, compass bezel, and premium nubuck leather strap'
    },
    {
        name: 'Terra Nova 40.5 Jumping Hour',
        refNo: 'TN40-JH-SS-BK-B',
        keyFeatures: 'Rare jumping hour complication with black dial, 904L steel construction, and unique aperture time display'
    },
    {
        name: 'Terra Nova 40.5 Date',
        refNo: 'TN40-DT-SS-BK-B',
        keyFeatures: 'Classic field watch with date function, black dial, and robust 904L steel bracelet'
    },
    {
        name: 'Terra Nova 40.5 Date, Green Dial',
        refNo: 'TN40-DT-SS-GN-L-S',
        keyFeatures: 'Field watch with green gradient dial, date complication, and premium brown leather strap'
    },
    {
        name: 'Terra Nova 38 Pink',
        refNo: 'TN38-ND-SS-PK-B',
        keyFeatures: 'Limited edition pink dial in compact 38mm case, limited to 250 pieces, premium steel construction'
    },
    
    // Supermarine Collection
    {
        name: 'Supermarine Full Ceramic Tactical Black, NATO Strap',
        refNo: 'SM43-DT-BKCER-BK-N-S',
        keyFeatures: 'Full ceramic construction, 500m water resistance, tactical black finish, and NATO strap'
    },
    {
        name: 'Supermarine 500m',
        refNo: 'SM43-DT-SS-BK-B',
        keyFeatures: 'Professional dive watch with 500m water resistance, black wave dial, and premium steel bracelet'
    },
    {
        name: 'Supermarine 500m, Black Rubber Strap',
        refNo: 'SM43-DT-SS-BK-R-S',
        keyFeatures: 'Professional dive watch with 500m water resistance, black wave dial, and quick-release rubber strap'
    },
    {
        name: 'Supermarine 300M Date, Bi-Colour',
        refNo: 'SM40-DT-BI-BR-B',
        keyFeatures: 'Bi-color steel and rose gold construction, brown gradient dial, and luxury bracelet'
    },
    {
        name: 'Supermarine 300M GMT, Tundra Green',
        refNo: 'SM40-GMT-SS-GNBK-G',
        keyFeatures: 'GMT complication with tundra green gradient dial, bi-directional bezel, and premium steel bracelet'
    },
    {
        name: 'Supermarine 300M GMT, Glacier Blue',
        refNo: 'SM40-SS-BLBK-B',
        keyFeatures: 'Limited edition glacier blue GMT with bi-directional bezel, limited to 500 pieces'
    },
    {
        name: 'Supermarine 300M Date, Black Dial, Bracelet',
        refNo: 'SM40-DT-SS-BK-B',
        keyFeatures: 'Classic dive watch with black gradient dial, date function, and premium steel bracelet'
    },
    {
        name: 'Supermarine 300M Date, Black Dial, Rubber Strap',
        refNo: 'SM40-DT-SS-BK-R-S',
        keyFeatures: 'Dive watch with black gradient dial, date function, and performance rubber strap'
    },
    {
        name: 'Supermarine 300M, Blue Dial, Bracelet',
        refNo: 'SM40-ND-SS-BL-S',
        keyFeatures: 'Blue gradient dial dive watch with premium steel bracelet and refined elegance'
    },
    {
        name: 'Supermarine 300M, Green Dial',
        refNo: 'SM40-ND-SS-GN-B',
        keyFeatures: 'Green gradient dial dive watch with premium steel bracelet and naval-inspired design'
    },
    
    // Altitude Collection
    {
        name: 'Altitude Chronograph GMT',
        refNo: 'ALT42-CHR-G-SS-BK-B',
        keyFeatures: 'Aviation chronograph with GMT complication, Trip-Tick case, and premium steel bracelet'
    },
    {
        name: 'Altitude Chronograph GMT, Black Dial',
        refNo: 'ALT42-CHR-G-SS-BK-L-S',
        keyFeatures: 'Aviation chronograph with GMT, black dial, Trip-Tick case, and premium leather strap'
    },
    {
        name: 'Altitude Chronograph GMT, Silver Dial, Steel Bracelet',
        refNo: 'ALT42-CHR-G-SS-SI-B',
        keyFeatures: 'Aviation chronograph with GMT, silver dial, Trip-Tick case, and premium steel bracelet'
    },
    {
        name: 'Altitude MB Meteor, Black Dial, Titanium Bracelet',
        refNo: 'ALT42-MT-TI-BKBK-B',
        keyFeatures: 'Lightweight titanium construction, MB Meteor design, black dial, and premium titanium bracelet'
    },
    {
        name: 'Altitude MB Meteor, Black Dial, Leather Strap',
        refNo: 'ALT42-MT-TI-BKBK-L-S',
        keyFeatures: 'Lightweight titanium construction, MB Meteor design, black dial, and premium leather strap'
    },
    {
        name: 'Altitude MB Meteor, Silver Dial, Titanium Bracelet',
        refNo: 'ALT42-MT-TI-SITI-B',
        keyFeatures: 'Lightweight titanium construction, MB Meteor design, silver dial, and premium titanium bracelet'
    },
    {
        name: 'Altitude MB Meteor, Silver Dial, Black Leather Strap',
        refNo: 'ALT42-MT-TI-SITI-L-S',
        keyFeatures: 'Lightweight titanium construction, MB Meteor design, silver dial, and premium leather strap'
    },
    {
        name: 'Altitude 39 Date, Black Dial, Leather Strap',
        refNo: 'ALT39-DT-SS-BK-L-S',
        keyFeatures: 'Compact 39mm aviation watch with date function, black dial, and premium leather strap'
    },
    {
        name: 'Altitude 39 Date, Black Dial, Steel Bracelet',
        refNo: 'ALT39-DT-SS-BK-B',
        keyFeatures: 'Compact 39mm aviation watch with date function, black dial, and premium steel bracelet'
    },
    {
        name: 'Altitude 39 Date, Silver Dial, Leather Strap',
        refNo: 'ALT39-DT-SS-SI-L-S',
        keyFeatures: 'Compact 39mm aviation watch with date function, silver dial, and premium leather strap'
    }
];

async function createSingleProduct(sourceProductId, productData) {
    try {
        // Find matching image
        const imagePath = findProductImage(productData.refNo, productData.name);
        if (imagePath) {
            console.log(`🖼️  Found image: ${path.basename(imagePath)}`);
            productData.imagePaths = [imagePath];
        } else {
            console.log(`⚠️  No image found for ${productData.refNo}`);
            productData.imagePaths = [];
        }
        
        // Generate Yoast SEO meta description
        const metaDescription = generateMetaDescription(productData.name, productData.keyFeatures);
        productData.yoastSEO = {
            '_yoast_wpseo_metadesc': metaDescription,
            '_yoast_wpseo_title': `Bremont ${productData.name} - Palladio Jewellers`
        };
        
        // Set basic required fields
        productData.brand = 'Bremont';
        productData.description = `The ${productData.name} represents exceptional Swiss craftsmanship and precision engineering. ${productData.keyFeatures}

This timepiece embodies Bremont's commitment to quality, durability, and timeless design—crafted for those who demand excellence in every detail.

Explore the complete collection at Palladio Jewellers, your Official Bremont Retailer in Vancouver.


<span style="display: none;">Tags : Ref No: ${productData.refNo}</span>`;
        
        // Create the product
        console.log(`🔨 Creating: ${productData.name}`);
        const result = await cloneProductComplete(sourceProductId, productData);
        
        console.log(`✅ Created: ${productData.name} (ID: ${result.productId})`);
        
        return {
            ...productData,
            ...result,
            status: 'created'
        };
        
    } catch (error) {
        console.error(`❌ Error creating ${productData.name}:`, error.message);
        return {
            ...productData,
            status: 'error',
            error: error.message
        };
    }
}

async function bulkCreateProducts(sourceProductId = '28624', startIndex = 0, count = 5) {
    console.log(`🚀 Bulk Creating Bremont Products (${startIndex + 1} to ${Math.min(startIndex + count, BREMONT_QUICK_CREATE.length)})\n`);
    
    const results = [];
    const endIndex = Math.min(startIndex + count, BREMONT_QUICK_CREATE.length);
    
    for (let i = startIndex; i < endIndex; i++) {
        const productData = { ...BREMONT_QUICK_CREATE[i] };
        
        console.log(`\n📝 Processing ${i + 1}/${BREMONT_QUICK_CREATE.length}: ${productData.name}`);
        
        const result = await createSingleProduct(sourceProductId, productData);
        results.push(result);
        
        // Add delay to avoid rate limiting
        if (i < endIndex - 1) {
            console.log('⏳ Waiting 2 seconds...');
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    
    // Save results
    const batchFile = `bremont-batch-${startIndex + 1}-${endIndex}.json`;
    fs.writeFileSync(batchFile, JSON.stringify(results, null, 2));
    
    console.log(`\n📊 BATCH SUMMARY`);
    console.log('================');
    console.log(`✅ Created: ${results.filter(r => r.status === 'created').length}`);
    console.log(`❌ Errors: ${results.filter(r => r.status === 'error').length}`);
    console.log(`📁 Saved to: ${batchFile}`);
    
    return results;
}

// If run directly
if (require.main === module) {
    const startIndex = parseInt(process.argv[2]) || 0;
    const count = parseInt(process.argv[3]) || 3;
    const sourceId = process.argv[4] || '28624';
    
    bulkCreateProducts(sourceId, startIndex, count)
        .then(() => console.log('\n🎯 Batch complete!'))
        .catch(error => {
            console.error('💥 Batch failed:', error.message);
            process.exit(1);
        });
}

module.exports = {
    BREMONT_QUICK_CREATE,
    bulkCreateProducts,
    createSingleProduct
};