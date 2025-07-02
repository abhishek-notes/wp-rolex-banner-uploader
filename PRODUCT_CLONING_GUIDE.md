# WordPress/WooCommerce Product Cloning System

## 🎯 PURPOSE

A comprehensive system for cloning WooCommerce products with complete data preservation including categories, meta fields, SEO data, custom fields, and images. Perfect for creating product variants or duplicating complex product setups.

---

## 🚀 QUICK START

### Basic Product Clone
```bash
# Clone Terra Nova to create Bronze variant
node cloneProductComplete.js 28624

# Delete a product if needed
node deleteProduct.js <product-id>

# Export complete product data for analysis
node exportProductComplete.js <product-id>
```

---

## 📋 SYSTEM COMPONENTS

### Core Scripts

1. **`exportProductComplete.js`** - Exports ALL product data
   - WooCommerce product data
   - WordPress post data (if available)
   - Categories and tags
   - Meta data and custom fields
   - Yoast SEO settings
   - Images and attributes

2. **`cloneProductComplete.js`** - Complete product cloning
   - Preserves all categories and hierarchy
   - Copies all meta data and custom fields
   - Uploads new product images
   - Maintains SEO settings
   - Creates proper slugs and permalinks

3. **`deleteProduct.js`** - Safe product deletion
   - Permanently deletes products
   - Use for cleanup and testing

4. **`fetchProductData.js`** - Basic product data fetching
   - Simple product information retrieval
   - Used by other scripts

---

## 🔧 TECHNICAL SPECIFICATIONS

### Data Preserved During Cloning

**WooCommerce Data:**
- ✅ Product name, description, short description
- ✅ Product type, status, visibility
- ✅ Categories (all levels maintained)
- ✅ Tags and attributes
- ✅ Pricing structure (empty preserved)
- ✅ Inventory settings
- ✅ Shipping settings
- ✅ Related products (upsells/cross-sells)

**WordPress Data:**
- ✅ All meta_data fields
- ✅ Custom fields (brand, product_subline, etc.)
- ✅ Yoast SEO settings
- ✅ Theme settings (Astra, etc.)
- ✅ Page templates
- ✅ Elementor settings (if used)

**Media:**
- ✅ Product images uploaded and linked
- ✅ Image metadata preserved
- ✅ Multiple image support

---

## 🛠️ CUSTOMIZATION

### Creating New Product Variants

Edit the configuration in `cloneProductComplete.js`:

```javascript
const newProductConfig = {
    name: 'Your Product Name',
    description: 'Full HTML product description...',
    brand: 'Brand Name',
    imagePaths: ['./path/to/image1.webp', './path/to/image2.jpg'],
    yoastSEO: { // Optional
        '_yoast_wpseo_title': 'Custom SEO Title',
        '_yoast_wpseo_metadesc': 'Custom meta description'
    },
    regular_price: '999.00', // Optional
    tags: [], // Optional - will inherit from source if not provided
    status: 'publish' // Optional - defaults to publish
};
```

### Advanced Configuration Options

```javascript
const advancedConfig = {
    // Basic Info
    name: 'Product Name',
    slug: 'custom-slug', // Auto-generated if not provided
    description: 'HTML description',
    short_description: 'Short description',
    
    // Pricing
    regular_price: '999.00',
    sale_price: '799.00',
    
    // Inventory
    manage_stock: true,
    stock_quantity: 10,
    stock_status: 'instock',
    
    // Custom Fields
    brand: 'Brand Name',
    product_subline: 'Product Subline',
    
    // SEO
    yoastSEO: {
        '_yoast_wpseo_title': 'SEO Title',
        '_yoast_wpseo_metadesc': 'Meta description',
        '_yoast_wpseo_focuskw': 'focus keyword'
    },
    
    // Images
    imagePaths: [
        './images/main-image.webp',
        './images/gallery-1.jpg',
        './images/gallery-2.jpg'
    ],
    
    // Categories (will inherit from source if not specified)
    additionalCategories: [
        { id: 123, name: 'Special Category' }
    ]
};
```

---

## 📁 FILE STRUCTURE

```
WordPress Image Upload Project/
├── cloneProductComplete.js       # Main cloning script
├── exportProductComplete.js      # Complete data export
├── fetchProductData.js          # Basic data fetching
├── deleteProduct.js             # Product deletion
├── images/
│   └── Bremont_Processed_901x1201_WEBP_IMPROVED_TRANSPARENT/
│       └── [product images]
├── product-export-complete-*.json  # Exported data files
└── PRODUCT_CLONING_GUIDE.md     # This guide
```

