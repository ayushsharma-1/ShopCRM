'use client';

import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import StepIndicator from '@/components/checkout/StepIndicator';
import AddressForm from '@/components/checkout/AddressForm';
import PaymentForm from '@/components/checkout/PaymentForm';
import OrderSummary from '@/components/checkout/OrderSummary';
import { resetCheckout } from '@/lib/redux/slices/checkoutSlice';

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { currentStep } = useSelector((state) => state.checkout);
  const { items } = useSelector((state) => state.cart);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.warning('Please login to access checkout');
      router.push('/login');
      return;
    }

    if (items.length === 0) {
      toast.info('Your cart is empty');
      router.push('/cart');
      return;
    }

    dispatch(resetCheckout());
  }, [isAuthenticated, items, router, dispatch]);

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <AddressForm key="address" />;
      case 2:
        return <PaymentForm key="payment" />;
      case 3:
        return <OrderSummary key="summary" />;
      default:
        return <AddressForm key="address" />;
    }
  };

  if (!isAuthenticated || items.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50/50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900 tracking-tight">
            Checkout
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Complete your purchase securely
          </p>
        </motion.div>

        <StepIndicator currentStep={currentStep} />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
