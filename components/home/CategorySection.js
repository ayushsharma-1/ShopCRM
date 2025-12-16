'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

const categories = [
  {
    name: 'Electronics',
    description: 'Latest tech & gadgets',
    href: '/products?category=Electronics',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800'
  },
  {
    name: 'Fashion',
    description: 'Trending styles',
    href: '/products?category=Clothing',
    image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800'
  },
  {
    name: 'Home & Living',
    description: 'Comfort & style',
    href: '/products?category=Home%20&%20Kitchen',
    image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800'
  }
];

export default function CategorySection() {
  return (
    <section className="py-16 md:py-24 bg-neutral-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-neutral-900 mb-3 tracking-tight">
            Shop by Category
          </h2>
          <p className="text-lg text-neutral-600">
            Curated collections for every lifestyle
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={category.href}
                className="group block relative h-80 rounded-2xl overflow-hidden border border-neutral-200 hover:border-neutral-300 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-neutral-900" />
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:opacity-50 transition-opacity duration-300"
                  style={{ backgroundImage: `url(${category.image})` }}
                />
                <div className="relative h-full flex flex-col justify-end p-8 text-white">
                  <h3 className="text-2xl font-semibold mb-2">{category.name}</h3>
                  <p className="text-neutral-300 mb-4">{category.description}</p>
                  <span className="inline-flex items-center gap-2 text-sm font-medium group-hover:gap-3 transition-all">
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
