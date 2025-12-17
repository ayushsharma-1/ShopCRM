import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db/mongo';
import { COLLECTIONS } from '@/lib/db/collections';
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
    const items = await collection.find({}).toArray();

    // Fallback to JSON if MongoDB empty
    if (items.length === 0) {
      console.log(`[API] No ${type} in DB, using JSON fallback`);
      const fallbackData = type === 'deals' ? dealsData : productsData;
      return NextResponse.json({
        success: true,
        data: fallbackData,
        source: 'json'
      });
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
