import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],
  filteredProducts: [],
  filters: {
    search: '',
    minPrice: 0,
    maxPrice: 10000,
    minRating: 0,
    category: 'all',
  },
  currentPage: 1,
  itemsPerPage: 12,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
      state.filteredProducts = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1;
    },
    applyFilters: (state) => {
      let filtered = [...state.products];

      if (state.filters.search) {
        const searchLower = state.filters.search.toLowerCase();
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower)
        );
      }

      filtered = filtered.filter(
        product => product.price >= state.filters.minPrice && 
                   product.price <= state.filters.maxPrice
      );
      
      if (state.filters.minRating > 0) {
        filtered = filtered.filter(
          product => product.rating >= state.filters.minRating
        );
      }
      
      if (state.filters.category !== 'all') {
        filtered = filtered.filter(
          product => product.category === state.filters.category
        );
      }
      
      state.filteredProducts = filtered;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.filteredProducts = state.products;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
});

export const { setProducts, setFilters, applyFilters, resetFilters, setCurrentPage } = productsSlice.actions;
export default productsSlice.reducer;
