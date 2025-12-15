'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import ProductInfo from '@/components/product/ProductInfo';
import ProductActions from '@/components/product/ProductActions';
import ProductTabs from '@/components/product/ProductTabs';
import SimilarProducts from '@/components/product/SimilarProducts';
import productsData from '@/data/products.json';
import { getProductReviews, getAverageRating, getReviewCount } from '@/lib/utils/reviewUtils';
import { FaArrowLeft } from 'react-icons/fa';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [similarProducts, setSimilarProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      const foundProduct = productsData.find((p) => p.id === parseInt(params.id));
      setProduct(foundProduct);

      if (foundProduct) {
        // Get similar products
        const similar = productsData
          .filter((p) => p.category === foundProduct.category && p.id !== foundProduct.id)
          .slice(0, 4);
        setSimilarProducts(similar);

        // Get reviews for this product
        const productReviews = getProductReviews(foundProduct.id, 4);
        setReviews(productReviews);

        // Get rating stats
        const avgRating = getAverageRating(foundProduct.id);
        const revCount = getReviewCount(foundProduct.id);
        setAverageRating(avgRating);
        setReviewCount(revCount);
      }
      
      setIsLoading(false);
    }, 500);
  }, [params.id]);

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
