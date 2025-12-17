import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db/mongo';
import { COLLECTIONS } from '@/lib/db/collections';
import { ObjectId } from 'mongodb';

// GET: Fetch user's addresses
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
    const collection = db.collection(COLLECTIONS.ADDRESSES);

    const addresses = await collection.find({ userId }).toArray();

    return NextResponse.json({
      success: true,
      data: addresses
    });

  } catch (error) {
    console.error('[API] Addresses GET error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch addresses', details: error.message },
      { status: 500 }
    );
  }
}

// POST: Create new address
export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, fullName, email, phone, street, city, state, zipCode, country, isDefault } = body;

    // Validation
    if (!userId || !fullName || !email || !phone || !street || !city || !state || !zipCode || !country) {
      return NextResponse.json(
        { error: 'All address fields are required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collection = db.collection(COLLECTIONS.ADDRESSES);

    // If this is default, unset other defaults for this user
    if (isDefault) {
      await collection.updateMany(
        { userId, isDefault: true },
        { $set: { isDefault: false } }
      );
    }

    // Check if this is the first address (auto-set as default)
    const addressCount = await collection.countDocuments({ userId });
    const shouldBeDefault = addressCount === 0 || isDefault;

    const newAddress = {
      userId,
      fullName,
      email,
      phone,
      street,
      city,
      state,
      zipCode,
      country,
      isDefault: shouldBeDefault,
      createdAt: new Date()
    };

    const result = await collection.insertOne(newAddress);

    return NextResponse.json({
      success: true,
      address: { ...newAddress, _id: result.insertedId }
    });

  } catch (error) {
    console.error('[API] Addresses POST error:', error);
    return NextResponse.json(
      { error: 'Failed to create address', details: error.message },
      { status: 500 }
    );
  }
}

// PUT: Update address
export async function PUT(request) {
  try {
    const body = await request.json();
    const { addressId, userId, fullName, email, phone, street, city, state, zipCode, country, isDefault } = body;

    if (!addressId || !userId) {
      return NextResponse.json(
        { error: 'Address ID and User ID are required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collection = db.collection(COLLECTIONS.ADDRESSES);

    // If this is default, unset other defaults for this user
    if (isDefault) {
      await collection.updateMany(
        { userId, isDefault: true, _id: { $ne: new ObjectId(addressId) } },
        { $set: { isDefault: false } }
      );
    }

    const updateData = {
      fullName,
      email,
      phone,
      street,
      city,
      state,
      zipCode,
      country,
      isDefault
    };

    const result = await collection.updateOne(
      { _id: new ObjectId(addressId), userId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Address updated successfully'
    });

  } catch (error) {
    console.error('[API] Addresses PUT error:', error);
    return NextResponse.json(
      { error: 'Failed to update address', details: error.message },
      { status: 500 }
    );
  }
}

// DELETE: Remove address
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const addressId = searchParams.get('addressId');
    const userId = searchParams.get('userId');

    if (!addressId || !userId) {
      return NextResponse.json(
        { error: 'Address ID and User ID are required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const collection = db.collection(COLLECTIONS.ADDRESSES);

    // Check if this is the default address
    const address = await collection.findOne({ _id: new ObjectId(addressId), userId });
    
    if (!address) {
      return NextResponse.json(
        { error: 'Address not found' },
        { status: 404 }
      );
    }

    // Delete the address
    await collection.deleteOne({ _id: new ObjectId(addressId), userId });

    // If it was default, set another address as default
    if (address.isDefault) {
      const nextAddress = await collection.findOne({ userId });
      if (nextAddress) {
        await collection.updateOne(
          { _id: nextAddress._id },
          { $set: { isDefault: true } }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Address deleted successfully'
    });

  } catch (error) {
    console.error('[API] Addresses DELETE error:', error);
    return NextResponse.json(
      { error: 'Failed to delete address', details: error.message },
      { status: 500 }
    );
  }
}
