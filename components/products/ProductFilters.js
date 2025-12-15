'use client';

import { useSelector, useDispatch } from 'react-redux';
import { setFilters, applyFilters, resetFilters } from '@/lib/redux/slices/productsSlice';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function ProductFilters() {
  const dispatch = useDispatch();
  const { filters, products } = useSelector((state) => state.products);

  const categories = ['all', ...new Set(products.map((p) => p.category))];
  const hasActiveFilters = filters.search || filters.category !== 'all' || filters.minPrice > 0 || filters.maxPrice < 10000 || filters.minRating > 0;

  const handleSearchChange = (e) => {
    dispatch(setFilters({ search: e.target.value }));
    dispatch(applyFilters());
  };

  const handlePriceChange = (type, value) => {
    dispatch(setFilters({ [type]: parseFloat(value) }));
    dispatch(applyFilters());
  };

  const handleRatingChange = (e) => {
    dispatch(setFilters({ minRating: parseFloat(e.target.value) }));
    dispatch(applyFilters());
  };

  const handleCategoryChange = (category) => {
    dispatch(setFilters({ category }));
    dispatch(applyFilters());
  };

  const handleReset = () => {
    dispatch(resetFilters());
    dispatch(applyFilters());
  };

  const clearSearch = () => {
    dispatch(setFilters({ search: '' }));
    dispatch(applyFilters());
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white border border-neutral-200/60 rounded-2xl p-5 space-y-6 sticky top-24 h-fit"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-900">Filters</h2>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="text-xs font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
          >
            Reset all
          </button>
        )}
      </div>

      {/* Search */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-neutral-700">Search</label>
        <div className="relative">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs" />
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-10 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all text-neutral-900 font-medium placeholder:text-neutral-400 placeholder:font-normal"
          />
          {filters.search && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
            >
              <FaTimes className="text-xs" />
            </button>
          )}
        </div>
      </div>

      {/* Category */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-neutral-700">Category</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-3.5 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                filters.category === category
                  ? 'bg-neutral-900 text-white'
                  : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              {category === 'all' ? 'All' : category}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-neutral-700">
          Price Range
        </label>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-neutral-600">
              <span>Min</span>
              <span className="font-semibold text-neutral-900">${filters.minPrice}</span>
            </div>
            <input
              type="range"
              min="0"
              max="10000"
              step="50"
              value={filters.minPrice}
              onChange={(e) => handlePriceChange('minPrice', e.target.value)}
              className="w-full h-1.5 bg-neutral-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-neutral-900 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-neutral-900 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-neutral-600">
              <span>Max</span>
              <span className="font-semibold text-neutral-900">${filters.maxPrice}</span>
            </div>
            <input
              type="range"
              min="0"
              max="10000"
              step="50"
              value={filters.maxPrice}
              onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
              className="w-full h-1.5 bg-neutral-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-neutral-900 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-neutral-900 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-neutral-700">
          Minimum Rating
        </label>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-neutral-600">
            <span>Any rating</span>
            <span className="font-semibold text-neutral-900">{filters.minRating > 0 ? `${filters.minRating}★` : 'Any'}</span>
          </div>
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={filters.minRating}
            onChange={handleRatingChange}
            className="w-full h-1.5 bg-neutral-200 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-neutral-900 [&::-webkit-slider-thumb]:cursor-pointer [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-neutral-900 [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:cursor-pointer"
          />
          <div className="flex justify-between text-xs text-neutral-500">
            <span>0★</span>
            <span>5★</span>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}
