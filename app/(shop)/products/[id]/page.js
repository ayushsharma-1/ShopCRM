'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { FaRobot } from 'react-icons/fa';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import ProductInfo from '@/components/product/ProductInfo';
import ProductActions from '@/components/product/ProductActions';
import ProductTabs from '@/components/product/ProductTabs';
import SimilarProducts from '@/components/product/SimilarProducts';
import productsData from '@/data/products.json';
import dealsData from '@/data/deals.json';
import { getProductReviews, getAverageRating, getReviewCount } from '@/lib/utils/reviewUtils';
import { askProductAssistant } from '@/lib/ai/productAssistant';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isAsking, setIsAsking] = useState(false);
  const [isDeal, setIsDeal] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      // First check products.json (numeric IDs)
      let foundProduct = productsData.find((p) => p.id === parseInt(params.id));
      
      // If not found, check deals.json (handles both string and numeric IDs)
      if (!foundProduct) {
        foundProduct = dealsData.find(d => {
          if (typeof d.id === 'number') {
            return d.id === parseInt(params.id);
          }
          return d.id === params.id;
        });
        if (foundProduct) {
          setIsDeal(true);
        }
      }
      
      setProduct(foundProduct);

      if (foundProduct) {
        // Get similar items from the appropriate source
        const sourceData = isDeal ? dealsData : productsData;
        const similar = sourceData
          .filter((p) => p.category === foundProduct.category && p.id !== foundProduct.id)
          .slice(0, 4);
        setSimilarProducts(similar);

        // Get reviews - only for numeric IDs
        if (typeof foundProduct.id === 'number') {
          const productReviews = getProductReviews(foundProduct.id, 4);
          setReviews(productReviews);

          const avgRating = getAverageRating(foundProduct.id);
          const revCount = getReviewCount(foundProduct.id);
          setAverageRating(avgRating);
          setReviewCount(revCount);
        } else {
          // For string IDs (deals), use the rating from the item itself
          setAverageRating(foundProduct.rating || 0);
          setReviewCount(foundProduct.ratingCount || 0);
          setReviews([]);
        }
      }
      
      setIsLoading(false);
    }, 500);
  }, [params.id]);

  const handleAskQuestion = async () => {
    if (!question.trim() || isAsking) return;

    setIsAsking(true);
    setAnswer('');

    try {
      const context = {
        product,
        reviews: reviews.slice(0, 5)
      };

      const aiAnswer = await askProductAssistant(question, context);
      setAnswer(aiAnswer);
    } catch (error) {
      setAnswer('Sorry, I couldn\'t process your question. Please try again.');
    } finally {
      setIsAsking(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <button
            onClick={() => router.push('/products')}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

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
              Products
            </button>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">{product.category}</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-12 space-y-8">
        {/* Deal Badge */}
        {isDeal && product.dealType && (
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl p-6 shadow-lg">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <div className="text-sm font-medium opacity-90 mb-1">{product.dealType}</div>
                <div className="text-2xl font-bold">{product.discount}</div>
              </div>
              {product.dealEndDate && (
                <div className="text-right">
                  <div className="text-sm opacity-90 mb-1">Deal ends in</div>
                  <div className="text-lg font-semibold">
                    {(() => {
                      const endDate = new Date(product.dealEndDate);
                      const now = new Date();
                      const days = Math.max(0, Math.floor((endDate - now) / (1000 * 60 * 60 * 24)));
                      return days > 0 ? `${days} days` : 'Ending soon!';
                    })()}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Product Details Grid */}
        <div className="bg-white rounded-2xl p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <ProductImageGallery product={product} />
          
          <div className="space-y-8">
            <ProductInfo 
              product={product} 
              averageRating={averageRating} 
              reviewCount={reviewCount} 
            />
            <ProductActions product={product} />
          </div>
        </div>

        {/* Product Tabs */}
        <ProductTabs product={product} reviews={reviews} />

        {/* Ask About Product */}
        <div className="bg-white rounded-2xl p-6 lg:p-8 border border-neutral-200/60">
          <div className="flex items-center gap-3 mb-5">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-neutral-100">
              <FaRobot className="text-lg text-neutral-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-neutral-900">Ask About This Product</h3>
              <p className="text-xs text-neutral-500 mt-0.5">Get instant answers about features and details</p>
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
                placeholder="Ask about features, compatibility, or availability..."
                disabled={isAsking}
                className="flex-1 px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 text-sm text-neutral-900 placeholder:text-neutral-400 disabled:opacity-50 disabled:bg-neutral-50 transition-all duration-150"
              />
              <button
                onClick={handleAskQuestion}
                disabled={isAsking || !question.trim()}
                className="px-5 py-2.5 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-neutral-900 transition-all duration-150 text-sm font-medium"
              >
                {isAsking ? 'Asking...' : 'Ask'}
              </button>
            </div>
            {isAsking && (
              <div className="flex items-center gap-3 text-sm text-neutral-500 animate-fadeIn">
                <div className="flex gap-1.5">
                  <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                </div>
                <span>Analyzing...</span>
              </div>
            )}
            {answer && !isAsking && (
              <div className="bg-neutral-50 border border-neutral-200/60 rounded-xl p-4 animate-fadeIn">
                <p className="text-sm text-neutral-800 leading-relaxed">{answer}</p>
              </div>
            )}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => setQuestion('What are the main features?')}
              className="px-3 py-2 text-xs bg-neutral-50 hover:bg-neutral-100 text-neutral-700 rounded-lg transition-colors duration-150"
            >
              What are the main features?
            </button>
            <button
              onClick={() => setQuestion('Is it in stock?')}
              className="px-3 py-2 text-xs bg-neutral-50 hover:bg-neutral-100 text-neutral-700 rounded-lg transition-colors duration-150"
            >
              Is it in stock?
            </button>
            <button
              onClick={() => setQuestion('What do reviews say?')}
              className="px-3 py-2 text-xs bg-neutral-50 hover:bg-neutral-100 text-neutral-700 rounded-lg transition-colors duration-150"
            >
              What do reviews say?
            </button>
          </div>
        </div>

        {/* v>
      </div>

      <div className="container mx-auto px-4 py-8 lg:py-12 space-y-8">
        {/* Product Details Grid */}
        <div className="bg-white rounded-2xl p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <ProductImageGallery product={product} />
          
          <div className="space-y-8">
            <ProductInfo 
              product={product} 
              averageRating={averageRating} 
              reviewCount={reviewCount} 
            />
            <ProductActions product={product} />
          </div>
        </div>

        {/* Product Tabs */}
        <ProductTabs product={product} reviews={reviews} />

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <SimilarProducts products={similarProducts} />
        )}
      </div>
    </div>
  );
}
