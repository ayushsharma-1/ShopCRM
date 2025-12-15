'use client';

import { useSelector, useDispatch } from 'react-redux';
import { setFilters, applyFilters, resetFilters } from '@/lib/redux/slices/productsSlice';
import { FaSearch } from 'react-icons/fa';

export default function ProductFilters() {
  const dispatch = useDispatch();
  const { filters, products } = useSelector((state) => state.products);
  const categories = ['all', ...new Set(products.map((p) => p.category))];

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

  const handleCategoryChange = (e) => {
    dispatch(setFilters({ category: e.target.value }));
    dispatch(applyFilters());
  };

  const handleReset = () => {
    dispatch(resetFilters());
    dispatch(applyFilters());
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
      <h2 className="text-xl font-bold text-gray-800">Filters</h2>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={filters.search}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
        <select
          value={filters.category}
          onChange={handleCategoryChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category === 'all' ? 'All Categories' : category}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Price Range: ${filters.minPrice} - ${filters.maxPrice}
        </label>
        <div className="space-y-3">
          <div>
            <input
              type="range"
              min="0"
              max="10000"
              step="50"
              value={filters.minPrice}
              onChange={(e) => handlePriceChange('minPrice', e.target.value)}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Min: ${filters.minPrice}</span>
            </div>
          </div>
          <div>
            <input
              type="range"
              min="0"
              max="10000"
              step="50"
              value={filters.maxPrice}
              onChange={(e) => handlePriceChange('maxPrice', e.target.value)}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Max: ${filters.maxPrice}</span>
            </div>
          </div>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Minimum Rating: {filters.minRating} ⭐
        </label>
        <input
          type="range"
          min="0"
          max="5"
          step="0.5"
          value={filters.minRating}
          onChange={handleRatingChange}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>Any</span>
          <span>5 ⭐</span>
        </div>
      </div>
      <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
        <button
          onClick={handleReset}
          className="px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-all border border-gray-300"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
