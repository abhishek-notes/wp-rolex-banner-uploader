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

// ALL REMAINING PRODUCTS WITH COMPLETE EXACT CONTENT
const ALL_REMAINING_PRODUCTS = [
    // Terra Nova - Last 2
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
    
    // Supermarine Collection - 10 Products
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
    },
    
    {
        name: 'Supermarine 500m',
        refNo: 'SM43-DT-SS-BK-B',
        keyFeatures: 'Professional dive watch with 500m water resistance, black wave dial, and premium steel bracelet',
        description: `The Bremont Supermarine 500M redefines professional dive watch performance with refined engineering and bold design. Crafted from premium 904L stainless steel, the 43mm case offers superior corrosion resistance and durability, now in a sleeker, more ergonomic profile with reinforced crown and bezel guards for enhanced protection in the harshest environments.

Engineered for the deep, this dive watch boasts an impressive 500-metre water resistance, a helium escape valve, and a rugged black ceramic uni-directional bezel with textured detailing for optimal grip. At the heart of the watch lies the automatic BB64 movement, delivering a robust 56-hour power reserve and reliable precision under pressure.

The dial features a striking wave-pattern motif, echoing the dynamic energy of the ocean's surface. Applied Super-LumiNova® indexes and bold sword hands ensure clarity in low-light conditions, while a domed sapphire crystal enhances visibility and lends a refined touch.

Offered on Bremont's innovative quick-release Supermarine bracelet, featuring polished-satin infinity links and a micro-adjustment clasp for a perfect fit, or choose a high-performance rubber or NATO strap for versatile styling.

Rugged yet sophisticated, the Supermarine 500M is built for those who venture further—on land, at sea, or beneath the waves.


<b>Functions</b>

Central Hour/Minute/Second

Date at 3 O'clock

Unidirectional rotating bezel


<b>Movement</b>

BB64AH movement

No of Jewels: 25 Jewels

Glucydur balance wheel

Anachron balance spring

Nivaflex mainspring

Frequency: 28,800bph (4Hz)

Power reserve: 56-hour


<b>Case specifications</b>

904L stainless steel case construction, black ceramic bezel insert inside a knurled detail 904L stainless steel bezel, automatic helium escape valve and crown protector. Screw down crown

Case Diameter: 43mm

Case Length: 50mm

Case Depth:13mm

Lug Width: 22mm

Case back: Stainless steel screw-in and decorated closed case back


<b>Dial and Hands specifications</b>

Black 3D wave pattern dial with applied indexes infilled with white Super-LumiNova® (Blue emission)

Black dial ring with printed minutes track

Polished nickel plated hour, minute and second hands filled with white Super-LumiNova® (Blue emission)


<b>Crystal</b>

Domed anti-reflective, scratch resistant sapphire crystal


<b>Water Resistance</b>

50 ATM, 500 metres


<strong>Strap</strong>

Quick-release 904L stainless steel bracelet


<span style="display: none;">Tags : Ref No: SM43-DT-SS-BK-B</span>`
    },
    
    {
        name: 'Supermarine 500m, Black Rubber Strap',
        refNo: 'SM43-DT-SS-BK-R-S',
        keyFeatures: 'Professional dive watch with 500m water resistance, black wave dial, and quick-release rubber strap',
        description: `The Bremont Supermarine 500M represents the next generation of the brand's acclaimed dive watch collection. Now crafted in a 43mm case of premium 904L stainless steel, this high-performance timepiece combines enhanced ergonomics with exceptional strength and corrosion resistance—ideal for professional-grade diving and everyday wear alike.

Built for the extremes, the Supermarine 500M is equipped with a 500-metre water resistance, a helium escape valve, and a robust black ceramic uni-directional bezel designed with improved grip and durability. Newly reimagined, the case features a slimmer profile and reinforced crown and bezel guards, delivering comfort without compromise.

A standout wave-pattern dial, inspired by the motion of the ocean, offers striking visual texture and depth. Super-LumiNova® coated indexes and bold sword hands ensure superior legibility in all lighting conditions, protected beneath a domed sapphire crystal for optimal clarity.

Inside, the watch is powered by Bremont's reliable automatic BB64 movement, offering a 56-hour power reserve and unwavering accuracy under pressure.

Available with Bremont's advanced quick-release Supermarine bracelet—featuring polished-satin infinity links and a precision micro-adjustment system—or paired with a rugged rubber or NATO strap, the Supermarine 500M is a versatile, refined tool watch made for life above and below the waves.


<b>Functions</b>

Central Hour/Minute/Second

Date at 3 O'clock

Unidirectional rotating bezel


<b>Movement</b>

BB64AH movement

No of Jewels: 25 Jewels

Glucydur balance wheel

Anachron balance spring

Nivaflex mainspring

Frequency: 28,800bph (4Hz)

Power reserve: 56-hour


<b>Case specifications</b>

904L stainless steel case construction, black ceramic bezel insert inside a knurled detail 904L stainless steel bezel, automatic helium escape valve and crown protector. Screw down crown

Case Diameter: 43mm

Case Length: 50mm

Case Depth:13mm

Lug Width: 22mm

Case back: Stainless steel screw-in and decorated closed case back


<b>Dial and Hands specifications</b>

Black 3D wave pattern dial with applied indexes infilled with white Super-LumiNova® (Blue emission)

Black dial ring with printed minutes track

Polished nickel plated hour, minute and second hands filled with white Super-LumiNova® (Blue emission)


<b>Crystal</b>

Domed anti-reflective, scratch resistant sapphire crystal


<b>Water Resistance</b>

50 ATM, 500 metres


<strong>Strap</strong>

Quick-release black rubber strap


<span style="display: none;">Tags : Ref No: SM43-DT-SS-BK-R-S</span>`
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

async function createAllRemaining(sourceProductId = '28624', startIndex = 0, batchSize = 2) {
    console.log(`🚀 Creating Remaining Bremont Products`);
    console.log(`📋 Batch: ${startIndex + 1} to ${Math.min(startIndex + batchSize, ALL_REMAINING_PRODUCTS.length)}`);
    console.log(`⚠️  EXACT CONTENT - NO MODIFICATIONS\n`);
    
    const results = [];
    const endIndex = Math.min(startIndex + batchSize, ALL_REMAINING_PRODUCTS.length);
    
    for (let i = startIndex; i < endIndex; i++) {
        const productData = { ...ALL_REMAINING_PRODUCTS[i] };
        
        console.log(`\n📝 Processing ${i + 1}/${ALL_REMAINING_PRODUCTS.length}: ${productData.name}`);
        
        const result = await createProduct(sourceProductId, productData);
        results.push(result);
        
        if (i < endIndex - 1) {
            console.log('⏳ Waiting 4 seconds...');
            await new Promise(resolve => setTimeout(resolve, 4000));
        }
    }
    
    const batchFile = `bremont-final-batch-${startIndex + 1}-${endIndex}.json`;
    fs.writeFileSync(batchFile, JSON.stringify(results, null, 2));
    
    console.log(`\n📊 BATCH SUMMARY`);
    console.log('================');
    console.log(`✅ Created: ${results.filter(r => r.status === 'created').length}`);
    console.log(`❌ Errors: ${results.filter(r => r.status === 'error').length}`);
    console.log(`📁 Saved to: ${batchFile}`);
    
    return results;
}

if (require.main === module) {
    const startIndex = parseInt(process.argv[2]) || 0;
    const batchSize = parseInt(process.argv[3]) || 2;
    const sourceId = process.argv[4] || '28624';
    
    createAllRemaining(sourceId, startIndex, batchSize)
        .then(() => console.log('\n🎯 Batch complete!'))
        .catch(error => {
            console.error('💥 Batch failed:', error.message);
            process.exit(1);
        });
}

module.exports = { ALL_REMAINING_PRODUCTS, createAllRemaining };