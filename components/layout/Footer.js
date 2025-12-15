import Link from 'next/link';
import { FaHeart, FaShoppingBag } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-linear-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-blue-600 via-purple-600 to-pink-600"></div>
      <div className="absolute top-10 right-10 w-32 h-32 bg-blue-600 rounded-full opacity-10 blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-purple-600 rounded-full opacity-10 blur-3xl"></div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        {/* Main Footer Content */}
        <div className="text-center mb-8">
          {/* Logo */}
          <div className="inline-flex items-center space-x-2 mb-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 bg-linear-to-br from-blue-600 via-purple-600 to-pink-600 rounded-xl"></div>
              <div className="relative w-full h-full bg-gray-900 rounded-xl flex items-center justify-center m-0.5">
                <span className="text-2xl font-black bg-linear-to-br from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  S
                </span>
              </div>
            </div>
            <span className="text-3xl font-black bg-linear-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              ShopCRM
            </span>
          </div>
          
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto mb-6">
            Your one-stop destination for all your shopping needs. Quality products at competitive prices with seamless shopping experience.
          </p>

          {/* Quick Links */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-8">
            <Link 
              href="/" 
              className="text-gray-400 hover:text-white transition-colors text-sm md:text-base font-medium hover:underline"
            >
              Home
            </Link>
            <Link 
              href="/products" 
              className="text-gray-400 hover:text-white transition-colors text-sm md:text-base font-medium hover:underline"
            >
              Products
            </Link>
            <Link 
              href="/cart" 
              className="text-gray-400 hover:text-white transition-colors text-sm md:text-base font-medium hover:underline"
            >
              Cart
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="text-center">
            <p className="text-gray-400 text-xs md:text-sm">
              &copy; 2025 ShopCRM. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
