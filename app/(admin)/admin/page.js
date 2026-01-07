'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts } from '@/lib/redux/slices/adminProductsSlice';
import { FiPackage, FiEye, FiAlertCircle, FiTag } from 'react-icons/fi';

/**
 * Admin Dashboard
 * Overview stats for products
 */
export default function AdminDashboard() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { products, isLoading } = useSelector((state) => state.adminProducts);

  useEffect(() => {
    if (user?.email && user?.role === 'admin') {
      dispatch(fetchAllProducts({ type: 'products', userId: user.email }));
    }
  }, [dispatch, user]);

  // Calculate stats
  const stats = {
    total: products.length,
    active: products.filter(p => p.isActive !== false).length,
    outOfStock: products.filter(p => p.stock === 0).length,
    deals: products.filter(p => p.isDeal === true).length,
  };

  const statCards = [
    {
      name: 'Total Products',
      value: stats.total,
      icon: FiPackage,
      color: 'text-neutral-600',
      bgColor: 'bg-neutral-100',
    },
    {
      name: 'Active Products',
      value: stats.active,
      icon: FiEye,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      name: 'Out of Stock',
      value: stats.outOfStock,
      icon: FiAlertCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      name: 'Active Deals',
      value: stats.deals,
      icon: FiTag,
      color: 'text-slate-600',
      bgColor: 'bg-slate-50',
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-medium text-neutral-900">Dashboard</h1>
        <p className="text-sm text-neutral-500 mt-1">
          Product management overview
        </p>
      </div>

      {/* Stats Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg border border-neutral-200 p-6 animate-pulse"
            >
              <div className="h-4 bg-neutral-200 rounded w-1/2 mb-4" />
              <div className="h-8 bg-neutral-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.name}
                className="bg-white rounded-lg border border-neutral-200 p-6 transition-shadow duration-150 hover:shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm text-neutral-600">{stat.name}</span>
                  <div className={`p-2 rounded-md ${stat.bgColor}`}>
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-3xl font-medium text-neutral-900">
                  {stat.value}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8 bg-white rounded-lg border border-neutral-200 p-6">
        <h2 className="text-lg font-medium text-neutral-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/products/new"
            className="flex items-center gap-3 px-4 py-3 border border-neutral-200 rounded-md hover:bg-neutral-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-md bg-neutral-900 flex items-center justify-center">
              <FiPackage className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900">Add Product</p>
              <p className="text-xs text-neutral-500">Create new product</p>
            </div>
          </a>

          <a
            href="/admin/products"
            className="flex items-center gap-3 px-4 py-3 border border-neutral-200 rounded-md hover:bg-neutral-50 transition-colors"
          >
            <div className="w-10 h-10 rounded-md bg-neutral-100 flex items-center justify-center">
              <FiEye className="w-5 h-5 text-neutral-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-900">View Products</p>
              <p className="text-xs text-neutral-500">Manage inventory</p>
            </div>
          </a>

          <div className="flex items-center gap-3 px-4 py-3 border border-neutral-200 rounded-md opacity-50 cursor-not-allowed">
            <div className="w-10 h-10 rounded-md bg-neutral-100 flex items-center justify-center">
              <FiTag className="w-5 h-5 text-neutral-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-neutral-400">Manage Deals</p>
              <p className="text-xs text-neutral-400">Coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}