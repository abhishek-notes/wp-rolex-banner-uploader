#!/usr/bin/env node

const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

const { WP_USER, APP_PASSWORD, WP_URL } = process.env;

// Read the fetched products
const products = JSON.parse(fs.readFileSync('bremont-products-fetched.json', 'utf-8'));

// Read code-syntax file to extract reference data
const codeSyntax = fs.readFileSync('code-syntax-bremont.txt', 'utf-8');

// Extract all products from code-syntax
const productMatches = codeSyntax.match(/Product \d+: ([^\n]+)\(WordPress Post Title: ([^\)]+)\)/g);
const refMatches = codeSyntax.match(/Ref No: ([A-Z0-9-]+)/g);

console.log('=== BREMONT PRODUCT ANALYSIS ===\n');
console.log(`Found ${products.length} products in WordPress`);
console.log(`Found ${productMatches?.length || 0} products in reference document\n`);

// Create a map of reference numbers to product titles
const refMap = {};
let productIndex = 0;
productMatches?.forEach((match, index) => {
  const titleMatch = match.match(/Product \d+: ([^\(]+)/);
  if (titleMatch && refMatches[index]) {
    const title = titleMatch[1].trim();
    const ref = refMatches[index].replace('Ref No: ', '');
    refMap[ref] = title;
  }
});

console.log('=== ISSUES FOUND ===\n');

const issues = [];

// Analyze each product
products.forEach((product, index) => {
  const productIssues = {
    id: product.id,
    name: product.name,
    issues: []
  };

  // Check 1: Title matching
  const hasMatchingTitle = productMatches?.some(match => 
    match.toLowerCase().includes(product.name.toLowerCase())
  );
  
  if (!hasMatchingTitle) {
    productIssues.issues.push('Title may not match reference document');
  }

  // Check 2: Image reference number
  if (product.images.length > 0) {
    const imageName = product.images[0].name;
    const imageRef = imageName.match(/([A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+-[A-Z0-9]+)/);
    
    if (imageRef) {
      const ref = imageRef[1];
      if (refMap[ref]) {
        productIssues.issues.push(`Image ref ${ref} should be for product: "${refMap[ref]}"`);
      }
    }
  } else {
    productIssues.issues.push('No image found');
  }

  // Check 3: Description length
  if (product.description.length < 500) {
    productIssues.issues.push('Description seems too short');
  }

  // Check 4: Multiple images with same suffix
  const imageSuffix = product.images[0]?.name.match(/-(\d+)$/);
  if (imageSuffix && imageSuffix[1] !== '1') {
    productIssues.issues.push(`Image has suffix -${imageSuffix[1]}, might be duplicate`);
  }

  if (productIssues.issues.length > 0) {
    issues.push(productIssues);
  }
});

// Display issues
issues.forEach(issue => {
  console.log(`\nProduct ID ${issue.id}: ${issue.name}`);
  issue.issues.forEach(i => console.log(`  - ${i}`));
});

console.log(`\n\nTotal products with issues: ${issues.length}/${products.length}`);

// Save detailed analysis
const analysis = {
  summary: {
    totalProducts: products.length,
    productsWithIssues: issues.length,
    timestamp: new Date().toISOString()
  },
  issues: issues,
  referenceMap: refMap
};

fs.writeFileSync('bremont-analysis.json', JSON.stringify(analysis, null, 2));
console.log('\nDetailed analysis saved to bremont-analysis.json');