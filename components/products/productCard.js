'use client';

import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import { addToCart } from '@/lib/redux/slices/cartSlice';
import { toast } from 'react-toastify';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart(product));
    toast.success(`${product.name} added to cart!`);
  };

  return (
    <Link href={`/products/${product.id}`} className="group block h-full">
      <article className="h-full bg-white border border-neutral-200/60 rounded-2xl overflow-hidden transition-all duration-300 hover:border-neutral-300 hover:shadow-lg hover:shadow-neutral-200/50 flex flex-col">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-neutral-50">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Stock Badge */}
          {product.stock < 20 && (
            <div className="absolute top-3 left-3 px-2.5 py-1 bg-neutral-900/90 backdrop-blur-sm text-white rounded-lg text-xs font-medium">
              {product.stock} left
            </div>
          )}
          
          {/* Price Badge */}
          <div className="absolute top-3 right-3 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-lg text-sm font-semibold text-neutral-900">
            ${product.price}
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Category */}
          <span className="text-xs font-medium text-neutral-600 uppercase tracking-wide">
            {product.category}
          </span>
          
          {/* Title */}
          <h3 className="mt-2 text-base font-semibold text-neutral-900 line-clamp-2 min-h-[3rem] group-hover:text-neutral-700 transition-colors">
            {product.name}
          </h3>
          
          {/* Description */}
          <p className="mt-2 text-sm text-neutral-500 line-clamp-2 flex-1">
            {product.description}
          </p>
          
          {/* Rating & Add to Cart */}
          <div className="mt-4 pt-4 border-t border-neutral-100 flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5">
              <FaStar className="text-yellow-400 text-sm" />
              <span className="text-sm font-medium text-neutral-900">{product.rating}</span>
            </div>
            
            <button
              onClick={handleAddToCart}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-all duration-200 text-sm font-medium group/btn"
            >
              <FaShoppingCart className="text-xs group-hover/btn:scale-110 transition-transform" />
              <span className="hidden sm:inline">Add</span>
            </button>
          </div>
        </div>
      </article>
    </Link>
  );
}
