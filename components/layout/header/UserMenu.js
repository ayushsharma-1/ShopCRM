'use client';

import Link from 'next/link';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';

export default function UserMenu({ isAuthenticated, user, onLogout }) {
  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2 md:gap-3">
        <div className="hidden lg:flex items-center gap-2 px-3 py-2 bg-neutral-100 rounded-xl">
          <div className="w-7 h-7 bg-neutral-900 rounded-full flex items-center justify-center">
            <FaUser className="text-white text-xs" />
          </div>
          <span className="text-sm font-medium text-neutral-900">{user?.name}</span>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-colors duration-200 text-sm font-medium"
        >
          <FaSignOutAlt className="text-sm" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    );
  }
  
  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="px-4 py-2 text-neutral-700 font-medium hover:text-neutral-900 transition-colors hidden sm:block"
      >
        Login
      </Link>
      <Link
        href="/signup"
        className="px-4 py-2 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-colors duration-200 text-sm font-medium"
      >
        Sign Up
      </Link>
    </div>
  );
}
