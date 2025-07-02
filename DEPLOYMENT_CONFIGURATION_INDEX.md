# 🚀 DEPLOYMENT & CONFIGURATION INDEX

## 🔐 CREDENTIALS & AUTHENTICATION

### Environment Variables (.env file)
```bash
# WordPress Connection
WP_USER=your_wp_username
APP_PASSWORD=your_wordpress_application_password  # NOT regular password!
WP_URL=https://your-wordpress-site.com

# AI Integration
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key

# Optional: Database direct access (if needed)
DB_HOST=localhost
DB_USER=database_user
DB_PASS=database_password
DB_NAME=wordpress_database
```

### WordPress Setup Requirements
1. **Application Passwords**: Must be enabled in WordPress
   - Go to Users → Profile → Application Passwords
   - Generate new password specifically for API access
   - Use this password, NOT your login password

2. **REST API**: Must be enabled (usually default)
   - Test: `https://yoursite.com/wp-json/wc/v3/products`

3. **Required Plugins**:
   - WooCommerce (for product management)
   - Yoast SEO (optional, for SEO data preservation)

---

## 🏗️ DEPLOYMENT ARCHITECTURE

### File Structure for Deployment
```
/workspace/
├── 🚀 PRODUCTION SCRIPTS
│   ├── autoUploader.js              # Main image uploader
│   ├── productManager.js            # Product management CLI
│   ├── cloneProductComplete.js      # Product cloning
│   └── exportProductComplete.js     # Data export
├── 📦 DEPLOYMENT CONFIG
│   ├── package.json                 # Dependencies
│   ├── package-lock.json           # Locked versions
│   └── .env                        # Credentials (CREATE THIS)
├── 🛠️ UTILITY SCRIPTS
│   ├── fetchProductData.js         # Data fetching
│   ├── deleteProduct.js            # Cleanup
│   └── updateProduct.js            # Updates
├── 📊 DATA DIRECTORIES
│   ├── source-images/              # Input directory
│   ├── processed-images/           # Output directory
│   └── images/                     # Asset library
└── 📚 DOCUMENTATION
    ├── README.md                   # Main guide
    ├── START_HERE_PROJECT_INDEX.md # This file
    └── *.md guides                 # Specific guides
```

### Server Requirements
- **Node.js**: v14+ (recommended v18+)
- **Memory**: 512MB minimum, 1GB recommended
- **Storage**: 2GB minimum for images and logs
- **Network**: HTTPS access to WordPress site
- **OS**: Linux/macOS/Windows (cross-platform)

---

## 🌐 WORDPRESS CONFIGURATION

### API Endpoints Used
```javascript
// Product Management
GET    /wp-json/wc/v3/products
POST   /wp-json/wc/v3/products
PUT    /wp-json/wc/v3/products/{id}
DELETE /wp-json/wc/v3/products/{id}

// Media Management
GET    /wp-json/wp/v2/media
POST   /wp-json/wp/v2/media
PUT    /wp-json/wp/v2/media/{id}

// Categories & Tags
GET    /wp-json/wc/v3/products/categories
GET    /wp-json/wc/v3/products/tags
```

### WordPress Permissions Needed
```php
// User capabilities required:
- edit_posts
- upload_files
- manage_woocommerce
- edit_products
- delete_products
- manage_product_terms
```

### WordPress Security Settings
```php
// In wp-config.php (recommended)
define('WP_DEBUG', false);  // Disable debug in production
define('WP_DEBUG_LOG', true);  // Enable error logging

// .htaccess protection for REST API
<Files "wp-json">
    # Allow API access but log requests
    LogLevel info
</Files>
```

---

## 🔧 TECHNICAL CONFIGURATION

### Image Processing Settings
```javascript
// autoUploader.js configuration
const IMAGE_SETTINGS = {
  maxWidth: 4000,          // Max image width
  maxHeight: 2000,         // Max image height
  quality: 85,             // JPEG quality
  formats: ['.jpg', '.jpeg', '.png', '.webp'],
  timeout: 30000           // Upload timeout (30s)
};
```

### API Rate Limiting
```javascript
// Built-in delays to prevent rate limiting
const API_DELAYS = {
  between_requests: 300,    // 300ms between API calls
  between_uploads: 500,     // 500ms between image uploads
  retry_delay: 2000,        // 2s before retry on error
  max_retries: 3            // Maximum retry attempts
};
```

### Memory Management
```javascript
// Node.js heap settings (if needed)
// Start with: node --max-old-space-size=2048 script.js
process.env.NODE_OPTIONS = '--max-old-space-size=2048';
```

---

## 📋 DEPLOYMENT CHECKLIST

### Pre-Deployment
- [ ] Node.js installed (v14+)
- [ ] WordPress site accessible
- [ ] WooCommerce plugin active
- [ ] Application passwords enabled
- [ ] API credentials tested
- [ ] Dependencies installed (`npm install`)

