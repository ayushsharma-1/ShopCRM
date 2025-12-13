"use client";

import { useSelector } from 'react-redux';
import StepIndicator from './stepIndicator';
import AddressForm from './AddressForm';
import PaymentForm from './paymentForm';
import OrderSummary from './OrderSummary';

export default function CheckoutWizard() {
  const currentStep = useSelector((state) => state.checkout.currentStep);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Checkout</h1>
        
        <StepIndicator />

        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          {currentStep === 1 && <AddressForm />}
          {currentStep === 2 && <PaymentForm />}
          {currentStep === 3 && <OrderSummary />}
        </div>
      </div>
    </div>
  );
}
