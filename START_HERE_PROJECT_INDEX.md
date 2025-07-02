# 🏠 PROJECT INDEX - START HERE

## 🎯 WHAT IS THIS PROJECT?

WordPress automation toolkit for **Palladio Jewellers** (Official Rolex & Bremont Retailer) featuring:
- AI-powered image uploads with metadata generation
- Complete WooCommerce product management
- Bremont watch catalog cleanup and management
- Rolex banner and blog content automation

---

## 🚀 QUICK START

### 1. CREDENTIALS & SETUP
- **Environment**: Copy `.env.example` to `.env` (not in repo)
- **Required Credentials**:
  - `WP_USER`: WordPress username
  - `APP_PASSWORD`: WordPress application password
  - `WP_URL`: WordPress site URL
  - `ANTHROPIC_API_KEY`: Claude AI API key
- **Install**: `npm install`

### 2. MAIN COMMANDS
```bash
# Monthly Rolex banners
node autoUploader.js monthly --collection \"Cosmograph Daytona\"

# Blog banners  
node autoUploader.js blog --title \"Rolex and the Vienna Philharmonic\"

# Product cloning
node productManager.js clone 28624 terra-nova-bronze

# Bremont cleanup (completed)
node bremont-catalog-cleanup.js
```

---

## 📁 DIRECTORY STRUCTURE & FILE INDEX

### 🏗️ CORE AUTOMATION SCRIPTS

| File | Purpose | Status |
|------|---------|---------|
| `autoUploader.js` | Main AI-powered image uploader | ✅ Active |
| `productManager.js` | Product cloning & management CLI | ✅ Active |
| `cloneProductComplete.js` | Complete product cloning with all metadata | ✅ Active |
| `exportProductComplete.js` | Export full product data | ✅ Active |

### 🍃 BREMONT CATALOG MANAGEMENT (COMPLETED PROJECT)

| File | Purpose | Status |
|------|---------|---------|
| `bremont-catalog-cleanup.js` | Main cleanup script (deleted 10, fixed 9, created 8) | ✅ Completed |
| `add-bremont-brand-field.js` | Added \"Bremont\" brand to all products | ✅ Completed |
| `fix-images-and-skus.js` | Uploaded images, removed SKUs | ✅ Completed |
| `remove-all-topline-strong.js` | Removed redundant product names | ✅ Completed |
| `fix-meter-capitalization.js` | Changed 300M → 300m in titles | ✅ Completed |
| `update-missing-descriptions.js` | Added complete technical descriptions | ✅ Completed |

### 📊 DATA & ANALYSIS FILES

#### Bremont Project Data
| File | Contents |
|------|----------|
| `bremont-final-catalog.json` | Final 29 Bremont products (canonical) |
| `bremont-final-catalog.css` | CSV export of final catalog |
| `bremont-comprehensive-report.json` | Complete analysis report |
| `bremont-verification-detailed.json` | Verification data |
| `code-syntax-bremont.txt` | Reference document with all 29 product specs |

#### Product Exports & Batches
| File | Contents |
|------|----------|
| `all-bremont-products.json` | All Bremont products fetched |
| `bremont-final-batch-1-2.json` | Batch 1-2 product data |
| `bremont-final-batch-3-4.json` | Batch 3-4 product data |
| `bremont-final-batch-5-4.json` | Batch 5-4 product data |
| `product-export-complete-28624.json` | Sample complete product export |

#### Image & Media Data
| File | Contents |
|------|----------|
| `blog-images-upload-results-2025-06-17T16-05-22-104Z.json` | Blog image upload results |
| `image-fix-results.json` | Image fixing results |
| `wp_images.json` | WordPress media library data |
| `media-slugs.json` | Media slug mappings |

### 📚 DOCUMENTATION

| File | Contents | Audience |
|------|----------|----------|
| `README.md` | Complete project overview & usage | Everyone |
| `BREMONT_WORDPRESS_COMPLETE_DOCUMENTATION.md` | Full Bremont project documentation | Technical |
| `PRODUCT_CLONING_GUIDE.md` | How to clone products | Users |
| `BLOG_CONTENT_IMAGES_GUIDE.md` | Blog image workflow | Content creators |
| `CLAUDE_AUTONOMOUS_WORKFLOW.md` | AI automation details | Technical |
| `QUICK_REFERENCE.md` | Command reference | Users |

### 🖼️ IMAGE DIRECTORIES

| Directory | Contents |
|-----------|----------|
| `source-images/` | Drop new images here for processing |
| `processed-images/` | Auto-generated processed images |
| `images/Bremont_Processed_901x1201_WEBP_IMPROVED_TRANSPARENT/` | 29 Bremont product images |
| `images/Archived - Ignore Images/` | Archived Rolex banners & blog images |

