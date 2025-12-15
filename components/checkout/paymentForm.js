"use client";

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePayment, nextStep, prevStep } from '@/lib/redux/slices/checkoutSlice';
import Input from '../common/Input';
import Button from '../common/button';

export default function PaymentForm() {
  const dispatch = useDispatch();
  const payment = useSelector((state) => state.checkout.payment);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(payment);

  const handleChange = (e) => {
    let { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      value = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      value = value.slice(0, 19); // 16 digits + 3 spaces
    }
    
    // Format expiry date
    if (name === 'expiryDate') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      value = value.slice(0, 5);
    }
    
    // Format CVV
    if (name === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 3);
    }
    
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    const cardNumberDigits = formData.cardNumber.replace(/\s/g, '');
    if (!cardNumberDigits) {
      newErrors.cardNumber = 'Card number is required';
    } else if (cardNumberDigits.length !== 16) {
      newErrors.cardNumber = 'Card number must be 16 digits';
    }
    
    if (!formData.cardName.trim()) {
      newErrors.cardName = 'Cardholder name is required';
    }
    
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Format: MM/YY';
    } else {
      const [month, year] = formData.expiryDate.split('/');
      const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
      const now = new Date();
      if (expiry < now) {
        newErrors.expiryDate = 'Card has expired';
      }
    }
    
    if (!formData.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (formData.cvv.length !== 3) {
      newErrors.cvv = 'CVV must be 3 digits';
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      dispatch(updatePayment(formData));
      dispatch(nextStep());
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Payment Information</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Card Number"
          name="cardNumber"
          placeholder="1234 5678 9012 3456"
          value={formData.cardNumber}
          onChange={handleChange}
          error={errors.cardNumber}
          required
        />

        <Input
          label="Cardholder Name"
          name="cardName"
          placeholder="John Doe"
          value={formData.cardName}
          onChange={handleChange}
          error={errors.cardName}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Expiry Date"
            name="expiryDate"
            placeholder="MM/YY"
            value={formData.expiryDate}
            onChange={handleChange}
            error={errors.expiryDate}
            required
          />
          <Input
            label="CVV"
            name="cvv"
            type="password"
            placeholder="123"
            value={formData.cvv}
            onChange={handleChange}
            error={errors.cvv}
            required
          />
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> Your payment information is encrypted and secure.
          </p>
        </div>

        <div className="flex justify-between gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => dispatch(prevStep())}
          >
            Back
          </Button>
          <Button type="submit" size="lg">
            Continue to Review
          </Button>
        </div>
      </form>
    </div>
  );
}