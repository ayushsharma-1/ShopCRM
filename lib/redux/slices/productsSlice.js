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
        let categoryFiltered = filtered;
        let colorFiltered = filtered;
        let keywordFiltered = filtered;
        let priceFiltered = filtered;
        let ratingFiltered = filtered;

        // AI Category filter
        if (state.aiFilters.category) {
          categoryFiltered = filtered.filter(product => product.category === state.aiFilters.category);
        }

        // AI Color filter (search in multiple fields)
        if (state.aiFilters.color) {
          colorFiltered = filtered.filter(product => {
            const colorLower = state.aiFilters.color.toLowerCase();
            return (
              product.attributes?.color?.toLowerCase().includes(colorLower) ||
              product.name.toLowerCase().includes(colorLower) ||
              product.description.toLowerCase().includes(colorLower) ||
              product.tags?.some(tag => tag.toLowerCase().includes(colorLower))
            );
          });
        }

        // AI Keywords filter (more flexible matching)
        if (state.aiFilters.keywords && state.aiFilters.keywords.length > 0) {
          keywordFiltered = filtered.filter(product => {
            const productText = `${product.name} ${product.description} ${product.category} ${product.tags?.join(' ') || ''} ${product.attributes?.color || ''}`.toLowerCase();
            return state.aiFilters.keywords.some(keyword => {
              const keywordLower = keyword.toLowerCase();
              return productText.includes(keywordLower);
            });
          });
        }

        // AI Max Price filter
        if (state.aiFilters.maxPrice) {
          priceFiltered = filtered.filter(product => product.price <= state.aiFilters.maxPrice);
        }

        // AI Min Rating filter
        if (state.aiFilters.minRating) {
          ratingFiltered = filtered.filter(product => product.rating >= state.aiFilters.minRating);
        }

        // Combine filters - use intersection for multiple filters, union for single filter
        const activeFilters = [];
        if (state.aiFilters.category) activeFilters.push(categoryFiltered);
        if (state.aiFilters.color) activeFilters.push(colorFiltered);
        if (state.aiFilters.keywords && state.aiFilters.keywords.length > 0) activeFilters.push(keywordFiltered);
        if (state.aiFilters.maxPrice) activeFilters.push(priceFiltered);
        if (state.aiFilters.minRating) activeFilters.push(ratingFiltered);

        if (activeFilters.length > 0) {
          // If multiple filters, find intersection (products matching all filters)
          filtered = activeFilters.reduce((acc, curr) => 
            acc.filter(p => curr.some(cp => cp.id === p.id))
          );
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
