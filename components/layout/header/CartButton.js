'use client';

import Link from 'next/link';
import { FaShoppingCart } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function CartButton({ totalItems, mounted }) {
  return (
    <Link
      href="/cart"
      className="relative p-2 md:p-2.5 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-all duration-200 group"
    >
      <FaShoppingCart className="text-lg md:text-xl" />
      {mounted && totalItems > 0 && (
        <motion.span
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-1 -right-1 bg-neutral-900 text-white text-xs font-medium rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
        >
          {totalItems > 9 ? '9+' : totalItems}
        </motion.span>
      )}
    </Link>
  );
}
