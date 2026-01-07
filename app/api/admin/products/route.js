import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db/mongo';
import { COLLECTIONS } from '@/lib/db/collections';

/**
 * Admin-only Products API
 * Requires user.role === 'admin'
 */

// Helper: Verify admin role
async function verifyAdmin(request) {
  try {
    // Get userId from headers (set by auth middleware or client)
    const userId = request.headers.get('x-user-id');
    
    console.log('[Admin API] x-user-id header:', userId);
    
    if (!userId) {
      return { authorized: false, error: 'Not authenticated' };
    }

    const db = await getDb();
    const user = await db.collection(COLLECTIONS.USERS).findOne({ 
      email: userId
    });

    console.log('[Admin API] Found user:', user ? { email: user.email, role: user.role } : 'null');

    if (!user || user.role !== 'admin') {
      return { authorized: false, error: 'Admin access required' };
    }

    return { authorized: true, user };
  } catch (error) {
    console.error('[Admin API] Verify error:', error);
    return { authorized: false, error: 'Auth verification failed' };
  }
}

/**
 * GET /api/admin/products
 * Fetch ALL products (including inactive)
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
    const { searchParams } = new URL(request.url);
    
    const type = searchParams.get('type') || 'products';
    const collection = type === 'deals' ? COLLECTIONS.DEALS : COLLECTIONS.PRODUCTS;
    
    const products = await db
      .collection(collection)
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ 
      products,
      count: products.length 
    });
  } catch (error) {
    console.error('[Admin API] Fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/products
 * Create new product
 */
export async function POST(request) {
  const auth = await verifyAdmin(request);
  
  if (!auth.authorized) {
    return NextResponse.json(
      { error: auth.error },
      { status: auth.error === 'Not authenticated' ? 401 : 403 }
    );
  }

  try {
    const body = await request.json();
    const db = await getDb();

    // Compute finalPrice
    const finalPrice = body.discountPercentage 
      ? body.price * (1 - body.discountPercentage / 100)
      : body.price;

    // Generate next ID
    const lastProduct = await db
      .collection(COLLECTIONS.PRODUCTS)
      .find({})
      .sort({ id: -1 })
      .limit(1)
      .toArray();
    
    const nextId = lastProduct.length > 0 ? lastProduct[0].id + 1 : 211;

    const newProduct = {
      id: nextId,
      name: body.name,
      description: body.description,
      category: body.category,
      price: body.price,
      originalPrice: body.price,
      discount: body.discountPercentage || 0,
      discountPercentage: body.discountPercentage || 0,
      finalPrice,
      stock: body.stock,
      image: body.images?.[0] || '',
      images: body.images || [],
      tags: body.tags || [],
      rating: 0,
      reviewCount: 0,
      isDeal: body.isDeal || false,
      dealExpiry: body.dealExpiry || null,
      isActive: body.isActive !== false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const collection = body.isDeal ? COLLECTIONS.DEALS : COLLECTIONS.PRODUCTS;
    const result = await db.collection(collection).insertOne(newProduct);

    return NextResponse.json({
      success: true,
      product: { ...newProduct, _id: result.insertedId }
    });
  } catch (error) {
    console.error('[Admin API] Create error:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/admin/products
 * Update existing product
 */
export async function PUT(request) {
  const auth = await verifyAdmin(request);
  
  if (!auth.authorized) {
    return NextResponse.json(
      { error: auth.error },
      { status: auth.error === 'Not authenticated' ? 401 : 403 }
    );
  }

  try {
    const body = await request.json();
    const { productId, ...updates } = body;
    
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID required' },
        { status: 400 }
      );
    }

    const db = await getDb();

    // Compute finalPrice if price or discount changed
    if (updates.price || updates.discountPercentage !== undefined) {
      const currentProduct = await db
        .collection(COLLECTIONS.PRODUCTS)
        .findOne({ id: productId });
      
      const price = updates.price || currentProduct?.price || 0;
      const discount = updates.discountPercentage !== undefined 
        ? updates.discountPercentage 
        : currentProduct?.discountPercentage || 0;
      
      updates.finalPrice = discount ? price * (1 - discount / 100) : price;
      
      if (updates.price) {
        updates.originalPrice = updates.price;
      }
      if (updates.discountPercentage !== undefined) {
        updates.discount = updates.discountPercentage;
      }
    }

    updates.updatedAt = new Date();

    const result = await db
      .collection(COLLECTIONS.PRODUCTS)
      .updateOne(
        { id: productId },
        { $set: updates }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    const updatedProduct = await db
      .collection(COLLECTIONS.PRODUCTS)
      .findOne({ id: productId });

    return NextResponse.json({
      success: true,
      product: updatedProduct
    });
  } catch (error) {
    console.error('[Admin API] Update error:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/products
 * Soft delete (set isActive = false)
 */
export async function DELETE(request) {
  const auth = await verifyAdmin(request);
  
  if (!auth.authorized) {
    return NextResponse.json(
      { error: auth.error },
      { status: auth.error === 'Not authenticated' ? 401 : 403 }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const productId = parseInt(searchParams.get('id'));
    
    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID required' },
        { status: 400 }
      );
    }

    const db = await getDb();
    
    // Soft delete
    const result = await db
      .collection(COLLECTIONS.PRODUCTS)
      .updateOne(
        { id: productId },
        { $set: { isActive: false, updatedAt: new Date() } }
      );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Product deactivated'
    });
  } catch (error) {
    console.error('[Admin API] Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
