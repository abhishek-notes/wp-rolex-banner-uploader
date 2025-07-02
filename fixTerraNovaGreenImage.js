require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');

// WordPress/WooCommerce API configuration  
const WP_URL = process.env.WP_URL;
const WP_USER = process.env.WP_USER;
const APP_PASSWORD = process.env.APP_PASSWORD;

const authHeader = Buffer.from(`${WP_USER}:${APP_PASSWORD}`).toString('base64');

// Terra Nova 40.5 Date Green Dial product that needs image fix
const PRODUCT_TO_FIX = {
    productId: 28642,
    name: 'Terra Nova 40.5 Date, Green Dial',
    correctImage: 'Bremont_TerraNova_TN40-DT-SS-GN-L-S.webp'
};

async function uploadImageToWordPress(imagePath, filename) {
    console.log(`📤 Uploading image: ${filename}`);
    
    try {
        const imageBuffer = fs.readFileSync(imagePath);
        const formData = new FormData();
        formData.append('file', imageBuffer, {
            filename: filename,
            contentType: 'image/webp'
        });

        const response = await axios.post(`${WP_URL}/wp-json/wp/v2/media`, formData, {
            headers: {
                'Authorization': `Basic ${authHeader}`,
                ...formData.getHeaders(),
                'Content-Disposition': `attachment; filename="${filename}"`
            }
        });

        console.log(`✅ Image uploaded successfully: ID ${response.data.id}`);
        return response.data;
    } catch (error) {
        console.error(`❌ Failed to upload image ${filename}:`, error.response?.data || error.message);
        throw error;
    }
}

async function updateProductImage(productId, imageId) {
    console.log(`🔗 Setting image ${imageId} for product ${productId}`);
    
    try {
        const response = await axios.put(`${WP_URL}/wp-json/wc/v3/products/${productId}`, {
            images: [{ id: imageId }]
        }, { 
            headers: {
                'Authorization': `Basic ${authHeader}`,
                'Content-Type': 'application/json'
            }
        });

        console.log(`✅ Product image updated successfully`);
        return response.data;
    } catch (error) {
        console.error(`❌ Failed to update product image:`, error.response?.data || error.message);
        throw error;
    }
}

async function fixTerraNovaGreenImage() {
    console.log('🚀 FIXING TERRA NOVA 40.5 DATE GREEN DIAL IMAGE');
    console.log('===============================================');
    console.log(`🔧 Product: ${PRODUCT_TO_FIX.name} (ID: ${PRODUCT_TO_FIX.productId})`);
    console.log(`🖼️  Image: ${PRODUCT_TO_FIX.correctImage}\n`);
    
    const imageDir = './images/Bremont_Processed_901x1201_WEBP_IMPROVED_TRANSPARENT/';
    const imagePath = path.join(imageDir, PRODUCT_TO_FIX.correctImage);
    
    // Check if image file exists
    if (!fs.existsSync(imagePath)) {
        console.log(`❌ Image file not found: ${imagePath}`);
        return false;
    }
    
    try {
        // Upload image to WordPress
        const uploadedImage = await uploadImageToWordPress(imagePath, PRODUCT_TO_FIX.correctImage);
        
        // Update product with the new image
        await updateProductImage(PRODUCT_TO_FIX.productId, uploadedImage.id);
        
        console.log(`\n✅ Successfully fixed image for ${PRODUCT_TO_FIX.name}`);
        console.log(`🔗 Product URL: https://staging-palladiocanadacom-staging.kinsta.cloud/product/watch/bremont/terra-nova/terra-nova-40-5-date-green-dial/`);
        
        const result = {
            ...PRODUCT_TO_FIX,
            success: true,
            uploadedImageId: uploadedImage.id,
            timestamp: new Date().toISOString()
        };
        
        // Save result
        fs.writeFileSync('terra-nova-green-fix-result.json', JSON.stringify(result, null, 2));
        console.log(`📁 Results saved to: terra-nova-green-fix-result.json`);
        
        return true;
        
    } catch (error) {
        console.error(`❌ Failed to fix image for ${PRODUCT_TO_FIX.name}:`, error.message);
        
        const result = {
            ...PRODUCT_TO_FIX,
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        };
        
        fs.writeFileSync('terra-nova-green-fix-result.json', JSON.stringify(result, null, 2));
        return false;
    }
}

if (require.main === module) {
    fixTerraNovaGreenImage()
        .then((success) => {
            if (success) {
                console.log('\n🎯 Terra Nova Green Dial image fix completed successfully!');
            } else {
                console.log('\n💥 Terra Nova Green Dial image fix failed!');
            }
            process.exit(success ? 0 : 1);
        })
        .catch(error => {
            console.error('💥 Image fixing process failed:', error.message);
            process.exit(1);
        });
}

module.exports = { fixTerraNovaGreenImage, PRODUCT_TO_FIX };