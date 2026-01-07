'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts, setFilters, selectFilteredProducts } from '@/lib/redux/slices/adminProductsSlice';
import { FiSearch, FiEdit2, FiEye, FiEyeOff, FiPlus, FiTag } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import OfferModal from '@/components/admin/OfferModal';
import BulkOfferModal from '@/components/admin/BulkOfferModal';

/**
 * Admin Products List
 * Table view with search, filters, pagination, bulk offers
 */
export default function AdminProductsPage() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { filters, isLoading } = useSelector((state) => state.adminProducts);
  const products = useSelector(selectFilteredProducts);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [offerModalProduct, setOfferModalProduct] = useState(null);
  const [bulkOfferModalOpen, setBulkOfferModalOpen] = useState(false);

  useEffect(() => {
    if (user?.email && user?.role === 'admin') {
      dispatch(fetchAllProducts({ type: 'products', userId: user.email }));
    }
  }, [dispatch, user]);

  // Pagination
  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = products.slice(startIndex, startIndex + itemsPerPage);

  const categories = ['All', 'Electronics', 'Clothing', 'Home & Living', 'Sports', 'Books'];

  const toggleSelectAll = () => {
    if (selectedProducts.length === paginatedProducts.length) {
      setSelectedProducts([]);
    } 
    else {
      setSelectedProducts(paginatedProducts.map(p => p.id));
    }
  };

  const toggleSelectProduct = (productId) => {
    setSelectedProducts(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const handleRefresh = () => {
    if (user?.email && user?.role === 'admin') {
      dispatch(fetchAllProducts({ type: 'products', userId: user.email }));
      setSelectedProducts([]);
    }
  };

  const selectedProductsData = products.filter(p => selectedProducts.includes(p.id));

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-medium text-neutral-900">Products</h1>
          <p className="text-sm text-neutral-500 mt-1">
            {products.length} products found
            {selectedProducts.length > 0 && ` • ${selectedProducts.length} selected`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selectedProducts.length > 0 && (
            <button
              onClick={() => setBulkOfferModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white rounded-md hover:bg-slate-700 transition-colors"
            >
              <FiTag className="w-4 h-4" />
              Apply Offer ({selectedProducts.length})
            </button>
          )}
          <Link
            href="/admin/products/new"
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-md hover:bg-neutral-800 transition-colors"
          >
            <FiPlus className="w-4 h-4" />
            Add Product
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-neutral-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => dispatch(setFilters({ search: e.target.value }))}
              className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>

          {/* Category */}
          <select
            value={filters.category}
            onChange={(e) => dispatch(setFilters({ category: e.target.value }))}
            className="px-4 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat === 'All' ? '' : cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Status */}
          <select
            value={filters.status}
            onChange={(e) => dispatch(setFilters({ status: e.target.value }))}
            className="px-4 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-900"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg border border-neutral-200 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center text-neutral-500">Loading...</div>
        ) : paginatedProducts.length === 0 ? (
          <div className="p-8 text-center text-neutral-500">No products found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedProducts.length === paginatedProducts.length && paginatedProducts.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 text-neutral-900 rounded"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">
                      Product
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">
                      Category
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">
                      Price
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">
                      Stock
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-neutral-600 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-neutral-600 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-200">
                  {paginatedProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedProducts.includes(product.id)}
                          onChange={() => toggleSelectProduct(product.id)}
                          className="w-4 h-4 text-neutral-900 rounded"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-neutral-100 rounded-md overflow-hidden shrink-0">
                            {product.image && (
                              <Image
                                src={product.image}
                                alt={product.name}
                                width={48}
                                height={48}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-neutral-900 truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-neutral-500">ID: {product.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-neutral-700">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm font-medium text-neutral-900">
                            ₹{product.finalPrice || product.price}
                          </p>
                          {product.discount > 0 && (
                            <p className="text-xs text-neutral-500 line-through">
                              ₹{product.price}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`text-sm ${
                            product.stock === 0
                              ? 'text-red-600 font-medium'
                              : product.stock < 10
                              ? 'text-amber-600'
                              : 'text-neutral-700'
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {product.isActive !== false ? (
                            <>
                              <FiEye className="w-4 h-4 text-green-600" />
                              <span className="text-sm text-green-600">Active</span>
                            </>
                          ) : (
                            <>
                              <FiEyeOff className="w-4 h-4 text-neutral-400" />
                              <span className="text-sm text-neutral-400">Hidden</span>
                            </>
                          )}
                          {product.isDeal && (
                            <span className="ml-2 px-2 py-0.5 bg-slate-100 text-slate-600 text-xs rounded">
                              Deal
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setOfferModalProduct(product)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-50 rounded-md transition-colors"
                            title="Apply Offer"
                          >
                            <FiTag className="w-3.5 h-3.5" />
                          </button>
                          <Link
                            href={`/admin/products/${product.id}`}
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-md transition-colors"
                          >
                            <FiEdit2 className="w-3.5 h-3.5" />
                            Edit
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-4 py-3 border-t border-neutral-200 flex items-center justify-between">
                <p className="text-sm text-neutral-500">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3 py-1 text-sm border border-neutral-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 text-sm border border-neutral-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-neutral-50 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {offerModalProduct && (
        <OfferModal
          product={offerModalProduct}
          onClose={() => setOfferModalProduct(null)}
          onSuccess={handleRefresh}
        />
      )}

      {bulkOfferModalOpen && selectedProductsData.length > 0 && (
        <BulkOfferModal
          products={selectedProductsData}
          onClose={() => setBulkOfferModalOpen(false)}
          onSuccess={handleRefresh}
        />
      )}
    </div>
  );
}
