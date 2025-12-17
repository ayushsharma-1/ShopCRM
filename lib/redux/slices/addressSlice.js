import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  addresses: [],
};

const addressSlice = createSlice({
  name: 'addresses',
  initialState,
  reducers: {
    addAddress: (state, action) => {
      const newAddress = {
        ...action.payload,
        id: `addr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        isDefault: state.addresses.length === 0,
      };
      state.addresses.push(newAddress);
    },
    
    updateAddress: (state, action) => {
      const index = state.addresses.findIndex(addr => addr.id === action.payload.id);
      if (index !== -1) {
        state.addresses[index] = { ...state.addresses[index], ...action.payload };
      }
    },
    
    removeAddress: (state, action) => {
      const removedAddress = state.addresses.find(addr => addr.id === action.payload);
      state.addresses = state.addresses.filter(addr => addr.id !== action.payload);
      
      // If default address was removed, set first address as default
      if (removedAddress?.isDefault && state.addresses.length > 0) {
        state.addresses[0].isDefault = true;
      }
    },
    
    setDefaultAddress: (state, action) => {
      state.addresses.forEach(addr => {
        addr.isDefault = addr.id === action.payload;
      });
    },
  },
});

export const { addAddress, updateAddress, removeAddress, setDefaultAddress } = addressSlice.actions;
export default addressSlice.reducer;
