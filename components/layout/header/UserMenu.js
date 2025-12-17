'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { FaUser, FaSignOutAlt, FaBell, FaMapMarkerAlt, FaChevronDown } from 'react-icons/fa';

export default function UserMenu({ isAuthenticated, user, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2 md:gap-3" ref={dropdownRef}>
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="hidden lg:flex items-center gap-2 px-3 py-2 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-colors duration-150"
          >
            <div className="w-7 h-7 bg-neutral-900 rounded-full flex items-center justify-center">
              <FaUser className="text-white text-xs" />
            </div>
            <span className="text-sm font-medium text-neutral-900">{user?.name}</span>
            <FaChevronDown className={`text-xs text-neutral-600 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-neutral-200 py-2 z-50">
              <Link
                href="/agent-dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors duration-150"
              >
                <FaBell className="text-neutral-500" />
                Automation & Alerts
              </Link>
              <Link
                href="/addresses"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors duration-150"
              >
                <FaMapMarkerAlt className="text-neutral-500" />
                Saved Addresses
              </Link>
              <div className="border-t border-neutral-100 my-2" />
              <button
                onClick={() => {
                  setIsOpen(false);
                  onLogout();
                }}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150 w-full text-left"
              >
                <FaSignOutAlt className="text-red-500" />
                Logout
              </button>
            </div>
          )}
        </div>
        
        <button
          onClick={onLogout}
          className="lg:hidden flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-colors duration-200 text-sm font-medium"
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
