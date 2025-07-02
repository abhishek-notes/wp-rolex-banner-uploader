require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { cloneProductComplete } = require('./cloneProductComplete');

// Helper function to generate meta description
function generateMetaDescription(name, keyFeatures) {
    // Extract key features and create concise meta description
    const cleanName = name.replace(/Bremont\s+/i, '');
    return `Experience the Bremont ${cleanName}. ${keyFeatures} at Palladio Jewellers.`;
}

// Helper function to generate image metadata
function generateImageMetadata(productName, imageName) {
    const cleanProductName = productName.replace(/Bremont\s+/i, '');
    const brand = 'Bremont';
    
    return {
        alt: `${brand} ${cleanProductName} - Luxury Watch at Palladio Jewellers`,
        title: `${brand} ${cleanProductName} | Official ${brand} Retailer | Palladio Jewellers`,
        caption: `${brand} ${cleanProductName} - Official ${brand} Retailer - Palladio Jewellers Vancouver`,
        description: `Discover the ${brand} ${cleanProductName} at Palladio Jewellers, your Official ${brand} Retailer in Vancouver. Premium Swiss craftsmanship and timeless elegance.`
    };
}

// Function to find matching image for product
function findProductImage(refNo, productName) {
    const imageDir = './images/Bremont_Processed_901x1201_WEBP_IMPROVED_TRANSPARENT/';
    
    try {
        const files = fs.readdirSync(imageDir);
        
        // Try to match by reference number first
        let matchedFile = files.find(file => 
            file.toLowerCase().includes(refNo.toLowerCase().replace(/-/g, ''))
        );
        
        // If no ref match, try to match by product name keywords
        if (!matchedFile) {
            const nameKeywords = productName.toLowerCase()
                .replace(/bremont\s+/i, '')
                .split(/[\s-]+/);
            
            matchedFile = files.find(file => {
                const fileName = file.toLowerCase();
                return nameKeywords.some(keyword => 
                    keyword.length > 2 && fileName.includes(keyword)
                );
            });
        }
        
        return matchedFile ? path.join(imageDir, matchedFile) : null;
    } catch (error) {
        console.warn(`Could not read image directory: ${error.message}`);
        return null;
    }
}

