require('dotenv').config();
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const { BLOG_MAPPING, generateNewFilename, generateMetadata, analyzeCurrentImages } = require('./renameBlogImages');

// WordPress configuration
const WP_URL = process.env.WP_URL;
const WP_USER = process.env.WP_USER;
const APP_PASSWORD = process.env.APP_PASSWORD;

if (!WP_URL || !WP_USER || !APP_PASSWORD) {
    console.error('❌ Missing required environment variables');
    process.exit(1);
}

const authHeader = Buffer.from(`${WP_USER}:${APP_PASSWORD}`).toString('base64');

async function uploadImageToWordPress(imagePath, filename, metadata) {
    console.log(`📤 Uploading: ${filename}`);
    
    try {
        const imageBuffer = fs.readFileSync(imagePath);
        const formData = new FormData();
        
        formData.append('file', imageBuffer, {
            filename: filename,
            contentType: 'image/jpeg'
        });
        
        formData.append('title', metadata.title);
        formData.append('alt_text', metadata.altText);
        formData.append('caption', metadata.caption);
        formData.append('description', metadata.description);

        const response = await axios.post(
            `${WP_URL}/wp-json/wp/v2/media`,
            formData,
            {
                headers: {
                    'Authorization': `Basic ${authHeader}`,
                    ...formData.getHeaders()
                }
            }
        );

        console.log(`✅ Uploaded successfully: ID ${response.data.id}`);
        
        return {
            success: true,
            mediaId: response.data.id,
            url: response.data.source_url,
            filename: filename
        };
        
    } catch (error) {
        console.error(`❌ Failed to upload ${filename}:`, error.response?.data || error.message);
        return {
            success: false,
            filename: filename,
            error: error.message
        };
    }
}

async function copyAndRenameImage(sourcePath, destPath) {
    try {
        await fs.promises.copyFile(sourcePath, destPath);
        return true;
    } catch (error) {
        console.error(`❌ Failed to copy file: ${error.message}`);
        return false;
    }
}

async function processBlogImages() {
    console.log('🚀 STARTING BLOG IMAGES UPLOAD PROCESS');
    console.log('=====================================\n');
    
    const analysis = analyzeCurrentImages();
    
    // Filter out .DS_Store files
    const validImages = analysis.filter(item => 
        !item.originalFilename.includes('.DS_Store') && 
        item.originalFilename.endsWith('.jpg')
    );
    
    console.log(`📊 Found ${validImages.length} valid images to process\n`);
    
    // Create renamed directory
    const renamedDir = './images/RBA_Articles_Renamed';
    if (!fs.existsSync(renamedDir)) {
        fs.mkdirSync(renamedDir, { recursive: true });
    }
    
    const results = [];
    let successCount = 0;
    let errorCount = 0;
    
    // Group by blog for organized processing
    const blogGroups = {};
    validImages.forEach(item => {
        if (!blogGroups[item.blogTitle]) {
            blogGroups[item.blogTitle] = [];
        }
        blogGroups[item.blogTitle].push(item);
    });
    
    // Process each blog's images
    for (const [blogTitle, images] of Object.entries(blogGroups)) {
        console.log(`\n📝 Processing: ${blogTitle}`);
        console.log(`   Images: ${images.length}`);
        console.log('   ─────────────────────────────\n');
        
        for (const imageData of images) {
            const destPath = path.join(renamedDir, imageData.newFilename);
            
            // Copy and rename file
            console.log(`   📋 Renaming: ${imageData.originalFilename} → ${imageData.newFilename}`);
            const copySuccess = await copyAndRenameImage(imageData.originalPath, destPath);
            
            if (!copySuccess) {
                errorCount++;
                results.push({
                    ...imageData,
                    uploaded: false,
                    error: 'Failed to copy/rename file'
                });
                continue;
            }
            
            // Upload to WordPress
            const uploadResult = await uploadImageToWordPress(
                destPath,
                imageData.newFilename,
                imageData.metadata
            );
            
            if (uploadResult.success) {
                successCount++;
                results.push({
                    ...imageData,
                    uploaded: true,
                    mediaId: uploadResult.mediaId,
                    url: uploadResult.url
                });
            } else {
                errorCount++;
                results.push({
                    ...imageData,
                    uploaded: false,
                    error: uploadResult.error
                });
            }
            
            // Wait between uploads to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    
    // Save results
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const resultsFile = `blog-images-upload-results-${timestamp}.json`;
    fs.writeFileSync(resultsFile, JSON.stringify(results, null, 2));
    
    // Display summary
    console.log('\n\n📊 UPLOAD SUMMARY');
    console.log('=================');
    console.log(`✅ Successfully uploaded: ${successCount}`);
    console.log(`❌ Failed uploads: ${errorCount}`);
    console.log(`📁 Results saved to: ${resultsFile}`);
    console.log(`📁 Renamed images in: ${renamedDir}`);
    
    // Display results by blog
    console.log('\n📋 DETAILED RESULTS BY BLOG:');
    console.log('============================\n');
    
    for (const [blogTitle, images] of Object.entries(blogGroups)) {
        const blogResults = results.filter(r => r.blogTitle === blogTitle);
        const blogSuccess = blogResults.filter(r => r.uploaded).length;
        
        console.log(`${blogTitle}`);
        console.log(`   ✅ Uploaded: ${blogSuccess}/${blogResults.length}`);
        
        blogResults.forEach(result => {
            if (result.uploaded) {
                console.log(`   📷 ${result.device}: Media ID ${result.mediaId}`);
            } else {
                console.log(`   ❌ ${result.device}: ${result.error}`);
            }
        });
        console.log('');
    }
    
    return results;
}

// Execute if run directly
if (require.main === module) {
    processBlogImages()
        .then(() => {
            console.log('\n🎯 Blog images upload process completed!');
            process.exit(0);
        })
        .catch(error => {
            console.error('💥 Process failed:', error.message);
            process.exit(1);
        });
}

module.exports = { processBlogImages };