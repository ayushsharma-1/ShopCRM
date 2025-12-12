import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    totalAmount:0,
    totalItem:0,
  },
  reducers: {
    addToCart: (state,action)=>{

    },
    removeFromCart:(state,action)=>{

    },
    updateQuantity:(state,action)=>{

    },
    clearCart:(state)=>{
      state.items=[];
      state.totalAmount=0;
      state.totalItem=0;
    },
    calculateTotals:(state)=>{

    },
  },
});
export const {addToCart,removeFromCart,updateQuantity,clearCart,calculateTotals} = cartSlice.actions;
export default cartSlice.reducer;
