'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { FaPlus, FaEdit, FaTrash, FaCheck, FaMapMarkerAlt } from 'react-icons/fa';
import { addAddress, updateAddress, removeAddress, setDefaultAddress } from '@/lib/redux/slices/addressSlice';
import { toast } from 'react-toastify';
import Modal from '@/components/common/Modal';

export default function AddressesPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const { addresses } = useSelector((state) => state.addresses);
  const [showModal, setShowModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const [errors, setErrors] = useState({});

  // Redirect if not authenticated
  if (!user) {
    router.push('/login');
    return null;
  }

  const handleChange = (e) => {
    let { name, value } = e.target;
    
    // Strict validation rules for each field
    if (name === 'fullName') {
      value = value.replace(/[^a-zA-Z\s]/g, '');
    }
    
    if (name === 'phone') {
      value = value.replace(/[^0-9+\-()\s]/g, '').slice(0, 20);
    }
    
    if (name === 'zipCode') {
      value = value.replace(/[^a-zA-Z0-9\s-]/g, '').slice(0, 10);
    }
    
    if (name === 'city' || name === 'state' || name === 'country') {
      value = value.replace(/[^a-zA-Z\s-]/g, '');
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.fullName || formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name is required (min 2 characters)';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.fullName)) {
      newErrors.fullName = 'Name can only contain letters';
    }
    
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    
    if (!formData.phone || formData.phone.replace(/[^0-9]/g, '').length < 10) {
      newErrors.phone = 'Phone must be at least 10 digits';
    }
    
    if (!formData.street || formData.street.trim().length < 5) {
      newErrors.street = 'Street address is required (min 5 characters)';
    }
    
    if (!formData.city || !/^[a-zA-Z\s-]+$/.test(formData.city)) {
      newErrors.city = 'Valid city is required';
    }
    
    if (!formData.state || !/^[a-zA-Z\s-]+$/.test(formData.state)) {
      newErrors.state = 'Valid state is required';
    }
    
    if (!formData.zipCode || formData.zipCode.replace(/[^a-zA-Z0-9]/g, '').length < 4) {
      newErrors.zipCode = 'ZIP code is required (min 4 characters)';
    }
    
    if (!formData.country || !/^[a-zA-Z\s-]+$/.test(formData.country)) {
      newErrors.country = 'Valid country is required';
    }
    
    return newErrors;
  };

  const handleOpenModal = (address = null) => {
    if (address) {
      setEditingAddress(address);
      setFormData({
        fullName: address.fullName,
        email: address.email,
        phone: address.phone,
        street: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country,
      });
    } else {
      setEditingAddress(null);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      });
    }
    setErrors({});
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingAddress(null);
    setFormData({
      fullName: '',
      email: '',
      phone: '',
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    });
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = validate();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error('Please fill in all required fields correctly');
      return;
    }

    if (editingAddress) {
      dispatch(updateAddress({ ...formData, id: editingAddress.id }));
      toast.success('Address updated successfully');
    } else {
      dispatch(addAddress(formData));
      toast.success('Address added successfully');
    }

    handleCloseModal();
  };

  const handleDelete = (addressId) => {
    if (confirm('Delete this address?')) {
      dispatch(removeAddress(addressId));
      toast.success('Address deleted');
    }
  };

  const handleSetDefault = (addressId) => {
    dispatch(setDefaultAddress(addressId));
    toast.success('Default address updated');
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">Saved Addresses</h1>
            <p className="text-neutral-600">Manage your delivery addresses</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 px-5 py-3 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-all duration-150 font-medium"
          >
            <FaPlus />
            Add Address
          </button>
        </div>

        {/* Addresses List */}
        {addresses.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-neutral-200">
            <FaMapMarkerAlt className="text-5xl text-neutral-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">No saved addresses yet</h2>
            <p className="text-neutral-600 mb-6">Add an address to enable auto-order features</p>
            <button
              onClick={() => handleOpenModal()}
              className="px-6 py-3 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-all duration-150"
            >
              Add Your First Address
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {addresses.map((address) => (
              <div
                key={address.id}
                className={`bg-white rounded-2xl p-6 border transition-all duration-200 ${
                  address.isDefault 
                    ? 'border-neutral-900 ring-2 ring-neutral-900' 
                    : 'border-neutral-200 hover:border-neutral-300'
                }`}
              >
                {/* Default Badge */}
                {address.isDefault && (
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-neutral-900 text-white rounded-full text-xs font-medium flex items-center gap-1">
                      <FaCheck className="text-xs" />
                      Default Address
                    </span>
                  </div>
                )}

                {/* Address Details */}
                <div className="mb-4">
                  <h3 className="font-semibold text-neutral-900 mb-1">{address.fullName}</h3>
                  <p className="text-sm text-neutral-600">{address.email}</p>
                  <p className="text-sm text-neutral-600">{address.phone}</p>
                  <p className="text-sm text-neutral-600 mt-2">
                    {address.street}<br />
                    {address.city}, {address.state} {address.zipCode}<br />
                    {address.country}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      className="flex items-center gap-2 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-sm font-medium transition-all duration-150"
                    >
                      <FaCheck />
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={() => handleOpenModal(address)}
                    className="flex items-center gap-2 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-sm font-medium transition-all duration-150"
                  >
                    <FaEdit />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(address.id)}
                    className="flex items-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-all duration-150"
                  >
                    <FaTrash />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Address Modal */}
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={editingAddress ? 'Edit Address' : 'Add New Address'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-400 text-sm ${
                  errors.fullName ? 'border-red-300' : 'border-neutral-200'
                }`}
              />
              {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-400 text-sm ${
                  errors.email ? 'border-red-300' : 'border-neutral-200'
                }`}
              />
              {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-400 text-sm ${
                  errors.phone ? 'border-red-300' : 'border-neutral-200'
                }`}
              />
              {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone}</p>}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Street Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-400 text-sm ${
                  errors.street ? 'border-red-300' : 'border-neutral-200'
                }`}
              />
              {errors.street && <p className="text-xs text-red-600 mt-1">{errors.street}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                City <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-400 text-sm ${
                  errors.city ? 'border-red-300' : 'border-neutral-200'
                }`}
              />
              {errors.city && <p className="text-xs text-red-600 mt-1">{errors.city}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                State/Province <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-400 text-sm ${
                  errors.state ? 'border-red-300' : 'border-neutral-200'
                }`}
              />
              {errors.state && <p className="text-xs text-red-600 mt-1">{errors.state}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                ZIP/Postal Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="zipCode"
                value={formData.zipCode}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-400 text-sm ${
                  errors.zipCode ? 'border-red-300' : 'border-neutral-200'
                }`}
              />
              {errors.zipCode && <p className="text-xs text-red-600 mt-1">{errors.zipCode}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Country <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-400 text-sm ${
                  errors.country ? 'border-red-300' : 'border-neutral-200'
                }`}
              />
              {errors.country && <p className="text-xs text-red-600 mt-1">{errors.country}</p>}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="flex-1 px-4 py-2.5 border border-neutral-200 text-neutral-700 rounded-xl hover:bg-neutral-50 transition-all duration-150 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2.5 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-all duration-150 text-sm font-medium"
            >
              {editingAddress ? 'Update Address' : 'Add Address'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
