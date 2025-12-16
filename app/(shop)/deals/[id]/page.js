'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import ProductInfo from '@/components/product/ProductInfo';
import ProductActions from '@/components/product/ProductActions';
import ProductTabs from '@/components/product/ProductTabs';
import SimilarProducts from '@/components/product/SimilarProducts';
import deals from '@/data/deals.json';
import { getProductReviews, getAverageRating, getReviewCount } from '@/lib/utils/reviewUtils';

export default function DealDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [deal, setDeal] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [similarDeals, setSimilarDeals] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      // Handle both string and numeric IDs
      const foundDeal = deals.find(d => {
        if (typeof d.id === 'number') {
          return d.id === parseInt(params.id);
        }
        return d.id === params.id;
      });
      
      setDeal(foundDeal);

      if (foundDeal) {
        // Get similar deals
        const similar = deals
          .filter((d) => d.category === foundDeal.category && d.id !== foundDeal.id)
          .slice(0, 4);
        setSimilarDeals(similar);

        // Get reviews for this deal (if it has a numeric ID, use it)
        if (typeof foundDeal.id === 'number') {
          const dealReviews = getProductReviews(foundDeal.id, 4);
          setReviews(dealReviews);

          const avgRating = getAverageRating(foundDeal.id);
          const revCount = getReviewCount(foundDeal.id);
          setAverageRating(avgRating);
          setReviewCount(revCount);
        } else {
          // For string IDs, use the rating from the deal itself
          setAverageRating(foundDeal.rating || 0);
          setReviewCount(0);
        }
      }
      
      setIsLoading(false);
    }, 500);
  }, [params.id]);

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!deal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Deal Not Found</h1>
          <p className="text-gray-600 mb-6">This deal may have expired or is no longer available.</p>
          <button
            onClick={() => router.push('/products')}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  const calculateTimeLeft = () => {
    if (!deal.dealEndDate) return { days: 0, hours: 0 };
    const endDate = new Date(deal.dealEndDate);
    const now = new Date();
    const difference = endDate - now;
    
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    
    return { days: Math.max(0, days), hours: Math.max(0, hours) };
  };

  const timeLeft = calculateTimeLeft();

  // Transform deal data to match product structure for components
  const productData = {
    ...deal,
    id: deal.id,
    name: deal.name,
    description: deal.description,
    price: deal.price,
    originalPrice: deal.originalPrice,
    discount: deal.discount,
    category: deal.category,
    rating: averageRating || deal.rating,
    image: deal.image,
    stock: deal.stock,
    // Add deal-specific timer badge
    dealTimer: timeLeft,
    dealEndDate: deal.dealEndDate,
    dealType: deal.dealType,
    features: deal.features
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Navigation */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center gap-2 text-xs md:text-sm overflow-x-auto">
            <button
              onClick={() => router.push('/')}
              className="text-gray-500 hover:text-gray-900 transition-colors"
            >
              Home
            </button>
            <span className="text-gray-300">/</span>
            <button
              onClick={() => router.push('/products')}
              className="text-gray-500 hover:text-gray-900 transition-colors"
            >
              Deals
            </button>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">{deal.category}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-12 space-y-8">
        {/* Deal Details Grid */}
        <div className="bg-white rounded-2xl p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <ProductImageGallery product={productData} />
          
          <div className="space-y-8">
            {/* Deal Timer Banner */}
            {deal.dealEndDate && (
              <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-xl p-4">
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
            )}
            
            <ProductInfo 
              product={productData} 
              averageRating={averageRating || deal.rating} 
              reviewCount={reviewCount} 
            />
            <ProductActions product={productData} />
          </div>
        </div>

        {/* Product Tabs */}
        <ProductTabs product={productData} reviews={reviews} />

        {/* Similar Deals */}
        {similarDeals.length > 0 && (
          <SimilarProducts products={similarDeals} title="Similar Deals" />
        )}
      </div>
    </div>
  );
}
