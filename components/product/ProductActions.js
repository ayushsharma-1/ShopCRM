'use client';

import { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { FaShoppingCart } from 'react-icons/fa';
import { addToCart } from '@/lib/redux/slices/cartSlice';
import { toast } from 'react-toastify';
import OptionRenderer from './options/OptionRenderer';
import { getOptionsForCategory, getOptionConfig } from '@/config/productOptions';

export default function ProductActions({ product }) {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  const availableOptions = useMemo(
    () => getOptionsForCategory(product.category),
    [product.category]
  );
  const [selectedOptions, setSelectedOptions] = useState(() => {
    const initial = {};
    availableOptions.forEach((optionType) => {
      const config = getOptionConfig(optionType);
      initial[optionType] = config?.defaultValue || '';
    });
    return initial;
  });

  const handleOptionChange = (optionType, value) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionType]: value
    }));
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      dispatch(addToCart(product));
    }
    toast.success(`${quantity} × ${product.name} added to cart!`, {
      position: 'bottom-right',
      autoClose: 2000
    });
  };

  return (
    <div className="space-y-6">
      {availableOptions.map((optionType) => (
        <OptionRenderer
          key={optionType}
          optionType={optionType}
          selectedValue={selectedOptions[optionType]}
          onValueChange={(value) => handleOptionChange(optionType, value)}
        />
      ))}

      <div className="space-y-3">
        <label className="block text-sm font-semibold text-gray-900">Quantity</label>
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center rounded-full overflow-hidden bg-white border border-gray-200">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-11 h-11 bg-gray-900 text-white hover:bg-gray-800 transition-colors font-medium flex items-center justify-center"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-14 h-11 bg-white font-medium text-gray-900 flex items-center justify-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
              className="w-11 h-11 bg-gray-900 text-white hover:bg-gray-800 transition-colors font-medium flex items-center justify-center"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
          <span className="text-sm text-gray-500">({product.stock} available)</span>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        {product.stock === 0 ? (
          <div className="flex-1 bg-neutral-100 text-neutral-500 py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 cursor-not-allowed">
            <span>Out of Stock</span>
          </div>
        ) : (
          <button
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md disabled:bg-neutral-300 disabled:cursor-not-allowed"
          >
            <FaShoppingCart size={18} />
            <span>Add to Cart</span>
          </button>
        )}
        <button
          className="px-5 py-3.5 border-2 border-gray-200 rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all"
          aria-label="Add to wishlist"
        >
          <FaShoppingCart className="text-gray-700" size={18} />
        </button>
      </div>
    </div>
  );
}
