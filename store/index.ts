import { configureStore } from '@reduxjs/toolkit';
import linksReducer from './slices/linksSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    links: linksReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
