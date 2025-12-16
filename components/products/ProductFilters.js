'use client';

import { useSelector, useDispatch } from 'react-redux';
import { useRef, useCallback } from 'react';
import { setFilters, setAiFilters, applyFilters, resetFilters } from '@/lib/redux/slices/productsSlice';
import { parseSearchIntent } from '@/lib/ai/intentParser';
import { FaSearch, FaTimes, FaMagic } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function ProductFilters() {
  const dispatch = useDispatch();
  const { filters, products, aiFilters } = useSelector((state) => state.products);
  const searchTimeoutRef = useRef(null);

  const categories = ['all', ...new Set(products.map((p) => p.category))];
  const hasActiveFilters = filters.search || filters.category !== 'all' || filters.minPrice > 0 || filters.maxPrice < 10000 || filters.minRating > 0 || aiFilters;

  const handleSearchChange = useCallback(async (e) => {
    const searchValue = e.target.value;
    dispatch(setFilters({ search: searchValue }));

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Debounce AI parsing (400ms)
    searchTimeoutRef.current = setTimeout(async () => {
      if (searchValue.length >= 3) {
        // Try AI intent parsing
        const aiIntent = await parseSearchIntent(searchValue);
        
        if (aiIntent) {
          dispatch(setAiFilters(aiIntent));
        } else {
          dispatch(setAiFilters(null));
        }
      } else {
        dispatch(setAiFilters(null));
      }
      
      dispatch(applyFilters());
    }, 400);
  }, [dispatch]);

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
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    dispatch(setFilters({ search: '' }));
    dispatch(setAiFilters(null));
    dispatch(applyFilters());
  };

  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-white border border-neutral-200/60 rounded-2xl p-5 space-y-6 sticky top-24 h-fit"
    >
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

      <div className="space-y-2">
        <label className="block text-sm font-medium text-neutral-700">
          Search
          {aiFilters && (
            <span className="ml-2 text-xs text-neutral-500 font-normal inline-flex items-center gap-1">
              <FaMagic className="text-[10px]" />
              AI Active
            </span>
          )}
        </label>
        <div className="relative">
          <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 text-xs" />
          <input
            type="text"
            placeholder="Try: black shoes under 3000..."
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-10 py-2.5 text-sm border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-neutral-900/80 focus:border-transparent transition-all duration-200 text-neutral-900 font-medium placeholder:text-neutral-400 placeholder:font-normal hover:border-neutral-300"
          />
          {filters.search && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors duration-150"
            >
              <FaTimes className="text-xs" />
            </button>
          )}
        </div>
        {aiFilters && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-neutral-600 bg-neutral-50 px-3 py-2 rounded-lg border border-neutral-200/60"
          >
            <div className="flex items-start gap-2">
              <FaMagic className="text-neutral-500 mt-0.5 flex-shrink-0" />
              <div className="space-y-1">
                {aiFilters.category && (
                  <div><span className="font-medium">Category:</span> {aiFilters.category}</div>
                )}
                {aiFilters.color && (
                  <div><span className="font-medium">Color:</span> {aiFilters.color}</div>
                )}
                {aiFilters.maxPrice && (
                  <div><span className="font-medium">Max Price:</span> ₹{aiFilters.maxPrice}</div>
                )}
                {aiFilters.minRating && (
                  <div><span className="font-medium">Min Rating:</span> {aiFilters.minRating}★</div>
                )}
                {aiFilters.keywords && aiFilters.keywords.length > 0 && (
                  <div><span className="font-medium">Keywords:</span> {aiFilters.keywords.join(', ')}</div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-neutral-700">Category</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-3.5 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
                filters.category === category
                  ? 'bg-neutral-900 text-white shadow-sm'
                  : 'bg-neutral-50 text-neutral-700 hover:bg-neutral-100 hover:border-neutral-300 border border-neutral-200 hover:shadow-sm active:scale-95'
              }`}
            >
              {category === 'all' ? 'All' : category}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-neutral-700">
          Price Range
        </label>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-neutral-600">
              <span>Min</span>
              <span className="font-semibold text-neutral-900">₹{filters.minPrice}</span>
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
              <span className="font-semibold text-neutral-900">₹{filters.maxPrice}</span>
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
