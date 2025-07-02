require('dotenv').config();
const { cloneProductComplete } = require('./cloneProductComplete');
const fs = require('fs');
const path = require('path');

// Helper functions
function generateMetaDescription(name, keyFeatures) {
    const cleanName = name.replace(/Bremont\s+/i, '');
    return `Experience the Bremont ${cleanName}. ${keyFeatures} at Palladio Jewellers.`;
}

function findProductImage(refNo, productName) {
    const imageDir = './images/Bremont_Processed_901x1201_WEBP_IMPROVED_TRANSPARENT/';
    
    try {
        const files = fs.readdirSync(imageDir);
        
        const strategies = [
            (file) => file.toLowerCase().includes(refNo.toLowerCase()),
            (file) => {
                const cleanRef = refNo.replace(/[-_]/g, '').toLowerCase();
                const cleanFile = file.replace(/[-_]/g, '').toLowerCase();
                return cleanFile.includes(cleanRef);
            },
            (file) => {
                const refParts = refNo.split('-');
                return refParts.some(part => 
                    part.length > 2 && file.toLowerCase().includes(part.toLowerCase())
                );
            },
            // Additional strategy for Terra Nova files
            (file) => {
                if (productName.includes('Terra Nova')) {
                    if (productName.includes('Jumping') && file.toLowerCase().includes('jump')) return true;
                    if (productName.includes('Power Reserve') && file.toLowerCase().includes('power')) return true;
                    if (productName.includes('Date') && file.toLowerCase().includes('date')) return true;
                }
                return false;
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

// Missing products with exact content from your list
const MISSING_PRODUCTS = [
    {
        name: 'Terra Nova 40.5 Turning Bezel Power Reserve',
        refNo: 'TN40-PWR-SS-BL-B',
        keyFeatures: 'Blue dial with power reserve indicator, compass bezel, and premium steel bracelet',
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
    {
        name: 'Terra Nova 40.5 Turning Bezel Power Reserve Black',
        refNo: 'TN40-PWR-SS-BK-L-S',
        keyFeatures: 'Black dial with power reserve indicator, compass bezel, and premium leather strap',
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


<span style="display: none;">Tags : Ref No: TN40-PWR-SS-BK-L-S</span>`
    },
    {
        name: 'Terra Nova 40.5 Jumping Hour',
        refNo: 'TN40-JH-SS-BK-B',
        keyFeatures: 'Rare jumping hour complication with instant hour changes and premium steel bracelet',
        description: `A rare complication meets modern field watch design in the Bremont Terra Nova Jumping Hour. Crafted from robust yet refined 904L stainless steel, this 40.5mm timepiece brings a contemporary edge to the Terra Nova collection while paying tribute to the heritage of early military timekeeping.

The cushion-shaped case features a sophisticated mix of polished and brushed finishes, framing a high-gloss black dial that showcases the unique Jumping Hour complication. A clean, offset aperture layout allows for a natural left-to-right time display, offering enhanced readability and minimalist appeal.

Powering the watch is Bremont's exclusive BC634 Jumping Hour calibre, a high-torque automatic movement designed to deliver precise and instantaneous jumps of the hour disc. The central seconds hand, treated with next-generation Super-LumiNova®, ensures visibility in low-light conditions, while applied markers and a crisp minute track add further clarity and detail.

Combining elegance and engineering, this standout model is offered on either a 904L stainless steel Terra Nova bracelet or a black gradient leather strap, adapting effortlessly from formal to everyday wear.

Whether you're drawn to the technical rarity of the Jumping Hour or the distinctive blend of form and function, the Terra Nova Jumping Hour is a statement of mechanical sophistication and modern versatility.


<b>Functions</b>

Hour window at 9 O'clock

Minute window at 9 O'clock

Central running seconds hand


<b>Movement</b>

BC634AH movement

No of Jewels: 29 Jewels

Glucydur balance wheel

Anachron balance spring

Nivaflex mainspring

Frequency: 28,800bph (4Hz)

Power reserve: 56-hour


<b>Case specifications</b>

Satin and polished two-piece 904L stainless steel case

Push-in crown

Case Diameter: 40.5mm

Case Length: 47mm

Case Depth: 10.15mm

Lug Width: 22mm

Case back: Decorated 904L stainless steel case back


<b>Dial and Hands specifications</b>

Black lacquered dial with applied window border

White Super-LumiNova® (Green emission) printed markers at 12, 3, 6 and 9 O'clock

Silver printed minute track and hour markers

Hour window with white Super-LumiNova® (Green emission) numerals

Minute window with white printed numerals

Centre seconds hand in full white Super-LumiNova® (Green emission)


<b>Crystal</b>

Flat anti-reflective sapphire crystal


<b>Water Resistance</b>

10 ATM, 100 metres


<strong>Strap</strong>

Quick-release 904L stainless steel bracelet with butterfly clasp


<span style="display: none;">Tags : Ref No: TN40-JH-SS-BK-B</span>`
    },
    {
        name: 'Terra Nova 40.5 Date',
        refNo: 'TN40-DT-SS-BK-B',
        keyFeatures: 'Classic field watch design with black dial, date display, and premium steel bracelet',
        description: `The Bremont Terra Nova Date is a modern reimagining of the classic field watch, infused with heritage and crafted for today's adventurer. At 40.5mm, its contemporary geometric cushion case is engineered from premium 904L stainless steel, offering a sleek, low-profile silhouette with shortened lugs for a perfectly balanced fit on the wrist.

Inspired by early 20th-century military pocket watches, the Terra Nova captures the essence of rugged elegance, functional simplicity, and enduring style. Its dial features oversized full-block Super-LumiNova® numerals, ensuring optimal legibility in all lighting conditions. A broken railroad minute track and vintage-style hands further evoke the timeless character of classic field instruments.

The closed case back is engraved with a detailed world map and the inscription 'Terra Nova', symbolizing exploration and global reach. Enhancing usability and design, the oversized crown—modeled after traditional field watches for operation with gloved hands—is adorned with Bremont's new 'Wayfinder' logo, celebrating the spirit of discovery.

Complete with a practical date display, this timepiece embodies both form and function. It's a reliable companion for everyday wear or the next great adventure.


<b>Functions</b>

Central Hour/minute/seconds

Date window at 3 o'clock


<b>Movement</b>

Calibre: Modified Calibre 11 1/2''' BE-36AE

No of Jewels: 26 Jewels

Glucydur balance wheel

Anachron balance spring

Nivaflex mainspring

Frequency: 28,800bph (4Hz)

Power reserve: 38-hour

Modified automatic winding bridge


<b>Case specifications</b>

Satin and polished two-piece stainless steel case

Push-in crown

Case Diameter: 40.5mm

Case Length: 47mm

Case Depth: 11.11mm

Lug width: 22mm

Case back: Decorated stainless steel case back


<b>Dial and Hands specifications</b>

Gradient anthracite and black metal with 3D vintage Super-LumiNova® (Green emission) block numerals

Polished Rhodium hands with vintage Super-LumiNova® (Green emission)


<b>Crystal</b>

Domed anti-reflective, scratch resistant sapphire crystal


<b>Water Resistance</b>

10 ATM, 100 metres


<strong>Strap</strong>

904L stainless steel quick release bracelet


<b>Weight</b>

70g (watch head only)


<span style="display: none;">Tags : Ref No: TN40-DT-SS-BK-B</span>`
    }
];

async function createProduct(sourceProductId, productData) {
    try {
        console.log(`📝 Processing: ${productData.name}`);
        
        const imagePath = findProductImage(productData.refNo, productData.name);
        if (imagePath) {
            console.log(`🖼️  Found image: ${path.basename(imagePath)}`);
            productData.imagePaths = [imagePath];
        } else {
            console.log(`⚠️  No image found for ${productData.refNo}`);
            productData.imagePaths = [];
        }
        
        const metaDescription = generateMetaDescription(productData.name, productData.keyFeatures);
        productData.yoastSEO = {
            '_yoast_wpseo_metadesc': metaDescription,
            '_yoast_wpseo_title': `Bremont ${productData.name} - Palladio Jewellers`
        };
        
        productData.brand = 'Bremont';
        
        console.log(`🔨 Creating: ${productData.name}`);
        const result = await cloneProductComplete(sourceProductId, productData);
        
        console.log(`✅ Created: ${productData.name} (ID: ${result.productId})`);
        
        return { ...productData, ...result, status: 'created' };
        
    } catch (error) {
        console.error(`❌ Error creating ${productData.name}:`, error.message);
        return { ...productData, status: 'error', error: error.message };
    }
}

async function createMissingProducts(sourceProductId = '28624') {
    console.log(`🚀 Creating Missing Bremont Products`);
    console.log(`📋 Processing ${MISSING_PRODUCTS.length} missing products`);
    console.log(`⚠️  EXACT CONTENT - NO MODIFICATIONS\n`);
    
    const results = [];
    
    for (let i = 0; i < MISSING_PRODUCTS.length; i++) {
        const productData = { ...MISSING_PRODUCTS[i] };
        
        console.log(`\n📝 Processing ${i + 1}/${MISSING_PRODUCTS.length}: ${productData.name}`);
        
        const result = await createProduct(sourceProductId, productData);
        results.push(result);
        
        if (i < MISSING_PRODUCTS.length - 1) {
            console.log('⏳ Waiting 4 seconds...');
            await new Promise(resolve => setTimeout(resolve, 4000));
        }
    }
    
    const resultsFile = `missing-bremont-products.json`;
    fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
    
    console.log(`\n📊 MISSING PRODUCTS SUMMARY`);
    console.log('============================');
    console.log(`✅ Created: ${results.filter(r => r.status === 'created').length}`);
    console.log(`❌ Errors: ${results.filter(r => r.status === 'error').length}`);
    console.log(`📁 Results saved to: ${resultsFile}`);
    
    return results;
}

if (require.main === module) {
    createMissingProducts()
        .then(() => {
            console.log('\n🎯 Missing products creation completed!');
            process.exit(0);
        })
        .catch(error => {
            console.error('💥 Missing products creation failed:', error.message);
            process.exit(1);
        });
}

module.exports = { createMissingProducts, MISSING_PRODUCTS };