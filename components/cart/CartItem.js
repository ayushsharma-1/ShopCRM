'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { removeFromCart, updateQuantity } from '@/lib/redux/slices/cartSlice';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function CartItem({ item }) {
  const dispatch = useDispatch();
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      dispatch(removeFromCart(item.id));
      toast.info(`${item.name} removed from cart`);
    }, 200);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity > item.stock) {
      toast.warning(`Only ${item.stock} items available`);
      return;
    }
    dispatch(updateQuantity({ id: item.id, quantity: newQuantity }));
  };

  const subtotal = (item.price * item.quantity).toFixed(2);

  return (
    <article className="bg-white border border-neutral-200/60 rounded-2xl p-4 md:p-5 transition-all duration-300 hover:border-neutral-300">
      <div className="flex gap-4">
        {/* Product Image */}
        <Link href={`/products/${item.id}`} className="shrink-0 group">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-neutral-50">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <Link href={`/products/${item.id}`}>
                <h3 className="text-base font-semibold text-neutral-900 hover:text-neutral-700 transition-colors line-clamp-1">
                  {item.name}
                </h3>
              </Link>
              <p className="text-xs text-neutral-500 uppercase tracking-wide mt-0.5">
                {item.category}
              </p>
            </div>
            
            {/* Remove Button */}
            <button
              onClick={handleRemove}
              disabled={isRemoving}
              className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50"
              aria-label="Remove item"
            >
              <FaTrash className="text-sm" />
            </button>
          </div>

          {/* Price & Quantity Controls */}
          <div className="flex items-center justify-between gap-4 mt-3">
            {/* Quantity Controls */}
            <div className="flex items-center gap-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleQuantityChange(item.quantity - 1)}
                disabled={item.quantity <= 1}
                className="w-9 h-9 bg-neutral-900 text-white hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center rounded-lg"
                aria-label="Decrease quantity"
              >
                <FaMinus className="text-xs" />
              </motion.button>
              
              <span className="min-w-[3rem] h-9 border border-neutral-300 font-semibold text-neutral-900 flex items-center justify-center rounded-lg text-sm px-3">
                {item.quantity}
              </span>
              
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => handleQuantityChange(item.quantity + 1)}
                disabled={item.quantity >= item.stock}
                className="w-9 h-9 bg-neutral-900 text-white hover:bg-neutral-800 disabled:bg-neutral-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center rounded-lg"
                aria-label="Increase quantity"
              >
                <FaPlus className="text-xs" />
              </motion.button>
            </div>

            {/* Price */}
            <div className="text-right">
              <p className="text-sm font-semibold text-neutral-900">
                ₹{subtotal}
              </p>
              <p className="text-xs text-neutral-500">
                ₹{item.price} each
              </p>
            </div>
          </div>

          {/* Stock Warning */}
          {item.quantity >= item.stock && (
            <p className="text-xs text-amber-600 mt-2">
              Maximum available quantity
            </p>
          )}
        </div>
      </div>
    </article>
  );
}
