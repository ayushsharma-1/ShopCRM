'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { prevStep, setProcessing, resetCheckout } from '@/lib/redux/slices/checkoutSlice';
import { clearCart } from '@/lib/redux/slices/cartSlice';
import { toast } from 'react-toastify';
import { useState } from 'react';
import OrderConfirmation from './OrderConfirmation';
import CheckoutSection from './CheckoutSection';
import { motion } from 'framer-motion';
import { FaLock } from 'react-icons/fa';

export default function OrderSummary() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { address, payment, isProcessing } = useSelector((state) => state.checkout);
  const { items, totalAmount } = useSelector((state) => state.cart);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const shippingCost = totalAmount > 100 ? 0 : 10;
  const tax = totalAmount * 0.1;
  const finalTotal = totalAmount + shippingCost + tax;

  const handlePlaceOrder = () => {
    dispatch(setProcessing(true));
    
    setTimeout(() => {
      setOrderPlaced(true);
      toast.success('🎉 Order placed successfully!');
      
      setTimeout(() => {
        dispatch(clearCart());
        dispatch(resetCheckout());
        dispatch(setProcessing(false));
        router.replace('/products');
      }, 3000);
    }, 2000);
  };

  if (orderPlaced || isProcessing) {
    return (
      <div className="bg-white border border-neutral-200/60 rounded-2xl p-6 md:p-8">
        <OrderConfirmation isProcessing={isProcessing} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Shipping Address */}
      <CheckoutSection title="Shipping Address">
        <div className="text-sm text-neutral-600 space-y-1">
          <p className="font-semibold text-neutral-900">{address.fullName}</p>
          <p>{address.street}</p>
          <p>{address.city}, {address.state} {address.zipCode}</p>
          <p>{address.country}</p>
          <p className="break-all pt-2 border-t border-neutral-100 mt-2">
            {address.email}
          </p>
          <p>{address.phone}</p>
        </div>
      </CheckoutSection>

      {/* Payment Method */}
      <CheckoutSection title="Payment Method" delay={0.1}>
        <div className="text-sm text-neutral-600 space-y-1">
          <p className="font-semibold text-neutral-900">{payment.cardName}</p>
          <p>•••• •••• •••• {payment.cardNumber.slice(-4)}</p>
          <p>Expires {payment.expiryDate}</p>
        </div>
      </CheckoutSection>

      {/* Order Items */}
      <CheckoutSection title={`Order Items (${items.length})`} delay={0.2}>
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-neutral-50 shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-neutral-900 truncate">
                  {item.name}
                </p>
                <p className="text-xs text-neutral-500">
                  Qty: {item.quantity} × ${item.price}
                </p>
              </div>
              <p className="font-semibold text-sm text-neutral-900">
                ${(item.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </CheckoutSection>

      {/* Price Summary */}
      <CheckoutSection delay={0.3}>
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-neutral-600">
            <span>Subtotal</span>
            <span className="font-medium text-neutral-900">${totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm text-neutral-600">
            <span>Shipping</span>
            <span className="font-medium text-neutral-900">
              {shippingCost === 0 ? (
                <span className="text-green-600">FREE</span>
              ) : (
                `$${shippingCost.toFixed(2)}`
              )}
            </span>
          </div>
          <div className="flex justify-between text-sm text-neutral-600">
            <span>Tax</span>
            <span className="font-medium text-neutral-900">${tax.toFixed(2)}</span>
          </div>
          <div className="border-t border-neutral-200 pt-3">
            <div className="flex justify-between items-baseline">
              <span className="text-base font-semibold text-neutral-900">Total</span>
              <span className="text-2xl font-bold text-neutral-900">
                ${finalTotal.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </CheckoutSection>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex gap-3 pt-2"
      >
        <button
          type="button"
          onClick={() => dispatch(prevStep())}
          disabled={isProcessing}
          className="flex-1 py-3.5 bg-neutral-100 text-neutral-900 rounded-xl hover:bg-neutral-200 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handlePlaceOrder}
          disabled={isProcessing}
          className="flex-1 py-3.5 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-all duration-200 font-medium disabled:bg-neutral-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <FaLock className="text-xs" />
          <span>Place Order</span>
        </motion.button>
      </motion.div>
    </div>
  );
}
