import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db/mongo';
import { COLLECTIONS } from '@/lib/db/collections';

/**
 * Admin-only Orders API
 * Requires user.role === 'admin'
 */

// Helper: Verify admin role
async function verifyAdmin(request) {
  try {
    const userId = request.headers.get('x-user-id');
    
    if (!userId) {
      return { authorized: false, error: 'Not authenticated' };
    }

    const db = await getDb();
    const user = await db.collection(COLLECTIONS.USERS).findOne({ 
      email: userId
    });

    if (!user || user.role !== 'admin') {
      return { authorized: false, error: 'Admin access required' };
    }

    return { authorized: true, user };
  } catch (error) {
    console.error('[Admin Orders API] Verify error:', error);
    return { authorized: false, error: 'Auth verification failed' };
  }
}

/**
 * GET /api/admin/orders
 * Fetch ALL orders across all users
 */
export async function GET(request) {
  const auth = await verifyAdmin(request);
  
  if (!auth.authorized) {
    return NextResponse.json(
      { error: auth.error },
      { status: auth.error === 'Not authenticated' ? 401 : 403 }
    );
  }

  try {
    const db = await getDb();
    const collection = db.collection(COLLECTIONS.ORDERS);

    const orders = await collection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: orders,
      count: orders.length
    });

  } catch (error) {
    console.error('[Admin Orders API] Fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders', details: error.message },
      { status: 500 }
    );
  }
}
