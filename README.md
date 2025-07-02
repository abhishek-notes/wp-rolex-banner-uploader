# WordPress Image Upload & Product Management Suite

A comprehensive WordPress automation toolkit for Palladio Jewellers featuring AI-powered image uploads and complete product cloning capabilities. Supports Rolex banner images, blog content, and WooCommerce product management.

## Features

### Image Upload System
- 🤖 **AI-Powered Metadata Generation**: Uses Claude AI to generate proper filenames, alt text, titles, captions, and descriptions
- 🔍 **Intelligent Image Detection**: Automatically identifies desktop vs mobile images by dimensions
- 📱 **Multi-Variant Support**: Generates 4 variants for monthly banners (Homepage Desktop/Mobile, Discover Page Desktop/Mobile)
- 🏷️ **Model Number Extraction**: Automatically extracts Rolex model numbers from filenames
- 📂 **File Management**: Automatically renames, processes, and uploads images
- 🧹 **Cleanup**: Removes source files after successful upload

### Product Management System
- 🛍️ **Complete Product Cloning**: Clone WooCommerce products with all data preserved
- 📊 **Full Data Export**: Export complete product data including categories, meta fields, SEO
- 🏷️ **Category & Tag Management**: Preserve complex category hierarchies and relationships
- 🖼️ **Image Handling**: Upload and link product images automatically
- 🔍 **SEO Preservation**: Maintain Yoast SEO settings and meta data
- ⚙️ **Custom Field Support**: Copy all meta data, custom fields, and theme settings

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables by copying `.env.example` to `.env` and filling in your credentials:
```bash
cp .env.example .env
```

Required environment variables:
- `WP_USER`: WordPress username
- `APP_PASSWORD`: WordPress application password
- `WP_URL`: WordPress site URL (e.g., https://your-site.com)
- `ANTHROPIC_API_KEY`: Claude AI API key

## Usage

### Monthly Banners

For monthly "Watch of the Month" banners:

1. Place your 2 source images (1 desktop, 1 mobile) in the `source-images` folder
2. Run the command:

```bash
# Auto-detects current month
node autoUploader.js monthly --collection "Cosmograph Daytona"

# Specify different month
node autoUploader.js monthly --collection "Sea-Dweller" --month "July"
```

### Blog Post Banners

For blog post banners:

1. Place your 2 source images (1 desktop, 1 mobile) in the `source-images` folder
2. Run the command:

```bash
node autoUploader.js blog --title "Rolex and the Vienna Philharmonic"
```

### Blog Content Images

For individual blog content images (photos within blog posts):

1. Place your content images in the `source-images` folder
2. Run the specialized content uploader:

```bash
node uploadEnduranceContent.js
```

This handles multiple content images with subject-specific naming and metadata.

### Hub Feature Images

For blog hub/thumbnail feature images:

1. Place your hub feature image in the `source-images` folder
2. Run the hub feature uploader:

```bash
node uploadHubFeatureImage.js
```

This handles single hub feature images for blog category thumbnails.

### Product Management

For cloning WooCommerce products with complete data preservation:

```bash
# Clone Terra Nova to create Bronze variant
node productManager.js clone 28624 terra-nova-bronze

# Clone with Steel variant  
node productManager.js clone 28624 terra-nova-steel

# List available configurations
node productManager.js list-configs

# Export complete product data
node productManager.js export 28624

# Delete a product (cleanup)
node productManager.js delete 28999
```

### Advanced Product Cloning

```bash
# Use custom configuration file
node productManager.js clone 28624 --custom ./my-config.json

# Direct script usage with full control
node cloneProductComplete.js 28624
```

## How It Works

1. **File Detection**: Scans `source-images` directory for image files
2. **Image Classification**: Uses dimensions to identify desktop (wide) vs mobile (tall/square) images
3. **Model Extraction**: Extracts Rolex model numbers (e.g., M126518LN-0014) from filenames
4. **AI Generation**: Sends structured prompt to Claude AI with collection/title details
5. **Processing**: Copies and renames files to `processed-images` directory
6. **Upload**: Uploads to WordPress with generated metadata
7. **Cleanup**: Removes source files after successful upload

## File Naming Conventions

### Monthly Banners
```
Rolex-at-Palladio-{Month}-{Variant}-Banner-{Collection}_{Model}.jpg
```

Examples:
- `Rolex-at-Palladio-June-Desktop-Banner-Cosmograph-Daytona_M126518LN-0014.jpg`
- `Rolex-at-Palladio-June-Discover-Page-Mobile-Banner-Cosmograph-Daytona_M126518LN-0014.jpg`

### Blog Post Banners
```
Rolex-at-Palladio-{hyphenated-title}-{Desktop/Mobile}-Banner.jpg
```

### Blog Content Images
```
{BlogTopic}-Blog-{subject-slug}-{orientation}-Rolex-Palladio.jpg
```

Examples:
- `Endurance-Blog-jamie-chadwick-landscape-Rolex-Palladio.jpg`
- `Endurance-Blog-le-mans-24-hours-portrait-Rolex-Palladio.jpg`

### Hub Feature Images
```
{BlogTopic}-Blog-Hub-{subject}-Feature-Rolex-Palladio.jpg
```

Examples:
- `Endurance-Blog-Hub-Le-Mans-24hr-Feature-Rolex-Palladio.jpg`

## Project Structure

```
├── Image Upload System
│   ├── autoUploader.js             # Main autonomous script (banners)
│   ├── uploadEnduranceContent.js   # Blog content image uploader
│   ├── uploadHubFeatureImage.js    # Hub feature image uploader
│   ├── uploadMedia.js             # Legacy upload script
│   └── export_wp_media.js         # Media export utility
├── Product Management System
│   ├── productManager.js          # Main product management CLI
│   ├── cloneProductComplete.js    # Complete product cloning
│   ├── exportProductComplete.js   # Full product data export
│   ├── fetchProductData.js        # Basic product fetching
│   └── deleteProduct.js           # Product deletion utility
├── Documentation
│   ├── BLOG_CONTENT_IMAGES_GUIDE.md
│   ├── PRODUCT_CLONING_GUIDE.md
│   ├── CLAUDE_AUTONOMOUS_WORKFLOW.md
│   └── QUICK_REFERENCE.md
├── Directories
│   ├── source-images/             # Drop source images here
│   ├── processed-images/          # Processed files (auto-created)
│   └── images/                    # Product images and archives
└── Configuration
    ├── package.json               # Dependencies
    ├── .env.example              # Environment template
    └── README.md                 # This file
```

## Requirements

- Node.js (v14+ recommended)
- WordPress site with REST API enabled
- WordPress Application Password (not regular password)
- WooCommerce plugin for product management
- Anthropic Claude API key (for image metadata generation)
- Yoast SEO plugin (optional, for SEO data preservation)

## Error Handling

The script includes comprehensive error handling:
- Validates all required environment variables
- Checks for minimum 2 source images
- Validates image dimensions and model number extraction
- Handles AI API errors gracefully
- Reports upload success/failure for each file

## Dependencies

- `@anthropic-ai/sdk`: Claude AI integration
- `yargs`: Command line interface
- `image-size`: Image dimension detection
- `axios`: HTTP requests
- `form-data`: File uploads
- `dotenv`: Environment configuration

## License

ISC