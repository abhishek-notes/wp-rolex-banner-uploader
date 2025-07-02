require('dotenv').config();
const axios = require('axios');

async function updateProduct(productId, updates) {
    const { WP_USER, APP_PASSWORD, WP_URL } = process.env;
    
    if (!WP_USER || !APP_PASSWORD || !WP_URL) {
        throw new Error('Missing required environment variables');
    }

    const authHeader = Buffer.from(`${WP_USER}:${APP_PASSWORD}`).toString('base64');
    const headers = {
        'Authorization': `Basic ${authHeader}`,
        'Content-Type': 'application/json'
    };

    try {
        console.log(`📝 Updating product ${productId}...`);
        
        // Update the product
        const updateResponse = await axios.put(
            `${WP_URL}/wp-json/wc/v3/products/${productId}`,
            updates,
            { headers }
        );
        
        console.log('✅ Product updated successfully!');
        console.log(`📱 View at: ${updateResponse.data.permalink}`);
        
        return updateResponse.data;
        
    } catch (error) {
        console.error('❌ Error updating product:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
        throw error;
    }
}

// Terra Nova Bronze updates
const terraNovaBronzeUpdates = {
    description: `Engineered for performance and designed for adventure, the Terra Nova Chronograph Bronze stands as the most technically sophisticated timepiece in the collection. Crafted from durable 42.5mm Cupro-Aluminium bronze—reinforced with aluminum and silicon—it naturally develops a rich, even patina over time, enhancing its character with every wear.

The bi-directional bronze compass bezel with a sleek black ceramic insert offers precise functionality for navigation and timing, while 100-metre water resistance ensures reliability in all conditions. A deep green gradient dial creates bold contrast, featuring oversized Super-LumiNova® numerals for outstanding legibility in any light.

Driven by the Chronometer-rated Calibre BE-50AV automatic movement, this chronograph includes a central sweep seconds hand, a 30-minute counter at 3 o'clock, and a discreet date display at 6 o'clock. With a 56-hour power reserve, it delivers unwavering accuracy and performance.

Completing the look is a khaki green nubuck leather strap, secured with a PVD bronze-coloured steel pin buckle—a rugged yet refined companion for any journey.


<b>Functions</b>

Central hour/minute

Chronograph centre sweep second hand

Chronograph 30 minutes counter at 3 o'clock

Date at 6 o'clock

Small seconds counter at 9 o'clock


<b>Movement</b>

Calibre: Modified Calibre 13 1/4''' BE-50AV

No of Jewels: 27 Jewels

Glucydur balance wheel

Anachron balance spring

Nivaflex mainspring

Frequency: 28,800bph (4Hz)

Power reserve: 56-hour


<b>Case specifications</b>

Satin and polished two-piece Cupro-Aluminium bronze case

Bi-directional Cupro-Aluminium bronze with a ceramic insert

Push-in crown

Case Diameter: 42.5mm

Case Length: 48.8 mm

Case Depth: 14.8mm

Lug width: 22mm

Case back: PVD bronze-coloured stainless steel case back


<b>Dial and Hands specifications</b>

Gradient green metal dial with 3D vintage Super-LumiNova® (Green emission) blocks

Polished Rose Gold plated hour and minute hands with vintage Super-LumiNova® (Green emission)

Rose Gold plated chrono hand and counter hands


<b>Crystal</b>

Domed anti-reflective, scratch resistant sapphire crystal


<b>Water Resistance</b>

10 ATM, 100 metres


<strong>Strap</strong>

Khaki Green Nubuck Leather with Cream Box Stitch with PVD bronze-coloured stainless steel pin buckle


<span style="display: none;">Tags : Ref No: TN42-CHR-BZ-GN-L-S</span>`,
    
    meta_data: [
        {
            key: '_yoast_wpseo_metadesc',
            value: 'Discover the Bremont Terra Nova Chronograph Bronze 42.5mm. A sophisticated Cupro-Aluminium bronze timepiece with green gradient dial, automatic movement, and adventure-ready design at Palladio Jewellers.'
        },
        {
            key: '_yoast_wpseo_title',
            value: 'Bremont Terra Nova Chronograph Bronze 42.5mm - Palladio Jewellers'
        }
    ]
};

// If run directly
if (require.main === module) {
    const productId = process.argv[2] || '28629';
    
    updateProduct(productId, terraNovaBronzeUpdates)
        .then(() => {
            console.log('🎉 Update completed successfully!');
        })
        .catch(error => {
            console.error('💥 Update failed:', error.message);
            process.exit(1);
        });
}

module.exports = { updateProduct };