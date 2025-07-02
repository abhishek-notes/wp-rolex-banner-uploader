const fs = require('fs');
const path = require('path');

// Blog mapping based on provided titles
const BLOG_MAPPING = {
    'Lemans': {
        title: 'THE 24 HOURS OF LE MANS',
        slug: 'le-mans-24-hours',
        category: 'Motorsports',
        description: '24 Hours of Le Mans endurance racing'
    },
    'The Championships_Wimbledon': {
        title: 'THE CHAMPIONSHIPS, WIMBLEDON',
        slug: 'wimbledon-championships',
        category: 'Tennis',
        description: 'Wimbledon Tennis Championships'
    },
    'The Amundi Evian Championship': {
        title: 'THE AMUNDI EVIAN CHAMPIONSHIP',
        slug: 'amundi-evian-championship',
        category: 'Golf',
        description: 'Amundi Evian Championship Ladies Golf'
    },
    'The Open': {
        title: 'THE OPEN: GOLF\'S OLDEST MAJOR',
        slug: 'the-open-golf-major',
        category: 'Golf',
        description: 'The Open Championship Golf'
    },
    'US Open': {
        title: 'US OPEN',
        slug: 'us-open-tennis',
        category: 'Tennis',
        description: 'US Open Tennis Championships'
    },
    'SailGP': {
        title: 'THE ROLEX SAILGP CHAMPIONSHIP',
        slug: 'rolex-sailgp-championship',
        category: 'Sailing',
        description: 'Rolex SailGP Racing Championship'
    },
    'VPO': {
        title: 'VIENNA PHILHARMONIC ORCHESTRA',
        slug: 'vienna-philharmonic-orchestra',
        category: 'Culture',
        description: 'Vienna Philharmonic Orchestra Partnership'
    },
    'RGSSJ': {
        title: 'ROLEX GRAND SLAM OF SHOW JUMPING',
        slug: 'rolex-grand-slam-show-jumping',
        category: 'Equestrian',
        description: 'Rolex Grand Slam of Show Jumping'
    }
};

function generateNewFilename(folderName, device) {
    const blog = BLOG_MAPPING[folderName];
    if (!blog) {
        throw new Error(`Unknown blog folder: ${folderName}`);
    }
    
    // Format: {Category}-Blog-{slug}-{device}-Rolex-Palladio.jpg
    return `${blog.category}-Blog-${blog.slug}-${device}-Rolex-Palladio.jpg`;
}

function generateMetadata(folderName, device) {
    const blog = BLOG_MAPPING[folderName];
    if (!blog) {
        throw new Error(`Unknown blog folder: ${folderName}`);
    }
    
    const deviceText = device.charAt(0).toUpperCase() + device.slice(1);
    
    return {
        title: `${blog.title} Blog - ${deviceText} - Rolex at Palladio Jewellers`,
        altText: `Rolex at Palladio Jewellers - ${blog.title} Blog - ${deviceText}`,
        caption: `${blog.title} - Rolex Brand Activation Blog - Palladio Jewellers Official Rolex Retailer`,
        description: `${deviceText} featured image for ${blog.title} blog article showcasing ${blog.description} at Palladio Jewellers, Official Rolex Retailer in Vancouver. Part of Rolex Brand Activation Digital Commercial series June 2025.`,
        slug: blog.slug,
        category: blog.category,
        keywords: [
            'Rolex',
            'Palladio Jewellers',
            blog.category,
            blog.title.split(' ').join(', '),
            'Brand Activation',
            'Digital Commercial',
            'Vancouver',
            'Official Rolex Retailer'
        ].join(', ')
    };
}

function analyzeCurrentImages() {
    const sourceDir = './images/RBA_Articles_images_20250605';
    const analysis = [];
    
    try {
        const folders = fs.readdirSync(sourceDir);
        
        folders.forEach(folderName => {
            const folderPath = path.join(sourceDir, folderName);
            if (fs.statSync(folderPath).isDirectory()) {
                const files = fs.readdirSync(folderPath);
                
                files.forEach(filename => {
                    const filePath = path.join(folderPath, filename);
                    const device = filename.includes('desktop') ? 'desktop' : 'mobile';
                    
                    try {
                        const newFilename = generateNewFilename(folderName, device);
                        const metadata = generateMetadata(folderName, device);
                        
                        analysis.push({
                            originalPath: filePath,
                            originalFilename: filename,
                            folderName: folderName,
                            device: device,
                            newFilename: newFilename,
                            blogTitle: BLOG_MAPPING[folderName].title,
                            metadata: metadata
                        });
                    } catch (error) {
                        console.warn(`⚠️  Skipping ${filename}: ${error.message}`);
                    }
                });
            }
        });
        
        return analysis;
    } catch (error) {
        console.error('❌ Error analyzing images:', error.message);
        return [];
    }
}

function displayRenamePreview() {
    console.log('🔍 BLOG IMAGES RENAME PREVIEW');
    console.log('===============================\\n');
    
    const analysis = analyzeCurrentImages();
    
    if (analysis.length === 0) {
        console.log('❌ No images found to analyze');
        return;
    }
    
    // Group by blog
    const blogGroups = {};
    analysis.forEach(item => {
        if (!blogGroups[item.folderName]) {
            blogGroups[item.folderName] = [];
        }
        blogGroups[item.folderName].push(item);
    });
    
    Object.keys(blogGroups).forEach(folderName => {
        const blog = BLOG_MAPPING[folderName];
        console.log(`📝 ${blog.title}`);
        console.log(`   Category: ${blog.category}`);
        console.log(`   Images: ${blogGroups[folderName].length}\\n`);
        
        blogGroups[folderName].forEach(item => {
            console.log(`   📷 ${item.device.toUpperCase()}`);
            console.log(`      Original: ${item.originalFilename}`);
            console.log(`      New Name: ${item.newFilename}`);
            console.log(`      Title: ${item.metadata.title}`);
            console.log(`      Alt Text: ${item.metadata.altText}\\n`);
        });
        
        console.log('   ─────────────────────────────────────\\n');
    });
    
    // Save analysis to file
    fs.writeFileSync('blog-images-rename-analysis.json', JSON.stringify(analysis, null, 2));
    console.log(`📁 Full analysis saved to: blog-images-rename-analysis.json`);
    console.log(`\\n📊 SUMMARY`);
    console.log(`   Total Images: ${analysis.length}`);
    console.log(`   Blog Articles: ${Object.keys(blogGroups).length}`);
    console.log(`   Ready for Rename: ${analysis.length}`);
}

if (require.main === module) {
    displayRenamePreview();
}

module.exports = { 
    BLOG_MAPPING, 
    generateNewFilename, 
    generateMetadata, 
    analyzeCurrentImages 
};