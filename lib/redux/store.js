'use client';

import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productsReducer from './slices/productsSlice';
import cartReducer from './slices/cartSlice';
import checkoutReducer from './slices/checkoutSlice';
import uiReducer from './slices/uiSlice';
import agentsReducer from './slices/agentsSlice';
import addressesReducer from './slices/addressSlice';
import localStorageMiddleware from './middleware/localStorageMiddleware';
import cartSyncMiddleware from './middleware/cartSyncMiddleware';

const loadFromLocalStorage = () => {
  if (typeof window === 'undefined') {
    return {};
  }
  
  try {
    const cartData = localStorage.getItem('cart');
    const authData = localStorage.getItem('auth');
    const agentsData = localStorage.getItem('agents');
    const addressesData = localStorage.getItem('addresses');
    
    return {
      cart: cartData ? JSON.parse(cartData) : undefined,
      auth: authData ? JSON.parse(authData) : undefined,
      agents: agentsData ? JSON.parse(agentsData) : undefined,
      addresses: addressesData ? JSON.parse(addressesData) : undefined,
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
    agents: agentsReducer,
    addresses: addressesReducer,
  },
  preloadedState: loadFromLocalStorage(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(localStorageMiddleware, cartSyncMiddleware),
});
