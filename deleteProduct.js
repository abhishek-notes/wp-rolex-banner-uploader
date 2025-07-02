require('dotenv').config();
const axios = require('axios');

async function deleteProduct(productId) {
    const { WP_USER, APP_PASSWORD, WP_URL } = process.env;
    
    if (!WP_USER || !APP_PASSWORD || !WP_URL) {
        throw new Error('Missing required environment variables');
    }

    const authHeader = Buffer.from(`${WP_USER}:${APP_PASSWORD}`).toString('base64');

    try {
        const response = await axios.delete(`${WP_URL}/wp-json/wc/v3/products/${productId}`, {
            headers: {
                'Authorization': `Basic ${authHeader}`
            },
            params: {
                force: true // Permanently delete
            }
        });
        
        console.log(`✅ Product ${productId} deleted successfully`);
        return response.data;
    } catch (error) {
        console.error(`❌ Error deleting product ${productId}:`, error.message);
        throw error;
    }
}

// If run directly
if (require.main === module) {
    const productId = process.argv[2];
    
    if (!productId) {
        console.error('Please provide a product ID to delete');
        process.exit(1);
    }
    
    deleteProduct(productId)
        .then(() => console.log('Done'))
        .catch(error => process.exit(1));
}

module.exports = { deleteProduct };