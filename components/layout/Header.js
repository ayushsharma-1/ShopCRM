'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import { FaShoppingCart, FaUser, FaSignOutAlt, FaBars, FaTimes, FaHome, FaBox, FaStore } from 'react-icons/fa';
import { logout } from '@/lib/redux/slices/authSlice';
import { toast } from 'react-toastify';

// Modular Logo Component
const Logo = () => (
  <Link href="/" className="flex items-center space-x-2 group">
    <div className="relative w-10 h-10 md:w-12 md:h-12">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl rotate-0 group-hover:rotate-6 transition-transform duration-300"></div>
      {/* Logo content */}
      <div className="relative w-full h-full bg-white rounded-xl flex items-center justify-center shadow-lg">
        <span className="text-2xl md:text-3xl font-black bg-linear-to-br from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
          S
        </span>
      </div>
      {/* Glow effect */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-400 via-purple-400 to-pink-400 rounded-xl blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-300 -z-10"></div>
    </div>
    <div className="flex flex-col">
      <span className="text-xl md:text-2xl font-black bg-linear-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-none">
        ShopCRM
      </span>
      <span className="text-[8px] md:text-[10px] text-gray-500 font-medium tracking-wider">
        YOUR STORE
      </span>
    </div>
  </Link>
);

// Modular Navigation Links Component
const NavLink = ({ href, children, icon: Icon, mobile = false, onClick }) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  
  if (mobile) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
          isActive 
            ? 'bg-linear-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        {Icon && <Icon className="text-lg" />}
        <span className="font-medium">{children}</span>
      </Link>
    );
  }
  
  return (
    <Link
      href={href}
      className={`relative px-4 py-2 font-medium transition-all duration-200 ${
        isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
      }`}
    >
      {children}
      {isActive && (
        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-blue-600 to-purple-600 rounded-full"></span>
      )}
    </Link>
  );
};

// Modular Cart Button Component
const CartButton = ({ totalItems, mounted }) => (
  <Link
    href="/cart"
    className="relative p-2.5 md:p-3 text-gray-700 hover:text-blue-600 transition-all duration-200 hover:bg-blue-50 rounded-xl group"
  >
    <FaShoppingCart className="text-xl md:text-2xl" />
    {mounted && totalItems > 0 && (
      <>
        <span className="absolute -top-1 -right-1 bg-linear-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center px-1 shadow-lg animate-pulse">
          {totalItems > 9 ? '9+' : totalItems}
        </span>
        <span className="absolute -top-1 -right-1 bg-red-400 rounded-full min-w-[20px] h-5 animate-ping opacity-75"></span>
      </>
    )}
  </Link>
);

// Modular User Menu Component
const UserMenu = ({ isAuthenticated, user, onLogout }) => {
  if (isAuthenticated) {
    return (
      <div className="flex items-center space-x-3">
        <div className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded-xl">
          <div className="w-8 h-8 bg-linear-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <FaUser className="text-white text-xs" />
          </div>
          <span className="text-sm font-semibold text-gray-800">{user?.name}</span>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center space-x-2 px-4 py-2 bg-linear-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all duration-200 shadow-md hover:shadow-lg text-sm font-medium">
          <FaSignOutAlt />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    );
  }
  
  return (
    <div className="flex items-center space-x-2">
      <Link
        href="/login"
        className="px-4 py-2 text-blue-600 font-semibold hover:text-blue-700 transition-colors hidden sm:block"
      >
        Login
      </Link>
      <Link
        href="/signup"
        className="px-4 py-2 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg text-sm font-semibold">
        Sign Up
      </Link>
    </div>
  );
};

export default function Header() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { totalItems } = useSelector((state) => state.cart);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Handle client-side mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
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
      className={`bg-white sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'shadow-lg py-2' : 'shadow-md py-3'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/products">Products</NavLink>
          </nav>

          {/* Right Section */}
          <div className="flex items-center space-x-2 md:space-x-3">
            {/* Cart Button */}
            <CartButton totalItems={totalItems} mounted={mounted} />

            {/* Desktop User Menu */}
            <div className="hidden md:flex">
              {mounted && (
                <UserMenu 
                  isAuthenticated={isAuthenticated} 
                  user={user} 
                  onLogout={handleLogout} 
                />
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 text-gray-700 hover:text-blue-600 transition-colors hover:bg-blue-50 rounded-xl"
              aria-label="Toggle menu"
            >
              <div className="relative w-6 h-6">
                <span className={`absolute w-6 h-0.5 bg-current transform transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 top-3' : 'top-1'}`}></span>
                <span className={`absolute w-6 h-0.5 bg-current top-3 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
                <span className={`absolute w-6 h-0.5 bg-current transform transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 top-3' : 'top-5'}`}></span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu with Animation */}
      <div 
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="container mx-auto px-4 py-6 space-y-3 border-t border-gray-100">
          {/* Mobile Navigation Links */}
          <NavLink href="/" icon={FaHome} mobile onClick={() => setMobileMenuOpen(false)}>
            Home
          </NavLink>
          <NavLink href="/products" icon={FaBox} mobile onClick={() => setMobileMenuOpen(false)}>
            Products
          </NavLink>

          {/* Mobile User Section */}
          <div className="pt-4 border-t border-gray-200 space-y-3">
            {mounted && isAuthenticated ? (
              <>
                <div className="flex items-center space-x-3 px-4 py-3 bg-linear-to-r from-blue-50 to-purple-50 rounded-xl">
                  <div className="w-10 h-10 bg-linear-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <FaUser className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-linear-to-r from-red-500 to-pink-500 text-white rounded-xl hover:from-red-600 hover:to-pink-600 transition-all shadow-md font-medium">
                  <FaSignOutAlt />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-3 text-blue-600 border-2 border-blue-600 rounded-xl hover:bg-blue-50 transition-all font-semibold"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-3 bg-linear-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-md font-semibold">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