### ⚙️ UTILITY SCRIPTS

| File | Purpose |
|------|---------|
| `uploadBlogImages.js` | Blog content image uploader |
| `uploadEnduranceContent.js` | Endurance blog content |
| `uploadHubFeatureImage.js` | Hub feature images |
| `fetchProductData.js` | Fetch product data |
| `deleteProduct.js` | Delete products |
| `updateProduct.js` | Update product data |

---

## 🎯 COMPLETED TASKS

### ✅ BREMONT CATALOG PROJECT (100% COMPLETE)
- **Final Result**: 29 perfectly configured Bremont products
- **Tasks Completed**:
  - ✅ Deleted 10 duplicate products
  - ✅ Fixed 9 products with incorrect data
  - ✅ Created 8 missing products
  - ✅ Added proper images with metadata to all products
  - ✅ Removed SKUs from all products
  - ✅ Added \"Bremont\" brand field to all products
  - ✅ Fixed meter capitalization (300M → 300m)
  - ✅ Added complete technical descriptions
  - ✅ Removed redundant product names from descriptions

### ✅ ROLEX BANNER UPDATES
- **Banners Updated**: 3 Bremont banner images with proper metadata
- **Pattern**: \"Bremont at Palladio Jewellers in Vancouver - Official Bremont Retailer\"

### ✅ BLOG CONTENT SYSTEM
- **Endurance Blog**: All images processed and uploaded
- **Vienna Philharmonic**: Desktop/mobile banners created
- **Naming Convention**: Established and documented

---

## 🔧 TECHNICAL DETAILS

### Dependencies (package.json)
- `@anthropic-ai/sdk`: Claude AI integration
- `axios`: HTTP requests
- `form-data`: File uploads
- `image-size`: Image processing
- `dotenv`: Environment config
- `yargs`: CLI interface

### WordPress Integration
- **API**: WooCommerce REST API (`/wp-json/wc/v3/`)
- **Media**: WordPress Media API (`/wp-json/wp/v2/media`)
- **Auth**: WordPress Application Passwords
- **Image Upload**: FormData multipart uploads

### AI Integration
- **Provider**: Anthropic Claude
- **Usage**: Metadata generation for images
- **Pattern**: Structured prompts for consistent output

---

## 🚨 IMPORTANT NOTES

### Project Status
- **Bremont Catalog**: ✅ COMPLETED - 29 products fully configured
- **Image Upload System**: ✅ ACTIVE - Ready for Rolex monthly banners
- **Product Cloning**: ✅ ACTIVE - Ready for new product variants

### File Safety
- Source images auto-deleted after successful upload
- All processed files saved in `processed-images/`
- Complete backup data in JSON files

### Credentials Security
- Environment variables NOT committed to repo
- WordPress Application Passwords (not regular passwords)
- Anthropic API key required for AI features

---

## 🎪 WORKFLOWS BY USE CASE

### 📅 Monthly Rolex Banners
1. Drop 2 images in `source-images/`
2. Run: `node autoUploader.js monthly --collection \"Collection Name\"`
3. AI generates 4 variants with metadata

### 📝 Blog Content
1. Drop images in `source-images/`
2. Run: `node autoUploader.js blog --title \"Blog Title\"`
3. Desktop/mobile banners created

### 🛍️ Product Management
1. Find source product ID
2. Run: `node productManager.js clone [ID] [variant]`
3. Complete product cloned with all data

### 🔍 Data Analysis
1. All Bremont data in `bremont-final-catalog.json`
2. Verification data in `bremont-verification-detailed.json`
3. Complete documentation in `BREMONT_WORDPRESS_COMPLETE_DOCUMENTATION.md`

---

## 🆘 TROUBLESHOOTING

### Common Issues
1. **Missing .env**: Copy `.env.example` to `.env` and fill credentials
2. **Image upload fails**: Check WordPress Application Password
3. **AI errors**: Verify Anthropic API key
4. **Product cloning fails**: Check WooCommerce permissions

### Log Files
- Most scripts output detailed console logs
- Upload results saved in JSON files
- Error messages include API response details

---

## 📞 NEXT STEPS

### If Starting Fresh
1. Read this index file completely
2. Set up credentials in `.env`
3. Review `README.md` for detailed usage
4. Choose your workflow from the sections above

### If Continuing Bremont Work
1. Review `BREMONT_WORDPRESS_COMPLETE_DOCUMENTATION.md`
2. All 29 products are ready - no further action needed
3. Use `bremont-final-catalog.json` as reference

### If Adding New Features
1. Study existing scripts for patterns
2. Follow WordPress REST API conventions
3. Include proper error handling and logging
4. Update documentation when complete

---

*Last Updated: December 2024*  
*Project Status: Active - Bremont Catalog Complete*