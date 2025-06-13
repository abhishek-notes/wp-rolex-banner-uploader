# Blog Content Images Upload Guide

## 🎯 PURPOSE

This guide covers uploading **blog content images** (images that appear within blog posts) as opposed to blog banners. These are the individual images that illustrate different sections of blog content, similar to show jumping blog images.

---

## 🔍 IDENTIFYING BLOG CONTENT IMAGES

### Blog Content Images vs Blog Banners vs Hub Feature Images

**Blog Content Images:**
- Individual photos for specific blog sections
- Various dimensions (not standardized banner dimensions)
- Named by subject/content (e.g., `rolex-endurance-jamie-chadwick-landscape.jpg`)
- Multiple images per blog post covering different topics

**Blog Banners:**
- Standardized dimensions (4000x1840, 3360x840, 1280x1760, etc.)
- Used as page headers/banners
- Fewer variants (typically 2-4 per blog)
- Named with "Banner" in the title

**Hub Feature Images:**
- Single thumbnail/feature image for blog hub/category
- Typically wide format (e.g., 2400x800)
- Named with blog topic and "world-of-rolex" or similar hub identifiers
- Used for blog section navigation and social previews

---

## 🚀 WORKFLOW FOR BLOG CONTENT IMAGES

### Step 1: Identify Content Images
Look for files with descriptive subject names rather than banner dimensions:
```
✅ Blog Content: rolex-endurance-jamie-chadwick-landscape.jpg
✅ Blog Content: rolex-endurance-lemans-circuit-portrait.jpg
✅ Hub Feature: Endurance-24hr_Le_Mans-world-of-rolex-at-Palladio-Jewellers.jpg
❌ Blog Banner: RBA_Endurance_Website_Banner_4000x1840.jpg
```

### Step 2: Use Appropriate Upload Script
Choose the correct script based on image type:

**For Blog Content Images:**
```bash
# Copy content images to source-images/
cp images/rolex-[blog-topic]-*.jpg source-images/

# Run the blog content upload script
node uploadEnduranceContent.js
```

**For Hub Feature Images:**
```bash
# Copy hub feature image to source-images/
cp images/*world-of-rolex*.jpg source-images/

# Run the hub feature upload script
node uploadHubFeatureImage.js
```

### Step 3: Content Classification
The script automatically identifies content by filename patterns and creates appropriate metadata:

#### Endurance Blog Content Types:
- **Daytona**: `DAYT25zs_00542` → "Rolex Cosmograph Daytona"
- **Le Mans Event**: `LEMANS_2406aw_0393` → "Le Mans 24 Hours"
- **Jamie Chadwick**: `jchadwick2503bh_301` → "Jamie Chadwick"
- **Le Mans Circuit**: `lemans17js_0048` → "Le Mans Circuit"
- **Tom Kristensen**: `tkristensen2501cc_1568` → "Tom Kristensen"
- **Collection Cover**: `rolex-collection_banner-the-cosmograph-daytona-cover` → "Cosmograph Daytona Collection"

---

## 📝 NAMING CONVENTIONS

### Generated Filename Pattern
```
Endurance-Blog-{subject-slug}-{orientation}-Rolex-Palladio.jpg
```

### Examples
- `Endurance-Blog-jamie-chadwick-landscape-Rolex-Palladio.jpg`
- `Endurance-Blog-le-mans-24-hours-portrait-Rolex-Palladio.jpg`
- `Endurance-Blog-cosmograph-daytona-collection-landscape-Rolex-Palladio.jpg`

### Hub Feature Images
```
{BlogTopic}-Blog-Hub-{subject}-Feature-Rolex-Palladio.jpg
```

### Examples
- `Endurance-Blog-Hub-Le-Mans-24hr-Feature-Rolex-Palladio.jpg`

### Metadata Patterns

#### Blog Content Images
- **Title**: `Endurance Blog - {Subject} - {Orientation} - Rolex at Palladio Jewellers`
- **Alt Text**: `Rolex at Palladio Jewellers - Endurance Blog - {Subject} {Orientation}`
- **Caption**: `{Subject} - Endurance Blog - Palladio Jewellers Official Rolex Retailer`
- **Description**: `{Orientation} image of {description} for the Endurance blog at Palladio Jewellers, Official Rolex Retailer in Vancouver.`

#### Hub Feature Images
- **Title**: `{BlogTopic} Blog Hub - {Subject} Feature Image - Rolex at Palladio Jewellers - Official Rolex Retailer`
- **Alt Text**: `Rolex at Palladio Jewellers - {BlogTopic} Blog Hub - {Subject} Feature`
- **Caption**: `{BlogTopic} Blog Hub Feature - {Subject} - Palladio Jewellers Official Rolex Retailer Vancouver`
- **Description**: `Hub feature image for the {BlogTopic} blog showcasing {subject description} at Palladio Jewellers, Official Rolex Retailer in Vancouver.`

---

## 🛠 TECHNICAL IMPLEMENTATION

### Upload Script Features

#### uploadEnduranceContent.js (Blog Content)
1. **Content Mapping**: Maps filename patterns to subjects and descriptions
2. **Intelligent Naming**: Generates SEO-friendly filenames
3. **Orientation Detection**: Automatically detects landscape vs portrait
4. **Metadata Generation**: Creates appropriate titles, alt text, captions, descriptions
5. **WordPress Upload**: Uses REST API with proper authentication
6. **Cleanup**: Removes source files after successful upload

