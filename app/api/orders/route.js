import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db/mongo';
import { COLLECTIONS } from '@/lib/db/collections';
import { ObjectId } from 'mongodb';

// GET: Fetch user's orders
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
    const collection = db.collection(COLLECTIONS.ORDERS);

    const orders = await collection
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({
      success: true,
      data: orders
    });

  } catch (error) {
    console.error('[API] Orders GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders', details: error.message },
      { status: 500 }
    );
  }
}

// POST: Create new order
export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      userId, 
      items, 
      total, 
      addressId, 
      paymentMethod,
      autoOrdered,
      agentRuleId
    } = body;

    // Validation
    if (!userId || !items || items.length === 0 || !total) {
      return NextResponse.json(
        { error: 'User ID, items, and total are required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collection = db.collection(COLLECTIONS.ORDERS);

    const newOrder = {
      userId,
      items,
      total,
      addressId: addressId || null,
      status: 'pending',
      paymentMethod: paymentMethod || 'COD',
      autoOrdered: autoOrdered || false,
      agentRuleId: agentRuleId || null,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await collection.insertOne(newOrder);

    return NextResponse.json({
      success: true,
      order: { ...newOrder, _id: result.insertedId }
    });

  } catch (error) {
    console.error('[API] Orders POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create order', details: error.message },
      { status: 500 }
    );
  }
}

// PUT: Update order status
export async function PUT(request) {
  try {
    const body = await request.json();
    const { orderId, userId, status } = body;

    if (!orderId || !userId || !status) {
      return NextResponse.json(
        { error: 'Order ID, User ID, and status are required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collection = db.collection(COLLECTIONS.ORDERS);

    const result = await collection.updateOne(
      { _id: new ObjectId(orderId), userId },
      { 
        $set: { 
          status,
          updatedAt: new Date()
        } 
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Order updated successfully'
    });

  } catch (error) {
    console.error('[API] Orders PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update order', details: error.message },
      { status: 500 }
    );
  }
}
