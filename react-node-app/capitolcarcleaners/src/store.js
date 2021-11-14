import { configureStore } from '@reduxjs/toolkit';
import statusReducer from './statusSlice';
import userIdReducer from './userIdSlice';
import roleReducer from './roleSlice';

export default configureStore({
  reducer: {
    loggedIn: statusReducer,
    userId: userIdReducer,
    role: roleReducer,
  },
});