// All 27 Bremont products data
const BREMONT_PRODUCTS = {
    // Product 1: Already exists (Terra Nova Bracelet)
    'terra-nova-chronograph-leather': {
        name: 'Terra Nova 42.5 Chronograph, Leather Strap',
        refNo: 'TN42-CHR-SS-BK-L-S',
        description: `Bremont's Terra Nova collection pays homage to early 20th-century military pocket watches, reimagined for the modern adventurer. Meticulously engineered and thoughtfully designed, these timepieces embody rugged elegance, practical utility, and enduring craftsmanship.

The 42.5mm cushion-shaped case, crafted from premium 904L stainless steel, features a distinctive mix of brushed and polished finishes. A bi-directional polished ceramic compass bezel enhances both style and functionality, making this chronograph a dependable companion in the field.

The dial delivers bold legibility with oversized Super-LumiNova® numerals, railroad minute tracks, and vintage-style hands, ensuring visibility even in low-light conditions. A custom-engraved case back displays a world map and 'Terra Nova' inscription—symbolizing the spirit of exploration.

An oversized crown, inspired by traditional field watches, allows for easy operation—even with gloves—and proudly bears Bremont's 'Wayfinder' logo.

Completing the look is a classic brown leather strap with pin buckle, designed to fit wrists from 16.5cm to 22cm in circumference.


<b>Functions</b>

Central Hour/Minute

Chronograph centre sweep seconds hand

Small seconds counter at 9 o'clock

Chronograph 30 minutes counter at 3 o'clock

Date at 6 o'clock


<b>Movement</b>

Calibre: Modified Calibre 13 1/4''' BE-50AV

No of Jewels: 27 Jewels

Glucydur balance wheel

Anachron balance spring

Nivaflex mainspring

Frequency: 28,800bph (4Hz)

Power reserve: 56-hour


<b>Case specifications</b>

Satin and polished two-piece stainless steel case

Bi-directional steel bezel with a ceramic insert

Push-in crown

Case Diameter: 42.5mm

Case Length: 48.8 mm

Case Depth: 14.8mm

Lug width: 22mm

Case back: Decorated stainless steel case back


<b>Dial and Hands specifications</b>

Black anthrecite metal dial with 3D vintage Super-LumiNova® (Green emission) blocks

Polished Rhodium Hour and minute hands with vintage Super-LumiNova® (Green emission)

Rose Gold plated Chrono hand

Gloss white counter hands


<b>Crystal</b>

Domed anti-reflective, scratch resistant sapphire crystal


<b>Water Resistance</b>

10 ATM, 100 metres


<strong>Strap</strong>

Brown leather strap


<b>Weight</b>

106g (watch head only)


<span style="display: none;">Tags : Ref No: TN42-CHR-SS-BK-L-S</span>`,
        keyFeatures: 'Classic field watch chronograph with premium 904L steel case, brown leather strap, and vintage-inspired navigation design'
    },
    
    'terra-nova-power-reserve-blue': {
        name: 'Terra Nova 40.5 Turning Bezel Power Reserve',
        refNo: 'TN40-PWR-SS-BL-B',
        description: `Inspired by the robust utility of early 20th-century military pocket watches, Bremont introduces the Terra Nova collection—a modern tribute to classic field timepieces. Each watch in the collection is a meticulous blend of historical design cues and contemporary innovation.

The 40.5mm model features a bold, geometrical cushion-shaped case crafted from high-performance 904L stainless steel. Its brushed and polished surfaces create a refined, durable exterior designed to withstand the rigours of exploration.

A bi-directional compass bezel with cardinal markers enhances navigational functionality, while the oversized crown—reminiscent of traditional field watches—ensures ease of use, even with gloved hands. Bremont's signature 'Wayfinder' logo embellishes the crown, symbolizing the brand's commitment to adventure and precision.

The dial is outfitted with oversized Super-LumiNova® numerals for exceptional visibility in low light, complemented by luminous indexes and vintage-inspired hands. A small seconds sub dial and a power reserve indicator pay homage to vintage military instrumentation.

The engraved case back features a detailed world map and the words 'Terra Nova', underscoring the collection's global spirit. The watch is completed with a 904L stainless steel quick-release bracelet, offering versatility and comfort.

Rediscover the heritage of field watches—refined for the modern explorer.


<b>Functions</b>

Central hour/minute function, utilising faceted pencil hands renowned for their vintage provenance and clear legibility

Date window at 3 o'clock

Running second hand at 9 o'clock

Power reserve at 6 o'clock

Rotating compass bezel


<b>Movement</b>

Calibre: Modified Calibre 11 1/2''' BE-79AL

No of Jewels: 31 Jewels

Glucydur balance wheel

Anachron balance spring

Nivaflex mainspring

Frequency: 28,800bph (4Hz)

Power reserve: 38-hour


<b>Case specifications</b>

Featuring a contemporary two-piece cushion case with a slim profile and tapered lugs reminiscent of military field watches. Elevated through the use of 904L stainless steel, utilised for its resistance to corrosion, improved lustre and greater durability. Finished with a brushed texturing for a unique and iconic wristwatch

Bi-directional steel bezel engraved with the compass rose

The Wayfinder, Bremont's new icon is engraved on the oversized push-in crown and features centrally on the dial

Case Diameter: 40.5mm

Case Length: 47 mm

Case Depth: 11.91mm

Lug width: 22mm

Case back: Globe decorated closed case back, highly functional and beautifully inscribed


<b>Dial and Hands specifications</b>

Gradient blue metal dial with 3D vintage Super-LumiNova® (Green emission) block numerals

Polished Rhodium hands with vintage Super-LumiNova® (Green emission)


<b>Crystal</b>

Domed anti-reflective, scratch resistant sapphire crystal


<b>Water Resistance</b>

10 ATM, 100 metres


<strong>Strap</strong>

Unique to the Terra Nova collection is a quick release bracelet crafted in 904L steel and finished in a combination of brushed and polished facets, which mirror the outer radius of the Terra Nova cushion case. Curved bars are repeated through the length of the strap creating a high level of articulation which ensures enhanced fluidity and great comfort to the wearer


<b>Weight</b>

75g (watch head only)


<span style="display: none;">Tags : Ref No: TN40-PWR-SS-BL-B</span>`,
        keyFeatures: 'Field watch with power reserve indicator, blue gradient dial, compass bezel, and premium 904L steel construction'
    },
    
    'terra-nova-power-reserve-black': {
        name: 'Terra Nova 40.5 Turning Bezel Power Reserve Black',
        refNo: 'TN40-PWR-SS-BK-L-S',
        description: `The Bremont Terra Nova collection reimagines the heritage of early 20th-century military pocket watches through the lens of modern craftsmanship. Purpose-built and elegantly styled, each timepiece embodies the essence of rugged functionality, simplicity, and timeless design—refined for today's adventurer.

Crafted from corrosion-resistant 904L stainless steel, the 40.5mm cushion-shaped case features a striking mix of brushed and polished finishes, offering both durability and distinction. A bi-directional compass bezel with cardinal direction markers enhances the watch's field-ready functionality.

The black dial showcases oversized, full-block Super-LumiNova® numerals for superior legibility in low light, complemented by luminous indexes and vintage-inspired hands. A small seconds sub-dial at 6 o'clock pays tribute to classic military timepieces, while the engraved case back features a world map and the inscription 'Terra Nova'—a nod to global exploration.

Completing the look is a black nubuck leather strap with a pin buckle clasp, designed to comfortably fit wrists from 16.5cm to 22cm. The oversized crown, adorned with Bremont's 'Wayfinder' logo, underscores the brand's enduring spirit of adventure.

A harmonious blend of heritage and innovation, the Terra Nova Power Reserve is a compelling choice for those who seek both performance and character in a field watch.


<b>Functions</b>

Central hour/minute function, utilising faceted pencil hands renowned for their vintage provenance and clear legibility

Date window at 3 o'clock

Running second hand at 9 o'clock

Power reserve at 6 o'clock

Rotating compass bezel


<b>Movement</b>

Calibre: Modified Calibre 11 1/2''' BE-79AL

No of Jewels: 31 Jewels

Glucydur balance wheel

Anachron balance spring

Nivaflex mainspring

Frequency: 28,800bph (4Hz)

Power reserve: 38-hour


<b>Case specifications</b>

Featuring a contemporary two-piece cushion case with a slim profile and tapered lugs reminiscent of military field watches. Elevated through the use of 904L stainless steel, utilised for its resistance to corrosion, improved lustre and greater durability. Finished with a brushed texturing for a unique and iconic wristwatch

Bi-directional steel bezel engraved with the compass rose

The Wayfinder, Bremont's new icon is engraved on the oversized push-in crown and features centrally on the dial

Case Diameter: 40.5mm

Case Length: 47 mm

Case Depth: 11.91mm

Lug width: 22mm

Case back: Globe decorated closed case back, highly functional and beautifully inscribed


<b>Dial and Hands specifications</b>

Gradient anthracite and black metal dial with 3D vintage Super-LumiNova® (Green emission) block numerals.

Polished Rhodium hands with vintage Super-LumiNova® (Green emission)


<b>Crystal</b>

Domed anti-reflective, scratch resistant sapphire crystal


<b>Water Resistance</b>

10 ATM, 100 metres


<strong>Strap</strong>

Black nubuck leather strap enhanced with boxed stitching in a shade of cream.


<b>Weight</b>

75g (watch head only)


<span style="display: none;">Tags : Ref No: TN40-PWR-SS-BK-L-S</span>`,
        keyFeatures: 'Field watch with power reserve complication, black dial, compass bezel, and premium leather strap'
    }
    
    // Continue with remaining products...
};

