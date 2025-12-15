'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import StepIndicator from '@/components/checkout/stepIndicator';
import AddressForm from '@/components/checkout/AddressForm';
import PaymentForm from '@/components/checkout/paymentForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import { resetCheckout } from '@/lib/redux/slices/checkoutSlice';

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentStep, isProcessing } = useSelector((state) => state.checkout);
  const { items } = useSelector((state) => state.cart);

  useEffect(() => {
    // Only redirect if cart is empty AND not currently processing an order
    if (items.length === 0 && !isProcessing) {
      router.push('/cart');
      return;
    }
    if (items.length > 0) {
      dispatch(resetCheckout());
    }
  }, [items, router, dispatch, isProcessing]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <AddressForm />;
      case 2:
        return <PaymentForm />;
      case 3:
        return <OrderSummary />;
      default:
        return <AddressForm />;
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center">Checkout</h1>

      <div className="max-w-3xl mx-auto">
        <StepIndicator currentStep={currentStep} />

        <div className="bg-white rounded-xl shadow-lg p-8">
          {renderStep()}
        </div>
      </div>
    </div>
  );
}
