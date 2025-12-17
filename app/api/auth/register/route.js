import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db/mongo';
import { COLLECTIONS } from '@/lib/db/collections';

export async function POST(request) {
  try {
    const { email, password, name } = await request.json();

    // Validation
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const usersCollection = db.collection(COLLECTIONS.USERS);

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = {
      email,
      password, // PROTOTYPE ONLY - Plain password
      name,
      createdAt: new Date()
    };

    const result = await usersCollection.insertOne(newUser);

    // Return user without password
    const user = {
      userId: result.insertedId.toString(),
      email: newUser.email,
      name: newUser.name
    };

    return NextResponse.json({ 
      success: true, 
      user 
    });

  } catch (error) {
    console.error('[API] Register error:', error);
    return NextResponse.json(
      { error: 'Registration failed', details: error.message },
      { status: 500 }
    );
  }
}
