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
      const existingItem = state.items.find(item => item.id === action.payload.id);
      if(existingItem){
        existingItem.quantity += action.payload.quantity;
      }else{
        state.items.push({...action.payload, quantity: action.payload.quantity});
      }
    },
    removeFromCart:(state,action)=>{
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    updateQuantity:(state,action)=>{
      const item = state.items.find(item => item.id === action.payload.id);
      if(item){
        item.quantity = action.payload.quantity;
      }
    },
    clearCart:(state)=>{
      state.items=[];
      state.totalAmount=0;
      state.totalItem=0;
    },
    calculateTotals:(state)=>{
      let totalAmount = 0;
      let totalItem = 0;
      state.items.forEach(item => {
        totalAmount += item.price * item.quantity;
        totalItem += item.quantity;
      });
      state.totalAmount = totalAmount;
      state.totalItem = totalItem;  
    },
  },
});
export const {addToCart,removeFromCart,updateQuantity,clearCart,calculateTotals} = cartSlice.actions;
export default cartSlice.reducer;
