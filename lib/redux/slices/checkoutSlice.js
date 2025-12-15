import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentStep: 1,
  address: {
    fullName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  },
  payment: {
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  },
  isProcessing: false,
};

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    nextStep: (state) => {
      if (state.currentStep < 3) {
        state.currentStep += 1;
      }
    },
    prevStep: (state) => {
      if (state.currentStep > 1) {
        state.currentStep -= 1;
      }
    },
    updateAddress: (state, action) => {
      state.address = { ...state.address, ...action.payload };
    },
    updatePayment: (state, action) => {
      state.payment = { ...state.payment, ...action.payload };
    },
    setProcessing: (state, action) => {
      state.isProcessing = action.payload;
    },
    resetCheckout: (state) => {
      return initialState;
    },
  },
});

export const { 
  setCurrentStep, 
  nextStep, 
  prevStep, 
  updateAddress, 
  updatePayment, 
  setProcessing,
  resetCheckout 
} = checkoutSlice.actions;
export default checkoutSlice.reducer;
