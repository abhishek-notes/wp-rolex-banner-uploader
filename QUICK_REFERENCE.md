# Quick Reference - Rolex Banner Upload

## 🚀 INSTANT EXECUTION GUIDE

### When User Says:
> "my images files for rolex monthly banners are added in images folder for [month] monthly banner of [collection] collection - do the thing"

### Execute This:
```bash
# 1. Copy images (exclude archived folders)
cp images/*.jpg source-images/ 2>/dev/null

# 2. Run command  
node autoUploader.js monthly --collection "[Collection]" --month "[Month]"

# 3. Report results
```

### When User Says:
> "process blog banners for '[title]' post"

### Execute This:
```bash
# 1. Copy images (exclude archived folders)
cp images/*.jpg source-images/ 2>/dev/null

# 2. Run command
node autoUploader.js blog --title "[Title]"

# 3. Report results
```

## 📋 Collection Names (Copy Exactly)
- Cosmograph Daytona
- Submariner Date  
- GMT-Master II
- Datejust
- Day-Date
- Explorer
- Oyster Perpetual
- Sea-Dweller
- Yacht-Master
- Milgauss
- Air-King

## 📅 Month Names (Copy Exactly)
January, February, March, April, May, June, July, August, September, October, November, December

## ✅ Success Criteria
- Monthly: 4/4 uploads
- Blog: 2/2 uploads  
- WordPress IDs returned
- Files cleaned up
- Exclude archived folders (e.g., "Archived - Ignore Images")

## 📱 Preferred Mobile Dimensions
- 1440x2560 (Discover Page Mobile - Preferred)
- 1280x1280 (Square format)
- 1280x1920 (Standard mobile)

## 🎯 Output Pattern
```
Monthly: Rolex-at-Palladio-{Month}-{Variant}-Banner-{Collection}_{Model}.jpg
Blog: Rolex-at-Palladio-{hyphenated-title}-{Desktop/Mobile}-Banner.jpg
```

**ALWAYS USE CLAUDE_AUTONOMOUS_WORKFLOW.md FOR COMPLETE INSTRUCTIONS**