'use client';

import Link from 'next/link';
import { FaUser, FaSignOutAlt, FaBell, FaMapMarkerAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import NavLink from './NavLink';

export default function MobileMenu({ 
  isOpen, 
  isAuthenticated, 
  user, 
  mounted, 
  onLogout, 
  onClose 
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="md:hidden overflow-hidden border-t border-neutral-200"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-3">
            <NavLink href="/" mobile onClick={onClose}>
              Home
            </NavLink>
            <NavLink href="/products" mobile onClick={onClose}>
              Products
            </NavLink>

            <div className="pt-4 border-t border-neutral-200 space-y-3">
              {mounted && isAuthenticated ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 bg-neutral-50 rounded-xl">
                    <div className="w-10 h-10 bg-neutral-900 rounded-full flex items-center justify-center">
                      <FaUser className="text-white text-sm" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-neutral-900 truncate">{user?.name}</p>
                      <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
                    </div>
                  </div>
                  <NavLink href="/agent-dashboard" mobile onClick={onClose}>
                    <FaBell className="inline mr-2" />
                    Automation & Alerts
                  </NavLink>
                  <NavLink href="/addresses" mobile onClick={onClose}>
                    <FaMapMarkerAlt className="inline mr-2" />
                    Saved Addresses
                  </NavLink>
                  <button
                    onClick={onLogout}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-colors font-medium"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    onClick={onClose}
                    className="block w-full text-center px-4 py-2.5 text-neutral-900 border border-neutral-300 rounded-xl hover:bg-neutral-50 transition-colors font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    onClick={onClose}
                    className="block w-full text-center px-4 py-2.5 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-colors font-medium"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
