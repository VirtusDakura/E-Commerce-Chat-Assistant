// Database Cleanup Script
// Run this to remove unused collections from your MongoDB Atlas database

import mongoose from 'mongoose';
import 'dotenv/config';

const cleanupDatabase = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    
    // Get all collections
    const collections = await db.listCollections().toArray();
    console.log('\n📊 Current collections:');
    collections.forEach(col => {
      console.log(`  - ${col.name}`);
    });

    // Collections that should exist in your project
    const validCollections = [
      'carts',
      'conversations',
      'products',
      'tokenblacklists',
      'users',
      'wishlists',
    ];

    // Find collections that shouldn't exist
    const collectionsToRemove = collections
      .map(col => col.name)
      .filter(name => !validCollections.includes(name) && !name.startsWith('system.'));

    if (collectionsToRemove.length === 0) {
      console.log('\n✅ Database is clean! No unused collections found.');
    } else {
      console.log('\n⚠️  Found unused collections:');
      collectionsToRemove.forEach(col => {
        console.log(`  - ${col}`);
      });

      console.log('\n🗑️  Removing unused collections...');
      
      for (const collectionName of collectionsToRemove) {
        await db.dropCollection(collectionName);
        console.log(`  ✅ Dropped: ${collectionName}`);
      }
      
      console.log('\n✅ Database cleanup complete!');
    }

    // Show final collections
    const finalCollections = await db.listCollections().toArray();
    console.log('\n📊 Collections after cleanup:');
    finalCollections.forEach(col => {
      console.log(`  - ${col.name}`);
    });

  } catch (error) {
    console.error('❌ Error during cleanup:', error.message);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
};

cleanupDatabase();
