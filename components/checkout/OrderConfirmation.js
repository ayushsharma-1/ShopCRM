'use client';

import { motion } from 'framer-motion';
import { FaCheckCircle, FaSpinner } from 'react-icons/fa';

export default function OrderConfirmation({ isProcessing }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-12 md:py-16"
    >
      {isProcessing ? (
        <>
          <div className="w-20 h-20 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-6">
            <FaSpinner className="text-neutral-900 text-3xl animate-spin" />
          </div>
          <h2 className="text-2xl font-semibold text-neutral-900 mb-2">
            Processing your order...
          </h2>
          <p className="text-neutral-500">Please wait while we confirm your payment</p>
        </>
      ) : (
        <>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20, delay: 0.2 }}
            className="w-20 h-20 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-6"
          >
            <FaCheckCircle className="text-green-600 text-4xl" />
          </motion.div>
          <h2 className="text-2xl md:text-3xl font-semibold text-neutral-900 mb-2">
            Order Confirmed!
          </h2>
          <p className="text-neutral-600 mb-4">Thank you for your purchase.</p>
          <p className="text-sm text-neutral-500">Redirecting to products page...</p>
        </>
      )}
    </motion.div>
  );
}
