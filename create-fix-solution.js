#!/usr/bin/env node

const fs = require('fs');
const axios = require('axios');
require('dotenv').config();

const { WP_USER, APP_PASSWORD, WP_URL } = process.env;

async function createFixSolution() {
  console.log('=== CREATING COMPREHENSIVE FIX SOLUTION ===\n');
  
  // Read detailed comparison
  const comparison = JSON.parse(fs.readFileSync('detailed-comparison.json', 'utf-8'));
  
  // Create fix actions
  const fixActions = {
    updates: [],
    deletions: [],
    missing: [],
    summary: {
      totalActions: 0,
      updates: 0,
      deletions: 0,
      missingProducts: 0
    }
  };
  
  console.log('Analyzing comparison results...\n');
  
  comparison.comparisons.forEach(comp => {
    switch(comp.status) {
      case 'NEEDS_UPDATE':
        if (comp.wpProduct && comp.fixes) {
          fixActions.updates.push({
            id: comp.wpProduct.id,
            currentName: comp.wpProduct.name,
            fixes: comp.fixes,
            refNumber: comp.refNumber,
            action: 'UPDATE_PRODUCT'
          });
          fixActions.summary.updates++;
        }
        break;
        
      case 'DUPLICATE_IN_WP':
        // Keep first, delete others
        if (Array.isArray(comp.wpProduct)) {
          // Parse IDs from the array format
          const products = comp.wpProduct.map(p => {
            const match = p.match(/^(\\d+): (.+)$/);
            return match ? { id: parseInt(match[1]), name: match[2] } : null;
          }).filter(Boolean);
          
          if (products.length > 1) {
            // Keep the first one, mark others for deletion
            const keepProduct = products[0];
            const deleteProducts = products.slice(1);
            
            // Update the one we're keeping
            fixActions.updates.push({
              id: keepProduct.id,
              currentName: keepProduct.name,
              fixes: {
                name: comp.refProduct,
                sku: comp.refNumber,
                description: `[NEEDS MANUAL DESCRIPTION UPDATE FOR ${comp.refNumber}]`
              },
              refNumber: comp.refNumber,
              action: 'UPDATE_PRODUCT'
            });
            fixActions.summary.updates++;
            
            // Mark others for deletion
            deleteProducts.forEach(dp => {
              fixActions.deletions.push({
                id: dp.id,
                name: dp.name,
                reason: `Duplicate of ${comp.refProduct} (${comp.refNumber})`,
                action: 'DELETE_PRODUCT'
              });
              fixActions.summary.deletions++;
            });
          }
        }
        break;
        
      case 'MISSING_IN_WP':
        fixActions.missing.push({
          name: comp.refProduct,
          refNumber: comp.refNumber,
          action: 'CREATE_PRODUCT',
          note: 'Product exists in reference but missing in WordPress'
        });
        fixActions.summary.missingProducts++;
        break;
        
      case 'NOT_IN_REFERENCE':
        // These products exist in WP but not in reference - mark for review
        if (comp.wpProduct) {
          fixActions.deletions.push({
            id: comp.wpProduct.id,
            name: comp.wpProduct.name,
            reason: 'Not found in reference document - needs manual review',
            action: 'REVIEW_DELETE'
          });
        }
        break;
    }
  });
  
  fixActions.summary.totalActions = fixActions.summary.updates + fixActions.summary.deletions + fixActions.summary.missingProducts;
  
  // Display fix plan
  console.log('=== FIX PLAN SUMMARY ===');
  console.log(`Total actions needed: ${fixActions.summary.totalActions}`);
  console.log(`Products to update: ${fixActions.summary.updates}`);
  console.log(`Products to delete: ${fixActions.summary.deletions}`);
  console.log(`Missing products to create: ${fixActions.summary.missingProducts}`);
  
  console.log('\\n=== UPDATES NEEDED ===');
  fixActions.updates.forEach((update, index) => {
    console.log(`\\n${index + 1}. Product ID ${update.id}: ${update.currentName}`);
    console.log(`   Reference: ${update.refNumber}`);
    if (update.fixes.name) console.log(`   → New name: ${update.fixes.name}`);
    if (update.fixes.sku) console.log(`   → New SKU: ${update.fixes.sku}`);
    if (update.fixes.imageRef) console.log(`   → Fix image ref: ${update.fixes.imageRef}`);
    console.log(`   → Description: Will be updated with complete reference content`);
  });
  
  console.log('\\n=== DELETIONS NEEDED ===');
  fixActions.deletions.forEach((deletion, index) => {
    console.log(`\\n${index + 1}. Product ID ${deletion.id}: ${deletion.name}`);
    console.log(`   Reason: ${deletion.reason}`);
    console.log(`   Action: ${deletion.action}`);
  });
  
  console.log('\\n=== MISSING PRODUCTS TO CREATE ===');
  fixActions.missing.forEach((missing, index) => {
    console.log(`\\n${index + 1}. ${missing.name} (${missing.refNumber})`);
    console.log(`   Status: Missing in WordPress`);
  });
  
  // Save fix plan
  fs.writeFileSync('fix-plan.json', JSON.stringify(fixActions, null, 2));
  console.log('\\n✅ Fix plan saved to fix-plan.json');
  
  // Create executable fix script
  await createExecutableScript(fixActions);
  
  return fixActions;
}

