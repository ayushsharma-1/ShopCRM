"use client";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { prevStep, setProcessing, resetCheckout } from "@/lib/redux/slices/checkoutSlice";
import { clearCart } from "@/lib/redux/slices/cartSlice";
import Button from "../common/button";

export default function OrderSummary() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const { address, payment, isProcessing } = useSelector((state) => state.checkout);
  const { items, totalAmount } = useSelector((state) => state.cart);
  
  const shippingCost = totalAmount > 100 ? 0 : 10;
  const tax = totalAmount * 0.1;
  const finalAmount = totalAmount + shippingCost + tax;

  const handlePlaceOrder = () => {
    dispatch(setProcessing(true));
    setTimeout(() => {
      setOrderPlaced(true);
      setTimeout(() => {
        dispatch(clearCart());
        dispatch(resetCheckout());
        router.push('/products');
      }, 2000);
    }, 1000);
  };

  if (orderPlaced) {
    return (
      <div className="max-w-md mx-auto text-center p-8">
        <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Placed Successfully!</h2>
        <p className="text-gray-600 mb-1">Thank you for your purchase.</p>
        <p className="text-sm text-gray-500">Redirecting to Products Page...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

      {/* Shipping Address */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-3">Shipping Address</h3>
        <div className="text-gray-700">
          <p className="font-medium">{address.fullName}</p>
          <p>{address.street}</p>
          <p>{address.city}, {address.state} {address.zipCode}</p>
          <p>{address.country}</p>
          <p className="mt-2">Email: {address.email}</p>
          <p>Phone: {address.phone}</p>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-3">Payment Method</h3>
        <div className="text-gray-700">
          <p>Card ending in {payment.cardNumber.slice(-4)}</p>
          <p>Cardholder: {payment.cardName}</p>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-3">Order Items ({items.length})</h3>
        <div className="divide-y">
          {items.map((item) => (
            <div key={item.id} className="py-3 flex justify-between">
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
              </div>
              <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Price Summary */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-3">Price Details</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between">
            <span>Tax (10%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="border-t pt-2 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${finalAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between gap-4">
        <Button
          variant="outline"
          onClick={() => dispatch(prevStep())}
          disabled={isProcessing}
        >
          Back
        </Button>
        <Button
          onClick={handlePlaceOrder}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Confirm Order'}
        </Button>
      </div>
    </div>
  );
}