// Process all products
async function processAllBremontProducts(sourceProductId = '28624') {
    console.log('🚀 Processing All Bremont Products...\n');
    
    const results = [];
    let successCount = 0;
    let errorCount = 0;
    
    for (const [key, productConfig] of Object.entries(BREMONT_PRODUCTS)) {
        try {
            console.log(`📝 Processing: ${productConfig.name}`);
            
            // Find matching image
            const imagePath = findProductImage(productConfig.refNo, productConfig.name);
            if (imagePath) {
                console.log(`🖼️  Found image: ${path.basename(imagePath)}`);
                productConfig.imagePaths = [imagePath];
                
                // Generate image metadata
                const imageMetadata = generateImageMetadata(productConfig.name, path.basename(imagePath));
                productConfig.imageMetadata = imageMetadata;
            } else {
                console.log(`⚠️  No image found for ${productConfig.refNo}`);
                productConfig.imagePaths = [];
            }
            
            // Generate Yoast SEO meta description
            const metaDescription = generateMetaDescription(productConfig.name, productConfig.keyFeatures);
            productConfig.yoastSEO = {
                '_yoast_wpseo_metadesc': metaDescription,
                '_yoast_wpseo_title': `Bremont ${productConfig.name} - Palladio Jewellers`
            };
            
            console.log(`✅ Configured: ${productConfig.name}\n`);
            
            results.push({
                key,
                config: productConfig,
                status: 'configured'
            });
            
            successCount++;
            
        } catch (error) {
            console.error(`❌ Error processing ${productConfig.name}:`, error.message);
            results.push({
                key,
                config: productConfig,
                status: 'error',
                error: error.message
            });
            errorCount++;
        }
    }
    
    // Save configurations to file
    fs.writeFileSync('bremont-products-configured.json', JSON.stringify(results, null, 2));
    
    console.log('\n📊 PROCESSING SUMMARY');
    console.log('===================');
    console.log(`✅ Successfully configured: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📁 Results saved to: bremont-products-configured.json`);
    
    return results;
}

