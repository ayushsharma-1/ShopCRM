'use client';

import { useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import ReviewCard from './ReviewCard';

export default function ProductTabs({ product, reviews }) {
  const [activeTab, setActiveTab] = useState('description');

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'reviews', label: `Reviews (${reviews.length})` }
  ];

  const specifications = [
    { label: 'Brand', value: 'ShopCRM Premium' },
    { label: 'Model Number', value: `SCM-${product.id}` },
    { label: 'Category', value: product.category },
    { label: 'Weight', value: '1.2 kg' },
    { label: 'Dimensions', value: '30 × 20 × 10 cm' },
    { label: 'Material', value: 'Premium Grade' },
    { label: 'Color Options', value: 'Black, White, Blue, Gray, Red' },
    { label: 'Warranty', value: '1 Year Manufacturer Warranty' }
  ];

  const features = [
    'Premium Quality Materials',
    'Durable Construction',
    'Modern Design',
    'Easy to Use',
    'Eco-Friendly',
    'Warranty Included'
  ];

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-100">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-4 px-6 font-medium transition-all relative ${
              activeTab === tab.id
                ? 'text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></div>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-8 lg:p-10">
        {activeTab === 'description' && (
          <div className="space-y-8 animate-fadeIn">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Product Description
              </h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                {product.description}
              </p>
            </div>

            <div>
              <h4 className="text-xl font-bold text-gray-900 mb-4">Key Features</h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {features.map((feature, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 text-gray-700 group"
                  >
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 group-hover:bg-green-200 transition-colors">
                      <FaCheck className="text-green-600 text-xs" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'specifications' && (
          <div className="space-y-6 animate-fadeIn">
            <h3 className="text-2xl font-bold text-gray-900">
              Technical Specifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {specifications.map((spec, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-4 px-5 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <span className="font-semibold text-gray-700">{spec.label}</span>
                  <span className="text-gray-600 text-right">{spec.value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-8 animate-fadeIn">
            {/* <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-gray-900">Customer Reviews</h3>
              <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
                Write a Review
              </button>
            </div> */}

            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <ReviewCard key={review.reviewId} review={review} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No reviews yet. Be the first to review this product!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
