'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { addToCart } from '@/lib/redux/slices/cartSlice';
import Button from '@/components/common/button';
import LoadingSpinner from '@/components/common/loadingSpinner';
import productsData from '@/data/products.json';
import { FaStar, FaCheckCircle, FaShoppingCart } from 'react-icons/fa';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      const foundProduct = productsData.find((p) => p.id === parseInt(params.id));
      setProduct(foundProduct);
      setIsLoading(false);
    }, 500);
  }, [params.id]);

  const handleAddToCart = () => {
    if (!product) return;
    
    dispatch(addToCart({ 
      id: product.id, 
      title: product.name, 
      name: product.name,
      price: product.price, 
      image: product.image, 
      quantity: quantity 
    }));
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Product Not Found</h1>
        <Button onClick={() => router.push('/products')}>Back to Products</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => router.push('/products')}
        className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-6 transition-colors"
      >
        <span>Back to Products</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="bg-gray-100 rounded-2xl overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-[500px] object-cover"
          />
        </div>


        <div className="space-y-6">
          <span className="inline-block px-4 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
            {product.category}
          </span>

          <h1 className="text-4xl font-bold text-gray-800">{product.name}</h1>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-lg font-semibold text-gray-700">{product.rating}</span>
            <span className="text-gray-500">|</span>
            <span className="text-gray-600">{product.stock} in stock</span>
          </div>
          <div className="py-4 border-y border-gray-200">
            <span className="text-5xl font-bold text-blue-600">${product.price}</span>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Description</h3>
            <p className="text-gray-600 leading-relaxed">{product.description}</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Features</h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2 text-gray-600">
                <FaCheckCircle className="w-5 h-5 text-green-500" />
                <span>High Quality Product</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-600">
                <FaCheckCircle className="w-5 h-5 text-green-500" />
                <span>Fast & Free Shipping</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-600">
                <FaCheckCircle className="w-5 h-5 text-green-500" />
                <span>30-Day Return Policy</span>
              </li>
              <li className="flex items-center space-x-2 text-gray-600">
                <FaCheckCircle className="w-5 h-5 text-green-500" />
                <span>Secure Payment</span>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <label className="text-gray-700 font-medium">Quantity:</label>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  -
                </button>
                <span className="px-6 py-2 border-x border-gray-300 font-semibold">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="px-4 py-2 hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            <Button
              onClick={handleAddToCart}
              variant="primary"
              size="lg"
              className="w-full flex items-center justify-center space-x-2"
            >
              <FaShoppingCart className="w-5 h-5" />
              <span>Add to Cart</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
