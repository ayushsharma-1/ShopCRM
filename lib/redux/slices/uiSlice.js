import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoading: false,
  isSidebarOpen: false,
  activeModal: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    openModal: (state, action) => {
      state.activeModal = action.payload;
    },
    closeModal: (state) => {
      state.activeModal = null;
    },
  },
});

export const { setLoading, toggleSidebar, openModal, closeModal } = uiSlice.actions;
export default uiSlice.reducer;
