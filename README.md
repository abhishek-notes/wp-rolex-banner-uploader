# WordPress Image Upload Script with AI

An autonomous WordPress media upload script that uses AI to generate proper metadata and filenames for Rolex banner images at Palladio Jewellers.

## Features

- 🤖 **AI-Powered Metadata Generation**: Uses Claude AI to generate proper filenames, alt text, titles, captions, and descriptions
- 🔍 **Intelligent Image Detection**: Automatically identifies desktop vs mobile images by dimensions
- 📱 **Multi-Variant Support**: Generates 4 variants for monthly banners (Homepage Desktop/Mobile, Discover Page Desktop/Mobile)
- 🏷️ **Model Number Extraction**: Automatically extracts Rolex model numbers from filenames
- 📂 **File Management**: Automatically renames, processes, and uploads images
- 🧹 **Cleanup**: Removes source files after successful upload

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

## Project Structure

```
├── autoUploader.js           # Main autonomous script
├── source-images/           # Drop source images here
├── processed-images/        # Processed files (auto-created)
├── uploadMedia.js          # Legacy upload script
├── export_wp_media.js      # Media export utility
├── package.json            # Dependencies
├── .env.example           # Environment template
└── README.md              # This file
```

## Requirements

- Node.js
- WordPress site with REST API enabled
- WordPress Application Password
- Anthropic Claude API key

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