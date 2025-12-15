"use client";

import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import CartItem from '@/components/cart/cartItem';
import CartSummary from '@/components/cart/cartSummary';
import Button from '@/components/common/button';
import { FaShoppingCart } from 'react-icons/fa';

export default function CartPage() {
  const router = useRouter();
  const { items } = useSelector((state) => state.cart);

  if(items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-md mx-auto">
          <FaShoppingCart className="w-32 h-32 mx-auto mb-6 text-gray-300" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">Add some products to get started!</p>
          <Button onClick={() => router.push('/products')} variant='primary' size='lg'>
            Continue Shopping
          </Button>
        </div>
      </div>
    )
  }
  return (
    <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Shopping Cart</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                {items.map((item)=>(
                    <CartItem key={item.id} item={item} />
                ))}
            </div>
            <div className="lg:col-span-1">
                <CartSummary />
            </div>
        </div>
    </div>
  )



}