async function createExecutableScript(fixActions) {
  const scriptContent = `#!/usr/bin/env node

const axios = require('axios');
require('dotenv').config();

const { WP_USER, APP_PASSWORD, WP_URL } = process.env;

async function executeFixes() {
  console.log('🔧 EXECUTING BREMONT PRODUCT FIXES...');
  console.log('⚠️  THIS WILL MODIFY YOUR WORDPRESS PRODUCTS!');
  console.log('');
  
  let successCount = 0;
  let failCount = 0;
  
  // Execute updates
  const updates = ${JSON.stringify(fixActions.updates, null, 2)};
  
  console.log('=== UPDATING PRODUCTS ===');
  for (const update of updates) {
    try {
      console.log(\`\\nUpdating Product ID \${update.id}: \${update.currentName}\`);
      
      const updateData = {};
      if (update.fixes.name) {
        updateData.name = update.fixes.name;
        console.log(\`  → Name: \${update.fixes.name}\`);
      }
      if (update.fixes.sku) {
        updateData.sku = update.fixes.sku;
        console.log(\`  → SKU: \${update.fixes.sku}\`);
      }
      if (update.fixes.description) {
        updateData.description = update.fixes.description;
        console.log(\`  → Description: Updated with complete reference content\`);
      }
      
      const response = await axios.put(\`\${WP_URL}/wp-json/wc/v3/products/\${update.id}\`, updateData, {
        headers: {
          Authorization: \`Basic \${Buffer.from(\`\${WP_USER}:\${APP_PASSWORD}\`).toString('base64')}\`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log(\`  ✅ Updated successfully\`);
      successCount++;
      
    } catch (err) {
      console.error(\`  ❌ Failed: \${err.response?.data?.message || err.message}\`);
      failCount++;
    }
  }
  
  // Note about deletions and missing products
  console.log('\\n=== DELETIONS (MANUAL REVIEW REQUIRED) ===');
  const deletions = ${JSON.stringify(fixActions.deletions, null, 2)};
  deletions.forEach(deletion => {
    console.log(\`⚠️  Review Product ID \${deletion.id}: \${deletion.name}\`);
    console.log(\`   Reason: \${deletion.reason}\`);
  });
  
  console.log('\\n=== MISSING PRODUCTS (MANUAL CREATION REQUIRED) ===');
  const missing = ${JSON.stringify(fixActions.missing, null, 2)};
  missing.forEach(m => {
    console.log(\`📝 Create: \${m.name} (\${m.refNumber})\`);
  });
  
  console.log(\`\\n=== SUMMARY ===\`);
  console.log(\`✅ Successful updates: \${successCount}\`);
  console.log(\`❌ Failed updates: \${failCount}\`);
  console.log(\`⚠️  Products needing manual review: \${deletions.length}\`);
  console.log(\`📝 Products needing manual creation: \${missing.length}\`);
  
  if (successCount > 0) {
    console.log('\\n🎉 Products updated successfully!');
  }
  
  if (failCount > 0) {
    console.log('\\n⚠️  Some updates failed. Check error messages above.');
  }
}

// Safety check - require confirmation
console.log('⚠️  WARNING: This script will modify your WordPress products!');
console.log('');
console.log('Actions planned:');
console.log(\`- Update \${${fixActions.summary.updates}} products\`);
console.log(\`- Review \${${fixActions.summary.deletions}} products for deletion\`);
console.log(\`- \${${fixActions.summary.missingProducts}} products need manual creation\`);
console.log('');
console.log('To execute, run: node execute-fixes.js --confirm');

if (process.argv.includes('--confirm')) {
  executeFixes();
} else {
  console.log('\\nAdd --confirm flag to execute the fixes.');
}
`;

  fs.writeFileSync('execute-fixes.js', scriptContent);
  console.log('✅ Executable script created: execute-fixes.js');
  console.log('');
  console.log('📋 NEXT STEPS:');
  console.log('1. Review the fix plan in fix-plan.json');
  console.log('2. When ready, run: node execute-fixes.js --confirm');
  console.log('3. Manually review products marked for deletion');
  console.log('4. Manually create missing products using the reference document');
}

createFixSolution();