/**
 * Middleware to sync cart with MongoDB for authenticated users
 */
const cartSyncMiddleware = (store) => (next) => (action) => {
  const result = next(action);
  
  // Only sync on client-side
  if (typeof window === 'undefined') return result;
  
  // Actions that modify cart
  const cartActions = [
    'cart/addToCart',
    'cart/removeFromCart', 
    'cart/updateQuantity',
    'cart/clearCart'
  ];
  
  if (cartActions.includes(action.type)) {
    const state = store.getState();
    const { auth, cart } = state;
    
    // Only sync if user is logged in
    if (auth.isAuthenticated && auth.user?.userId) {
      // Debounce saves to avoid too many requests
      if (window.cartSaveTimeout) {
        clearTimeout(window.cartSaveTimeout);
      }
      
      window.cartSaveTimeout = setTimeout(async () => {
        try {
          await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId: auth.user.userId,
              items: cart.items
            })
          });
          console.log('[Cart] Synced to MongoDB');
        } catch (error) {
          console.error('[Cart] Sync error:', error);
        }
      }, 500); // Wait 500ms after last change
    }
  }
  
  return result;
};

export default cartSyncMiddleware;
