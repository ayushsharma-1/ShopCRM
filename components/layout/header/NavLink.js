'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export default function NavLink({ href, children, icon: Icon, mobile = false, onClick }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  if (mobile) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 ${
          isActive 
            ? 'bg-neutral-900 text-white' 
            : 'text-neutral-700 hover:bg-neutral-100'
        }`}
      >
        {Icon && <Icon className="text-base" />}
        <span className="font-medium">{children}</span>
      </Link>
    );
  }
  
  return (
    <Link
      href={href}
      className={`relative px-4 py-2 font-medium transition-colors duration-200 ${
        isActive ? 'text-neutral-900' : 'text-neutral-600 hover:text-neutral-900'
      }`}
    >
      {children}
      {isActive && (
        <motion.span
          layoutId="activeNav"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900 rounded-full"
          transition={{ type: "spring", stiffness: 380, damping: 30 }}
        />
      )}
    </Link>
  );
}
