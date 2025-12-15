'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

export default function HeroSection() {
  return (
    <section className="relative min-h-[600px] md:min-h-[700px] bg-neutral-900 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920')] bg-cover bg-center opacity-20"></div>
      
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center py-20 md:py-32">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-white mb-6 leading-tight tracking-tight">
              Elevate Your
              <span className="block text-neutral-400 mt-2">
                Shopping Experience
              </span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-400 mb-8 max-w-2xl">
              Discover curated collections, exclusive deals, and seamless shopping across all categories
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/products"
                className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-neutral-900 rounded-xl font-medium hover:bg-neutral-100 transition-all duration-200"
              >
                <span>Explore Collections</span>
                <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-6 py-3.5 border border-neutral-700 text-white rounded-xl font-medium hover:bg-neutral-800 transition-all duration-200"
              >
                Join Now
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
