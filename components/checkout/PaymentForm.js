'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePayment, nextStep, prevStep } from '@/lib/redux/slices/checkoutSlice';
import Input from '../common/Input';
import Button from '../common/Button';
import { toast } from 'react-toastify';
import { FaCreditCard } from 'react-icons/fa';

export default function PaymentForm() {
  const dispatch = useDispatch();
  const { payment } = useSelector((state) => state.checkout);
  const [formData, setFormData] = useState(payment);
  const [errors, setErrors] = useState({});

  const handleUseDemoData = () => {
    const demoData = {
      cardNumber: '4532 1234 5678 9010',
      cardName: 'Rajesh Kumar',
      expiryDate: '12/28',
      cvv: '123'
    };
    setFormData(demoData);
    setErrors({});
    toast.info('Demo payment details filled');
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    
    // Strict validation: Only numbers allowed for card number
    if (name === 'cardNumber') {
      value = value.replace(/\D/g, '').slice(0, 16);
      // Format with spaces for display
      value = value.replace(/(.{4})/g, '$1 ').trim();
    }
    
    // Strict validation: Only letters and spaces for cardholder name
    if (name === 'cardName') {
      value = value.replace(/[^a-zA-Z\s]/g, '');
    }
    
    // Strict validation: Only numbers for expiry date, format as MM/YY
    if (name === 'expiryDate') {
      value = value.replace(/\D/g, '');
      if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
      }
      value = value.slice(0, 5);
    }

    // Strict validation: Only numbers for CVV, max 3 digits
    if (name === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 3);
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    // Strict card number validation
    if (!formData.cardNumber) {
      newErrors.cardNumber = 'Card number is required';
    } else {
      const cardDigits = formData.cardNumber.replace(/\s/g, '');
      if (!/^\d{16}$/.test(cardDigits)) {
        newErrors.cardNumber = 'Card number must be exactly 16 digits';
      }
    }
    
    // Strict cardholder name validation
    if (!formData.cardName) {
      newErrors.cardName = 'Cardholder name is required';
    } else if (formData.cardName.trim().length < 3) {
      newErrors.cardName = 'Name must be at least 3 characters';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.cardName)) {
      newErrors.cardName = 'Name can only contain letters';
    }
    
    // Strict expiry date validation
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiryDate)) {
      newErrors.expiryDate = 'Invalid format (MM/YY)';
    } else {
      const [month, year] = formData.expiryDate.split('/');
      const monthNum = parseInt(month, 10);
      if (monthNum < 1 || monthNum > 12) {
        newErrors.expiryDate = 'Invalid month (01-12)';
      }
      const currentYear = new Date().getFullYear() % 100;
      const currentMonth = new Date().getMonth() + 1;
      const yearNum = parseInt(year, 10);
      if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
        newErrors.expiryDate = 'Card has expired';
      }
    }
    
    // Strict CVV validation (exactly 3 digits)
    if (!formData.cvv) {
      newErrors.cvv = 'CVV is required';
    } else if (!/^\d{3}$/.test(formData.cvv)) {
      newErrors.cvv = 'CVV must be exactly 3 digits';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fill in all payment details correctly');
      return;
    }

    dispatch(updatePayment(formData));
    dispatch(nextStep());
    toast.success('Payment details saved!');
  };

  return (
    <div className="bg-white border border-neutral-200/60 rounded-2xl p-6 md:p-8">
      <h2 className="text-xl font-semibold text-neutral-900 mb-6">Payment Details</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex items-start justify-between gap-3 p-4 bg-neutral-50 border border-neutral-200 rounded-xl">
          <div className="flex items-start gap-3 flex-1">
            <FaCreditCard className="text-neutral-600 mt-0.5 shrink-0" />
            <div className="text-sm">
              <p className="font-medium text-neutral-900">Demo Payment Mode</p>
              <p className="text-neutral-600 text-xs mt-1">
                Click "Use Demo" to auto-fill • Example: 4532 1234 5678 9010, Rajesh Kumar, 12/28, 123
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleUseDemoData}
            className="whitespace-nowrap text-sm"
          >
            Use Demo
          </Button>
        </div>

        <Input
          label="Card Number"
          name="cardNumber"
          value={formData.cardNumber}
          onChange={handleChange}
          placeholder="1234 5678 9012 3456"
          error={errors.cardNumber}
          required
        />

        <Input
          label="Cardholder Name"
          name="cardName"
          value={formData.cardName}
          onChange={handleChange}
          placeholder="Rajesh Kumar"
          error={errors.cardName}
          required
        />

        <div className="grid grid-cols-2 gap-5">
          <Input
            label="Expiry Date"
            name="expiryDate"
            value={formData.expiryDate}
            onChange={handleChange}
            placeholder="MM/YY"
            error={errors.expiryDate}
            required
          />

          <Input
            label="CVV"
            type="password"
            name="cvv"
            value={formData.cvv}
            onChange={handleChange}
            placeholder="123"
            error={errors.cvv}
            required
          />
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => dispatch(prevStep())}
            className="flex-1 py-3.5 bg-neutral-100 text-neutral-900 rounded-xl hover:bg-neutral-200 transition-all duration-200 font-medium"
          >
            Back
          </button>
          <button
            type="submit"
            className="flex-1 py-3.5 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-all duration-200 font-medium"
          >
            Review Order
          </button>
        </div>
      </form>
    </div>
  );
}
