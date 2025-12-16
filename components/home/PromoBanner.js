'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';
import products from '@/data/products.json';

export default function PromoBanner() {
  const saleProducts = products.filter(product => 
    product.discount === '50% OFF' && product.originalPrice
  );

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            {saleProducts.length > 0 ? (
              <Link
                href="/products?onSale=true"
                className="group block relative h-96 lg:h-full rounded-2xl overflow-hidden border border-neutral-200 hover:border-neutral-300 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-neutral-900" />
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-30 group-hover:opacity-40 transition-opacity"
                  style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800)' }}
                />
                <div className="relative h-full flex flex-col justify-center p-10 md:p-12 text-white">
                  <span className="text-xs font-medium uppercase tracking-wider mb-3 text-neutral-400">
                    Limited Time Offer
                  </span>
                  <h3 className="text-4xl md:text-5xl font-semibold mb-3">Winter Sale</h3>
                  <p className="text-xl md:text-2xl text-neutral-300 mb-6">
                    Up to 50% Off on {saleProducts.length} Products
                  </p>
                  <span className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-neutral-900 rounded-xl font-medium w-fit group-hover:bg-neutral-100 transition-colors">
                    <span>Shop Sale</span>
                    <FaArrowRight className="text-sm" />
                  </span>
                </div>
              </Link>
            ) : (
              <div className="relative h-96 lg:h-full rounded-2xl overflow-hidden border border-neutral-200">
                <div className="absolute inset-0 bg-neutral-900" />
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-30"
                  style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800)' }}
                />
                <div className="relative h-full flex flex-col justify-center p-10 md:p-12 text-white">
                  <span className="text-xs font-medium uppercase tracking-wider mb-3 text-neutral-400">
                    Coming Soon
                  </span>
                  <h3 className="text-4xl md:text-5xl font-semibold mb-3">Stay Tuned</h3>
                  <p className="text-xl md:text-2xl text-neutral-300 mb-6">
                    Exciting offers on the way
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          <div className="flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Link
                href="/products?category=Electronics"
                className="group block relative h-56 rounded-2xl overflow-hidden border border-neutral-200 hover:border-neutral-300 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-neutral-800" />
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-50 transition-opacity"
                  style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600)' }}
                />
                <div className="relative h-full flex items-center p-8 text-white">
                  <div>
                    <h4 className="text-2xl md:text-3xl font-semibold mb-2">Smart Watches</h4>
                    <p className="text-neutral-300 mb-4">Track your fitness goals</p>
                    <span className="text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      <span>Discover More</span>
                      <FaArrowRight className="text-xs" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Link
                href="/products?category=Sports"
                className="group block relative h-56 rounded-2xl overflow-hidden border border-neutral-200 hover:border-neutral-300 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-neutral-800" />
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-50 transition-opacity"
                  style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600)' }}
                />
                <div className="relative h-full flex items-center p-8 text-white">
                  <div>
                    <h4 className="text-2xl md:text-3xl font-semibold mb-2">Sports Gear</h4>
                    <p className="text-neutral-300 mb-4">Premium quality essentials</p>
                    <span className="text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                      <span>View Collection</span>
                      <FaArrowRight className="text-xs" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
