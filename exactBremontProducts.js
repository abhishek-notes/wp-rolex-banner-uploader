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

// EXACT CONTENT - ALL REMAINING PRODUCTS WITH COMPLETE DESCRIPTIONS AS PROVIDED
const EXACT_BREMONT_PRODUCTS = [
    // Terra Nova Collection - Remaining Products
    {
        name: 'Terra Nova 40.5 Date',
        refNo: 'TN40-DT-SS-BK-B',
        keyFeatures: 'Classic field watch with date function, black dial, and robust 904L steel bracelet',
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
    },
    
    {
        name: 'Terra Nova 40.5 Date, Green Dial',
        refNo: 'TN40-DT-SS-GN-L-S',
        keyFeatures: 'Field watch with green gradient dial, date complication, and premium brown leather strap',
        description: `The Bremont Terra Nova Date in 40.5mm is a refined field watch that seamlessly blends vintage military inspiration with modern British craftsmanship. Featuring a distinctive geometric cushion case crafted from high-grade 904L stainless steel, this watch is designed with a low profile and shortened lugs to ensure a balanced, comfortable fit on the wrist.

Inspired by early 20th-century military pocket watches, the Terra Nova captures a timeless spirit of adventure with its clean lines, purposeful design, and practical functionality—reimagined for the modern era.

The dial is designed for maximum legibility, with oversized numerals crafted in full-block Super-LumiNova®, complemented by a broken railroad minute track and vintage-style hands. A date window adds everyday practicality, while the closed case back is beautifully engraved with a global map and the Terra Nova insignia.

Paying homage to field watches of the past, the oversized crown is both functional and elegant, engineered for precision even when worn with gloves. It features Bremont's new 'Wayfinder' logo—an emblem of the brand's dedication to exploration.

This model is paired with a rich brown leather strap featuring a pin buckle clasp. Designed for versatility, the standard-length strap fits wrists from 16.5cm to 22cm.


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


<b>Case specifications</b>

Satin and polished two-piece stainless steel case

Push-in crown

Case Diameter: 40.5mm

Case Length: 47mm

Case Depth: 11.11mm

Lug width: 22mm

Case back: Decorated stainless steel case back


<b>Dial and Hands specifications</b>

Gradient green metal dial with 3D vintage Super-LumiNova® (Green emission) block numerals

Polished Rhodium hands with vintage Super-LumiNova® (Green emission)


<b>Crystal</b>

Domed anti-reflective, scratch resistant sapphire crystal


<b>Water Resistance</b>

10 ATM, 100 metres


<strong>Strap</strong>

Brown leather strap


<b>Weight</b>

70g (watch head only)


<span style="display: none;">Tags : Ref No: TN40-DT-SS-GN-L-S</span>`
    },
    
    {
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
    },
    
    // Supermarine Collection - All Products
    {
        name: 'Supermarine Full Ceramic Tactical Black, NATO Strap',
        refNo: 'SM43-DT-BKCER-BK-N-S',
        keyFeatures: 'Full ceramic construction, 500m water resistance, tactical black finish, and NATO strap',
        description: `Introducing the next evolution in Bremont's dive watch legacy: the Supermarine Full Ceramic Tactical Black. Purpose-built for extreme performance and tested by Bremont ambassador and former Royal Marine Aldo Kane, this high-performance timepiece is engineered to thrive in the world's most demanding environments.

Encased in a mono-block black ceramic case—a first for Bremont—this striking 500m diver combines technical excellence with cutting-edge materials. The ceramic is meticulously crafted: soft ceramic powder is shaped, then sintered at 1,450°C under high pressure, shrinking the case by 23% to achieve ultimate hardness and a flawless matte sandblasted finish. The result is an incredibly scratch-resistant and robust watch case, ideal for land, sea, or beyond.

The design features a PVD-treated titanium uni-directional knurled bezel with a black ceramic insert, complemented by a titanium movement container and PVD titanium case back. Inside, a chronometer-rated automatic movement delivers a 50-hour power reserve, protected and precise under pressure. With 500m water resistance and a helium escape valve, this timepiece is built to dive deep while maintaining its impeccable performance.

For low-light readability, the applied indexes and hands are filled with blue-emission Super-LumiNova®, offering outstanding visibility and a touch of luminescent brilliance.

Completing the watch is a black and grey woven fabric NATO-style strap, expertly woven on 18th-century Jacquard French looms. Its self-gripping fastening provides a secure and comfortable fit, ready for any adventure.

The Bremont Supermarine Full Ceramic Tactical Black is where elite engineering meets modern style—crafted for those who demand reliability, resilience, and refinement in every moment.


<b>Functions</b>

Central Hour/Minute/Second

Date at 3 O'clock

Unidirectional rotating bezel


<b>Movement</b>

Calibre: Modified Calibre 11 1/2''' BE-92AV

No of Jewels: 25 Jewels

Glucydur balance wheel

Anachron balance spring

Nivaflex mainspring

Frequency: 28,800bph (4Hz)

Power reserve: 50-hour


<b>Case specifications</b>

Black ceramic and titanium case construction, black ceramic bezel insert inside a knurled detail PVD treated titanium bezel, automatic helium escape valve and crown protector

Screw down PVD treated titanium crown

Case Diameter: 43mm

Case Length: 50mm

Case Depth:13mm

Lug Width: 22mm

Case back: PVD black titanium screw-in and decorated closed case back


<b>Dial and Hands specifications</b>

Black gradient dial with applied indexes infilled with white Super-LumiNova® (Blue emission)

Black dial ring with printed minutes track

Polished black gold hour, minute and second hands filled with white Super-LumiNova® (Blue emission)

Date window at 3-hour position


<b>Crystal</b>

Domed anti-reflective, scratch resistant sapphire crystal


<b>Water Resistance</b>

50 ATM, 500 metres


<strong>Strap</strong>

Black and grey woven fabric NATO strap with self-gripping fastening system


<b>Weight</b>

74g (watch head only)


<span style="display: none;">Tags : Ref No: SM43-DT-BKCER-BK-N-S</span>`
    }
    
    // Continue with remaining products...
];

