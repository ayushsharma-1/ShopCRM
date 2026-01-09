'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { FaTrash, FaMinus, FaPlus, FaSync } from 'react-icons/fa';
import { removeFromCart, updateQuantity } from '@/lib/redux/slices/cartSlice';
import { addRule } from '@/lib/redux/slices/agentsSlice';
import { normalizeRulePayload } from '@/lib/agents/ruleUtils';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Modal from '@/components/common/Modal';

export default function CartItem({ item }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { addresses } = useSelector((state) => state.addresses);
  const [isRemoving, setIsRemoving] = useState(false);
  const [restockModalOpen, setRestockModalOpen] = useState(false);
  const [restockQty, setRestockQty] = useState(item.quantity || 1);
  const [keepActive, setKeepActive] = useState(false);
  const [actionMode, setActionMode] = useState('notify');
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [userConsent, setUserConsent] = useState(false);

  const handleRestockSave = () => {
    if (!restockQty || restockQty <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    if (actionMode === 'auto_order' && !selectedAddressId) {
      toast.error('Please select a saved address for auto-order');
      return;
    }

    if (actionMode === 'auto_order' && !userConsent) {
      toast.error('Please confirm consent for auto-order');
      return;
    }

    const rule = normalizeRulePayload({
      type: 'autoRestock',
      productId: item.id,
      restockQty: parseInt(restockQty),
      keepActive,
      actionMode,
      addressId: actionMode === 'auto_order' ? selectedAddressId : null,
      userConsent: actionMode === 'auto_order' ? userConsent : false,
    });

    dispatch(addRule(rule));
    toast.success('Auto-restock enabled for this item');
    setRestockModalOpen(false);
    setActionMode('notify');
    setSelectedAddressId(null);
    setUserConsent(false);
  };

  const handleRemove = () => {
    setIsRemoving(true);
    setTimeout(() => {
      dispatch(removeFromCart({ cartItemKey: item.cartItemKey, id: item.id }));
      toast.info(`${item.name} removed from cart`);
    }, 200);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity > item.stock) {
      toast.warning(`Only ${item.stock} items available`);
      return;
    }
    dispatch(updateQuantity({ cartItemKey: item.cartItemKey, id: item.id, quantity: newQuantity }));
  };

  const subtotal = (item.price * item.quantity).toFixed(2);

  return (
    <article className="bg-white border border-neutral-200/60 rounded-2xl p-4 md:p-5 transition-all duration-300 hover:border-neutral-300">
      <div className="flex gap-4">
        <Link href={`/products/${item.id}`} className="shrink-0 group">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-neutral-50">
            <img
              src={item.image}
              alt={item.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </Link>

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
              {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {Object.entries(item.selectedOptions).map(([key, value]) => (
                    value && (
                      <span 
                        key={key}
                        className="text-xs px-2 py-0.5 bg-neutral-100 text-neutral-600 rounded-md"
                      >
                        {key}: {value}
                      </span>
                    )
                  ))}
                </div>
              )}
            </div>
            
            <button
              onClick={handleRemove}
              disabled={isRemoving}
              className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50"
              aria-label="Remove item"
            >
              <FaTrash className="text-sm" />
            </button>
          </div>

          <div className="flex items-center justify-between gap-4 mt-3">
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

            <div className="text-right">
              <p className="text-sm font-semibold text-neutral-900">
                ₹{subtotal}
              </p>
              <p className="text-xs text-neutral-500">
                ₹{item.price} each
              </p>
            </div>
          </div>

          {item.quantity >= item.stock && (
            <p className="text-xs text-amber-600 mt-2">
              Maximum available quantity
            </p>
          )}

          {/* Auto-Restock Button */}
          <button
            onClick={() => setRestockModalOpen(true)}
            className="mt-3 flex items-center gap-2 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-xs font-medium transition-all duration-150"
          >
            <FaSync className="text-xs" />
            Auto-Restock
          </button>
        </div>
      </div>

      {/* Auto-Restock Modal */}
      <Modal isOpen={restockModalOpen} onClose={() => setRestockModalOpen(false)} title="Auto-Restock">
        <div className="space-y-5">
          <p className="text-sm text-neutral-600">
            Automatically add <strong>{item.name}</strong> to your cart when it's out of stock.
          </p>
          
          <div>
            <label htmlFor={`restockQty-${item.id}`} className="block text-sm font-medium text-neutral-700 mb-2">
              Quantity to add
            </label>
            <input
              id={`restockQty-${item.id}`}
              type="number"
              min="1"
              value={restockQty}
              onChange={(e) => setRestockQty(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 text-sm text-neutral-900"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              id={`keepActiveCart-${item.id}`}
              type="checkbox"
              checked={keepActive}
              onChange={(e) => setKeepActive(e.target.checked)}
              className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-1 focus:ring-neutral-400"
            />
            <label htmlFor={`keepActiveCart-${item.id}`} className="text-sm text-neutral-700">
              Keep restocking (continue monitoring after first trigger)
            </label>
          </div>

          {/* Action Mode Selection */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              What should the agent do?
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 transition-colors">
                <input
                  type="radio"
                  name={`actionModeCart-${item.id}`}
                  value="notify"
                  checked={actionMode === 'notify'}
                  onChange={(e) => setActionMode(e.target.value)}
                  className="w-4 h-4"
                />
                <div>
                  <div className="font-medium text-neutral-900 text-sm">Notify Only</div>
                  <div className="text-xs text-neutral-600">Show alert, I'll decide</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 transition-colors">
                <input
                  type="radio"
                  name={`actionModeCart-${item.id}`}
                  value="add_to_cart"
                  checked={actionMode === 'add_to_cart'}
                  onChange={(e) => setActionMode(e.target.value)}
                  className="w-4 h-4"
                />
                <div>
                  <div className="font-medium text-neutral-900 text-sm">Auto Add to Cart</div>
                  <div className="text-xs text-neutral-600">Automatically add item</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 transition-colors">
                <input
                  type="radio"
                  name={`actionModeCart-${item.id}`}
                  value="auto_order"
                  checked={actionMode === 'auto_order'}
                  onChange={(e) => setActionMode(e.target.value)}
                  className="w-4 h-4"
                />
                <div>
                  <div className="font-medium text-neutral-900 text-sm">Auto Order</div>
                  <div className="text-xs text-neutral-600">Place order automatically</div>
                </div>
              </label>
            </div>
          </div>

          {/* Address Selection (only for auto_order) */}
          {actionMode === 'auto_order' && (
            <>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Delivery Address
                </label>
                {addresses.length === 0 ? (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                    No saved addresses. <button onClick={() => router.push('/addresses')} className="underline font-medium">Add one now</button>
                  </div>
                ) : (
                  <select
                    value={selectedAddressId || ''}
                    onChange={(e) => setSelectedAddressId(e.target.value)}
                    className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-400 text-sm"
                  >
                    <option value="">Select address</option>
                    {addresses.map(addr => (
                      <option key={addr.id} value={addr.id}>
                        {addr.fullName} - {addr.street}, {addr.city}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex items-start gap-3 p-4 bg-neutral-50 rounded-xl">
                <input
                  id={`userConsentCart-${item.id}`}
                  type="checkbox"
                  checked={userConsent}
                  onChange={(e) => setUserConsent(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-neutral-300"
                />
                <label htmlFor={`userConsentCart-${item.id}`} className="text-sm text-neutral-700 flex-1">
                  <strong>I allow the agent to place orders for me</strong> using the selected address.
                </label>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                setRestockModalOpen(false);
                setActionMode('notify');
                setSelectedAddressId(null);
                setUserConsent(false);
              }}
              className="flex-1 px-4 py-2.5 border border-neutral-200 text-neutral-700 rounded-xl hover:bg-neutral-50 transition-all duration-150 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleRestockSave}
              className="flex-1 px-4 py-2.5 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-all duration-150 text-sm font-medium active:scale-95"
            >
              Enable Auto-Restock
            </button>
          </div>
        </div>
      </Modal>
    </article>
  );
}
