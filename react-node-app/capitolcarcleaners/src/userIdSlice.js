import { createSlice } from '@reduxjs/toolkit';

export const userIdSlice = createSlice({
  name: 'userId',
  initialState: {
    value: null,
  },
  reducers: {
    setUserId: (state, action) => {
      state.value = action.payload;
    },
    removeUserId: (state) => {
      state.value = null;
    },
  },
});

export const { setUserId, removeUserId } = userIdSlice.actions;

export default userIdSlice.reducer;