"use client";
import { useEffect, useState } from "react";
import {useSelector, useDispatch} from 'react-redux';
import { useSearchParams } from "next/navigation";
import { setProducts, applyFilters, setFilters } from "@/lib/redux/slices/productsSlice";
import ProductCard from "@/components/products/productCard";
import ProductFilters from "@/components/products/productFilter";
import LoadingSpinner from "@/components/common/loadingSpinner";
import productsData from '@/data/products.json';
export default function ProductsPage() {
  const dispatch = useDispatch();
  // const router = useRouter();
  const searchParams = useSearchParams();
  const {filteredProducts, currentPage, itemsPerPage} = useSelector((state) => state.products);
  const [isLoading, setIsLoading] = useState(true);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  useEffect(() => {
    // Simulate fetching products from an API
    setTimeout(() => {
      dispatch(setProducts(productsData));
      setIsLoading(false);
    }, 1000);
  }, [dispatch]);

  useEffect(() => {
    const category = searchParams.get('category') || '';
    const minPrice = searchParams.get('minPrice') || '';
    const maxPrice = searchParams.get('maxPrice') || '';
    const rating = searchParams.get('rating') || '';
    dispatch(setFilters({ category, minPrice, maxPrice, rating }));
    dispatch(applyFilters());
  }, [searchParams, dispatch]);
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setDisplayedProducts(filteredProducts.slice(startIndex, endIndex));
  }, [filteredProducts, currentPage, itemsPerPage]);

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  } 
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Products</h1>
        <button 
          onClick={() => setShowFilters(!showFilters)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-md flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
        {showFilters && (
          <div className="mt-6">
            <ProductFilters />
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayedProducts.length === 0 ? (
          <div className="col-span-full text-center py-16">
            <p className="text-xl text-gray-500">No products found.</p>
          </div>
        ) : ( 
          displayedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
}