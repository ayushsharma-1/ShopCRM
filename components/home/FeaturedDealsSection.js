'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';
import deals from '@/data/deals.json';

export default function FeaturedDealsSection() {
  // Separate winter sale deals (sports shoes) from other deals
  const winterDeals = deals.filter(deal => deal.dealType === 'Winter Sale').slice(0, 4);
  const hotDeals = deals.filter(deal => deal.dealType !== 'Winter Sale').slice(0, 8);

  return (
    <section className="py-16 md:py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Winter Sale Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-full mb-4">
            ❄️ WINTER SALE - 50% OFF
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900 mb-3 tracking-tight">
            Sports Shoes Winter Clearance
          </h2>
          <p className="text-lg text-neutral-600">
            Get 50% off on premium sports footwear - Limited stock!
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
          {winterDeals.map((deal, index) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Link
                href={`/deals/${deal.id}`}
                className="group block bg-white border border-neutral-200 rounded-2xl overflow-hidden hover:border-neutral-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden bg-neutral-50">
                  <img
                    src={deal.image}
                    alt={deal.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 bg-neutral-900 text-white px-2.5 py-1 rounded-lg text-xs font-medium">
                    {deal.discount}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold text-neutral-900 mb-2 line-clamp-1">
                    {deal.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mb-3">
                    <FaStar className="text-yellow-400 text-sm" />
                    <span className="text-sm text-neutral-600">{deal.rating}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-neutral-900">
                      ${deal.price}
                    </span>
                    <span className="text-sm text-neutral-400 line-through">
                      ${deal.originalPrice}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Hot Deals Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 bg-neutral-900 text-white text-xs font-medium rounded-full mb-4">
            🔥 HOT DEALS
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900 mb-3 tracking-tight">
            Limited Time Offers
          </h2>
          <p className="text-lg text-neutral-600">
            Grab these amazing deals before they're gone!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {hotDeals.map((deal, index) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Link
                href={`/deals/${deal.id}`}
                className="group block bg-white border border-neutral-200 rounded-2xl overflow-hidden hover:border-neutral-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden bg-neutral-50">
                  <img
                    src={deal.image}
                    alt={deal.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 right-3 bg-neutral-900 text-white px-2.5 py-1 rounded-lg text-xs font-medium">
                    {deal.discount}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-semibold text-neutral-900 mb-2 line-clamp-1">
                    {deal.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mb-3">
                    <FaStar className="text-yellow-400 text-sm" />
                    <span className="text-sm text-neutral-600">{deal.rating}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold text-neutral-900">
                      ${deal.price}
                    </span>
                    <span className="text-sm text-neutral-400 line-through">
                      ${deal.originalPrice}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
