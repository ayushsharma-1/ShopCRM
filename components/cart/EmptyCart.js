'use client';

import { motion } from 'framer-motion';
import { FaShoppingBag } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function EmptyCart() {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-20 px-4"
    >
      <div className="w-20 h-20 rounded-2xl bg-neutral-100 flex items-center justify-center mb-6">
        <FaShoppingBag className="text-neutral-400 text-3xl" />
      </div>
      <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
        Your cart is empty
      </h2>
      <p className="text-neutral-500 text-center max-w-md mb-8">
        Start adding products to see them here
      </p>
      <button
        onClick={() => router.push('/products')}
        className="px-6 py-3 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-all duration-200 font-medium"
      >
        Continue Shopping
      </button>
    </motion.div>
  );
}
