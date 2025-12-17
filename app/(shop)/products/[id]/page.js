'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { FaRobot, FaBell, FaSync } from 'react-icons/fa';
import { toast } from 'react-toastify';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import ProductImageGallery from '@/components/product/ProductImageGallery';
import ProductInfo from '@/components/product/ProductInfo';
import ProductActions from '@/components/product/ProductActions';
import ProductTabs from '@/components/product/ProductTabs';
import SimilarProducts from '@/components/product/SimilarProducts';
import Modal from '@/components/common/Modal';
import productsData from '@/data/products.json';
import dealsData from '@/data/deals.json';
import { getProductReviews, getAverageRating, getReviewCount } from '@/lib/utils/reviewUtils';
import { askProductAssistant } from '@/lib/ai/productAssistant';
import { addRule } from '@/lib/redux/slices/agentsSlice';
import { normalizeRulePayload } from '@/lib/agents/ruleUtils';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { addresses } = useSelector((state) => state.addresses);
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
  const [priceAlertOpen, setPriceAlertOpen] = useState(false);
  const [restockAlertOpen, setRestockAlertOpen] = useState(false);
  const [priceThreshold, setPriceThreshold] = useState('');
  const [restockQty, setRestockQty] = useState(1);
  const [keepActive, setKeepActive] = useState(false);
  const [actionMode, setActionMode] = useState('notify');
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [userConsent, setUserConsent] = useState(false);

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

  const handleSavePriceAlert = () => {
    if (!priceThreshold || parseFloat(priceThreshold) <= 0) {
      toast.error('Please enter a valid price threshold');
      return;
    }

    if (actionMode === 'auto_order' && !selectedAddressId) {
      toast.error('Please select a saved address for auto-order');
      return;
    }

    if (actionMode === 'auto_order' && !userConsent) {
      toast.error('Please confirm consent for auto-order');
      return;
    }

    const rule = normalizeRulePayload({
      type: 'priceDrop',
      productId: product.id,
      threshold: parseFloat(priceThreshold),
      keepActive,
      actionMode,
      addressId: actionMode === 'auto_order' ? selectedAddressId : null,
      userConsent: actionMode === 'auto_order' ? userConsent : false,
    });

    dispatch(addRule(rule));
    toast.success('Price alert saved — Agent will notify you when conditions match');
    setPriceAlertOpen(false);
    setPriceThreshold('');
    setKeepActive(false);
    setActionMode('notify');
    setSelectedAddressId(null);
    setUserConsent(false);
  };

  const handleSaveRestockAlert = () => {
    if (!restockQty || restockQty <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    if (actionMode === 'auto_order' && !selectedAddressId) {
      toast.error('Please select a saved address for auto-order');
      return;
    }

    if (actionMode === 'auto_order' && !userConsent) {
      toast.error('Please confirm consent for auto-order');
      return;
    }

    const rule = normalizeRulePayload({
      type: 'autoRestock',
      productId: product.id,
      restockQty: parseInt(restockQty),
      keepActive,
      actionMode,
      addressId: actionMode === 'auto_order' ? selectedAddressId : null,
      userConsent: actionMode === 'auto_order' ? userConsent : false,
    });

    dispatch(addRule(rule));
    toast.success('Auto-restock rule saved — Agent will monitor inventory');
    setRestockAlertOpen(false);
    setRestockQty(1);
    setKeepActive(false);
    setActionMode('notify');
    setSelectedAddressId(null);
    setUserConsent(false);
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
            
            {/* Agent Actions */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-neutral-100">
              <button
                onClick={() => setPriceAlertOpen(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-sm font-medium transition-all duration-150 active:scale-95"
              >
                <FaBell className="text-base" />
                Set Price Alert
              </button>
              <button
                onClick={() => setRestockAlertOpen(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 rounded-xl text-sm font-medium transition-all duration-150 active:scale-95"
              >
                <FaSync className="text-base" />
                Auto-Restock
              </button>
            </div>
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

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <SimilarProducts products={similarProducts} />
        )}
      </div>

      {/* Price Alert Modal */}
      <Modal isOpen={priceAlertOpen} onClose={() => setPriceAlertOpen(false)} title="Set Price Alert">
        <div className="space-y-5">
          {!isAuthenticated && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
              <strong>Login required to enable smart alerts</strong>
              <button 
                onClick={() => router.push('/login')} 
                className="ml-2 underline font-medium hover:text-amber-900"
              >
                Sign in now
              </button>
            </div>
          )}
          
          <p className="text-sm text-neutral-600">
            Get notified when <strong>{product.name}</strong> drops below your target price.
          </p>
          
          <div>
            <label htmlFor="priceThreshold" className="block text-sm font-medium text-neutral-700 mb-2">
              Alert when price drops below (₹)
            </label>
            <input
              id="priceThreshold"
              type="number"
              min="1"
              step="0.01"
              value={priceThreshold}
              onChange={(e) => setPriceThreshold(e.target.value)}
              placeholder="Enter target price"
              className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 text-sm text-neutral-900"
            />
            <p className="text-xs text-neutral-500 mt-2">
              Current price: ₹{product.price?.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              id="keepActivePriceAlert"
              type="checkbox"
              checked={keepActive}
              onChange={(e) => setKeepActive(e.target.checked)}
              className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-1 focus:ring-neutral-400"
            />
            <label htmlFor="keepActivePriceAlert" className="text-sm text-neutral-700">
              Keep alert active after trigger (re-notify on future drops)
            </label>
          </div>

          {/* Action Mode Selection */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              What should the agent do?
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 transition-colors">
                <input
                  type="radio"
                  name="actionMode"
                  value="notify"
                  checked={actionMode === 'notify'}
                  onChange={(e) => setActionMode(e.target.value)}
                  className="w-4 h-4"
                />
                <div>
                  <div className="font-medium text-neutral-900 text-sm">Notify Only</div>
                  <div className="text-xs text-neutral-600">Show alert, I'll decide</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 transition-colors">
                <input
                  type="radio"
                  name="actionMode"
                  value="add_to_cart"
                  checked={actionMode === 'add_to_cart'}
                  onChange={(e) => setActionMode(e.target.value)}
                  className="w-4 h-4"
                />
                <div>
                  <div className="font-medium text-neutral-900 text-sm">Auto Add to Cart</div>
                  <div className="text-xs text-neutral-600">Automatically add item</div>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-3 border border-neutral-200 rounded-xl transition-colors ${
                !isAuthenticated || addresses.length === 0 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'cursor-pointer hover:bg-neutral-50'
              }`}>
                <input
                  type="radio"
                  name="actionMode"
                  value="auto_order"
                  checked={actionMode === 'auto_order'}
                  onChange={(e) => setActionMode(e.target.value)}
                  disabled={!isAuthenticated || addresses.length === 0}
                  className="w-4 h-4"
                />
                <div>
                  <div className="font-medium text-neutral-900 text-sm">Auto Order</div>
                  <div className="text-xs text-neutral-600">
                    {!isAuthenticated ? 'Login required' : addresses.length === 0 ? 'Saved address required' : 'Place order automatically'}
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Address Selection (only for auto_order) */}
          {actionMode === 'auto_order' && (
            <>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Delivery Address
                </label>
                {addresses.length === 0 ? (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                    No saved addresses. <button onClick={() => router.push('/addresses')} className="underline font-medium">Add one now</button>
                  </div>
                ) : (
                  <select
                    value={selectedAddressId || ''}
                    onChange={(e) => setSelectedAddressId(e.target.value)}
                    className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-400 text-sm"
                  >
                    <option value="">Select address</option>
                    {addresses.map(addr => (
                      <option key={addr.id} value={addr.id}>
                        {addr.fullName} - {addr.street}, {addr.city}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex items-start gap-3 p-4 bg-neutral-50 rounded-xl">
                <input
                  id="userConsentPrice"
                  type="checkbox"
                  checked={userConsent}
                  onChange={(e) => setUserConsent(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-neutral-300"
                />
                <label htmlFor="userConsentPrice" className="text-sm text-neutral-700 flex-1">
                  <strong>I allow the agent to place orders for me</strong> using the selected address.
                </label>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                setPriceAlertOpen(false);
                setActionMode('notify');
                setSelectedAddressId(null);
                setUserConsent(false);
              }}
              className="flex-1 px-4 py-2.5 border border-neutral-200 text-neutral-700 rounded-xl hover:bg-neutral-50 transition-all duration-150 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSavePriceAlert}
              disabled={!isAuthenticated}
              className="flex-1 px-4 py-2.5 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-all duration-150 text-sm font-medium active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-neutral-900"
            >
              Save Alert
            </button>
          </div>
        </div>
      </Modal>

      {/* Auto-Restock Modal */}
      <Modal isOpen={restockAlertOpen} onClose={() => setRestockAlertOpen(false)} title="Auto-Restock">
        <div className="space-y-5">
          {!isAuthenticated && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
              <strong>Login required to enable smart alerts</strong>
              <button 
                onClick={() => router.push('/login')} 
                className="ml-2 underline font-medium hover:text-amber-900"
              >
                Sign in now
              </button>
            </div>
          )}
          
          <p className="text-sm text-neutral-600">
            Automatically add <strong>{product.name}</strong> to your cart when it's out of stock.
          </p>
          
          <div>
            <label htmlFor="restockQty" className="block text-sm font-medium text-neutral-700 mb-2">
              Quantity to add
            </label>
            <input
              id="restockQty"
              type="number"
              min="1"
              value={restockQty}
              onChange={(e) => setRestockQty(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-400 focus:border-neutral-400 text-sm text-neutral-900"
            />
          </div>

          <div className="flex items-center gap-3">
            <input
              id="keepActiveRestock"
              type="checkbox"
              checked={keepActive}
              onChange={(e) => setKeepActive(e.target.checked)}
              className="w-4 h-4 rounded border-neutral-300 text-neutral-900 focus:ring-1 focus:ring-neutral-400"
            />
            <label htmlFor="keepActiveRestock" className="text-sm text-neutral-700">
              Keep restocking (continue monitoring after first trigger)
            </label>
          </div>

          {/* Action Mode Selection */}
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-3">
              What should the agent do?
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 transition-colors">
                <input
                  type="radio"
                  name="actionModeRestock"
                  value="notify"
                  checked={actionMode === 'notify'}
                  onChange={(e) => setActionMode(e.target.value)}
                  className="w-4 h-4"
                />
                <div>
                  <div className="font-medium text-neutral-900 text-sm">Notify Only</div>
                  <div className="text-xs text-neutral-600">Show alert, I'll decide</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-xl cursor-pointer hover:bg-neutral-50 transition-colors">
                <input
                  type="radio"
                  name="actionModeRestock"
                  value="add_to_cart"
                  checked={actionMode === 'add_to_cart'}
                  onChange={(e) => setActionMode(e.target.value)}
                  className="w-4 h-4"
                />
                <div>
                  <div className="font-medium text-neutral-900 text-sm">Auto Add to Cart</div>
                  <div className="text-xs text-neutral-600">Automatically add item</div>
                </div>
              </label>

              <label className={`flex items-center gap-3 p-3 border border-neutral-200 rounded-xl transition-colors ${
                !isAuthenticated || addresses.length === 0 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'cursor-pointer hover:bg-neutral-50'
              }`}>
                <input
                  type="radio"
                  name="actionModeRestock"
                  value="auto_order"
                  checked={actionMode === 'auto_order'}
                  onChange={(e) => setActionMode(e.target.value)}
                  disabled={!isAuthenticated || addresses.length === 0}
                  className="w-4 h-4"
                />
                <div>
                  <div className="font-medium text-neutral-900 text-sm">Auto Order</div>
                  <div className="text-xs text-neutral-600">
                    {!isAuthenticated ? 'Login required' : addresses.length === 0 ? 'Saved address required' : 'Place order automatically'}
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Address Selection (only for auto_order) */}
          {actionMode === 'auto_order' && (
            <>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Delivery Address
                </label>
                {addresses.length === 0 ? (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm text-amber-800">
                    No saved addresses. <button onClick={() => router.push('/addresses')} className="underline font-medium">Add one now</button>
                  </div>
                ) : (
                  <select
                    value={selectedAddressId || ''}
                    onChange={(e) => setSelectedAddressId(e.target.value)}
                    className="w-full px-4 py-2.5 border border-neutral-200 rounded-xl focus:outline-none focus:ring-1 focus:ring-neutral-400 text-sm"
                  >
                    <option value="">Select address</option>
                    {addresses.map(addr => (
                      <option key={addr.id} value={addr.id}>
                        {addr.fullName} - {addr.street}, {addr.city}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="flex items-start gap-3 p-4 bg-neutral-50 rounded-xl">
                <input
                  id="userConsentRestock"
                  type="checkbox"
                  checked={userConsent}
                  onChange={(e) => setUserConsent(e.target.checked)}
                  className="w-4 h-4 mt-0.5 rounded border-neutral-300"
                />
                <label htmlFor="userConsentRestock" className="text-sm text-neutral-700 flex-1">
                  <strong>I allow the agent to place orders for me</strong> using the selected address.
                </label>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4">
            <button
              onClick={() => {
                setRestockAlertOpen(false);
                setActionMode('notify');
                setSelectedAddressId(null);
                setUserConsent(false);
              }}
              className="flex-1 px-4 py-2.5 border border-neutral-200 text-neutral-700 rounded-xl hover:bg-neutral-50 transition-all duration-150 text-sm font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveRestockAlert}
              disabled={!isAuthenticated}
              className="flex-1 px-4 py-2.5 bg-neutral-900 text-white rounded-xl hover:bg-neutral-800 transition-all duration-150 text-sm font-medium active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-neutral-900"
            >
              Enable Auto-Restock
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
