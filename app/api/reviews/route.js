import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db/mongo';
import { COLLECTIONS } from '@/lib/db/collections';
import reviewsData from '@/data/reviews.json';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    const db = await getDb();
    const collection = db.collection(COLLECTIONS.REVIEWS);

    let query = {};
    if (productId) {
      query = { productId: parseInt(productId) };
    }

    // Fetch from MongoDB
    const reviews = await collection.find(query).toArray();

    // Fallback to JSON if MongoDB empty
    if (reviews.length === 0) {
      console.log('[API] No reviews in DB, using JSON fallback');
      const fallbackReviews = productId 
        ? reviewsData.filter(r => r.productId === parseInt(productId))
        : reviewsData;
      
      return NextResponse.json({
        success: true,
        data: fallbackReviews,
        source: 'json'
      });
    }

    return NextResponse.json({
      success: true,
      data: reviews,
      source: 'mongodb'
    });

  } catch (error) {
    console.error('[API] Reviews fetch error:', error);
    
    // Fallback to JSON on error
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');
    const fallbackReviews = productId 
      ? reviewsData.filter(r => r.productId === parseInt(productId))
      : reviewsData;
    
    return NextResponse.json({
      success: true,
      data: fallbackReviews,
      source: 'json-fallback'
    });
  }
}
