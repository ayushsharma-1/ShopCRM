'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

export default function CTASection() {
  return (
    <section className="relative min-h-[500px] md:min-h-[600px] bg-neutral-900 overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>
      
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1920)' }}
      />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex flex-col justify-center items-center text-center py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-6 tracking-tight">
            Start Your Journey Today
          </h2>
          <p className="text-lg md:text-xl text-neutral-400 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers and experience shopping like never before
          </p>
          <Link
            href="/products"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-white text-neutral-900 rounded-xl text-lg font-medium hover:bg-neutral-100 transition-all duration-200"
          >
            <span>Browse All Products</span>
            <FaArrowRight className="text-sm group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
