import { getDb } from './mongo.js';
import { COLLECTIONS } from './collections.js';
import productsData from '../../data/products.json';
import dealsData from '../../data/deals.json';
import reviewsData from '../../data/reviews.json';

let seeded = false;

// Demo users for development/testing
const DEMO_USERS = [
  { email: 'admin@shop.com', password: 'admin123', name: 'adminCRM', role: 'admin' },
  { email: 'dev@shop.com', password: 'dev123', name: 'devCRM', role: 'user' },
  { email: 'test@shop.com', password: 'test123', name: 'testCRM', role: 'user' },
];

/**
 * Seed MongoDB collections from static JSON files
 * Only runs if collections are empty (idempotent)
 */
export async function seedDatabase() {
  // Prevent multiple seed attempts
  if (seeded) {
    return { success: true, message: 'Already seeded' };
  }

  try {
    const db = await getDb();
    
    // Update existing users with role field if missing
    const usersCollection = db.collection(COLLECTIONS.USERS);
    const usersCount = await usersCollection.countDocuments();
    
    if (usersCount > 0) {
      // Update admin@shop.com to have admin role
      await usersCollection.updateOne(
        { email: 'admin@shop.com' },
        { $set: { role: 'admin' } }
      );
      
      // Update other demo users to have user role
      await usersCollection.updateMany(
        { email: { $in: ['dev@shop.com', 'test@shop.com'] } },
        { $set: { role: 'user' } }
      );
      
      console.log('[Seed] Updated existing users with role field');
    }
    
    // Seed demo users first
    await seedCollection(
      db,
      COLLECTIONS.USERS,
      DEMO_USERS,
      'demo users'
    );
    
    // Seed products
    await seedCollection(
      db,
      COLLECTIONS.PRODUCTS,
      productsData,
      'products'
    );

    // Seed deals
    await seedCollection(
      db,
      COLLECTIONS.DEALS,
      dealsData,
      'deals'
    );

    // Seed reviews
    await seedCollection(
      db,
      COLLECTIONS.REVIEWS,
      reviewsData,
      'reviews'
    );

    seeded = true;
    console.log('[Seed] Database seeding complete');
    
    return { success: true, message: 'Database seeded successfully' };
  } catch (error) {
    console.error('[Seed] Error seeding database:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Seed a single collection if empty
 */
async function seedCollection(db, collectionName, data, label) {
  try {
    const collection = db.collection(collectionName);
    
    // Check if collection already has data
    const count = await collection.countDocuments();
    
    if (count > 0) {
      console.log(`[Seed] ${label} already exists (${count} documents), skipping`);
      return;
    }

    // Add createdAt to all documents
    const documentsWithTimestamps = data.map(doc => ({
      ...doc,
      createdAt: new Date()
    }));

    // Insert data
    const result = await collection.insertMany(documentsWithTimestamps);
    console.log(`[Seed] Inserted ${result.insertedCount} ${label}`);
    
    // Create indexes based on schema
    await createIndexes(collection, collectionName);
    
  } catch (error) {
    console.error(`[Seed] Error seeding ${label}:`, error.message);
    throw error;
  }
}

/**
 * Create indexes for collections
 */
async function createIndexes(collection, collectionName) {
  try {
    if (collectionName === COLLECTIONS.PRODUCTS) {
      await collection.createIndex({ id: 1 }, { unique: true });
      await collection.createIndex({ category: 1 });
      await collection.createIndex({ price: 1 });
      await collection.createIndex({ rating: -1 });
    }
    
    if (collectionName === COLLECTIONS.DEALS) {
      await collection.createIndex({ id: 1 }, { unique: true });
      await collection.createIndex({ dealEndDate: 1 });
    }
    
    if (collectionName === COLLECTIONS.REVIEWS) {
      await collection.createIndex({ id: 1 }, { unique: true });
      await collection.createIndex({ productId: 1 });
      await collection.createIndex({ userId: 1 });
    }
    
    if (collectionName === COLLECTIONS.USERS) {
      await collection.createIndex({ email: 1 }, { unique: true });
    }
    
    console.log(`[Seed] Created indexes for ${collectionName}`);
  } catch (error) {
    // Ignore index errors (may already exist)
    if (error.code !== 11000) {
      console.warn(`[Seed] Index creation warning for ${collectionName}:`, error.message);
    }
  }
}

/**
 * Reset database (CAUTION: Deletes all data)
 * Use only for development
 */
export async function resetDatabase() {
  try {
    const db = await getDb();
    
    await db.collection(COLLECTIONS.PRODUCTS).deleteMany({});
    await db.collection(COLLECTIONS.DEALS).deleteMany({});
    await db.collection(COLLECTIONS.REVIEWS).deleteMany({});
    await db.collection(COLLECTIONS.USERS).deleteMany({});
    await db.collection(COLLECTIONS.ADDRESSES).deleteMany({});
    await db.collection(COLLECTIONS.AGENTS).deleteMany({});
    await db.collection(COLLECTIONS.ORDERS).deleteMany({});
    
    seeded = false;
    
    console.log('[Seed] Database reset complete');
    return { success: true, message: 'Database reset successfully' };
  } catch (error) {
    console.error('[Seed] Error resetting database:', error.message);
    return { success: false, error: error.message };
  }
}
