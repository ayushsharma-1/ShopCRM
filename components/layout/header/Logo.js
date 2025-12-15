'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5 group">
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
        className="relative w-9 h-9 md:w-10 md:h-10"
      >
        <div className="absolute inset-0 bg-neutral-900 rounded-lg" />
        <div className="relative w-full h-full flex items-center justify-center">
          <span className="text-xl md:text-2xl font-bold text-white">S</span>
        </div>
      </motion.div>
      <div className="flex flex-col">
        <span className="text-lg md:text-xl font-semibold text-neutral-900 leading-none group-hover:text-neutral-700 transition-colors">
          ShopCRM
        </span>
        <span className="text-[9px] md:text-[10px] text-neutral-500 font-medium tracking-wider uppercase">
          Your Store
        </span>
      </div>
    </Link>
  );
}
