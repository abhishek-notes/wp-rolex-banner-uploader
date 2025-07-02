// Bremont Product Configurations
// All products have strong titles removed and include Yoast SEO meta descriptions

const BREMONT_PRODUCTS = {
    // Terra Nova Collection
    'terra-nova-bronze': {
        name: 'Terra Nova 42.5 Chronograph Bronze',
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
        brand: 'Bremont',
        imagePaths: ['./images/Bremont_Processed_901x1201_WEBP_IMPROVED_TRANSPARENT/BremontBronze_TerraNova_TN42-CHR-BZ-GN-L-S.webp'],
        yoastSEO: {
            '_yoast_wpseo_metadesc': 'Discover the Bremont Terra Nova Chronograph Bronze 42.5mm. A sophisticated Cupro-Aluminium bronze timepiece with green gradient dial, automatic movement, and adventure-ready design at Palladio Jewellers.',
            '_yoast_wpseo_title': 'Bremont Terra Nova Chronograph Bronze 42.5mm - Palladio Jewellers'
        }
    },
    
    'terra-nova-steel': {
        name: 'Terra Nova 42.5 Chronograph Steel',
        description: `Classic and versatile, the Terra Nova Chronograph Steel combines timeless elegance with robust functionality. The 42.5mm stainless steel case features a refined brushed and polished finish that complements any setting, from boardroom to adventure.

The black dial with contrasting white markers ensures optimal readability, while the steel bracelet provides comfort and durability for daily wear. This chronograph maintains all the precision and reliability Bremont is known for, powered by the dependable Calibre BE-50AV movement.

Perfect for those who appreciate understated luxury and proven performance in a classic steel presentation.


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

Satin and polished two-piece stainless steel case

Bi-directional steel bezel with a ceramic insert

Push-in crown

Case Diameter: 42.5mm

Case Length: 48.8 mm

Case Depth: 14.8mm

Lug width: 22mm

Case back: Decorated stainless steel case back


<b>Dial and Hands specifications</b>

Black metal dial with 3D vintage Super-LumiNova® (Green emission) blocks

Polished steel hour and minute hands with vintage Super-LumiNova® (Green emission)

Steel chrono hand and counter hands


<b>Crystal</b>

Domed anti-reflective, scratch resistant sapphire crystal


<b>Water Resistance</b>

10 ATM, 100 metres


<strong>Strap</strong>

904L stainless steel quick release bracelet


<span style="display: none;">Tags : Ref No: TN42-CHR-SS-BK-B</span>`,
        brand: 'Bremont',
        imagePaths: ['./images/Bremont_Processed_901x1201_WEBP_IMPROVED_TRANSPARENT/Bremont_Terranova_TN42-CHR-SS-BK-B.webp'],
        yoastSEO: {
            '_yoast_wpseo_metadesc': 'Experience the Bremont Terra Nova Chronograph Steel 42.5mm. Classic stainless steel construction with black dial, precision chronograph movement, and versatile steel bracelet at Palladio Jewellers.',
            '_yoast_wpseo_title': 'Bremont Terra Nova Chronograph Steel 42.5mm - Palladio Jewellers'
        }
    }
    
    // Additional products will be added here as you provide them
};

// Helper function to generate meta descriptions
function generateMetaDescription(name, keyFeatures, brand = 'Bremont') {
    return `Experience the ${brand} ${name}. ${keyFeatures} at Palladio Jewellers.`;
}

// Helper function to generate Yoast titles
function generateYoastTitle(name, brand = 'Bremont') {
    return `${brand} ${name} - Palladio Jewellers`;
}

// Helper function to create product config
function createProductConfig(productData) {
    const config = {
        name: productData.name,
        description: productData.description,
        brand: productData.brand || 'Bremont',
        imagePaths: productData.imagePaths || [],
        yoastSEO: {
            '_yoast_wpseo_metadesc': productData.metaDescription || generateMetaDescription(productData.name, productData.keyFeatures),
            '_yoast_wpseo_title': productData.yoastTitle || generateYoastTitle(productData.name, productData.brand)
        }
    };
    
    // Add optional fields
    if (productData.regular_price) config.regular_price = productData.regular_price;
    if (productData.sale_price) config.sale_price = productData.sale_price;
    if (productData.short_description) config.short_description = productData.short_description;
    if (productData.tags) config.tags = productData.tags;
    
    return config;
}

module.exports = {
    BREMONT_PRODUCTS,
    generateMetaDescription,
    generateYoastTitle,
    createProductConfig
};