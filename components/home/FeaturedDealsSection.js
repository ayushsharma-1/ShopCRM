'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaStar } from 'react-icons/fa';

const deals = [
  {
    id: 32,
    name: 'Gaming Laptop',
    price: 1299,
    originalPrice: 1529,
    discount: '15% OFF',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=400&h=300&fit=crop'
  },
  {
    id: 28,
    name: 'Wireless Earbuds',
    price: 129,
    originalPrice: 161,
    discount: '20% OFF',
    rating: 4.6,
    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=300&fit=crop'
  },
  {
    id: 87,
    name: 'Massage Gun',
    price: 99,
    originalPrice: 132,
    discount: '25% OFF',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400&h=300&fit=crop'
  },
  {
    id: 62,
    name: 'Dumbbell Set',
    price: 299,
    originalPrice: 365,
    discount: '18% OFF',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=300&fit=crop'
  },
  {
    id: 31,
    name: '4K Smart TV 55"',
    price: 699,
    originalPrice: 897,
    discount: '22% OFF',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=300&fit=crop'
  },
  {
    id: 72,
    name: 'Ergonomic Chair',
    price: 249,
    originalPrice: 357,
    discount: '30% OFF',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400&h=300&fit=crop'
  },
  {
    id: 40,
    name: 'Drone with Camera',
    price: 399,
    originalPrice: 454,
    discount: '12% OFF',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=300&fit=crop'
  },
  {
    id: 91,
    name: 'Winter Coat',
    price: 129,
    originalPrice: 179,
    discount: '28% OFF',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=300&fit=crop'
  }
];

export default function FeaturedDealsSection() {
  return (
    <section className="py-16 md:py-24 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-neutral-900 text-white text-xs font-medium rounded-full mb-4">
            🔥 HOT DEALS
          </span>
          <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900 mb-3 tracking-tight">
            Limited Time Offers
          </h2>
          <p className="text-lg text-neutral-600">
            Grab these deals before they're gone!
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {deals.map((deal, index) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.05 }}
            >
              <Link
                href={`/products/${deal.id}`}
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
