'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProduct } from '@/lib/redux/slices/adminProductsSlice';
import { toast } from 'react-toastify';
import { FiX, FiTag, FiPercent, FiClock } from 'react-icons/fi';

/**
 * Quick Offer Modal
 * Apply discount to product directly from list
 */
export default function OfferModal({ product, onClose, onSuccess }) {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    discountPercentage: product.discountPercentage || product.discount || 0,
    isDeal: product.isDeal || false,
    dealExpiry: product.dealExpiry || '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const updates = {
        discountPercentage: parseFloat(formData.discountPercentage),
        isDeal: formData.isDeal,
        dealExpiry: formData.isDeal && formData.dealExpiry ? formData.dealExpiry : null,
      };

      await dispatch(updateProduct({ 
        productId: product.id, 
        updates, 
        userId: user.email 
      })).unwrap();

      toast.success('Offer applied successfully!');
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error || 'Failed to apply offer');
    } finally {
      setIsSaving(false);
    }
  };

  const finalPrice = product.price * (1 - formData.discountPercentage / 100);
  const savings = product.price - finalPrice;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-lg font-medium text-neutral-900">Apply Offer</h2>
            <p className="text-sm text-neutral-500 mt-1 line-clamp-1">{product.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-neutral-100 rounded-md transition-colors"
          >
            <FiX className="w-5 h-5 text-neutral-400" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Discount */}
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-neutral-700 mb-2">
              <FiPercent className="w-4 h-4" />
              Discount Percentage
            </label>
            <input
              type="number"
              min="0"
              max="100"
              step="1"
              value={formData.discountPercentage}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                discountPercentage: e.target.value 
              }))}
              className="w-full px-4 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900"
              required
            />
          </div>

          {/* Price Preview */}
          <div className="bg-neutral-50 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Original Price:</span>
              <span className="font-medium text-neutral-900">₹{product.price}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-neutral-600">Discount:</span>
              <span className="font-medium text-red-600">-{formData.discountPercentage}%</span>
            </div>
            <div className="border-t border-neutral-200 pt-2 flex justify-between">
              <span className="text-sm font-medium text-neutral-900">Final Price:</span>
              <span className="text-lg font-bold text-neutral-900">₹{finalPrice.toFixed(2)}</span>
            </div>
            {savings > 0 && (
              <p className="text-xs text-green-600 text-center">
                Customers save ₹{savings.toFixed(2)}
              </p>
            )}
          </div>

          {/* Deal Settings */}
          <div className="border border-neutral-200 rounded-lg p-4 space-y-3">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isDeal}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  isDeal: e.target.checked 
                }))}
                className="w-4 h-4 text-neutral-900 rounded"
              />
              <FiTag className="w-4 h-4 text-neutral-500" />
              <span className="text-sm font-medium text-neutral-700">Mark as Deal</span>
            </label>

            {formData.isDeal && (
              <div>
                <label className="flex items-center gap-2 text-sm text-neutral-600 mb-1">
                  <FiClock className="w-3.5 h-3.5" />
                  Deal Expiry (Optional)
                </label>
                <input
                  type="datetime-local"
                  value={formData.dealExpiry}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    dealExpiry: e.target.value 
                  }))}
                  className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900"
                />
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 px-4 py-2 bg-neutral-900 text-white rounded-md hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSaving ? 'Applying...' : 'Apply Offer'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-neutral-200 text-neutral-700 rounded-md hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
