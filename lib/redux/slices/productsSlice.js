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
        }
    },
});

export const { } = productsSlice.actions;
export default productsSlice.reducer;
