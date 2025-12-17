'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FaBox, FaCalendar, FaReceipt } from 'react-icons/fa';

export default function OrdersPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.warning('Please login to view orders');
      router.push('/login');
      return;
    }

    fetchOrders();
  }, [isAuthenticated, user]);

  const fetchOrders = async () => {
    if (!user?.email) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/orders?userId=${user.email}`);
      const result = await response.json();

      if (result.success) {
        setOrders(result.data);
      } else {
        toast.error('Failed to load orders');
      }
    } catch (error) {
      console.error('Orders fetch error:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900 tracking-tight">
            My Orders
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            View your order history
          </p>
        </motion.div>

        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin"></div>
          </div>
        ) : orders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white border border-neutral-200/60 rounded-2xl p-12 text-center"
          >
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaBox className="text-2xl text-neutral-400" />
            </div>
            <h3 className="text-lg font-medium text-neutral-900 mb-2">No orders yet</h3>
            <p className="text-sm text-neutral-500 mb-6">
              Start shopping to see your orders here
            </p>
            <button
              onClick={() => router.push('/products')}
              className="px-6 py-2.5 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors duration-150 text-sm font-medium"
            >
              Browse Products
            </button>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white border border-neutral-200/60 rounded-2xl p-6 hover:shadow-sm transition-shadow duration-200"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 pb-4 border-b border-neutral-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                      <FaReceipt className="text-neutral-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-neutral-500 mt-0.5">
                        <FaCalendar className="text-[10px]" />
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        order.status === 'Completed'
                          ? 'bg-neutral-100 text-neutral-700'
                          : 'bg-neutral-100 text-neutral-600'
                      }`}
                    >
                      {order.status}
                    </span>
                    <span className="text-lg font-semibold text-neutral-900">
                      ₹{order.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-medium text-neutral-700">
                    Items ({order.items.length})
                  </p>
                  <div className="grid gap-3">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 bg-neutral-50/50 rounded-lg"
                      >
                        <div className="w-14 h-14 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-neutral-200/60">
                          <img
                            src={item.image || 'https://via.placeholder.com/56'}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-neutral-900 truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-neutral-500 mt-0.5">
                            Qty: {item.quantity} × ₹{item.price}
                          </p>
                        </div>
                        <p className="text-sm font-semibold text-neutral-900">
                          ₹{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {order.autoOrdered && (
                  <div className="mt-4 pt-4 border-t border-neutral-100">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-neutral-100 text-neutral-600 rounded-md text-xs font-medium">
                      <span className="w-1.5 h-1.5 bg-neutral-500 rounded-full"></span>
                      Auto-Ordered by Agent
                    </span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
