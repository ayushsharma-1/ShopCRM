'use client';

import { useRouter } from 'next/navigation';
import { FaStar } from 'react-icons/fa';

export default function SimilarProducts({ products }) {
  const router = useRouter();

  if (!products || products.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-8 lg:p-10 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <button
            key={product.id}
            onClick={() => router.push(`/products/${product.id}`)}
            className="group bg-white rounded-xl border border-gray-100 hover:border-gray-200 overflow-hidden transition-all hover:shadow-md"
          >
            {/* Product Image */}
            <div className="relative aspect-square bg-linear-to-br from-gray-50 to-gray-100 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-3 right-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full shadow-sm">
                <span className="text-sm font-semibold text-gray-900">
                  ₹{product.price}
                </span>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-5 text-left">
              <span className="inline-block px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium mb-3">
                {product.category}
              </span>
              
              <h3 className="text-base font-bold text-gray-900 line-clamp-2 min-h-12 mb-3 group-hover:text-blue-600 transition-colors">
                {product.name}
              </h3>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <FaStar className="text-yellow-400 text-sm" />
                  <span className="text-sm font-semibold text-gray-700">
                    {product.rating}
                  </span>
                </div>
                <span className="text-blue-600 font-medium text-sm group-hover:translate-x-1 transition-transform inline-block">
                  View →
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
