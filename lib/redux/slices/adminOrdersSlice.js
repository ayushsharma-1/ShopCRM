'use client';

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  isLoading: false,
  error: null,
};

const adminOrdersSlice = createSlice({
  name: 'adminOrders',
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

export const { setOrders, setLoading, setError } = adminOrdersSlice.actions;

// Async thunk to fetch all orders (admin only)
export const fetchAllOrders = (userId) => async (dispatch) => {
  try {
    dispatch(setLoading(true));
    
    const response = await fetch('/api/admin/orders', {
      headers: {
        'x-user-id': userId
      }
    });

    const result = await response.json();

    if (!response.ok) {
      dispatch(setError(result.error || 'Failed to fetch orders'));
      return;
    }

    dispatch(setOrders(result.data));

  } catch (error) {
    console.error('[Admin Orders] Fetch error:', error);
    dispatch(setError('Failed to fetch orders'));
  }
};

export default adminOrdersSlice.reducer;
