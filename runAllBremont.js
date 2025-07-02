require('dotenv').config();
const { spawn } = require('child_process');
const fs = require('fs');

// Track all products that need to be created
const BATCH_SCHEDULE = [
    { startIndex: 2, batchSize: 2, description: "Supermarine 500m + Rubber" },
    { startIndex: 4, batchSize: 2, description: "Supermarine 300M Bi-Color + GMT Green" },
    { startIndex: 6, batchSize: 2, description: "Supermarine GMT Blue + 300M Black Bracelet" },
    { startIndex: 8, batchSize: 2, description: "Supermarine 300M Black Rubber + Blue Bracelet" },
    { startIndex: 10, batchSize: 2, description: "Supermarine Green + Altitude Chronograph GMT" },
    { startIndex: 12, batchSize: 2, description: "Altitude GMT Black + Silver" },
    { startIndex: 14, batchSize: 2, description: "Altitude Meteor Black Titanium + Leather" },
    { startIndex: 16, batchSize: 2, description: "Altitude Meteor Silver + Leather" },
    { startIndex: 18, batchSize: 2, description: "Altitude 39 Black Leather + Steel" },
    { startIndex: 20, batchSize: 1, description: "Altitude 39 Silver Leather" }
];

async function runBatch(batchInfo) {
    return new Promise((resolve, reject) => {
        console.log(`\n🚀 Starting Batch: ${batchInfo.description}`);
        console.log(`📋 Products ${batchInfo.startIndex + 1} to ${batchInfo.startIndex + batchInfo.batchSize}`);
        
        const child = spawn('node', [
            'completeAllBremont.js',
            batchInfo.startIndex.toString(),
            batchInfo.batchSize.toString(),
            '28624'
        ], {
            stdio: 'inherit'
        });
        
        child.on('close', (code) => {
            if (code === 0) {
                console.log(`✅ Batch completed: ${batchInfo.description}`);
                resolve(batchInfo);
            } else {
                console.error(`❌ Batch failed: ${batchInfo.description}`);
                reject(new Error(`Batch failed with code ${code}`));
            }
        });
        
        child.on('error', (error) => {
            console.error(`💥 Batch error: ${batchInfo.description}`, error);
            reject(error);
        });
    });
}

async function runAllBatches() {
    console.log('🎯 STARTING COMPLETE BREMONT PRODUCT CREATION');
    console.log('============================================');
    console.log(`📊 Total batches to process: ${BATCH_SCHEDULE.length}`);
    console.log(`📈 Estimated products to create: ${BATCH_SCHEDULE.reduce((sum, batch) => sum + batch.batchSize, 0)}`);
    console.log('');
    
    const results = [];
    let successCount = 0;
    let errorCount = 0;
    
    for (let i = 0; i < BATCH_SCHEDULE.length; i++) {
        const batchInfo = BATCH_SCHEDULE[i];
        
        try {
            console.log(`\n📋 Processing batch ${i + 1}/${BATCH_SCHEDULE.length}`);
            
            await runBatch(batchInfo);
            
            results.push({
                ...batchInfo,
                status: 'completed',
                batchNumber: i + 1
            });
            
            successCount += batchInfo.batchSize;
            
            // Add delay between batches
            if (i < BATCH_SCHEDULE.length - 1) {
                console.log('⏳ Waiting 5 seconds before next batch...');
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
            
        } catch (error) {
            console.error(`❌ Batch ${i + 1} failed:`, error.message);
            
            results.push({
                ...batchInfo,
                status: 'failed',
                error: error.message,
                batchNumber: i + 1
            });
            
            errorCount += batchInfo.batchSize;
            
            // Continue with next batch despite failure
            console.log('⚠️  Continuing with next batch...');
        }
    }
    
    // Save final results
    fs.writeFileSync('bremont-all-batches-results.json', JSON.stringify(results, null, 2));
    
    console.log('\n🎉 ALL BATCHES COMPLETED!');
    console.log('========================');
    console.log(`✅ Successful batches: ${results.filter(r => r.status === 'completed').length}`);
    console.log(`❌ Failed batches: ${results.filter(r => r.status === 'failed').length}`);
    console.log(`📊 Estimated products created: ${successCount}`);
    console.log(`📁 Results saved to: bremont-all-batches-results.json`);
    
    return results;
}

// If run directly
if (require.main === module) {
    runAllBatches()
        .then(() => {
            console.log('\n🎯 All Bremont products creation process completed!');
            process.exit(0);
        })
        .catch(error => {
            console.error('💥 Overall process failed:', error.message);
            process.exit(1);
        });
}

module.exports = { runAllBatches, BATCH_SCHEDULE };