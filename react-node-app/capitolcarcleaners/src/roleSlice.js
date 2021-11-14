import { createSlice } from '@reduxjs/toolkit';

export const roleSlice = createSlice({
  name: 'role',
  initialState: {
    value: null,
  },
  reducers: {
    setRole: (state, action) => {
      state.value = action.payload;
    },
    removeRole: (state) => {
      state.value = null;
    },
  },
});

export const { setRole, removeRole } = roleSlice.actions;

export default roleSlice.reducer;