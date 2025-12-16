'use client';

import { FaStar } from 'react-icons/fa';
import { formatRelativeTime } from '@/lib/utils/reviewUtils';

export default function ReviewCard({ review }) {
  const { user, rating, reviewText, timestamp, verified, category } = review;

  const categoryColors = {
    Quality: 'bg-blue-100 text-blue-700',
    Performance: 'bg-purple-100 text-purple-700',
    Features: 'bg-green-100 text-green-700',
    UI: 'bg-orange-100 text-orange-700',
    Support: 'bg-pink-100 text-pink-700',
    Accessibility: 'bg-indigo-100 text-indigo-700'
  };

  return (
    <div className="pb-6 border-b border-gray-100 last:border-0 last:pb-0 group">
      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-12 h-12 rounded-full ring-2 ring-gray-100 transition-all group-hover:ring-gray-200"
          />
          {verified && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center ring-2 ring-white">
              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-2">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{user.name}</h4>
              <div className="flex items-center gap-2 mt-1">
                {verified && (
                  <span className="text-xs text-green-600 font-medium">Verified Purchase</span>
                )}
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">{formatRelativeTime(timestamp)}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`${
                    i < rating ? 'text-yellow-400' : 'text-gray-200'
                  } text-sm`}
                />
              ))}
            </div>
          </div>

          {category && (
            <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium mb-3 ${categoryColors[category] || 'bg-gray-100 text-gray-700'}`}>
              {category}
            </span>
          )}

          <p className="text-gray-600 leading-relaxed">{reviewText}</p>
        </div>
      </div>
    </div>
  );
}
