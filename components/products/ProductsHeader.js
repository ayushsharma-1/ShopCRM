'use client';

import { motion } from 'framer-motion';
import { FaSliders } from 'react-icons/fa6';
import SortDropdown from './SortDropdown';

export default function ProductsHeader({ 
  productsCount, 
  showFilters, 
  onToggleFilters 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between gap-4 mb-6 md:mb-8"
    >
      <div className="flex-1">
        <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900 tracking-tight mb-1">
          Products
        </h1>
        <p className="text-sm text-neutral-500">
          {productsCount} {productsCount === 1 ? 'product' : 'products'}
        </p>
      </div>

      <div className="flex items-center gap-3">
        <SortDropdown />
        
        <button
          onClick={onToggleFilters}
          className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-all duration-200 text-sm font-medium"
        >
          <FaSliders className="text-xs" />
          <span className="hidden sm:inline">Filters</span>
        </button>
      </div>
    </motion.div>
  );
}
