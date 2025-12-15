'use client';

import { motion } from 'framer-motion';

export default function CheckoutSection({ title, children, delay = 0 }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="bg-white border border-neutral-200/60 rounded-2xl p-5 md:p-6"
    >
      {title && (
        <h3 className="text-base font-semibold text-neutral-900 mb-4">{title}</h3>
      )}
      {children}
    </motion.section>
  );
}
