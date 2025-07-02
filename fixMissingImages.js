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

// Products that need image fixes with their correct image matches
const PRODUCTS_TO_FIX = [
    {
        productId: 28672,
        name: 'Altitude 39, Black Leather Strap',
        refNo: 'ALT1-C-39-BK-L',
        correctImage: 'Bremont_Altitude_39DateLeather_ALT39-DT-SS-BK-L-S.webp'
    },
    {
        productId: 28673,
        name: 'Altitude 39, Steel Bracelet', 
        refNo: 'ALT1-C-39-BK-B',
        correctImage: 'Bremont_Altitude_39DateBracelet_ALT39-DT-SS-BK-B.webp'
    },
    {
        productId: 28674,
        name: 'Altitude 39, Silver Leather Strap',
        refNo: 'ALT1-C-39-SL-L', 
        correctImage: 'Bremont_Altitude_39DateLeather_ALT39-DT-SS-SI-L-S.webp'
    },
    {
        productId: 28664,
        name: 'Altitude GMT, Silver',
        refNo: 'ALT1-ZT-GMT-SL-B',
        correctImage: 'Bremont_Altitude_ChronographSilverBracelet_ALT42-CHR-G-SS-SI-B.webp'
    }
];

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

async function fixProductImage(productInfo) {
    console.log(`\n🔧 Fixing image for: ${productInfo.name}`);
    
    const imageDir = './images/Bremont_Processed_901x1201_WEBP_IMPROVED_TRANSPARENT/';
    const imagePath = path.join(imageDir, productInfo.correctImage);
    
    // Check if image file exists
    if (!fs.existsSync(imagePath)) {
        console.log(`❌ Image file not found: ${imagePath}`);
        return false;
    }
    
    try {
        // Upload image to WordPress
        const uploadedImage = await uploadImageToWordPress(imagePath, productInfo.correctImage);
        
        // Update product with the new image
        await updateProductImage(productInfo.productId, uploadedImage.id);
        
        console.log(`✅ Successfully fixed image for ${productInfo.name}`);
        return true;
        
    } catch (error) {
        console.error(`❌ Failed to fix image for ${productInfo.name}:`, error.message);
        return false;
    }
}

async function fixAllMissingImages() {
    console.log('🚀 FIXING MISSING BREMONT PRODUCT IMAGES');
    console.log('=========================================');
    console.log(`📊 Products to fix: ${PRODUCTS_TO_FIX.length}\n`);
    
    const results = [];
    
    for (const productInfo of PRODUCTS_TO_FIX) {
        const success = await fixProductImage(productInfo);
        results.push({
            ...productInfo,
            success: success,
            timestamp: new Date().toISOString()
        });
        
        // Wait between requests to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
    
    // Save results
    fs.writeFileSync('image-fix-results.json', JSON.stringify(results, null, 2));
    
    console.log('\n📊 IMAGE FIX SUMMARY');
    console.log('===================');
    console.log(`✅ Successfully fixed: ${results.filter(r => r.success).length}`);
    console.log(`❌ Failed to fix: ${results.filter(r => !r.success).length}`);
    console.log(`📁 Results saved to: image-fix-results.json`);
    
    return results;
}

if (require.main === module) {
    fixAllMissingImages()
        .then(() => {
            console.log('\n🎯 Image fixing process completed!');
            process.exit(0);
        })
        .catch(error => {
            console.error('💥 Image fixing process failed:', error.message);
            process.exit(1);
        });
}

module.exports = { fixAllMissingImages, PRODUCTS_TO_FIX };