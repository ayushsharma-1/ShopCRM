import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  totalAmount: 0,
  totalItems: 0,
  isSyncing: false,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCartItems: (state, action) => {
      state.items = action.payload;
      cartSlice.caseReducers.calculateTotals(state);
    },
    addToCart: (state, action) => {
      const existingItem = state.items.find(item => item.id === action.payload.id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({ ...action.payload, quantity: 1 });
      }
      
      cartSlice.caseReducers.calculateTotals(state);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      cartSlice.caseReducers.calculateTotals(state);
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item) {
        item.quantity = Math.max(1, quantity);
        cartSlice.caseReducers.calculateTotals(state);
      }
    },
    clearCart: (state) => {
      state.items = [];
      state.totalAmount = 0;
      state.totalItems = 0;
    },
    calculateTotals: (state) => {
      state.totalItems = state.items.reduce((total, item) => total + item.quantity, 0);
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
    setSyncing: (state, action) => {
      state.isSyncing = action.payload;
    },
  },
});

export const { 
  setCartItems, 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart, 
  calculateTotals,
  setSyncing 
} = cartSlice.actions;

// Async thunk to load cart from MongoDB
export const loadCartFromDB = (userId) => async (dispatch) => {
  if (!userId) return;
  
  try {
    dispatch(setSyncing(true));
    const response = await fetch(`/api/cart?userId=${userId}`);
    const result = await response.json();
    
    if (result.success) {
      dispatch(setCartItems(result.data));
    }
  } catch (error) {
    console.error('[Cart] Load error:', error);
  } finally {
    dispatch(setSyncing(false));
  }
};

// Async thunk to save cart to MongoDB
export const saveCartToDB = (userId, items) => async (dispatch) => {
  if (!userId) return;
  
  try {
    dispatch(setSyncing(true));
    await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, items })
    });
  } catch (error) {
    console.error('[Cart] Save error:', error);
  } finally {
    dispatch(setSyncing(false));
  }
};

// Async thunk to clear cart in MongoDB
export const clearCartInDB = (userId) => async (dispatch) => {
  if (!userId) return;
  
  try {
    await fetch(`/api/cart?userId=${userId}`, {
      method: 'DELETE'
    });
    dispatch(clearCart());
  } catch (error) {
    console.error('[Cart] Clear error:', error);
  }
};

export default cartSlice.reducer;
