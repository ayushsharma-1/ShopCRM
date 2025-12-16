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
  aiFilters: null,
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
    setAiFilters: (state, action) => {
      state.aiFilters = action.payload;
      state.currentPage = 1;
    },
    applyFilters: (state) => {
      let filtered = [...state.products];

      // Apply AI filters first if available
      if (state.aiFilters) {
        // AI Category filter
        if (state.aiFilters.category) {
          filtered = filtered.filter(product => product.category === state.aiFilters.category);
        }

        // AI Color filter
        if (state.aiFilters.color) {
          filtered = filtered.filter(product => 
            product.attributes?.color?.toLowerCase() === state.aiFilters.color
          );
        }

        // AI Keywords filter
        if (state.aiFilters.keywords && state.aiFilters.keywords.length > 0) {
          filtered = filtered.filter(product => {
            const productText = `${product.name} ${product.description} ${product.tags?.join(' ') || ''}`.toLowerCase();
            return state.aiFilters.keywords.some(keyword => productText.includes(keyword));
          });
        }

        // AI Max Price filter
        if (state.aiFilters.maxPrice) {
          filtered = filtered.filter(product => product.price <= state.aiFilters.maxPrice);
        }

        // AI Min Rating filter
        if (state.aiFilters.minRating) {
          filtered = filtered.filter(product => product.rating >= state.aiFilters.minRating);
        }
      }

      // Apply traditional search filter
      if (state.filters.search && !state.aiFilters) {
        const searchLower = state.filters.search.toLowerCase();
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower) ||
          product.category.toLowerCase().includes(searchLower) ||
          product.tags?.some(tag => tag.toLowerCase().includes(searchLower))
        );
      }

      // Apply manual price filters
      filtered = filtered.filter(
        product => product.price >= state.filters.minPrice && 
                   product.price <= state.filters.maxPrice
      );
      
      // Apply manual rating filter
      if (state.filters.minRating > 0) {
        filtered = filtered.filter(
          product => product.rating >= state.filters.minRating
        );
      }
      
      // Apply manual category filter
      if (state.filters.category !== 'all') {
        filtered = filtered.filter(
          product => product.category === state.filters.category
        );
      }

      // Apply sale filter
      if (state.filters.onSale) {
        filtered = filtered.filter(
          product => product.discount === '50% OFF' && product.originalPrice
        );
      }

      // Calculate AI relevance scores if AI filters are active
      if (state.aiFilters) {
        filtered = filtered.map(product => ({
          ...product,
          _relevanceScore: calculateProductScore(product, state.aiFilters)
        }));
      }

      // Apply sorting
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
        case 'relevance':
          if (state.aiFilters) {
            filtered.sort((a, b) => (b._relevanceScore || 0) - (a._relevanceScore || 0));
          }
          break;
        default:
          // If AI filters are active and no manual sort, sort by relevance
          if (state.aiFilters) {
            filtered.sort((a, b) => (b._relevanceScore || 0) - (a._relevanceScore || 0));
          }
          break;
      }
      
      state.filteredProducts = filtered;
    },
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    resetFilters: (state) => {
      state.filters = initialState.filters;
      state.aiFilters = null;
      state.filteredProducts = state.products;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
});

// Helper function to calculate product relevance score
function calculateProductScore(product, aiFilters) {
  if (!aiFilters) return 0;
  
  let score = 0;

  // Category exact match (highest priority)
  if (aiFilters.category && product.category === aiFilters.category) {
    score += 100;
  }

  // Color exact match (high priority)
  if (aiFilters.color && product.attributes?.color?.toLowerCase() === aiFilters.color) {
    score += 50;
  }

  // Keywords match (medium priority)
  if (aiFilters.keywords && aiFilters.keywords.length > 0) {
    const productText = `${product.name} ${product.description} ${product.tags?.join(' ') || ''}`.toLowerCase();
    
    aiFilters.keywords.forEach(keyword => {
      if (product.name.toLowerCase().includes(keyword)) {
        score += 30; // Name match is more important
      } else if (productText.includes(keyword)) {
        score += 15; // Description/tags match
      }
    });
  }

  // Rating boost
  if (product.rating >= 4.5) {
    score += 10;
  } else if (product.rating >= 4.0) {
    score += 5;
  }

  // Price proximity bonus
  if (aiFilters.maxPrice && product.price <= aiFilters.maxPrice) {
    const priceRatio = product.price / aiFilters.maxPrice;
    score += Math.round((1 - priceRatio) * 10);
  }

  // Review count boost (more reviews = more trustworthy)
  if (product.ratingCount) {
    if (product.ratingCount >= 200) score += 8;
    else if (product.ratingCount >= 100) score += 5;
    else if (product.ratingCount >= 50) score += 3;
  }

  return score;
}

export const { setProducts, setFilters, setAiFilters, applyFilters, resetFilters, setCurrentPage, setSortBy } = productsSlice.actions;
export default productsSlice.reducer;
