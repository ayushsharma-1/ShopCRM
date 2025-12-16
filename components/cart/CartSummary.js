'use client';

import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaLock, FaShippingFast } from 'react-icons/fa';

export default function CartSummary() {
  const router = useRouter();
  const { totalAmount, totalItems } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const shippingCost = totalAmount > 100 ? 0 : 10;
  const tax = totalAmount * 0.1;
  const finalTotal = totalAmount + shippingCost + tax;
  const freeShippingProgress = Math.min((totalAmount / 100) * 100, 100);
  const remainingForFreeShipping = Math.max(100 - totalAmount, 0);

  const handleCheckout = () => {
    if (!isAuthenticated) {
      toast.warning('Please login to proceed with checkout');
      router.push('/login');
      return;
    }
    router.push('/checkout');
  };

  return (
    <motion.aside
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white border border-neutral-200/60 rounded-2xl p-5 space-y-5 lg:sticky lg:top-24"
    >
      <h2 className="text-lg font-semibold text-neutral-900">Order Summary</h2>
      {totalAmount < 100 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600">Free shipping</span>
            <span className="text-xs text-neutral-500">
              ${remainingForFreeShipping.toFixed(2)} away
            </span>
          </div>
          <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${freeShippingProgress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="h-full bg-neutral-900 rounded-full"
            />
          </div>
        </div>
      )}

      {totalAmount >= 100 && (
        <div className="flex items-center gap-2 p-3 bg-neutral-50 rounded-xl">
          <FaShippingFast className="text-neutral-900" />
          <span className="text-sm font-medium text-neutral-900">
            Free shipping unlocked!
          </span>
        </div>
      )}

      <div className="space-y-3 py-4 border-t border-b border-neutral-100">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-600">Subtotal ({totalItems} items)</span>
          <span className="font-medium text-neutral-900">₹{totalAmount.toFixed(2)}</span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-neutral-600">Shipping</span>
          <span className="font-medium text-neutral-900">
            {shippingCost === 0 ? (
              <span className="text-green-600">FREE</span>
            ) : (
              `₹${shippingCost.toFixed(2)}`
            )}
          </span>
        </div>

        <div className="flex justify-between text-sm">
          <span className="text-neutral-600">Tax</span>
          <span className="font-medium text-neutral-900">₹{tax.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex justify-between items-baseline">
        <span className="text-base font-semibold text-neutral-900">Total</span>
        <span className="text-2xl font-bold text-neutral-900">₹{finalTotal.toFixed(2)}</span>
      </div>

      <motion.button
        whileTap={{ scale: 0.98 }}
        onClick={handleCheckout}
        disabled={totalItems === 0}
        className="w-full py-3.5 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-all duration-200 font-medium disabled:bg-neutral-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <FaLock className="text-xs" />
        <span>Proceed to Checkout</span>
      </motion.button>
      {!isAuthenticated && (
        <p className="text-xs text-center text-neutral-500">
          You'll be asked to login before checkout
        </p>
      )}
      <div className="pt-4 border-t border-neutral-100">
        <div className="grid grid-cols-2 gap-3 text-xs text-neutral-600">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span>Secure checkout</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <span>Easy returns</span>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
