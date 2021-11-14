import { createSlice } from '@reduxjs/toolkit';

export const statusSlice = createSlice({
  name: 'loggedIn',
  initialState: {
    value: false,
  },
  reducers: {
    logUserIn: (state) => {
      state.value = true;
    },
    logUserOut: (state) => {
      state.value = false;
    },
  },
});

export const { logUserIn, logUserOut } = statusSlice.actions;

export default statusSlice.reducer;