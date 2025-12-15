'use client';

import { FaStar } from 'react-icons/fa';

export default function ProductInfo({ product, averageRating, reviewCount }) {
  return (
    <div className="space-y-4 md:space-y-6">
      {/* Category & Status */}
      <div className="flex items-center gap-2 md:gap-3 flex-wrap">
        <span className="px-2.5 md:px-3 py-1 bg-linear-to-r from-blue-50 to-purple-50 text-blue-700 rounded-full text-xs font-semibold uppercase tracking-wide">
          {product.category}
        </span>
        {product.stock > 50 && (
          <span className="px-2.5 md:px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
            In Stock
          </span>
        )}
      </div>

      <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
        {product.name}
      </h1>

      <div className="flex flex-wrap items-center gap-2 md:gap-4 pb-4 md:pb-6 border-b border-gray-100">
        <div className="flex items-center gap-1.5">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={`${
                i < Math.floor(averageRating || product.rating)
                  ? 'text-yellow-400'
                  : 'text-gray-200'
              } text-lg`}
            />
          ))}
        </div>
        <span className="text-lg font-semibold text-gray-900">
          {averageRating || product.rating}
        </span>
        <span className="text-gray-300">|</span>
        <button className="text-gray-600 hover:text-blue-600 transition-colors text-sm">
          {reviewCount || 248} Reviews
        </button>
        <span className="text-gray-300">|</span>
        <span className="text-gray-600 text-sm">1.2K Sold</span>
      </div>

      {/* Price Section */}
      <div className="bg-linear-to-br from-gray-50 to-gray-100/50 rounded-xl md:rounded-2xl p-4 md:p-6 space-y-2">
        <div className="flex flex-wrap items-baseline gap-2 md:gap-3">
          <span className="text-3xl md:text-4xl font-bold text-gray-900">${product.price}</span>
          <span className="text-lg md:text-xl text-gray-400 line-through">
            ${(product.price * 1.3).toFixed(2)}
          </span>
          <span className="px-2 md:px-3 py-1 bg-red-500 text-white rounded-full text-xs md:text-sm font-semibold">
            Save 30%
          </span>
        </div>
        <p className="text-xs md:text-sm text-gray-600">
          Inclusive of all taxes • <span className="font-medium">Free Shipping</span>
        </p>
      </div>

      {/* Product Description */}
      <div className="pt-2">
        <p className="text-sm md:text-base text-gray-600 leading-relaxed">{product.description}</p>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-2 md:gap-4 pt-2 md:pt-4">
        <div className="text-center space-y-2 p-4 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
          <div className="w-10 h-10 mx-auto bg-blue-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
          </div>
          <p className="text-xs font-medium text-gray-700">Free Delivery</p>
        </div>
        <div className="text-center space-y-2 p-4 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
          <div className="w-10 h-10 mx-auto bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <p className="text-xs font-medium text-gray-700">Secure Payment</p>
        </div>
        <div className="text-center space-y-2 p-4 rounded-xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
          <div className="w-10 h-10 mx-auto bg-purple-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <p className="text-xs font-medium text-gray-700">Easy Returns</p>
        </div>
      </div>
    </div>
  );
}
