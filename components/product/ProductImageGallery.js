'use client';

import { useState } from 'react';
import { FaShareAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

export default function ProductImageGallery({ product }) {
  const [activeImage, setActiveImage] = useState(0);
  const images = [product.image, product.image, product.image, product.image];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast.success('URL copied to clipboard!');
  };

  return (
    <div className="space-y-3 md:space-y-4">
      <div className="relative aspect-square bg-linear-to-br from-gray-50 to-gray-100 rounded-xl md:rounded-2xl overflow-hidden group">
        <img
          src={images[activeImage]}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute top-3 md:top-4 right-3 md:right-4">
          <button 
            onClick={handleShare}
            className="w-9 h-9 md:w-11 md:h-11 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-all shadow-sm hover:shadow-md"
            aria-label="Share product"
          >
            <FaShareAlt className="text-gray-600 hover:text-blue-500 transition-colors" size={16} />
          </button>
        </div>

        {product.stock < 20 && (
          <div className="absolute top-3 md:top-4 left-3 md:left-4 px-3 md:px-4 py-1.5 md:py-2 bg-red-500/90 backdrop-blur-sm text-white rounded-full text-xs md:text-sm font-medium shadow-lg">
            Only {product.stock} left
          </div>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2 md:gap-3">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setActiveImage(index)}
            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
              activeImage === index
                ? 'border-blue-500 scale-95'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
