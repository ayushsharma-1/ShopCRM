'use client';

import { useParams } from 'next/navigation';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaStar, FaShoppingCart, FaHeart, FaCheckCircle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { addItem } from '@/lib/redux/slices/cartSlice';
import { toast } from 'react-toastify';
import deals from '@/data/deals.json';

export default function DealDetailPage() {
  const params = useParams();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);
  
  const deal = deals.find(d => d.id === params.id);

  if (!deal) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Deal Not Found</h1>
          <p className="text-neutral-600">This deal may have expired or is no longer available.</p>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    dispatch(addItem({
      id: deal.id,
      name: deal.name,
      price: deal.price,
      image: deal.image,
      quantity: quantity
    }));
    toast.success('Added to cart!');
  };

  const calculateTimeLeft = () => {
    const endDate = new Date(deal.dealEndDate);
    const now = new Date();
    const difference = endDate - now;
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    
    return { days, hours };
  };

  const timeLeft = calculateTimeLeft();

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="sticky top-24">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-white border border-neutral-200">
                <img
                  src={deal.image}
                  alt={deal.name}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-lg">
                  {deal.discount}
                </span>
                <span className="absolute top-4 left-4 bg-neutral-900 text-white px-4 py-2 rounded-lg text-xs font-medium">
                  ❄️ {deal.dealType}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Details Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            {/* Deal Timer */}
            <div className="bg-red-50 border border-red-200 rounded-xl p-4">
              <p className="text-sm font-medium text-red-800 mb-2">⏰ Deal Ends In:</p>
              <div className="flex gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{timeLeft.days}</div>
                  <div className="text-xs text-red-800">Days</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{timeLeft.hours}</div>
                  <div className="text-xs text-red-800">Hours</div>
                </div>
              </div>
            </div>

            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3">
                {deal.name}
              </h1>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-1.5">
                  <FaStar className="text-yellow-400 text-lg" />
                  <span className="text-lg font-semibold text-neutral-900">{deal.rating}</span>
                  <span className="text-neutral-600">(250+ reviews)</span>
                </div>
              </div>

              <p className="text-neutral-600 text-lg leading-relaxed">
                {deal.description}
              </p>
            </div>

            {/* Price Section */}
            <div className="bg-white rounded-xl p-6 border border-neutral-200">
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-4xl font-bold text-neutral-900">
                  ${deal.price.toFixed(2)}
                </span>
                <span className="text-2xl text-neutral-400 line-through">
                  ${deal.originalPrice.toFixed(2)}
                </span>
                <span className="text-lg font-semibold text-green-600">
                  Save ${(deal.originalPrice - deal.price).toFixed(2)}
                </span>
              </div>
              <p className="text-sm text-neutral-600">Inclusive of all taxes</p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-xl p-6 border border-neutral-200">
              <h3 className="font-semibold text-neutral-900 mb-4">Key Features</h3>
              <div className="grid grid-cols-1 gap-3">
                {deal.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <FaCheckCircle className="text-green-600 flex-shrink-0" />
                    <span className="text-neutral-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 text-sm">
              <span className={`inline-block w-2 h-2 rounded-full ${deal.stock > 20 ? 'bg-green-500' : 'bg-orange-500'}`} />
              <span className="text-neutral-700">
                {deal.stock > 20 ? 'In Stock' : `Only ${deal.stock} left!`}
              </span>
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-neutral-700 font-medium">Quantity:</span>
              <div className="flex items-center border border-neutral-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-neutral-100 transition-colors"
                >
                  -
                </button>
                <span className="px-6 py-2 border-x border-neutral-300">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(deal.stock, quantity + 1))}
                  className="px-4 py-2 hover:bg-neutral-100 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-neutral-900 text-white py-4 px-6 rounded-xl font-semibold hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
              >
                <FaShoppingCart />
                Add to Cart
              </button>
              <button className="p-4 border border-neutral-300 rounded-xl hover:bg-neutral-50 transition-colors">
                <FaHeart className="text-xl text-neutral-700" />
              </button>
            </div>

            {/* Additional Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 space-y-2">
              <div className="flex items-start gap-2">
                <FaCheckCircle className="text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">Free Shipping</p>
                  <p className="text-sm text-blue-700">On orders above $50</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FaCheckCircle className="text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">Easy Returns</p>
                  <p className="text-sm text-blue-700">30-day return policy</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
