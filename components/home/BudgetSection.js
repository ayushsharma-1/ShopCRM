'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

const budgetRanges = [
  {
    range: '$1-$99',
    title: 'Budget Friendly',
    description: 'Amazing products under $99',
    href: '/products?maxPrice=99',
    image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=800'
  },
  {
    range: '$99-$199',
    title: 'Mid Range',
    description: 'Quality meets affordability',
    href: '/products?minPrice=99&maxPrice=199',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'
  },
  {
    range: '$199+',
    title: 'Premium',
    description: 'Luxury & high-end products',
    href: '/products?minPrice=199',
    image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800'
  }
];

export default function BudgetSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900 mb-3 tracking-tight">
            Shop by Budget
          </h2>
          <p className="text-lg text-neutral-600">
            Find amazing deals in your price range
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {budgetRanges.map((budget, index) => (
            <motion.div
              key={budget.range}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={budget.href}
                className="group block relative h-72 rounded-2xl overflow-hidden border border-neutral-200 hover:border-neutral-300 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="absolute inset-0 bg-neutral-100" />
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-20 group-hover:opacity-30 transition-opacity duration-300"
                  style={{ backgroundImage: `url(${budget.image})` }}
                />
                <div className="relative h-full flex flex-col justify-center items-center p-8 text-center">
                  <div className="text-5xl md:text-6xl font-bold text-neutral-900 mb-4">
                    {budget.range}
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-900 mb-2">
                    {budget.title}
                  </h3>
                  <p className="text-neutral-600 mb-6">
                    {budget.description}
                  </p>
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white rounded-xl font-medium text-sm group-hover:bg-neutral-800 transition-colors">
                    <span>Shop Now</span>
                    <FaArrowRight className="text-xs" />
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
