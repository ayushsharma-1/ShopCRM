import { createSlice } from "@reduxjs/toolkit";

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
        setProducts:(state,action) => {
            state.products = action.payload;
            state.filteredProducts = action.payload;
        },
        setFilter:(state,action) => {
            state.filters = {...state.filters, ...action.payload};
        },
        applyFilter:(state) => {
            let filtered = state.products;

            if(state.filters.search) {
                filtered = filtered.filter(product =>
                    product.name.toLowerCase().includes(state.filters.search.toLowerCase())
                );
            }

            filtered = filtered.filter(product =>
                product.price >= state.filters.minPrice &&
                product.price <= state.filters.maxPrice &&
                product.rating >= state.filters.minRating
            );

            if(state.filters.category !== 'all') {
                filtered = filtered.filter(product => product.category === state.filters.category);
            }

            state.filteredProducts = filtered;
        },
        setCurrentPage:(state,action) => {
            state.currentPage = action.payload;
        },
        resetFilters:(state) => {
            state.filters = initialState.filters;
            state.filteredProducts = state.products;
            state.currentPage = 1;
        },
    },
});

export const {setProducts, setFilter, applyFilter, setCurrentPage, resetFilters } = productsSlice.actions;
export default productsSlice.reducer;