### Environment Setup
- [ ] `.env` file created with all credentials
- [ ] `source-images/` directory exists
- [ ] Write permissions for `processed-images/`
- [ ] Network access to WordPress site
- [ ] Anthropic API key valid (for AI features)

### Testing Deployment
```bash
# Test basic connectivity
node -e \"console.log('Node.js working')\"

# Test WordPress connection
node fetchProductData.js

# Test image upload (with test image)
node autoUploader.js --test

# Test product operations
node productManager.js list-configs
```

### Post-Deployment Verification
- [ ] Image uploads work correctly
- [ ] Product cloning functions
- [ ] Metadata generation active
- [ ] Error handling working
- [ ] Log files being created

---

## 🚨 SECURITY CONSIDERATIONS

### Credential Security
```bash
# .env file permissions (Unix/Linux)
chmod 600 .env

# Never commit credentials
echo \".env\" >> .gitignore
echo \"node_modules/\" >> .gitignore
```

### WordPress Security
```php
// Application password best practices:
1. Use unique password for this application
2. Limit user permissions to minimum required
3. Monitor API access logs
4. Rotate passwords regularly
5. Use HTTPS only
```

### File Security
```javascript
// Images are processed and deleted from source
// Processed files stored securely
// No sensitive data in logs
// API keys never logged
```

---

## 📊 MONITORING & LOGGING

### Application Logs
```javascript
// All scripts include comprehensive logging:
console.log('✅ Success messages');
console.log('📝 Progress updates');  
console.log('❌ Error details');
console.log('📊 Summary statistics');
```

### WordPress Logs
```php
// WordPress debug log location:
/wp-content/debug.log

// Monitor for API errors:
tail -f /wp-content/debug.log | grep \"REST\"
```

### System Monitoring
```bash
# Monitor Node.js processes
ps aux | grep node

# Monitor memory usage
top -p $(pgrep node)

# Monitor disk space (for images)
df -h
```

---

## 🔄 BACKUP & RECOVERY

### Data Backup Strategy
1. **Product Data**: Exported to JSON files automatically
2. **Images**: Stored in `processed-images/` directory
3. **Configuration**: `.env` file (secure backup required)
4. **WordPress**: Regular WordPress backups recommended

### Recovery Procedures
```bash
# Restore from product export
node cloneProductComplete.js --import backup-file.json

# Re-upload images from processed directory
node uploadMedia.js --source processed-images/

# Verify data integrity
node exportProductComplete.js --verify
```

---

## 🚀 PERFORMANCE OPTIMIZATION

### Production Settings
```javascript
// For high-volume operations
process.env.UV_THREADPOOL_SIZE = 128;  // Increase thread pool
process.env.NODE_OPTIONS = '--max-old-space-size=4096';  // More memory
```

### Batch Processing
```javascript
// Process images in batches to prevent memory issues
const BATCH_SIZE = 10;  // Process 10 images at a time
const CONCURRENT_UPLOADS = 3;  // 3 simultaneous uploads max
```

### Caching Strategy
```javascript
// API responses cached for efficiency
// Image metadata cached to prevent re-processing
// Product data cached during batch operations
```

---

## 🆘 TROUBLESHOOTING GUIDE

### Common Deployment Issues

#### Environment Issues
```bash
# Error: Missing environment variables
Solution: Check .env file exists and has all required variables

# Error: Permission denied
Solution: Check file permissions and WordPress user capabilities
```

#### API Connection Issues
```bash
# Error: 401 Unauthorized
Solution: Verify WordPress Application Password (not login password)

# Error: 403 Forbidden
Solution: Check user permissions and WordPress API access
```

#### Image Upload Issues
```bash
# Error: File too large
Solution: Check WordPress upload limits in php.ini

# Error: Invalid image format
Solution: Verify supported formats: .jpg, .jpeg, .png, .webp
```

### Debug Commands
```bash
# Test WordPress connection
curl -u username:app_password https://yoursite.com/wp-json/wc/v3/products

# Test Node.js and dependencies
node -e \"require('./package.json'); console.log('Dependencies OK')\"

# Test AI integration
node -e \"console.log(process.env.ANTHROPIC_API_KEY ? 'API Key Set' : 'Missing API Key')\"
```

---

## 📞 SUPPORT & MAINTENANCE

### Regular Maintenance Tasks
- [ ] Update Node.js dependencies monthly
- [ ] Rotate API credentials quarterly
- [ ] Clean up old processed images
- [ ] Monitor WordPress plugin updates
- [ ] Review and archive log files

### Version Updates
```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Update specific packages
npm install @anthropic-ai/sdk@latest
```

### Support Resources
- **WordPress REST API**: https://developer.wordpress.org/rest-api/
- **WooCommerce API**: https://woocommerce.github.io/woocommerce-rest-api-docs/
- **Anthropic API**: https://docs.anthropic.com/
- **Node.js Documentation**: https://nodejs.org/docs/

---

*Last Updated: December 2024*  
*For Technical Support: Review logs and use debug commands above*