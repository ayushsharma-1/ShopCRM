import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db/mongo';
import { COLLECTIONS } from '@/lib/db/collections';

// GET: Fetch user's cart
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collection = db.collection('carts');

    const cart = await collection.findOne({ userId });

    return NextResponse.json({
      success: true,
      data: cart?.items || []
    });

  } catch (error) {
    console.error('[API] Cart GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch cart', details: error.message },
      { status: 500 }
    );
  }
}

// POST: Save user's cart
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, items } = body;

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collection = db.collection('carts');

    // Upsert cart (update if exists, insert if not)
    await collection.updateOne(
      { userId },
      { 
        $set: { 
          items: items || [],
          updatedAt: new Date()
        },
        $setOnInsert: {
          createdAt: new Date()
        }
      },
      { upsert: true }
    );

    return NextResponse.json({
      success: true,
      message: 'Cart saved successfully'
    });

  } catch (error) {
    console.error('[API] Cart POST error:', error);
    return NextResponse.json(
      { error: 'Failed to save cart', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Clear user's cart
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collection = db.collection('carts');

    await collection.updateOne(
      { userId },
      { 
        $set: { 
          items: [],
          updatedAt: new Date()
        }
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Cart cleared successfully'
    });

  } catch (error) {
    console.error('[API] Cart DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to clear cart', details: error.message },
      { status: 500 }
    );
  }
}
