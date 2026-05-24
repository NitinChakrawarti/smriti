import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface UiState {
  sidebarOpen: boolean;
  toasts: Toast[];
  addLinkModalOpen: boolean;
  searchQuery: string;
}

const initialState: UiState = {
  sidebarOpen: true,
  toasts: [],
  addLinkModalOpen: false,
  searchQuery: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      const id = Date.now().toString();
      state.toasts.push({ ...action.payload, id });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter(toast => toast.id !== action.payload);
    },
    setAddLinkModalOpen: (state, action: PayloadAction<boolean>) => {
      state.addLinkModalOpen = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    clearSearchQuery: (state) => {
      state.searchQuery = '';
    },
  },
});

export const { toggleSidebar, setSidebarOpen, addToast, removeToast, setAddLinkModalOpen, setSearchQuery, clearSearchQuery } = uiSlice.actions;
export default uiSlice.reducer;
