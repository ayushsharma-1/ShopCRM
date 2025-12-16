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
    onSale: false,
  },
  sortBy: 'default',
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

      if (state.filters.onSale) {
        filtered = filtered.filter(
          product => product.discount === '50% OFF' && product.originalPrice
        );
      }

      switch (state.sortBy) {
        case 'price-low':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'name':
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        default:
          break;
      }
      
      state.filteredProducts = filtered;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
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

export const { setProducts, setFilters, applyFilters, resetFilters, setCurrentPage, setSortBy } = productsSlice.actions;
export default productsSlice.reducer;
