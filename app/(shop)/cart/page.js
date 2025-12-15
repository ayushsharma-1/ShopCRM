'use client';

import { useSelector } from 'react-redux';
import EmptyCart from '@/components/cart/EmptyCart';
import CartHeader from '@/components/cart/CartHeader';
import CartItemsList from '@/components/cart/CartItemsList';
import CartSummary from '@/components/cart/CartSummary';

export default function CartPage() {
  const { items, totalItems } = useSelector((state) => state.cart);

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50/50 flex items-center justify-center">
        <EmptyCart />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <CartHeader itemCount={totalItems} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-7">
            <CartItemsList items={items} />
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-5">
            <CartSummary />
          </div>
        </div>
      </div>
    </div>
  );
}
