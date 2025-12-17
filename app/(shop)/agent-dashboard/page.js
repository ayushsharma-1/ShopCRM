'use client';

import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { FaBell, FaSync, FaClock, FaTrash, FaToggleOn, FaToggleOff, FaCog } from 'react-icons/fa';
import { removeRule, toggleRule, updateRule } from '@/lib/redux/slices/agentsSlice';
import { toast } from 'react-toastify';
import Modal from '@/components/common/Modal';
import productsData from '@/data/products.json';
import dealsData from '@/data/deals.json';

export default function AgentDashboardPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);
  const { rules } = useSelector((state) => state.agents);
  const { addresses } = useSelector((state) => state.addresses);
  const [editingRule, setEditingRule] = useState(null);
  const [actionMode, setActionMode] = useState('notify');
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [userConsent, setUserConsent] = useState(false);

  // Redirect if not authenticated
  if (!user) {
    router.push('/auth/login');
    return null;
  }

  const allProducts = [...productsData, ...dealsData];

  const getProduct = (productId) => {
    return allProducts.find(p => p.id === productId);
  };

  const getRuleTypeLabel = (type) => {
    switch(type) {
      case 'priceDrop': return 'Price Drop';
      case 'autoRestock': return 'Auto Restock';
      case 'cartReminder': return 'Cart Reminder';
      default: return type;
    }
  };

  const getConditionSummary = (rule) => {
    switch(rule.type) {
      case 'priceDrop':
        return `When price ≤ ₹${rule.threshold?.toLocaleString('en-IN')}`;
      case 'autoRestock':
        return `When back in stock (qty: ${rule.restockQty})`;
      case 'cartReminder':
        return `After ${rule.timeoutHours}h in cart`;
      default:
        return 'No condition';
    }
  };

  const getActionModeLabel = (mode) => {
    switch(mode) {
      case 'notify': return 'Notify Only';
      case 'add_to_cart': return 'Auto Add to Cart';
      case 'auto_order': return 'Auto Order';
      default: return 'Notify Only';
    }
  };

  const getLastTriggeredText = (ruleId) => {
    const state = useSelector(state => state.agents);
    const timestamp = state.lastTriggered?.[ruleId];
    if (!timestamp) return 'Not triggered yet';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const handleDeleteRule = (ruleId) => {
    if (confirm('Delete this automation rule?')) {
      dispatch(removeRule(ruleId));
      toast.success('Rule deleted');
    }
  };

  const handleToggleActive = (rule) => {
    dispatch(toggleRule(rule.id));
    toast.info(rule.active ? 'Rule paused' : 'Rule activated');
  };

  const handleEditPermissions = (rule) => {
    setEditingRule(rule);
    setActionMode(rule.actionMode || 'notify');
    setSelectedAddressId(rule.addressId || null);
    setUserConsent(rule.userConsent || false);
  };

  const handleSavePermissions = () => {
    if (actionMode === 'auto_order' && !selectedAddressId) {
      toast.error('Please select a saved address for auto-order');
      return;
    }
    
    if (actionMode === 'auto_order' && !userConsent) {
      toast.error('Please confirm consent for auto-order');
      return;
    }

    dispatch(updateRule({
      ...editingRule,
      actionMode,
      addressId: actionMode === 'auto_order' ? selectedAddressId : null,
      userConsent: actionMode === 'auto_order' ? userConsent : false,
    }));

    toast.success('Permissions updated');
    setEditingRule(null);
    setActionMode('notify');
    setSelectedAddressId(null);
    setUserConsent(false);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="container mx-auto px-4 py-8 lg:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 mb-2">Automation & Alerts</h1>
          <p className="text-neutral-600">Manage your smart shopping rules</p>
        </div>

        {/* Rules List */}
        {rules.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-neutral-200">
            <FaBell className="text-5xl text-neutral-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-neutral-900 mb-2">No automation rules yet</h2>
            <p className="text-neutral-600 mb-6">Create price alerts or auto-restock rules from product pages</p>
            <button
              onClick={() => router.push('/products')}
              className="px-6 py-3 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-all duration-150"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {rules.map((rule) => {
              const product = getProduct(rule.productId);
              if (!product) return null;

              return (
                <div
                  key={rule.id}
                  className="bg-white rounded-2xl p-5 border border-neutral-200 hover:border-neutral-300 transition-all duration-200"
                >
                  <div className="flex gap-4">
                    {/* Product Thumbnail */}
                    <div className="shrink-0">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-20 h-20 rounded-xl object-cover bg-neutral-100"
                      />
                    </div>

                    {/* Rule Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-neutral-900 mb-1 line-clamp-1">
                            {product.name}
                          </h3>
                          <div className="flex items-center gap-3 flex-wrap text-sm">
                            <span className="px-2 py-1 bg-neutral-100 text-neutral-700 rounded-lg font-medium">
                              {getRuleTypeLabel(rule.type)}
                            </span>
                            <span className="text-neutral-600">
                              {getConditionSummary(rule)}
                            </span>
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          rule.active 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-neutral-100 text-neutral-500'
                        }`}>
                          {rule.active ? 'Active' : 'Paused'}
                        </span>
                      </div>

                      {/* Action Mode & Last Triggered */}
                      <div className="flex items-center gap-6 text-sm text-neutral-600 mb-4">
                        <div className="flex items-center gap-2">
                          <FaCog className="text-xs" />
                          <span>{getActionModeLabel(rule.actionMode || 'notify')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FaClock className="text-xs" />
                          <span>{getLastTriggeredText(rule.id)}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleActive(rule)}
                          className="flex items-center gap-2 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-sm font-medium transition-all duration-150"
                        >
                          {rule.active ? <FaToggleOn /> : <FaToggleOff />}
                          {rule.active ? 'Pause' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleEditPermissions(rule)}
                          className="flex items-center gap-2 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg text-sm font-medium transition-all duration-150"
                        >
                          <FaCog />
                          Edit Permissions
                        </button>
                        <button
                          onClick={() => handleDeleteRule(rule.id)}
                          className="flex items-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-all duration-150"
                        >
                          <FaTrash />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Permissions Modal */}
      {editingRule && (
        <Modal
          isOpen={!!editingRule}
          onClose={() => {
            setEditingRule(null);
            setActionMode('notify');
            setSelectedAddressId(null);
            setUserConsent(false);
          }}
          title="Edit Automation Permissions"
        >
          <div className="space-y-5">
            <p className="text-sm text-neutral-600">
              Control what the agent can do when this rule triggers
            </p>

            {/* Action Mode */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                Action Type
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 transition-colors">
                  <input
                    type="radio"
                    name="actionMode"
                    value="notify"
                    checked={actionMode === 'notify'}
                    onChange={(e) => setActionMode(e.target.value)}
                    className="w-4 h-4"
                  />
                  <div>
                    <div className="font-medium text-neutral-900">Notify Only</div>
                    <div className="text-xs text-neutral-600">Show alert, I'll decide what to do</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 transition-colors">
                  <input
                    type="radio"
                    name="actionMode"
                    value="add_to_cart"
                    checked={actionMode === 'add_to_cart'}
                    onChange={(e) => setActionMode(e.target.value)}
                    className="w-4 h-4"
                  />
                  <div>
                    <div className="font-medium text-neutral-900">Auto Add to Cart</div>
                    <div className="text-xs text-neutral-600">Automatically add item to cart</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 transition-colors">
                  <input
                    type="radio"
                    name="actionMode"
                    value="auto_order"
                    checked={actionMode === 'auto_order'}
                    onChange={(e) => setActionMode(e.target.value)}
                    className="w-4 h-4"
                  />
                  <div>
                    <div className="font-medium text-neutral-900">Auto Order</div>
                    <div className="text-xs text-neutral-600">Place order automatically (requires address)</div>
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
                    id="userConsent"
                    type="checkbox"
                    checked={userConsent}
                    onChange={(e) => setUserConsent(e.target.checked)}
                    className="w-4 h-4 mt-0.5 rounded border-neutral-300"
                  />
                  <label htmlFor="userConsent" className="text-sm text-neutral-700 flex-1">
                    <strong>I allow the agent to place orders for me</strong> using the selected address when this rule triggers.
                  </label>
                </div>
              </>
            )}

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => {
                  setEditingRule(null);
                  setActionMode('notify');
                  setSelectedAddressId(null);
                  setUserConsent(false);
                }}
                className="flex-1 px-4 py-2.5 border border-neutral-200 text-neutral-700 rounded-xl hover:bg-neutral-50 transition-all duration-150 text-sm font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSavePermissions}
                className="flex-1 px-4 py-2.5 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-all duration-150 text-sm font-medium"
              >
                Save Permissions
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
