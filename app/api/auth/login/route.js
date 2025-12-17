import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db/mongo';
import { COLLECTIONS } from '@/lib/db/collections';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    const usersCollection = db.collection(COLLECTIONS.USERS);

    // Find user by email
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check password (PROTOTYPE ONLY - Plain comparison)
    if (user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Return user without password
    const userResponse = {
      userId: user._id.toString(),
      email: user.email,
      name: user.name
    };

    return NextResponse.json({ 
      success: true, 
      user: userResponse 
    });

  } catch (error) {
    console.error('[API] Login error:', error);
    return NextResponse.json(
      { error: 'Login failed', details: error.message },
      { status: 500 }
    );
  }
}
