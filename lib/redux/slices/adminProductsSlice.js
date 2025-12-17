'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

/**
 * Admin Products Slice
 * Separate from storefront products - includes inactive items
 */

// Fetch all products (admin view - includes inactive)
export const fetchAllProducts = createAsyncThunk(
  'adminProducts/fetchAll',
  async ({ type = 'products', userId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/admin/products?type=${type}`, {
        headers: {
          'x-user-id': userId
        }
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error || 'Failed to fetch products');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create new product
export const createProduct = createAsyncThunk(
  'adminProducts/create',
  async ({ productData, userId }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/admin/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId
        },
        body: JSON.stringify(productData)
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error || 'Failed to create product');
      }

      const data = await response.json();
      return data.product;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update existing product
export const updateProduct = createAsyncThunk(
  'adminProducts/update',
  async ({ productId, updates, userId }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId
        },
        body: JSON.stringify({ productId, ...updates })
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error || 'Failed to update product');
      }

      const data = await response.json();
      return data.product;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete product (soft delete)
export const deleteProduct = createAsyncThunk(
  'adminProducts/delete',
  async ({ productId, userId }, { rejectWithValue }) => {
    try {
      const response = await fetch(`/api/admin/products?id=${productId}`, {
        method: 'DELETE',
        headers: {
          'x-user-id': userId
        }
      });

      if (!response.ok) {
        const error = await response.json();
        return rejectWithValue(error.error || 'Failed to delete product');
      }

      return productId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const adminProductsSlice = createSlice({
  name: 'adminProducts',
  initialState: {
    products: [],
    isLoading: false,
    isSaving: false,
    error: null,
    filters: {
      search: '',
      category: '',
      status: 'all' // 'all' | 'active' | 'inactive'
    }
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch all products
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    // Create product
    builder
      .addCase(createProduct.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.isSaving = false;
        state.products.unshift(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload;
      });

    // Update product
    builder
      .addCase(updateProduct.pending, (state) => {
        state.isSaving = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.isSaving = false;
        const index = state.products.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.isSaving = false;
        state.error = action.payload;
      });

    // Delete product
    builder
      .addCase(deleteProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex(p => p.id === action.payload);
        if (index !== -1) {
          state.products[index].isActive = false;
        }
      });
  }
});

export const { setFilters, clearError } = adminProductsSlice.actions;

// Selectors
export const selectFilteredProducts = (state) => {
  const { products, filters } = state.adminProducts;
  
  return products.filter(product => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch = 
        product.name?.toLowerCase().includes(searchLower) ||
        product.category?.toLowerCase().includes(searchLower);
      if (!matchesSearch) return false;
    }
    
    // Category filter
    if (filters.category && product.category !== filters.category) {
      return false;
    }
    
    // Status filter
    if (filters.status === 'active' && product.isActive !== true) {
      return false;
    }
    if (filters.status === 'inactive' && product.isActive !== false) {
      return false;
    }
    
    return true;
  });
};

export default adminProductsSlice.reducer;
