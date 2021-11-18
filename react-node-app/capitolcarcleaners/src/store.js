import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import {combineReducers} from "redux"; 
import storage from 'redux-persist/lib/storage'; //defaults to LocalStorage for web
import statusReducer from './statusSlice';
import userIdReducer from './userIdSlice';
import roleReducer from './roleSlice';

const reducers = combineReducers({
  loggedIn: statusReducer,
  userId: userIdReducer,
  role: roleReducer,
});

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, reducers)

export default () => {
  let store = configureStore({
    reducer: persistedReducer,
  });
  let persistor = persistStore(store);
  return { store, persistor }
}