---

## 💡 USAGE EXAMPLES

### Example 1: Clone Terra Nova Watch

```bash
# Export original product data first (optional)
node exportProductComplete.js 28624

# Clone the product with Bronze variant
node cloneProductComplete.js 28624
```

**Result:**
- New product: "Terra Nova 42.5 Chronograph Bronze"
- All categories: Bremont, Terra Nova, Watch
- All meta fields copied
- Bronze-specific image uploaded
- Proper SEO settings maintained

### Example 2: Custom Product Clone

Create a custom configuration:

```javascript
// In cloneProductComplete.js, modify the config:
const customConfig = {
    name: 'Terra Nova 40mm Classic',
    description: 'Your custom description...',
    brand: 'Bremont',
    imagePaths: ['./images/custom-watch.webp']
};
```

Then run:
```bash
node cloneProductComplete.js 28624
```

### Example 3: Bulk Product Management

```bash
# Export multiple products for analysis
node exportProductComplete.js 28624
node exportProductComplete.js 28625
node exportProductComplete.js 28626

# Clone with modifications
node cloneProductComplete.js 28624
node cloneProductComplete.js 28625

# Clean up test products
node deleteProduct.js 28999
```

---

## 🔍 TROUBLESHOOTING

### Common Issues

**1. Image Upload Fails**
```
Error: ENOENT: no such file or directory
```
- Check image path is correct
- Ensure image file exists
- Verify file permissions

**2. Categories Not Copying**
```
Categories: [] (empty)
```
- Source product may not have categories
- Check category IDs are valid
- Verify user permissions

**3. Meta Data Missing**
```
Meta Fields: 0
```
- Source product may not have meta data
- Check WooCommerce REST API permissions
- Verify authentication

**4. SEO Data Not Preserved**
```
Yoast SEO data not found
```
- Yoast SEO plugin may not be active
- Check if Yoast REST API is enabled
- Verify meta data permissions

### Debug Mode

Add debug logging to any script:

```javascript
// Add at the top of any script
const DEBUG = true;

// Use throughout the script
if (DEBUG) console.log('Debug info:', data);
```

---

## 🔐 SECURITY CONSIDERATIONS

### Authentication
- Uses WordPress Application Passwords
- Requires proper user permissions
- All API calls authenticated

### Data Handling
- No sensitive data logged
- Temporary files cleaned up
- Image uploads validated

### Permissions Required
- WooCommerce product management
- WordPress media upload
- Category/tag management
- Meta data modification

---

## 📊 SUCCESS METRICS

### Expected Results
- ✅ Product created with unique ID
- ✅ All categories preserved
- ✅ Meta data copied (12+ fields typical)
- ✅ Images uploaded and linked
- ✅ SEO settings maintained
- ✅ Proper permalink structure

### Verification Checklist
- [ ] New product appears in WooCommerce
- [ ] Categories match original
- [ ] Custom fields populated (brand, etc.)
- [ ] Images display correctly
- [ ] Permalink structure correct
- [ ] SEO data preserved

---

## 🚀 EXTENDING THE SYSTEM

### Adding New Product Types

1. Create type-specific configuration
2. Add custom field mappings
3. Include type-specific images
4. Test with sample products

### Integration with Other Systems

```javascript
// Example: Add Shopify export
const shopifyExport = {
    title: product.name,
    description: product.description,
    price: product.regular_price,
    images: product.images.map(img => img.src)
};
```

### Automation

```bash
# Create a batch processing script
#!/bin/bash
for id in 28624 28625 28626; do
    node cloneProductComplete.js $id
done
```

---

## 📝 CHANGELOG

### Version 1.0 (Current)
- ✅ Complete WooCommerce product cloning
- ✅ Meta data preservation
- ✅ Image upload and linking
- ✅ Category/tag management
- ✅ SEO data handling
- ✅ Error handling and validation

### Future Enhancements
- [ ] Bulk product cloning
- [ ] CSV import/export
- [ ] Advanced SEO automation
- [ ] Product variation cloning
- [ ] Integration with external image sources

---

*This system ensures 100% data preservation when cloning WooCommerce products, making it perfect for creating product variants, testing, and maintaining complex product catalogs.*