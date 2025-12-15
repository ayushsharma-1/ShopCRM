'use client';

import Link from 'next/link';
import FooterSection from './footer/FooterSection';
import FooterLink from './footer/FooterLink';

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-4 group">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <span className="text-xl font-bold text-neutral-900">S</span>
            </div>
            <span className="text-2xl font-semibold text-white group-hover:text-neutral-300 transition-colors">
              ShopCRM
            </span>
          </Link>
          
          <p className="text-neutral-400 text-sm md:text-base max-w-2xl mx-auto mb-6">
            Your one-stop destination for all your shopping needs. Quality products at competitive prices with seamless shopping experience.
          </p>

          <div className="flex flex-wrap justify-center gap-6 md:gap-8">
            <FooterLink href="/">Home</FooterLink>
            <FooterLink href="/products">Products</FooterLink>
            <FooterLink href="/cart">Cart</FooterLink>
          </div>
        </div>

        <div className="border-t border-neutral-800 pt-8">
          <div className="text-center">
            <p className="text-neutral-500 text-xs md:text-sm">
              &copy; 2025 ShopCRM. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
