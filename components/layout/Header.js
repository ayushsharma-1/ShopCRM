'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/redux/slices/authSlice';
import { toast } from 'react-toastify';
import Logo from './header/Logo';
import NavLink from './header/NavLink';
import CartButton from './header/CartButton';
import UserMenu from './header/UserMenu';
import MobileMenu from './header/MobileMenu';

export default function Header() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [router]);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully!');
    setMobileMenuOpen(false);
    router.push('/login');
  };

  return (
    <header 
      className={`bg-white sticky top-0 z-50 transition-all duration-300 border-b ${
        scrolled ? 'border-neutral-200 shadow-sm' : 'border-neutral-200/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />

          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/products">Products</NavLink>
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <CartButton totalItems={totalItems} mounted={mounted} />

            <div className="hidden md:flex">
              {mounted && (
                <UserMenu 
                  isAuthenticated={isAuthenticated} 
                  user={user} 
                  onLogout={handleLogout} 
                />
              )}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors"
              aria-label="Toggle menu"
            >
              <div className="relative w-5 h-5">
                <span 
                  className={`absolute w-5 h-0.5 bg-current rounded-full transform transition-all duration-300 ${
                    mobileMenuOpen ? 'rotate-45 top-2.5' : 'top-1'
                  }`}
                />
                <span 
                  className={`absolute w-5 h-0.5 bg-current rounded-full top-2.5 transition-all duration-300 ${
                    mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span 
                  className={`absolute w-5 h-0.5 bg-current rounded-full transform transition-all duration-300 ${
                    mobileMenuOpen ? '-rotate-45 top-2.5' : 'top-4'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>

      <MobileMenu
        isOpen={mobileMenuOpen}
        isAuthenticated={isAuthenticated}
        user={user}
        mounted={mounted}
        onLogout={handleLogout}
        onClose={() => setMobileMenuOpen(false)}
      />
    </header>
  );
}
