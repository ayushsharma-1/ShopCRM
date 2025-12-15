"use client";

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateAddress, nextStep } from '@/lib/redux/slices/checkoutSlice';
import Input from '../common/Input';
import Button from '../common/button';

export default function AddressForm() {
  const dispatch = useDispatch();
  const address = useSelector((state) => state.checkout.address);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState(address);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone must be 10 digits';
    }
    if (!formData.street.trim()) newErrors.street = 'Street address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = 'ZIP code is required';
    } else if (!/^\d{5,6}$/.test(formData.zipCode)) {
      newErrors.zipCode = 'ZIP code must be 5-6 digits';
    }
    if (!formData.country.trim()) newErrors.country = 'Country is required';

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length === 0) {
      dispatch(updateAddress(formData));
      dispatch(nextStep());
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Shipping Address</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Full Name"
          name="fullName"
          placeholder="John Doe"
          value={formData.fullName}
          onChange={handleChange}
          error={errors.fullName}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Email"
            name="email"
            type="email"
            placeholder="john@example.com"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />
          <Input
            label="Phone"
            name="phone"
            type="tel"
            placeholder="1234567890"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            required
          />
        </div>

        <Input
          label="Street Address"
          name="street"
          placeholder="123 Main St, Apt 4B"
          value={formData.street}
          onChange={handleChange}
          error={errors.street}
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="City"
            name="city"
            placeholder="New York"
            value={formData.city}
            onChange={handleChange}
            error={errors.city}
            required
          />
          <Input
            label="State/Province"
            name="state"
            placeholder="NY"
            value={formData.state}
            onChange={handleChange}
            error={errors.state}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="ZIP/Postal Code"
            name="zipCode"
            placeholder="10001"
            value={formData.zipCode}
            onChange={handleChange}
            error={errors.zipCode}
            required
          />
          <Input
            label="Country"
            name="country"
            placeholder="United States"
            value={formData.country}
            onChange={handleChange}
            error={errors.country}
            required
          />
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" size="lg">
            Continue to Payment
          </Button>
        </div>
      </form>
    </div>
  );
}