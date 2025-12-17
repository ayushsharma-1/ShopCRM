'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllOrders } from '@/lib/redux/slices/adminOrdersSlice';
import { FiBox, FiCalendar, FiUser, FiPackage } from 'react-icons/fi';

/**
 * Admin Orders Page
 * View all orders across all users
 */
export default function AdminOrdersPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { orders, isLoading, error } = useSelector((state) => state.adminOrders);

  useEffect(() => {
    if (user?.email && user?.role === 'admin') {
      dispatch(fetchAllOrders(user.email));
    }
  }, [dispatch, user]);

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-6 text-center">
          <p className="text-sm text-neutral-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-medium text-neutral-900">Orders</h1>
        <p className="text-sm text-neutral-500 mt-1">
          {orders.length} total orders
        </p>
      </div>

      {/* Orders Table */}
      {orders.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-lg p-12 text-center">
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiBox className="w-7 h-7 text-neutral-400" />
          </div>
          <h3 className="text-base font-medium text-neutral-900 mb-1">No orders yet</h3>
          <p className="text-sm text-neutral-500">
            Orders will appear here once users start placing them
          </p>
        </div>
      ) : (
        <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <FiPackage className="w-4 h-4 text-neutral-400" />
                        <span className="text-sm font-medium text-neutral-900">
                          #{order._id.slice(-8).toUpperCase()}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <FiUser className="w-4 h-4 text-neutral-400" />
                        <span className="text-sm text-neutral-600">
                          {order.userId}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                        order.autoOrdered
                          ? 'bg-neutral-100 text-neutral-600'
                          : 'bg-neutral-100 text-neutral-700'
                      }`}>
                        {order.autoOrdered ? 'Agent' : 'Manual'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm text-neutral-900">
                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-neutral-900">
                        ₹{order.total.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${
                        order.status === 'Completed'
                          ? 'bg-neutral-100 text-neutral-700'
                          : 'bg-neutral-100 text-neutral-600'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <FiCalendar className="w-4 h-4 text-neutral-400" />
                        <span className="text-sm text-neutral-600">
                          {new Date(order.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
