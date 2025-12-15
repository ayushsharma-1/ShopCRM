'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'next/navigation';
import { setProducts, applyFilters, setFilters } from '@/lib/redux/slices/productsSlice';
import ProductsHeader from '@/components/products/ProductsHeader';
import ProductFilters from '@/components/products/ProductFilters';
import ProductGrid from '@/components/products/ProductGrid';
import LoadMoreButton from '@/components/products/LoadMoreButton';
import productsData from '@/data/products.json';
import { motion, AnimatePresence } from 'framer-motion';

export default function ProductsPage() {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const { filteredProducts, currentPage, itemsPerPage } = useSelector((state) => state.products);
  const [isLoading, setIsLoading] = useState(true);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    // Get URL parameters
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    // Simulate loading
    const loadTimer = setTimeout(() => {
      dispatch(setProducts(productsData));
      
      // Apply filters from URL parameters
      if (category || minPrice || maxPrice) {
        dispatch(setFilters({
          category: category || 'all',
          minPrice: minPrice ? parseFloat(minPrice) : 0,
          maxPrice: maxPrice ? parseFloat(maxPrice) : 10000,
        }));
      }
      
      dispatch(applyFilters());
      setIsLoading(false);
    }, 600);

    return () => clearTimeout(loadTimer);
  }, [dispatch, searchParams]);

  useEffect(() => {
    // Initial pagination
    const startIndex = 0;
    const endIndex = itemsPerPage;
    setDisplayedProducts(filteredProducts.slice(startIndex, endIndex));
  }, [filteredProducts, itemsPerPage]);

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    
    setTimeout(() => {
      setDisplayedProducts([
        ...displayedProducts,
        ...filteredProducts.slice(
          displayedProducts.length,
          displayedProducts.length + itemsPerPage
        ),
      ]);
      setIsLoadingMore(false);
    }, 400);
  };

  const hasMore = displayedProducts.length < filteredProducts.length;

  return (
    <div className="min-h-screen bg-neutral-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Header */}
        <ProductsHeader 
          productsCount={filteredProducts.length}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block lg:col-span-3">
            <ProductFilters />
          </div>

          {/* Filters Sidebar - Mobile */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                onClick={() => setShowFilters(false)}
              >
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  className="absolute left-0 top-0 bottom-0 w-full max-w-sm bg-neutral-50 overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-neutral-900">Filters</h2>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-neutral-200 hover:bg-neutral-300 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                    <ProductFilters />
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <div className="lg:col-span-9">
            <ProductGrid 
              products={displayedProducts} 
              isLoading={isLoading}
            />
            
            <LoadMoreButton 
              onClick={handleLoadMore}
              isLoading={isLoadingMore}
              hasMore={hasMore}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
