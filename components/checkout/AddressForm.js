'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateAddress, nextStep } from '@/lib/redux/slices/checkoutSlice';
import { addAddress } from '@/lib/redux/slices/addressSlice';
import Input from '../common/Input';
import Button from '../common/Button';
import { toast } from 'react-toastify';

export default function AddressForm() {
  const dispatch = useDispatch();
  const { address } = useSelector((state) => state.checkout);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { addresses } = useSelector((state) => state.addresses);
  const [formData, setFormData] = useState(address);
  const [errors, setErrors] = useState({});
  const [useSavedAddress, setUseSavedAddress] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [saveThisAddress, setSaveThisAddress] = useState(false);

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

  const handleSavedAddressSelect = (addressId) => {
    const savedAddress = addresses.find(addr => addr.id === addressId);
    if (savedAddress) {
      setFormData(savedAddress);
      setUseSavedAddress(true);
      setSelectedAddressId(addressId);
    }
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
    
    // Save address to user account if requested
    if (saveThisAddress && isAuthenticated && !useSavedAddress) {
      dispatch(addAddress({ ...formData, id: Date.now().toString() }));
      toast.success('Address saved to your account!');
    }
    
    dispatch(nextStep());
    toast.success('Address confirmed!');
  };

  return (
    <div className="bg-white border border-neutral-200/60 rounded-2xl p-6 md:p-8">
      <h2 className="text-xl font-semibold text-neutral-900 mb-6">Shipping Address</h2>
      
      {/* Saved Address Selection */}
      {isAuthenticated && addresses.length > 0 && (
        <div className="mb-6 p-4 bg-neutral-50 rounded-xl border border-neutral-200">
          <label className="block text-sm font-medium text-neutral-700 mb-3">
            Use a saved address
          </label>
          <div className="space-y-2">
            {addresses.map((addr) => (
              <label 
                key={addr.id}
                className="flex items-start gap-3 p-3 border border-neutral-200 rounded-lg cursor-pointer hover:bg-white transition-colors"
              >
                <input
                  type="radio"
                  name="savedAddress"
                  value={addr.id}
                  checked={selectedAddressId === addr.id}
                  onChange={() => handleSavedAddressSelect(addr.id)}
                  className="mt-1"
                />
                <div className="flex-1 text-sm">
                  <div className="font-medium text-neutral-900">{addr.fullName}</div>
                  <div className="text-neutral-600">
                    {addr.street}, {addr.city}, {addr.state} {addr.zipCode}
                  </div>
                </div>
              </label>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setUseSavedAddress(false);
              setSelectedAddressId('');
              setFormData(address);
            }}
            className="mt-3 text-sm text-neutral-600 hover:text-neutral-900 underline"
          >
            Or enter a new address
          </button>
        </div>
      )}

      {/* Login prompt for save feature */}
      {!isAuthenticated && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800">
          <strong>Login to save addresses for faster checkout</strong>
        </div>
      )}
      
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

        {/* Save Address Checkbox (only for logged-in users and new addresses) */}
        {isAuthenticated && !useSavedAddress && (
          <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl">
            <input
              id="saveAddress"
              type="checkbox"
              checked={saveThisAddress}
              onChange={(e) => setSaveThisAddress(e.target.checked)}
              className="w-4 h-4 rounded border-neutral-300 text-neutral-900"
            />
            <label htmlFor="saveAddress" className="text-sm text-neutral-700">
              Save this address to my account for faster checkout
            </label>
          </div>
        )}

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
