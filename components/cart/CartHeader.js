'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function CartHeader({ itemCount }) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between mb-8"
    >
      <div>
        <h1 className="text-2xl md:text-3xl font-semibold text-neutral-900 tracking-tight mb-1">
          Shopping Cart
        </h1>
        <p className="text-sm text-neutral-500">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </p>
      </div>
      
      <button
        onClick={() => router.push('/products')}
        className="text-sm text-neutral-600 hover:text-neutral-900 font-medium transition-colors"
      >
        Continue Shopping
      </button>
    </motion.div>
  );
}
