'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateAddress, nextStep } from '@/lib/redux/slices/checkoutSlice';
import Input from '../common/Input';
import Button from '../common/Button';
import { toast } from 'react-toastify';

export default function AddressForm() {
  const dispatch = useDispatch();
  const { address } = useSelector((state) => state.checkout);
  const [formData, setFormData] = useState(address);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    let { name, value } = e.target;
    
    // Strict validation rules for each field
    if (name === 'fullName') {
      // Only letters and spaces
      value = value.replace(/[^a-zA-Z\s]/g, '');
    }
    
    if (name === 'phone') {
      // Only numbers, +, -, (, ), and spaces
      value = value.replace(/[^0-9+\-()\s]/g, '').slice(0, 20);
    }
    
    if (name === 'zipCode') {
      // Only alphanumeric (supports both numeric and alphanumeric zip codes)
      value = value.replace(/[^a-zA-Z0-9\s-]/g, '').slice(0, 10);
    }
    
    if (name === 'city' || name === 'state' || name === 'country') {
      // Only letters, spaces, and hyphens
      value = value.replace(/[^a-zA-Z\s-]/g, '');
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
    } 
    else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters';
    } 
    else if (!/^[a-zA-Z\s]+$/.test(formData.fullName)) {
      newErrors.fullName = 'Name can only contain letters';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } 
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } 
    else if (formData.phone.replace(/[^0-9]/g, '').length < 10) {
      newErrors.phone = 'Phone must be at least 10 digits';
    }
    
    if (!formData.street) {
      newErrors.street = 'Street address is required';
    } 
    else if (formData.street.trim().length < 5) {
      newErrors.street = 'Street address must be at least 5 characters';
    }
    
    if (!formData.city) {
      newErrors.city = 'City is required';
    } 
    else if (!/^[a-zA-Z\s-]+$/.test(formData.city)) {
      newErrors.city = 'City can only contain letters';
    }
    
    if (!formData.state) {
      newErrors.state = 'State is required';
    } 
    else if (!/^[a-zA-Z\s-]+$/.test(formData.state)) {
      newErrors.state = 'State can only contain letters';
    }
    
    if (!formData.zipCode) {
      newErrors.zipCode = 'ZIP code is required';
    } 
    else if (formData.zipCode.replace(/[^a-zA-Z0-9]/g, '').length < 4) {
      newErrors.zipCode = 'ZIP code must be at least 4 characters';
    }
    
    if (!formData.country) {
      newErrors.country = 'Country is required';
    } 
    else if (!/^[a-zA-Z\s-]+$/.test(formData.country)) {
      newErrors.country = 'Country can only contain letters';
    }
    
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fill in all required fields');
      return;
    }

    dispatch(updateAddress(formData));
    dispatch(nextStep());
    toast.success('Address saved successfully!');
  };

  return (
    <div className="bg-white border border-neutral-200/60 rounded-2xl p-6 md:p-8">
      <h2 className="text-xl font-semibold text-neutral-900 mb-6">Shipping Address</h2>
      
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="md:col-span-2">
            <Input
              label="Full Name"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              required
            />
          </div>

          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            required
          />

          <Input
            label="Phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            required
          />

          <div className="md:col-span-2">
            <Input
              label="Street Address"
              name="street"
              value={formData.street}
              onChange={handleChange}
              error={errors.street}
              required
            />
          </div>

          <Input
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            error={errors.city}
            required
          />

          <Input
            label="State/Province"
            name="state"
            value={formData.state}
            onChange={handleChange}
            error={errors.state}
            required
          />

          <Input
            label="ZIP/Postal Code"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            error={errors.zipCode}
            required
          />

          <Input
            label="Country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            error={errors.country}
            required
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-3.5 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-all duration-200 font-medium"
          >
            Continue to Payment
          </button>
        </div>
      </form>
    </div>
  );
}
