'use client';

import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FiHome, FiPackage, FiPlus, FiShoppingBag, FiBarChart2 } from 'react-icons/fi';

/**
 * Admin Layout
 * - Client-side auth guard
 * - Sidebar navigation
 * - Minimal grayscale design
 */
export default function AdminLayout({ children }) {
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Wait for client-side hydration
    setIsChecking(false);
    
    // Client-side auth check
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    // Role check (require admin role)
    if (user?.role !== 'admin') {
      router.push('/');
      return;
    }
  }, [isAuthenticated, user, router]);

  // Show loading while checking auth or if not authorized
  const shouldShowContent = !isChecking && isAuthenticated && user?.role === 'admin';
  
  if (!shouldShowContent) {
    return (
      <div className="min-h-screen bg-neutral-50">
        <div className="flex items-center justify-center h-screen">
          <div className="text-neutral-500">Loading...</div>
        </div>
      </div>
    );
  }

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: FiHome },
    { name: 'Products', href: '/admin/products', icon: FiPackage },
    { name: 'Add Product', href: '/admin/products/new', icon: FiPlus },
    { name: 'Orders', href: '/admin/orders', icon: FiShoppingBag, disabled: true },
    { name: 'Analytics', href: '/admin/analytics', icon: FiBarChart2, disabled: true },
  ];

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-neutral-200">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-neutral-200">
            <h1 className="text-xl font-medium text-neutral-900">Admin Panel</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.disabled ? '#' : item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-md text-sm
                    transition-colors duration-150
                    ${item.disabled 
                      ? 'text-neutral-400 cursor-not-allowed' 
                      : 'text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900'
                    }
                  `}
                  onClick={(e) => item.disabled && e.preventDefault()}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                  {item.disabled && (
                    <span className="ml-auto text-xs text-neutral-400">Soon</span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User info */}
          <div className="p-4 border-t border-neutral-200">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-neutral-200 flex items-center justify-center">
                <span className="text-sm font-medium text-neutral-600">A</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-neutral-900 truncate">
                  {user?.name || 'Admin'}
                </p>
                <p className="text-xs text-neutral-500 truncate">{user?.email}</p>
              </div>
            </div>
            <Link
              href="/"
              className="mt-3 block w-full text-center px-3 py-2 text-sm text-neutral-700 bg-neutral-100 rounded-md hover:bg-neutral-200 transition-colors"
            >
              Back to Shop
            </Link>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="pl-64">
        <div className="min-h-screen">
          {children}
        </div>
      </main>
    </div>
  );
}
