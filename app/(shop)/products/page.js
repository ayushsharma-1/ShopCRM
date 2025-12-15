"use client";
import { useEffect, useState } from "react";
import {useSelector, useDispatch} from 'react-redux';
import { useSearchParams } from "next/navigation";
import { setProducts, applyFilters, setFilters, setCurrentPage } from "@/lib/redux/slices/productsSlice";
import ProductCard from "@/components/products/productCard";
import ProductFilters from "@/components/products/productFilter";
import LoadingSpinner from "@/components/common/loadingSpinner";
import productsData from '@/data/products.json';
import { FaFilter, FaSadTear, FaChevronDown } from 'react-icons/fa';
export default function ProductsPage() {
  const dispatch = useDispatch();
  // const router = useRouter();
  const searchParams = useSearchParams();
  const {filteredProducts, currentPage, itemsPerPage} = useSelector((state) => state.products);
  const [isLoading, setIsLoading] = useState(true);
  const [displayedProducts, setDisplayedProducts] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      dispatch(setProducts(productsData));
      dispatch(applyFilters());
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
    dispatch(setCurrentPage(1));
  }, [filteredProducts.length, dispatch]);

  useEffect(() => {
    const startIndex = 0;
    const endIndex = currentPage * itemsPerPage;
    setDisplayedProducts(filteredProducts.slice(startIndex, endIndex));
  }, [filteredProducts, currentPage, itemsPerPage]);

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  } 
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Products</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <aside className={`lg:block ${showFilters ? 'block' : 'hidden'} lg:w-80 flex-shrink-0`}>
          <div className="sticky top-20">
            <ProductFilters />
          </div>
        </aside>

        <div className="flex-1">
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden mb-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors shadow-md flex items-center gap-2 w-full justify-center"
          >
            <FaFilter className="w-5 h-5" />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>

          <div className="mb-6 flex justify-between items-center">
            <p className="text-gray-600">
              Showing <span className="font-semibold">{displayedProducts.length}</span> of{' '}
              <span className="font-semibold">{filteredProducts.length}</span> products
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {displayedProducts.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <FaSadTear className="w-24 h-24 mx-auto mb-4 text-gray-300" />
                <p className="text-xl text-gray-500">No products found.</p>
                <p className="text-gray-400 mt-2">Try adjusting your filters</p>
              </div>
            ) : ( 
              displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
          {filteredProducts.length > displayedProducts.length && (
            <div className="mt-12 text-center">
              <button
                onClick={() => {
                  const nextPage = currentPage + 1;
                  const startIndex = 0;
                  const endIndex = nextPage * itemsPerPage;
                  setDisplayedProducts(filteredProducts.slice(startIndex, endIndex));
                  dispatch({ type: 'products/setCurrentPage', payload: nextPage });
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition-colors shadow-md inline-flex items-center gap-2"
              >
                Load More Products
                <FaChevronDown className="w-5 h-5" />
              </button>
              <p className="text-sm text-gray-500 mt-3">
                {filteredProducts.length - displayedProducts.length} more products available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}