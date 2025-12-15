'use client';

import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';

export default function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 px-4"
    >
      <div className="w-16 h-16 rounded-2xl bg-neutral-100 flex items-center justify-center mb-5">
        <FaSearch className="text-neutral-400 text-2xl" />
      </div>
      <h3 className="text-xl font-semibold text-neutral-800 mb-2">
        No products found
      </h3>
      <p className="text-neutral-500 text-center max-w-md">
        Try adjusting your filters or search terms to find what you're looking for
      </p>
    </motion.div>
  );
}
