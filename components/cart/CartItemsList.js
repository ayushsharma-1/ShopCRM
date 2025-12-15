'use client';

import { motion, AnimatePresence } from 'framer-motion';
import CartItem from './CartItem';

export default function CartItemsList({ items }) {
  return (
    <motion.div layout className="space-y-4">
      <AnimatePresence mode="popLayout">
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
            transition={{
              duration: 0.3,
              delay: index * 0.05,
              ease: [0.23, 1, 0.32, 1]
            }}
          >
            <CartItem item={item} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
