require('dotenv').config();
const axios = require('axios');

async function fetchProductBySlug(slug) {
    const { WP_USER, APP_PASSWORD, WP_URL } = process.env;
    
    if (!WP_USER || !APP_PASSWORD || !WP_URL) {
        throw new Error('Missing required environment variables');
    }

    const authHeader = Buffer.from(`${WP_USER}:${APP_PASSWORD}`).toString('base64');

    try {
        // First, get the product by slug
        const productsResponse = await axios.get(`${WP_URL}/wp-json/wc/v3/products`, {
            headers: {
                'Authorization': `Basic ${authHeader}`
            },
            params: {
                slug: slug,
                per_page: 1
            }
        });

        if (!productsResponse.data || productsResponse.data.length === 0) {
            throw new Error(`Product with slug "${slug}" not found`);
        }

        const product = productsResponse.data[0];

        // Fetch complete product data including all metadata
        const fullProductResponse = await axios.get(`${WP_URL}/wp-json/wc/v3/products/${product.id}`, {
            headers: {
                'Authorization': `Basic ${authHeader}`
            }
        });

        const fullProduct = fullProductResponse.data;

        // Try to fetch custom fields - handle if endpoint doesn't exist
        let postData = {};
        try {
            const postResponse = await axios.get(`${WP_URL}/wp-json/wp/v2/products/${product.id}`, {
                headers: {
                    'Authorization': `Basic ${authHeader}`
                }
            });
            postData = postResponse.data;
        } catch (postError) {
            console.log('Note: Could not fetch additional post data (this is normal for some setups)');
        }

        // Combine all data
        return {
            woocommerce: fullProduct,
            wordpress: postData,
            categories: fullProduct.categories,
            tags: fullProduct.tags,
            attributes: fullProduct.attributes,
            meta_data: fullProduct.meta_data,
            acf: postData.acf || {},
            yoast: postData.yoast_head_json || {}
        };

    } catch (error) {
        console.error('Error fetching product:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
        throw error;
    }
}

// Export for use in other scripts
module.exports = { fetchProductBySlug };

// If run directly, fetch the Terra Nova product
if (require.main === module) {
    const slug = process.argv[2] || 'terra-nova-42-5-chronograph-bracelet';
    
    fetchProductBySlug(slug)
        .then(data => {
            console.log('Product data fetched successfully:');
            console.log(JSON.stringify(data, null, 2));
            
            // Save to file for reference
            const fs = require('fs');
            fs.writeFileSync(`product-data-${slug}.json`, JSON.stringify(data, null, 2));
            console.log(`\nProduct data saved to product-data-${slug}.json`);
        })
        .catch(error => {
            console.error('Failed to fetch product:', error.message);
            process.exit(1);
        });
}