'use client';

import { motion } from 'framer-motion';
import { FaSpinner } from 'react-icons/fa';

export default function LoadMoreButton({ onClick, isLoading, hasMore }) {
  if (!hasMore) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex justify-center mt-10"
    >
      <button
        onClick={onClick}
        disabled={isLoading}
        className="group relative px-8 py-3.5 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
      >
        <span className={`flex items-center gap-2 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
          Load More Products
        </span>
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <FaSpinner className="animate-spin" />
          </span>
        )}
      </button>
    </motion.div>
  );
}
