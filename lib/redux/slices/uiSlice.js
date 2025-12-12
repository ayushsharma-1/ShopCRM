import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    isLoading: false,
  },
  reducers: {
    SetLoading: (state, action) => {
      state.isLoading = action.payload;
    },

  },
});
export const { SetLoading } = uiSlice.actions;
export default uiSlice.reducer;
