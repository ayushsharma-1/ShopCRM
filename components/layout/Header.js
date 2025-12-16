'use client';

import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter, usePathname } from 'next/navigation';
import { logout } from '@/lib/redux/slices/authSlice';
import { toast } from 'react-toastify';
import { FaRobot } from 'react-icons/fa';
import Logo from './header/Logo';
import NavLink from './header/NavLink';
import CartButton from './header/CartButton';
import UserMenu from './header/UserMenu';
import MobileMenu from './header/MobileMenu';
import Modal from '../common/Modal';
import { askGlobalAssistant, parseNavigationAction } from '@/lib/ai/productAssistant';

export default function Header() {
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { totalItems, items } = useSelector((state) => state.cart);
  const { products } = useSelector((state) => state.products);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [router]);


  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage = inputValue.trim();
    setInputValue('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const context = {
        products: products || [],
        cart: items || [],
        currentRoute: pathname
      };

      const aiResponse = await askGlobalAssistant(userMessage, context);
      
      // Handle new response format
      let messageData;
      if (typeof aiResponse === 'string') {
        // Legacy format
        const { hasAction, route, cleanResponse } = parseNavigationAction(aiResponse);
        messageData = { role: 'assistant', content: cleanResponse, action: hasAction ? route : null };
      } else {
        // New format with products
        const { hasAction, route, cleanResponse } = parseNavigationAction(aiResponse.text);
        messageData = { 
          role: 'assistant', 
          content: cleanResponse, 
          action: hasAction ? route : null,
          products: aiResponse.products || []
        };
      }

      setMessages(prev => [...prev, messageData]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = (route) => {
    router.push(route);
    setAssistantOpen(false);
    toast.success('Navigating...');
  };
  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully!');
    setMobileMenuOpen(false);
    router.push('/login');
  };

  return (
    <header 
      className={`bg-white sticky top-0 z-50 transition-all duration-300 border-b ${
        scrolled ? 'border-neutral-200 shadow-sm' : 'border-neutral-200/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Logo />

          <nav className="hidden md:flex items-center gap-1">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/products">Products</NavLink>
          </nav>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setAssistantOpen(true)}
              className="p-2 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-all duration-200"
              title="AI Shopping Assistant"
            >
              <FaRobot className="text-lg" />
            </button>

            <CartButton totalItems={totalItems} mounted={mounted} />

            <div className="hidden md:flex">
              {mounted && (
                <UserMenu 
                  isAuthenticated={isAuthenticated} 
                  user={user} 
                  onLogout={handleLogout} 
                />
              )}
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors"
              aria-label="Toggle menu"
            >
              <div className="relative w-5 h-5">
                <span 
                  className={`absolute w-5 h-0.5 bg-current rounded-full transform transition-all duration-300 ${
                    mobileMenuOpen ? 'rotate-45 top-2.5' : 'top-1'
                  }`}
                />
                <span 
                  className={`absolute w-5 h-0.5 bg-current rounded-full top-2.5 transition-all duration-300 ${
                    mobileMenuOpen ? 'opacity-0' : 'opacity-100'
                  }`}
                />
                <span 
                  className={`absolute w-5 h-0.5 bg-current rounded-full transform transition-all duration-300 ${
                    mobileMenuOpen ? '-rotate-45 top-2.5' : 'top-4'
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </div>


      <Modal isOpen={assistantOpen} onClose={() => setAssistantOpen(false)} title="AI Assistant" size="md">
        <div className="flex flex-col h-[480px]">
          <div className="flex-1 overflow-y-auto space-y-3 mb-5 px-1">
            {messages.length === 0 ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-neutral-100 mb-5">
                  <FaRobot className="text-2xl text-neutral-400" />
                </div>
                <p className="text-sm text-neutral-600 mb-6 max-w-xs mx-auto leading-relaxed">
                  I can help you find products, check your cart, or navigate the store.
                </p>
                <div className="space-y-2 text-xs">
                  <button
                    onClick={() => setInputValue('Show me budget electronics')}
                    className="block w-full max-w-xs mx-auto px-4 py-2.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 rounded-lg transition-colors duration-150 text-left"
                  >
                    Show me budget electronics
                  </button>
                  <button
                    onClick={() => setInputValue('What\'s in my cart?')}
                    className="block w-full max-w-xs mx-auto px-4 py-2.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 rounded-lg transition-colors duration-150 text-left"
                  >
                    What's in my cart?
                  </button>
                  <button
                    onClick={() => setInputValue('Suggest something under ₹500')}
                    className="block w-full max-w-xs mx-auto px-4 py-2.5 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 rounded-lg transition-colors duration-150 text-left"
                  >
                    Suggest something under ₹500
                  </button>
                </div>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className="space-y-2">
                  <div 
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
                    style={{ animationDelay: '50ms' }}
                  >
                    <div className={`max-w-[85%] px-4 py-3 ${
                      msg.role === 'user' 
                        ? 'bg-neutral-900 text-white rounded-2xl rounded-br-md' 
                        : 'bg-neutral-50 text-neutral-800 rounded-2xl rounded-bl-md border border-neutral-200/60'
                    }`}>
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                      {msg.action && (
                        <button
                          onClick={() => handleNavigate(msg.action)}
                          className="mt-2.5 px-3 py-1.5 text-xs bg-white/10 hover:bg-white/20 rounded-lg transition-colors duration-150"
                        >
                          Go there →
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Product Cards */}
                  {msg.products && msg.products.length > 0 && (
                    <div className="flex justify-start">
                      <div className="max-w-[85%] space-y-2">
                        {msg.products.map((product) => (
                          <button
                            key={product.id}
                            onClick={() => handleNavigate(`/products/${product.id}`)}
                            className="w-full flex gap-3 p-2.5 bg-white border border-neutral-200 rounded-xl hover:border-neutral-300 hover:shadow-sm transition-all duration-150 text-left group"
                          >
                            <div className="relative w-16 h-16 flex-shrink-0 bg-neutral-100 rounded-lg overflow-hidden">
                              <img 
                                src={product.image || 'https://via.placeholder.com/64'} 
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                              />
                              {product.discount && (
                                <div className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-medium px-1.5 py-0.5 rounded">
                                  {product.discount}
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-medium text-neutral-900 line-clamp-1 mb-1">
                                {product.name}
                              </h4>
                              <div className="flex items-baseline gap-2">
                                <span className="text-sm font-semibold text-neutral-900">
                                  ₹{product.price?.toLocaleString()}
                                </span>
                                {product.originalPrice && product.originalPrice > product.price && (
                                  <span className="text-xs text-neutral-400 line-through">
                                    ₹{product.originalPrice?.toLocaleString()}
                                  </span>
                                )}
                              </div>
                              {product.rating && (
                                <div className="flex items-center gap-1 mt-1">
                                  <span className="text-xs text-yellow-600">★</span>
                                  <span className="text-xs text-neutral-600">{product.rating}</span>
                                </div>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start animate-fadeIn">
                <div className="bg-neutral-50 border border-neutral-200/60 px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1.5">
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 bg-neutral-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2 border-t border-neutral-100 pt-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask about products or your cart..."
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 text-sm text-neutral-900 placeholder:text-neutral-400 disabled:opacity-50 disabled:bg-neutral-50 transition-all duration-150"
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputValue.trim()}
              className="px-5 py-2.5 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-neutral-900 transition-all duration-150 text-sm font-medium"
            >
              Send
            </button>
          </div>
        </div>
      </Modal>
      <MobileMenu
        isOpen={mobileMenuOpen}
        isAuthenticated={isAuthenticated}
        user={user}
        mounted={mounted}
        onLogout={handleLogout}
        onClose={() => setMobileMenuOpen(false)}
      />
    </header>
  );
}
