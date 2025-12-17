import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'ShopCRM';

if (!uri) {
  throw new Error('Please add your MongoDB URI to .env.local');
}

let cachedClient = null;
let cachedDb = null;

/**
 * Get cached MongoDB database connection
 * Uses globalThis to cache across Next.js hot reloads
 */
export async function getDb() {
  if (cachedDb) {
    return cachedDb;
  }

  if (!cachedClient) {
    cachedClient = new MongoClient(uri, {
      maxPoolSize: 10,
      minPoolSize: 2,
    });
    await cachedClient.connect();
    console.log('[MongoDB] Connected to database');
  }

  cachedDb = cachedClient.db(dbName);
  
  // Store in globalThis for Next.js dev mode
  if (typeof globalThis !== 'undefined') {
    globalThis._mongoClient = cachedClient;
    globalThis._mongoDb = cachedDb;
  }

  return cachedDb;
}

/**
 * Get MongoDB client (use sparingly, prefer getDb)
 */
export async function getClient() {
  if (cachedClient) {
    return cachedClient;
  }
  
  cachedClient = new MongoClient(uri, {
    maxPoolSize: 10,
    minPoolSize: 2,
  });
  
  await cachedClient.connect();
  
  if (typeof globalThis !== 'undefined') {
    globalThis._mongoClient = cachedClient;
  }
  
  return cachedClient;
}
