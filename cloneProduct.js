require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const { fetchProductBySlug } = require('./fetchProductData');

async function uploadProductImage(imagePath, authHeader) {
    const { WP_URL } = process.env;
    
    try {
        const imageData = fs.readFileSync(imagePath);
        const imageName = path.basename(imagePath);
        
        const formData = new FormData();
        formData.append('file', imageData, imageName);
        
        const uploadResponse = await axios.post(
            `${WP_URL}/wp-json/wp/v2/media`,
            formData,
            {
                headers: {
                    'Authorization': `Basic ${authHeader}`,
                    ...formData.getHeaders()
                }
            }
        );
        
        return uploadResponse.data.id;
    } catch (error) {
        console.error('Error uploading image:', error.message);
        throw error;
    }
}

async function cloneProduct(sourceSlug, newProductData, imagePath = null) {
    const { WP_USER, APP_PASSWORD, WP_URL } = process.env;
    
    if (!WP_USER || !APP_PASSWORD || !WP_URL) {
        throw new Error('Missing required environment variables');
    }

    const authHeader = Buffer.from(`${WP_USER}:${APP_PASSWORD}`).toString('base64');

    try {
        // Step 1: Fetch source product data
        console.log(`Fetching source product: ${sourceSlug}`);
        const sourceData = await fetchProductBySlug(sourceSlug);
        const sourceProduct = sourceData.woocommerce;
        
        // Step 2: Prepare new product data
        const clonedProduct = {
            // Basic info
            name: newProductData.name,
            slug: newProductData.slug || newProductData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, ''),
            type: sourceProduct.type,
            status: 'publish',
            featured: sourceProduct.featured,
            catalog_visibility: sourceProduct.catalog_visibility,
            
            // Description (provided in newProductData)
            description: newProductData.description,
            short_description: newProductData.short_description || sourceProduct.short_description,
            
            // Pricing (empty like source)
            regular_price: '',
            sale_price: '',
            
            // Stock
            manage_stock: sourceProduct.manage_stock,
            stock_status: sourceProduct.stock_status,
            
            // Shipping
            virtual: sourceProduct.virtual,
            downloadable: sourceProduct.downloadable,
            
            // Categories (same as source)
            categories: sourceProduct.categories.map(cat => ({ id: cat.id })),
            
            // Tags
            tags: newProductData.tags || sourceProduct.tags,
            
            // Reviews
            reviews_allowed: sourceProduct.reviews_allowed,
            
            // Menu order
            menu_order: sourceProduct.menu_order + 1 // Place after the original
        };
        
        // Step 3: Create the product
        console.log('Creating new product...');
        const createResponse = await axios.post(
            `${WP_URL}/wp-json/wc/v3/products`,
            clonedProduct,
            {
                headers: {
                    'Authorization': `Basic ${authHeader}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        const newProduct = createResponse.data;
        console.log(`Product created with ID: ${newProduct.id}`);
        
        // Step 4: Upload and set product image if provided
        if (imagePath && fs.existsSync(imagePath)) {
            console.log('Uploading product image...');
            const imageId = await uploadProductImage(imagePath, authHeader);
            
            // Update product with image
            await axios.put(
                `${WP_URL}/wp-json/wc/v3/products/${newProduct.id}`,
                {
                    images: [{ id: imageId }]
                },
                {
                    headers: {
                        'Authorization': `Basic ${authHeader}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log(`Image uploaded and set with ID: ${imageId}`);
        }
        
        // Step 5: Copy meta data
        console.log('Copying meta data...');
        const metaDataToCopy = sourceProduct.meta_data.filter(meta => {
            // Skip certain meta keys that should be unique
            const skipKeys = ['_wp_old_date', '_elementor_page_assets', '_elementor_css'];
            return !skipKeys.includes(meta.key);
        });
        
        // Add or update meta data
        const metaUpdates = {
            meta_data: [
                ...metaDataToCopy,
                // Add brand meta
                { key: 'brand', value: newProductData.brand || 'Bremont' },
                // Set primary category to Bremont
                { key: '_yoast_wpseo_primary_product_cat', value: '748' }
            ]
        };
        
        await axios.put(
            `${WP_URL}/wp-json/wc/v3/products/${newProduct.id}`,
            metaUpdates,
            {
                headers: {
                    'Authorization': `Basic ${authHeader}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        
        console.log('Meta data copied successfully');
        
        // Return the new product data
        return {
            success: true,
            productId: newProduct.id,
            productUrl: newProduct.permalink,
            productSlug: newProduct.slug,
            message: `Product cloned successfully! New product ID: ${newProduct.id}`
        };
        
    } catch (error) {
        console.error('Error cloning product:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
        }
        throw error;
    }
}

module.exports = { cloneProduct };

// If run directly, test with Terra Nova Bronze
if (require.main === module) {
    const bronzeProductData = {
        name: 'Terra Nova 42.5 Chronograph Bronze',
        description: `<strong>Bremont Terra Nova Chronograph Bronze – 42.5mm</strong>
Engineered for performance and designed for adventure, the Terra Nova Chronograph Bronze stands as the most technically sophisticated timepiece in the collection. Crafted from durable 42.5mm Cupro-Aluminium bronze—reinforced with aluminum and silicon—it naturally develops a rich, even patina over time, enhancing its character with every wear.

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
        brand: 'Bremont'
    };
    
    // Image path for the bronze model
    const imagePath = './images/Bremont_Processed_901x1201_WEBP_IMPROVED_TRANSPARENT/BremontBronze_TerraNova_TN42-CHR-BZ-GN-L-S.webp';
    
    cloneProduct('terra-nova-42-5-chronograph-bracelet', bronzeProductData, imagePath)
        .then(result => {
            console.log('\n✅ SUCCESS!');
            console.log(result.message);
            console.log(`View the new product at: ${result.productUrl}`);
        })
        .catch(error => {
            console.error('\n❌ FAILED!');
            console.error(error.message);
            process.exit(1);
        });
}