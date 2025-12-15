import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { FaArrowRight, FaDollarSign, FaCheckCircle, FaBolt } from 'react-icons/fa';


export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white">
          <div className="container mx-auto px-4 py-24">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
                Welcome to ShopCRM
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-blue-100">
                Your one-stop shop for all your online shopping needs
              </p>
              <Link 
                href="/products" 
                className="inline-flex items-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-lg font-bold text-lg hover:bg-blue-50 transition-colors shadow-lg hover:shadow-xl"
              >
                Browse Products
                <FaArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-12">
              Why Shop With Us?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-md text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaDollarSign className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Best Prices</h3>
                <p className="text-gray-600">Competitive pricing on all products with regular discounts and offers.</p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-md text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaCheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Quality Products</h3>
                <p className="text-gray-600">Only the highest quality items from trusted brands and suppliers.</p>
              </div>
              
              <div className="bg-white p-8 rounded-xl shadow-md text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaBolt className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Fast Delivery</h3>
                <p className="text-gray-600">Quick and reliable shipping to get your products to you fast.</p>
              </div>
            </div>
          </div>
        </section>
      </main> 
      <Footer />
    </>
  )
} 