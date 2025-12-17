import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db/mongo';
import { COLLECTIONS } from '@/lib/db/collections';
import { ObjectId } from 'mongodb';

// GET: Fetch user's agent rules
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
    const collection = db.collection(COLLECTIONS.AGENTS);

    const agents = await collection.find({ userId }).toArray();

    return NextResponse.json({
      success: true,
      data: agents
    });

  } catch (error) {
    console.error('[API] Agents GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agents', details: error.message },
      { status: 500 }
    );
  }
}

// POST: Create new agent rule
export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      userId, 
      type, 
      productId, 
      threshold, 
      restockQty, 
      timeoutHours, 
      active, 
      keepActive,
      actionMode,
      addressId,
      userConsent,
      snoozeHours
    } = body;

    // Validation
    if (!userId || !type || !productId) {
      return NextResponse.json(
        { error: 'User ID, type, and product ID are required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collection = db.collection(COLLECTIONS.AGENTS);

    const newAgent = {
      userId,
      type,
      productId: parseInt(productId),
      threshold: threshold || 0,
      restockQty: restockQty || 1,
      timeoutHours: timeoutHours || 24,
      active: active !== false, // default true
      keepActive: keepActive || false,
      actionMode: actionMode || 'notify',
      addressId: addressId || null,
      userConsent: userConsent || false,
      snoozeHours: snoozeHours || 24,
      createdAt: new Date(),
      snoozeUntil: null,
      lastTriggered: null
    };

    const result = await collection.insertOne(newAgent);

    return NextResponse.json({
      success: true,
      agent: { ...newAgent, _id: result.insertedId }
    });

  } catch (error) {
    console.error('[API] Agents POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create agent rule', details: error.message },
      { status: 500 }
    );
  }
}

// PUT: Update agent rule
export async function PUT(request) {
  try {
    const body = await request.json();
    const { agentId, userId, ...updateFields } = body;

    if (!agentId || !userId) {
      return NextResponse.json(
        { error: 'Agent ID and User ID are required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collection = db.collection(COLLECTIONS.AGENTS);

    // Remove undefined/null values
    const cleanedUpdates = {};
    Object.keys(updateFields).forEach(key => {
      if (updateFields[key] !== undefined) {
        cleanedUpdates[key] = updateFields[key];
      }
    });

    const result = await collection.updateOne(
      { _id: new ObjectId(agentId), userId },
      { $set: cleanedUpdates }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Agent rule not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Agent rule updated successfully'
    });

  } catch (error) {
    console.error('[API] Agents PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update agent rule', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Remove agent rule
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const agentId = searchParams.get('agentId');
    const userId = searchParams.get('userId');

    if (!agentId || !userId) {
      return NextResponse.json(
        { error: 'Agent ID and User ID are required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collection = db.collection(COLLECTIONS.AGENTS);

    const result = await collection.deleteOne({ 
      _id: new ObjectId(agentId), 
      userId 
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: 'Agent rule not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Agent rule deleted successfully'
    });

  } catch (error) {
    console.error('[API] Agents DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete agent rule', details: error.message },
      { status: 500 }
    );
  }
}
