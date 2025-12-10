import { configureStore } from '@reduxjs/toolkit';
import authSlice from './slices/authSlice';
import themeSlice from './slices/themeSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    theme: themeSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});
 
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;