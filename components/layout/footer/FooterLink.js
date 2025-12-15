'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function FooterLink({ href, children }) {
  return (
    <Link
      href={href}
      className="block text-neutral-400 hover:text-white transition-colors duration-200 text-sm group"
    >
      <motion.span
        whileHover={{ x: 2 }}
        transition={{ duration: 0.2 }}
        className="inline-block"
      >
        {children}
      </motion.span>
    </Link>
  );
}