// Create products function
async function createAllProducts(sourceProductId = '28624') {
    console.log('🏭 Creating All Bremont Products...\n');
    
    const results = [];
    let successCount = 0;
    let errorCount = 0;
    
    for (const [key, productConfig] of Object.entries(BREMONT_PRODUCTS)) {
        try {
            console.log(`🔨 Creating: ${productConfig.name}`);
            
            const result = await cloneProductComplete(sourceProductId, productConfig);
            
            console.log(`✅ Created: ${productConfig.name} (ID: ${result.productId})`);
            console.log(`🔗 URL: ${result.productUrl}\n`);
            
            results.push({
                key,
                ...result,
                status: 'created'
            });
            
            successCount++;
            
            // Add delay between creations to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000));
            
        } catch (error) {
            console.error(`❌ Error creating ${productConfig.name}:`, error.message);
            results.push({
                key,
                config: productConfig,
                status: 'error',
                error: error.message
            });
            errorCount++;
        }
    }
    
    // Save results to file
    fs.writeFileSync('bremont-products-created.json', JSON.stringify(results, null, 2));
    
    console.log('\n🎉 CREATION SUMMARY');
    console.log('==================');
    console.log(`✅ Successfully created: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📁 Results saved to: bremont-products-created.json`);
    
    return results;
}

// If run directly
if (require.main === module) {
    const command = process.argv[2] || 'configure';
    const sourceId = process.argv[3] || '28624';
    
    if (command === 'configure') {
        processAllBremontProducts(sourceId)
            .then(() => console.log('\n🎯 Configuration complete!'))
            .catch(error => {
                console.error('💥 Configuration failed:', error.message);
                process.exit(1);
            });
    } else if (command === 'create') {
        createAllProducts(sourceId)
            .then(() => console.log('\n🎯 Creation complete!'))
            .catch(error => {
                console.error('💥 Creation failed:', error.message);
                process.exit(1);
            });
    } else {
        console.log('Usage: node processBremontProducts.js [configure|create] [sourceProductId]');
    }
}

module.exports = {
    BREMONT_PRODUCTS,
    processAllBremontProducts,
    createAllProducts,
    generateMetaDescription,
    generateImageMetadata,
    findProductImage
};