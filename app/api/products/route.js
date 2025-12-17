import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db/mongo';
import { COLLECTIONS } from '@/lib/db/collections';
import { seedDatabase } from '@/lib/db/seed';
import productsData from '@/data/products.json';
import dealsData from '@/data/deals.json';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'products'; // 'products' or 'deals'

    const db = await getDb();
    const collection = db.collection(
      type === 'deals' ? COLLECTIONS.DEALS : COLLECTIONS.PRODUCTS
    );

    // Fetch from MongoDB
    let items = await collection.find({}).toArray();

    // Seed if MongoDB empty
    if (items.length === 0) {
      console.log(`[API] No ${type} in DB, triggering seed...`);
      await seedDatabase();
      
      // Refetch after seeding
      items = await collection.find({}).toArray();
      
      // If still empty, use JSON fallback
      if (items.length === 0) {
        console.log(`[API] Seed failed, using JSON fallback`);
        const fallbackData = type === 'deals' ? dealsData : productsData;
        return NextResponse.json({
          success: true,
          data: fallbackData,
          source: 'json'
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: items,
      source: 'mongodb'
    });

  } catch (error) {
    console.error('[API] Products fetch error:', error);
    
    // Fallback to JSON on error
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'products';
    const fallbackData = type === 'deals' ? dealsData : productsData;
    
    return NextResponse.json({
      success: true,
      data: fallbackData,
      source: 'json-fallback'
    });
  }
}
