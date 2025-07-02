require('dotenv').config();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const { exportProductComplete } = require('./exportProductComplete');

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
        
        console.log(`Image uploaded: ${imageName} (ID: ${uploadResponse.data.id})`);
        return uploadResponse.data.id;
    } catch (error) {
        console.error('Error uploading image:', error.message);
        throw error;
    }
}

async function cloneProductComplete(sourceProductId, newProductData) {
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
        // Step 1: Export complete source product data
        console.log('📤 Exporting source product data...');
        const sourceData = await exportProductComplete(sourceProductId);
        const sourceProduct = sourceData.woocommerce;
        
        // Step 2: Prepare new product data with ALL fields
        console.log('\n📝 Preparing new product data...');
        const clonedProduct = {
            // Basic Information
            name: newProductData.name,
            slug: newProductData.slug || generateSlug(newProductData.name),
            type: sourceProduct.type,
            status: newProductData.status || 'publish',
            featured: sourceProduct.featured,
            catalog_visibility: sourceProduct.catalog_visibility,
            
            // Content
            description: newProductData.description,
            short_description: newProductData.short_description || sourceProduct.short_description,
            
            // Pricing (keeping empty like source)
            regular_price: newProductData.regular_price || '',
            sale_price: newProductData.sale_price || '',
            
            // Inventory
            manage_stock: sourceProduct.manage_stock,
            stock_status: sourceProduct.stock_status,
            backorders: sourceProduct.backorders,
            sold_individually: sourceProduct.sold_individually,
            
            // Shipping
            virtual: sourceProduct.virtual,
            downloadable: sourceProduct.downloadable,
            weight: sourceProduct.weight,
            dimensions: sourceProduct.dimensions,
            shipping_class: sourceProduct.shipping_class,
            
            // Categories - maintain all original categories
            categories: sourceProduct.categories.map(cat => ({ id: cat.id })),
            
            // Tags
            tags: newProductData.tags || sourceProduct.tags,
            
            // Attributes
            attributes: sourceProduct.attributes,
            
            // Other settings
            reviews_allowed: sourceProduct.reviews_allowed,
            menu_order: newProductData.menu_order || (sourceProduct.menu_order + 1),
            
            // Related products
            upsell_ids: sourceProduct.upsell_ids,
            cross_sell_ids: sourceProduct.cross_sell_ids
        };
        
        // Step 3: Create the product
        console.log('\n🔨 Creating new product...');
        const createResponse = await axios.post(
            `${WP_URL}/wp-json/wc/v3/products`,
            clonedProduct,
            { headers }
        );
        
        const newProduct = createResponse.data;
        console.log(`✅ Product created with ID: ${newProduct.id}`);
        console.log(`📎 Slug: ${newProduct.slug}`);
        
        // Step 4: Upload and set product images
        if (newProductData.imagePaths && newProductData.imagePaths.length > 0) {
            console.log('\n🖼️ Uploading product images...');
            const imageIds = [];
            
            for (const imagePath of newProductData.imagePaths) {
                if (fs.existsSync(imagePath)) {
                    const imageId = await uploadProductImage(imagePath, authHeader);
                    imageIds.push({ id: imageId });
                }
            }
            
            // Update product with images
            if (imageIds.length > 0) {
                await axios.put(
                    `${WP_URL}/wp-json/wc/v3/products/${newProduct.id}`,
                    { images: imageIds },
                    { headers }
                );
                console.log(`✅ ${imageIds.length} image(s) uploaded and set`);
            }
        }
        
        // Step 5: Copy and update meta data
        console.log('\n📋 Copying meta data...');
        
        // Prepare meta data - filter out unique fields
        const skipMetaKeys = [
            '_wp_old_date',
            '_wp_old_slug', 
            '_wp_trash_meta_status',
            '_wp_trash_meta_time',
            '_edit_lock',
            '_edit_last'
        ];
        
        const metaDataToCopy = sourceProduct.meta_data.filter(meta => {
            return !skipMetaKeys.includes(meta.key);
        });
        
        // Build meta data array with updates
        const updatedMetaData = [
            ...metaDataToCopy.map(meta => {
                // Update specific meta fields
                if (meta.key === 'brand') {
                    return { key: meta.key, value: newProductData.brand || meta.value };
                }
                if (meta.key === 'product_subline') {
                    return { key: meta.key, value: newProductData.product_subline || meta.value };
                }
                return meta;
            })
        ];
        
        // Update product with meta data
        await axios.put(
            `${WP_URL}/wp-json/wc/v3/products/${newProduct.id}`,
            { meta_data: updatedMetaData },
            { headers }
        );
        
        console.log(`✅ ${updatedMetaData.length} meta fields copied`);
        
        // Step 6: Handle Yoast SEO data if available
        if (newProductData.yoastSEO) {
            console.log('\n🔍 Setting Yoast SEO data...');
            const yoastMetaData = Object.entries(newProductData.yoastSEO).map(([key, value]) => ({
                key: key,
                value: value
            }));
            
            await axios.put(
                `${WP_URL}/wp-json/wc/v3/products/${newProduct.id}`,
                { meta_data: yoastMetaData },
                { headers }
            );
            console.log('✅ Yoast SEO data set');
        }
        
        // Step 7: Final verification
        console.log('\n🔍 Verifying cloned product...');
        const verifyResponse = await axios.get(
            `${WP_URL}/wp-json/wc/v3/products/${newProduct.id}`,
            { headers }
        );
        
        const finalProduct = verifyResponse.data;
        
        // Display final summary
        console.log('\n✨ CLONE COMPLETED SUCCESSFULLY! ✨');
        console.log('=====================================');
        console.log(`Product Name: ${finalProduct.name}`);
        console.log(`Product ID: ${finalProduct.id}`);
        console.log(`Product URL: ${finalProduct.permalink}`);
        console.log(`Categories: ${finalProduct.categories.map(c => c.name).join(', ')}`);
        console.log(`Meta Fields: ${finalProduct.meta_data.length}`);
        console.log(`Images: ${finalProduct.images.length}`);
        console.log('=====================================\n');
        
        return {
            success: true,
            productId: finalProduct.id,
            productUrl: finalProduct.permalink,
            productSlug: finalProduct.slug,
            productData: finalProduct
        };
        
    } catch (error) {
        console.error('\n❌ Error cloning product:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
        throw error;
    }
}

function generateSlug(name) {
    return name.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

// Terra Nova Bronze configuration
const terraNovaBronzeConfig = {
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
};

// If run directly
if (require.main === module) {
    const sourceId = process.argv[2] || '28624';
    
    console.log('🚀 Starting product clone process...\n');
    
    cloneProductComplete(sourceId, terraNovaBronzeConfig)
        .then(result => {
            console.log('🎉 Process completed successfully!');
            process.exit(0);
        })
        .catch(error => {
            console.error('💥 Process failed:', error.message);
            process.exit(1);
        });
}

module.exports = { cloneProductComplete };