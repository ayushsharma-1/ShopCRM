'use client';

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productsReducer from './slices/productsSlice';
import cartReducer from './slices/cartSlice';
import checkoutReducer from './slices/checkoutSlice';
import uiReducer from './slices/uiSlice';
import localStorageMiddleware from './middleware/localStorageMiddleware';

const loadFromLocalStorage = () => {
  try {
    const cartData = localStorage.getItem('cart');
    const authData = localStorage.getItem('auth');
    
    return {
      cart: cartData ? JSON.parse(cartData) : undefined,
      auth: authData ? JSON.parse(authData) : undefined,
    };
  } catch (error) {
    console.error('Error loading from localStorage:', error);
    return {};
  }
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
    ui: uiReducer,
  },
  preloadedState: typeof window !== 'undefined' ? loadFromLocalStorage() : {},
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware),
});
