#!/usr/bin/env node
/**
 * Delete the incorrectly uploaded July Land-Dweller banners
 * WordPress Media IDs: 28909, 28910, 28911, 28912
 */

const axios = require('axios');
require('dotenv').config();

const { WP_USER, APP_PASSWORD, WP_URL } = process.env;

if (!WP_USER || !APP_PASSWORD || !WP_URL) {
    console.error('❌ Missing required environment variables');
    process.exit(1);
}

const mediaIdsToDelete = [28909, 28910, 28911, 28912];

async function deleteMedia(mediaId) {
    try {
        const response = await axios.delete(
            `${WP_URL}/wp-json/wp/v2/media/${mediaId}`,
            {
                auth: {
                    username: WP_USER,
                    password: APP_PASSWORD
                },
                params: {
                    force: true // Permanently delete, not trash
                }
            }
        );
        console.log(`✅ Deleted media ID ${mediaId}`);
        return true;
    } catch (error) {
        console.error(`❌ Failed to delete media ID ${mediaId}:`, error.response?.data?.message || error.message);
        return false;
    }
}

async function main() {
    console.log('🗑️  Deleting incorrectly uploaded July Land-Dweller banners...\n');
    
    let successCount = 0;
    let failCount = 0;
    
    for (const mediaId of mediaIdsToDelete) {
        const success = await deleteMedia(mediaId);
        if (success) {
            successCount++;
        } else {
            failCount++;
        }
    }
    
    console.log('\n--- Summary ---');
    console.log(`✅ Successfully deleted: ${successCount}`);
    console.log(`❌ Failed to delete: ${failCount}`);
}

main();