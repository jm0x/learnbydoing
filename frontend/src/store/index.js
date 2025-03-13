import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import problemReducer from './slices/problemSlice';
import progressReducer from './slices/progressSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    problems: problemReducer,
    progress: progressReducer,
  },
});

export default store;