#### uploadHubFeatureImage.js (Hub Features)
1. **Hub Detection**: Identifies hub feature images by filename patterns
2. **Specialized Naming**: Generates hub-specific filenames
3. **Feature Metadata**: Creates hub-appropriate metadata
4. **Thumbnail Optimization**: Handles typical hub image dimensions (e.g., 2400x800)
5. **WordPress Upload**: Uses REST API with proper authentication
6. **URL Reporting**: Returns WordPress URL for immediate use

### Key Functions

```javascript
// Content identification
const contentMapping = {
    'pattern': {
        subject: 'Display Name',
        context: 'Context',
        description: 'Detailed description'
    }
};

// Filename generation
function generateFilename(originalFilename) {
    const orientation = originalFilename.includes('landscape') ? 'landscape' : 'portrait';
    const baseKey = Object.keys(contentMapping).find(key => originalFilename.includes(key));
    // Returns: Endurance-Blog-{subject-slug}-{orientation}-Rolex-Palladio.jpg
}

// Metadata generation
function generateMetadata(filename, orientation) {
    // Returns structured metadata object
}
```

---

## 📊 SUCCESS METRICS

### Expected Results
- **Content Images**: All subject images uploaded (landscape + portrait variants)
- **Proper Naming**: SEO-friendly filenames following Palladio conventions
- **Complete Metadata**: Title, alt text, caption, description for each image
- **WordPress IDs**: All uploads receive valid media IDs
- **File Cleanup**: Source images cleaned up automatically

### Endurance Blog Example
✅ **12/12 images uploaded successfully**
- Daytona: 2 images (landscape + portrait)
- Le Mans 24 Hours: 2 images
- Jamie Chadwick: 2 images
- Le Mans Circuit: 2 images
- Tom Kristensen: 2 images
- Collection Cover: 2 images

WordPress IDs: 28584-28593, 28597-28598

---

## 🔄 WORKFLOW COMPARISON

### Banner Upload Workflow
```bash
# For standardized blog banners
node autoUploader.js blog --title "Blog Post Title"
# Results: 2-4 banner variants with standard dimensions
```

### Content Image Workflow
```bash
# For blog content images (individual photos)
cp images/rolex-[topic]-*.jpg source-images/
node uploadEnduranceContent.js
# Results: Multiple content images organized by subject
```

### Hub Feature Image Workflow
```bash
# For blog hub/thumbnail feature images
cp images/*world-of-rolex*.jpg source-images/
node uploadHubFeatureImage.js
# Results: Single hub feature image with thumbnail metadata
```

---

## 📚 EXTENDING FOR OTHER BLOGS

### Creating New Blog Content Handlers

1. **Copy and modify** `uploadEnduranceContent.js`
2. **Update contentMapping** with new blog topics
3. **Adjust naming patterns** if needed
4. **Test with sample images**

### Example for Show Jumping Blog
```javascript
const contentMapping = {
    'showjumping-event': {
        subject: 'Show Jumping Event',
        context: 'Equestrian Sport',
        description: 'Show jumping competition featuring Rolex partnerships'
    },
    'rider-profile': {
        subject: 'Professional Rider',
        context: 'Equestrian Athlete',
        description: 'Professional show jumping rider and Rolex ambassador'
    }
};
```

---

## ⚠️ IMPORTANT DISTINCTIONS

### When to Use Each Method

**Use `autoUploader.js blog`** for:
- Blog page banners/headers
- Standardized dimensions (4000x1840, 3360x840, 1280x1760)
- 2-4 banner variants per blog

**Use `uploadEnduranceContent.js`** (or similar) for:
- Individual blog content images
- Multiple subjects within one blog post
- Various image dimensions
- Content-specific naming and metadata

**Use `uploadHubFeatureImage.js`** for:
- Blog hub/category thumbnail images
- Single feature image per blog topic
- Hub navigation thumbnails
- Social media preview images

### File Organization
```
Blog Structure:
├── Blog Banners (autoUploader.js blog)
│   ├── Homepage Desktop (4000x1840)
│   ├── Homepage Mobile (1280x1760)
│   ├── Discover Page Desktop (3360x840)
│   └── Discover Page Mobile (1280x1760)
├── Blog Content Images (uploadEnduranceContent.js)
│   ├── Subject 1 (landscape + portrait)
│   ├── Subject 2 (landscape + portrait)
│   ├── Subject 3 (landscape + portrait)
│   └── ...
└── Hub Feature Image (uploadHubFeatureImage.js)
    └── Blog Hub Thumbnail (2400x800 or similar)
```

---

## 🎯 BEST PRACTICES

1. **Separate Workflows**: Use appropriate script for content type
2. **Descriptive Filenames**: Ensure source files have clear subject indicators
3. **Orientation Variants**: Provide both landscape and portrait when possible
4. **Content Mapping**: Update mapping for new blog topics
5. **Metadata Quality**: Ensure descriptions are accurate and SEO-friendly
6. **Testing**: Test uploads with small batches first
7. **Documentation**: Update this guide for new blog types

---

*This workflow ensures blog content images are properly organized, named, and uploaded with appropriate metadata for the Palladio Jewellers WordPress site.*