import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Link, LinkFilters, Stats } from '@/types';
import { linkApi } from '@/services/api';

interface LinksState {
  links: Link[];
  stats: Stats | null;
  filters: LinkFilters;
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  } | null;
}

const initialState: LinksState = {
  links: [],
  stats: null,
  filters: {
    sortBy: 'createdAt',
    order: 'desc',
  },
  loading: false,
  error: null,
  pagination: null,
};

// Async thunks
export const fetchLinks = createAsyncThunk(
  'links/fetchLinks',
  async (_, { getState }) => {
    const state = getState() as { links: LinksState };
    const { filters } = state.links;
    
    const params: any = {
      sortBy: filters.sortBy,
      order: filters.order,
    };

    if (filters.category) params.category = filters.category;
    if (filters.tags && filters.tags.length > 0) params.tags = filters.tags.join(',');
    if (filters.readStatus !== undefined) params.readStatus = filters.readStatus;

    return await linkApi.getLinks(params);
  }
);

export const addLink = createAsyncThunk(
  'links/addLink',
  async ({ url, source }: { url: string; source: 'telegram' | 'web' }) => {
    return await linkApi.addLink(url, source);
  }
);

export const toggleReadStatus = createAsyncThunk(
  'links/toggleReadStatus',
  async ({ id, readStatus }: { id: string; readStatus: boolean }) => {
    return await linkApi.toggleReadStatus(id, readStatus);
  }
);

export const deleteLink = createAsyncThunk(
  'links/deleteLink',
  async (id: string) => {
    await linkApi.deleteLink(id);
    return id;
  }
);

export const fetchStats = createAsyncThunk(
  'links/fetchStats',
  async () => {
    return await linkApi.getStats();
  }
);

// Slice
const linksSlice = createSlice({
  name: 'links',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<LinkFilters>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {
        sortBy: 'createdAt',
        order: 'desc',
      };
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch links
    builder
      .addCase(fetchLinks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLinks.fulfilled, (state, action) => {
        state.loading = false;
        state.links = action.payload.links;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchLinks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch links';
      });

    // Add link
    builder
      .addCase(addLink.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addLink.fulfilled, (state, action) => {
        state.loading = false;
        state.links.unshift(action.payload);
      })
      .addCase(addLink.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to add link';
      });

    // Toggle read status
    builder
      .addCase(toggleReadStatus.fulfilled, (state, action) => {
        const index = state.links.findIndex(link => link._id === action.payload._id);
        if (index !== -1) {
          state.links[index] = action.payload;
        }
      });

    // Delete link
    builder
      .addCase(deleteLink.fulfilled, (state, action) => {
        state.links = state.links.filter(link => link._id !== action.payload);
      });

    // Fetch stats
    builder
      .addCase(fetchStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearError } = linksSlice.actions;
export default linksSlice.reducer;
