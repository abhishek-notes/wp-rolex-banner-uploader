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

### When User Says:
> "these are image files for the blog, that will go on blog pages" or "upload blog content images"

### Execute This:
```bash
# 1. Copy content images (exclude archived folders)
cp images/rolex-[topic]-*.jpg source-images/ 2>/dev/null

# 2. Run content upload script
node uploadEnduranceContent.js

# 3. Report results
```

### When User Says:
> "hub feature image" or "blog thumbnail feature image"

### Execute This:
```bash
# 1. Copy hub feature image (exclude archived folders)
cp images/*world-of-rolex*.jpg source-images/ 2>/dev/null

# 2. Run hub feature upload script
node uploadHubFeatureImage.js

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
- Blog Banners: 2/2 uploads  
- Blog Content: All content images uploaded (varies by topic)
- Hub Feature: 1/1 upload with WordPress URL
- WordPress IDs returned
- Files cleaned up
- Exclude archived folders (e.g., "Archived - Ignore Images")

## 📱 Preferred Mobile Dimensions
- 1440x2560 (Discover Page Mobile - Preferred)
- 1280x1760 (Blog Mobile - Current)
- 1280x1280 (Square format)
- 1280x1920 (Standard mobile)

## 📰 Blog Banner Dimensions
- Homepage Desktop: 4000x1840 (Current)
- Discover Page Desktop: 3360x840 (Current)
- Mobile: 1280x1760 (Current) or 780x1050 (Legacy)
- Legacy Desktop: 5760x2100

## 🎯 Output Pattern
```
Monthly: Rolex-at-Palladio-{Month}-{Variant}-Banner-{Collection}_{Model}.jpg
Blog Banners (Standard): Rolex-at-Palladio-{hyphenated-title}-{Desktop/Mobile}-Banner.jpg
Blog Banners (Extended): Rolex-at-Palladio-{title}-Blog-{Discover-Page-}?{Desktop/Mobile}-Banner.jpg
Blog Content: {BlogTopic}-Blog-{subject-slug}-{orientation}-Rolex-Palladio.jpg
Hub Feature: {BlogTopic}-Blog-Hub-{subject}-Feature-Rolex-Palladio.jpg
```

**ALWAYS USE CLAUDE_AUTONOMOUS_WORKFLOW.md FOR COMPLETE INSTRUCTIONS**