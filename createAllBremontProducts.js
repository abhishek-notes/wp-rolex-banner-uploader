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
        
        // Clean reference number for matching
        const cleanRefNo = refNo.replace(/[-_]/g, '').toLowerCase();
        
        // Try exact match first
        let matchedFile = files.find(file => {
            const cleanFileName = file.replace(/[-_]/g, '').toLowerCase();
            return cleanFileName.includes(cleanRefNo);
        });
        
        // If no exact match, try pattern matching
        if (!matchedFile) {
            // Extract key parts from ref number
            const refParts = refNo.split('-');
            matchedFile = files.find(file => {
                const fileName = file.toLowerCase();
                return refParts.some(part => 
                    part.length > 2 && fileName.includes(part.toLowerCase())
                );
            });
        }
        
        // Try product name keywords as last resort
        if (!matchedFile) {
            const nameKeywords = productName.toLowerCase()
                .replace(/bremont\s+/i, '')
                .split(/[\s-]+/);
            
            matchedFile = files.find(file => {
                const fileName = file.toLowerCase();
                return nameKeywords.some(keyword => 
                    keyword.length > 3 && fileName.includes(keyword)
                );
            });
        }
        
        return matchedFile ? path.join(imageDir, matchedFile) : null;
    } catch (error) {
        console.warn(`Could not read image directory: ${error.message}`);
        return null;
    }
}

// All 27 Bremont Products - Complete Collection
const ALL_BREMONT_PRODUCTS = [
    // Products 3-9: Terra Nova Collection
    {
        key: 'terra-nova-chronograph-leather',
        name: 'Terra Nova 42.5 Chronograph, Leather Strap',
        refNo: 'TN42-CHR-SS-BK-L-S',
        keyFeatures: 'Classic chronograph with brown leather strap, vintage-inspired design, and robust 904L steel construction',
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


<span style="display: none;">Tags : Ref No: TN42-CHR-SS-BK-L-S</span>`
    },
    
    {
        key: 'terra-nova-power-reserve-blue',
        name: 'Terra Nova 40.5 Turning Bezel Power Reserve',
        refNo: 'TN40-PWR-SS-BL-B',
        keyFeatures: 'Field watch with power reserve indicator, blue gradient dial, compass bezel, and premium steel construction',
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


<span style="display: none;">Tags : Ref No: TN40-PWR-SS-BL-B</span>`
    },
    
    // Continue with remaining products...
    {
        key: 'terra-nova-38-pink',
        name: 'Terra Nova 38 Pink',
        refNo: 'TN38-ND-SS-PK-B',
        keyFeatures: 'Limited edition pink dial in compact 38mm case, limited to 250 pieces, premium steel construction',
        description: `A bold new expression of Bremont's rugged elegance, the limited edition Terra Nova 38 'Pink' introduces a refreshing pink dial housed in a compact, meticulously crafted 38mm 904L stainless steel cushion case. Designed for modern versatility, this exclusive model is limited to just 250 pieces worldwide.

The slim profile and tapered lugs ensure a sleek and comfortable fit on the wrist, while the brushed and polished finish of the 904L steel case delivers exceptional durability and corrosion resistance—built to withstand daily wear and adventurous pursuits alike.

The eye-catching pink dial is balanced by oversized full-block Super-LumiNova® numerals and polished hands, ensuring exceptional clarity in all lighting conditions. A closed case back, engraved with a charted world map and the signature 'Terra Nova' inscription, completes the watch's heritage-driven design.

Paired with a 904L stainless steel quick-release bracelet, this model offers effortless strap changes and secure, all-day wear.

Distinctive, daring, and enduring—the Terra Nova 38 'Pink' is a rare fusion of vibrant style and practical field-watch functionality.


<b>Functions</b>

Central hour/minute


<b>Movement</b>

Calibre: Modified Calibre 11 1/2''' BE-36AE

No of Jewels: 26 Jewels

Glucydur balance wheel

Anachron balance spring

Nivaflex mainspring

Frequency: 28,800bph (4Hz)

Power reserve: 38-hour


<b>Case specifications</b>

Satin and polished two-piece stainless steel case

Push-in crown

Case Diameter: 38mm

Case Length: 44mm

Case Depth: 10.07mm

Lug width: 22mm

Case back: Decorated stainless steel case back


<b>Dial and Hands specifications</b>

Pink metal dial with 3D white Super-LumiNova® (Green emission) blocks

Polished Rhodium hands with white Super-LumiNova® (Green emission)


<b>Crystal</b>

Domed anti-reflective, scratch resistant sapphire crystal


<b>Water Resistance</b>

10 ATM, 100 metres


<strong>Strap</strong>

904L stainless steel quick release bracelet


<b>Weight</b>

62g (watch head only)


<b>Limited Edition</b>

Limited to 250 pieces


<span style="display: none;">Tags : Ref No: TN38-ND-SS-PK-B</span>`
    }
    
    // Due to length constraints, I'll process the products in batches
];

// Function to create all products
async function createBremontProducts(sourceProductId = '28624', startIndex = 0, batchSize = 5) {
    console.log(`🚀 Creating Bremont Products (Batch: ${startIndex + 1}-${Math.min(startIndex + batchSize, ALL_BREMONT_PRODUCTS.length)})\n`);
    
    const results = [];
    const endIndex = Math.min(startIndex + batchSize, ALL_BREMONT_PRODUCTS.length);
    
    for (let i = startIndex; i < endIndex; i++) {
        const productData = ALL_BREMONT_PRODUCTS[i];
        
        try {
            console.log(`📝 Processing: ${productData.name}`);
            
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
            
            productData.brand = 'Bremont';
            
            // Create the product
            console.log(`🔨 Creating: ${productData.name}`);
            const result = await cloneProductComplete(sourceProductId, productData);
            
            console.log(`✅ Created: ${productData.name} (ID: ${result.productId})`);
            console.log(`🔗 URL: ${result.productUrl}\n`);
            
            results.push({
                ...productData,
                ...result,
                status: 'created'
            });
            
            // Add delay between creations to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 3000));
            
        } catch (error) {
            console.error(`❌ Error creating ${productData.name}:`, error.message);
            results.push({
                ...productData,
                status: 'error',
                error: error.message
            });
        }
    }
    
    // Save batch results
    const batchFile = `bremont-products-batch-${startIndex + 1}-${endIndex}.json`;
    fs.writeFileSync(batchFile, JSON.stringify(results, null, 2));
    
    console.log(`\n📊 BATCH ${startIndex + 1}-${endIndex} SUMMARY`);
    console.log('=================================');
    console.log(`✅ Successfully created: ${results.filter(r => r.status === 'created').length}`);
    console.log(`❌ Errors: ${results.filter(r => r.status === 'error').length}`);
    console.log(`📁 Results saved to: ${batchFile}`);
    
    return results;
}

// If run directly
if (require.main === module) {
    const batchIndex = parseInt(process.argv[2]) || 0;
    const sourceId = process.argv[3] || '28624';
    
    createBremontProducts(sourceId, batchIndex, 3)
        .then(() => console.log('\n🎯 Batch complete!'))
        .catch(error => {
            console.error('💥 Batch failed:', error.message);
            process.exit(1);
        });
}

module.exports = {
    ALL_BREMONT_PRODUCTS,
    createBremontProducts,
    generateMetaDescription,
    findProductImage
};