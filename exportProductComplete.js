require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

async function exportProductComplete(productId) {
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
        console.log(`Exporting complete data for product ID: ${productId}`);
        
        // 1. Get WooCommerce product data
        console.log('Fetching WooCommerce data...');
        const wcProduct = await axios.get(`${WP_URL}/wp-json/wc/v3/products/${productId}`, { headers });
        
        // 2. Try to get WordPress post data
        let wpPost = null;
        try {
            console.log('Fetching WordPress post data...');
            wpPost = await axios.get(`${WP_URL}/wp-json/wp/v2/products/${productId}`, { headers });
        } catch (e) {
            console.log('WordPress REST API endpoint not available for products');
        }
        
        // 3. Get all product categories with hierarchy
        console.log('Fetching all product categories...');
        const allCategories = await axios.get(`${WP_URL}/wp-json/wc/v3/products/categories`, {
            headers,
            params: { per_page: 100 }
        });
        
        // 4. Get product tags
        console.log('Fetching product tags...');
        const allTags = await axios.get(`${WP_URL}/wp-json/wc/v3/products/tags`, {
            headers,
            params: { per_page: 100 }
        });
        
        // 5. Try custom REST endpoints for meta/ACF
        let customFields = {};
        try {
            // Try ACF endpoint if available
            const acfResponse = await axios.get(`${WP_URL}/wp-json/acf/v3/products/${productId}`, { headers });
            customFields.acf = acfResponse.data;
        } catch (e) {
            console.log('ACF REST endpoint not available');
        }
        
        // 6. Use WordPress Export API (if available)
        let wpExportData = null;
        try {
            console.log('Attempting WordPress export...');
            const exportResponse = await axios.post(`${WP_URL}/wp-json/wordpress-exporter/v1/export`, {
                content: 'products',
                post__in: [productId]
            }, { headers });
            wpExportData = exportResponse.data;
        } catch (e) {
            console.log('WordPress Export API not available');
        }
        
        // 7. Compile all data
        const completeExport = {
            productId: productId,
            exportDate: new Date().toISOString(),
            woocommerce: wcProduct.data,
            wordpress: wpPost ? wpPost.data : null,
            categories: {
                productCategories: wcProduct.data.categories,
                allAvailable: allCategories.data
            },
            tags: {
                productTags: wcProduct.data.tags,
                allAvailable: allTags.data
            },
            customFields: customFields,
            metaData: wcProduct.data.meta_data,
            yoastSEO: extractYoastData(wcProduct.data),
            wpExport: wpExportData,
            images: wcProduct.data.images,
            attributes: wcProduct.data.attributes,
            variations: wcProduct.data.variations || []
        };
        
        // Save to file
        const filename = `product-export-complete-${productId}.json`;
        fs.writeFileSync(filename, JSON.stringify(completeExport, null, 2));
        
        console.log(`\n✅ Export completed successfully!`);
        console.log(`📁 Data saved to: ${filename}`);
        
        // Display summary
        console.log('\n📊 Export Summary:');
        console.log(`- Product Name: ${wcProduct.data.name}`);
        console.log(`- Product ID: ${productId}`);
        console.log(`- Categories: ${wcProduct.data.categories.map(c => c.name).join(', ')}`);
        console.log(`- Meta Data Fields: ${wcProduct.data.meta_data.length}`);
        console.log(`- Images: ${wcProduct.data.images.length}`);
        
        return completeExport;
        
    } catch (error) {
        console.error('Error during export:', error.message);
        if (error.response) {
            console.error('Response:', error.response.data);
        }
        throw error;
    }
}

function extractYoastData(product) {
    const yoastMeta = {};
    
    // Extract from meta_data
    product.meta_data.forEach(meta => {
        if (meta.key.startsWith('_yoast_')) {
            yoastMeta[meta.key] = meta.value;
        }
    });
    
    // Add structured data
    yoastMeta.yoast_head = product.yoast_head || '';
    yoastMeta.yoast_head_json = product.yoast_head_json || {};
    
    return yoastMeta;
}

// If run directly
if (require.main === module) {
    const productId = process.argv[2];
    
    if (!productId) {
        console.error('Please provide a product ID');
        console.log('Usage: node exportProductComplete.js <product-id>');
        process.exit(1);
    }
    
    exportProductComplete(productId)
        .then(() => {
            console.log('\nExport completed!');
        })
        .catch(error => {
            console.error('\nExport failed:', error.message);
            process.exit(1);
        });
}

module.exports = { exportProductComplete };