async function createExactProduct(sourceProductId, productData) {
    try {
        console.log(`📝 Processing: ${productData.name}`);
        
        // Find matching image - NO CHANGES TO LOGIC
        const imagePath = findProductImage(productData.refNo, productData.name);
        if (imagePath) {
            console.log(`🖼️  Found image: ${path.basename(imagePath)}`);
            productData.imagePaths = [imagePath];
        } else {
            console.log(`⚠️  No image found for ${productData.refNo}`);
            productData.imagePaths = [];
        }
        
        // Generate Yoast SEO meta description - NO CHANGES
        const metaDescription = generateMetaDescription(productData.name, productData.keyFeatures);
        productData.yoastSEO = {
            '_yoast_wpseo_metadesc': metaDescription,
            '_yoast_wpseo_title': `Bremont ${productData.name} - Palladio Jewellers`
        };
        
        // Set brand - NO CHANGES
        productData.brand = 'Bremont';
        
        // CRITICAL: Use EXACT description provided - NO MODIFICATIONS WHATSOEVER
        // The description is already provided in the productData object exactly as specified
        
        console.log(`🔨 Creating: ${productData.name}`);
        const result = await cloneProductComplete(sourceProductId, productData);
        
        console.log(`✅ Created: ${productData.name} (ID: ${result.productId})`);
        console.log(`🔗 URL: ${result.productUrl}`);
        
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

async function createExactProducts(sourceProductId = '28624', startIndex = 0, count = 3) {
    console.log(`🚀 Creating EXACT Bremont Products (${startIndex + 1} to ${Math.min(startIndex + count, EXACT_BREMONT_PRODUCTS.length)})`);
    console.log('⚠️  NO CONTENT MODIFICATIONS - EXACT REPRODUCTION\n');
    
    const results = [];
    const endIndex = Math.min(startIndex + count, EXACT_BREMONT_PRODUCTS.length);
    
    for (let i = startIndex; i < endIndex; i++) {
        const productData = { ...EXACT_BREMONT_PRODUCTS[i] };
        
        console.log(`\n📝 Processing ${i + 1}/${EXACT_BREMONT_PRODUCTS.length}: ${productData.name}`);
        
        const result = await createExactProduct(sourceProductId, productData);
        results.push(result);
        
        // Add delay to avoid rate limiting
        if (i < endIndex - 1) {
            console.log('⏳ Waiting 3 seconds...');
            await new Promise(resolve => setTimeout(resolve, 3000));
        }
    }
    
    // Save results
    const batchFile = `bremont-exact-batch-${startIndex + 1}-${endIndex}.json`;
    fs.writeFileSync(batchFile, JSON.stringify(results, null, 2));
    
    console.log(`\n📊 EXACT BATCH SUMMARY`);
    console.log('====================');
    console.log(`✅ Created: ${results.filter(r => r.status === 'created').length}`);
    console.log(`❌ Errors: ${results.filter(r => r.status === 'error').length}`);
    console.log(`📁 Saved to: ${batchFile}`);
    
    return results;
}

// If run directly
if (require.main === module) {
    const startIndex = parseInt(process.argv[2]) || 0;
    const count = parseInt(process.argv[3]) || 2;
    const sourceId = process.argv[4] || '28624';
    
    createExactProducts(sourceId, startIndex, count)
        .then(() => console.log('\n🎯 EXACT batch complete - NO CONTENT MODIFIED!'))
        .catch(error => {
            console.error('💥 Batch failed:', error.message);
            process.exit(1);
        });
}

module.exports = {
    EXACT_BREMONT_PRODUCTS,
    createExactProducts,
    createExactProduct
};