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
    page: 1,
    limit: 20,
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
      page: filters.page || 1,
      limit: filters.limit || 20,
    };

    if (filters.category) params.category = filters.category;
    if (filters.tags && filters.tags.length > 0) params.tags = filters.tags.join(',');
    if (filters.readStatus !== undefined) params.readStatus = filters.readStatus;
    if (filters.search && filters.search.trim()) params.search = filters.search.trim();

    return await linkApi.getLinks(params);
  }
);

export const addLink = createAsyncThunk(
  'links/addLink',
  async ({ url, source }: { url: string; source: 'telegram' | 'web' | 'pwa-share' }) => {
    return await linkApi.addLink(url, source);
  }
);

export const addText = createAsyncThunk(
  'links/addText',
  async ({ text }: { text: string }) => {
    return await linkApi.addText(text);
  }
);

export const addFile = createAsyncThunk(
  'links/addFile',
  async ({ file }: { file: File }) => {
    return await linkApi.addFile(file);
  }
);

export const setReminder = createAsyncThunk(
  'links/setReminder',
  async ({ id, days }: { id: string; days: number }, { rejectWithValue }) => {
    try {
      return await linkApi.setReminder(id, days);
    } catch (error: any) {
      const data = error?.response?.data;
      return rejectWithValue({
        code: data?.code,
        message: data?.message || 'Failed to set reminder',
      });
    }
  }
);

export const clearReminder = createAsyncThunk(
  'links/clearReminder',
  async (id: string) => {
    return await linkApi.clearReminder(id);
  }
);

export const setKeep = createAsyncThunk(
  'links/setKeep',
  async ({ id, keep }: { id: string; keep: boolean }) => {
    return await linkApi.setKeep(id, keep);
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
      // Any filter change (other than an explicit page change) resets to page 1
      const onlyPageChanged =
        Object.keys(action.payload).length === 1 && 'page' in action.payload;
      state.filters = {
        ...state.filters,
        ...action.payload,
        page: onlyPageChanged ? action.payload.page : 1,
      };
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.filters.page = Math.max(1, action.payload);
    },
    setSearch: (state, action: PayloadAction<string>) => {
      state.filters.search = action.payload;
      state.filters.page = 1;
    },
    clearFilters: (state) => {
      state.filters = {
        sortBy: 'createdAt',
        order: 'desc',
        page: 1,
        limit: state.filters.limit || 20,
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

    // Add text
    builder
      .addCase(addText.fulfilled, (state, action) => {
        state.links.unshift(action.payload);
      });

    // Add file
    builder
      .addCase(addFile.fulfilled, (state, action) => {
        state.links.unshift(action.payload);
      });

    // Reminder / keep updates
    const replaceLink = (state: LinksState, payload: Link) => {
      const index = state.links.findIndex(link => link._id === payload._id);
      if (index !== -1) {
        state.links[index] = payload;
      }
    };

    builder
      .addCase(setReminder.fulfilled, (state, action) => {
        replaceLink(state, action.payload);
      })
      .addCase(clearReminder.fulfilled, (state, action) => {
        replaceLink(state, action.payload);
      })
      .addCase(setKeep.fulfilled, (state, action) => {
        replaceLink(state, action.payload);
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

export const { setFilters, setPage, setSearch, clearFilters, clearError } = linksSlice.actions;
export default linksSlice.reducer;
