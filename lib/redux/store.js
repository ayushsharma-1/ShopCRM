import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import cartReducer from './slices/cartSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    cart: cartReducer,
  },
});
