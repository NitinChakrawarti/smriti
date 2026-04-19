'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setFilters, clearFilters, fetchLinks } from '@/store/slices/linksSlice';
import { setSidebarOpen } from '@/store/slices/uiSlice';
import { X, Filter, BarChart3 } from 'lucide-react';
import { Category } from '@/types';

const categories: Category[] = [
  'Technology',
  'Business',
  'Design',
  'Marketing',
  'Development',
  'AI/ML',
  'Product',
  'Other',
];

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const { sidebarOpen } = useAppSelector((state) => state.ui);
  const { filters, stats } = useAppSelector((state) => state.links);

  const handleCategoryClick = (category: Category) => {
    const newCategory = filters.category === category ? undefined : category;
    dispatch(setFilters({ category: newCategory }));
    dispatch(fetchLinks());
  };

  const handleReadStatusClick = (status: boolean | undefined) => {
    const newStatus = filters.readStatus === status ? undefined : status;
    dispatch(setFilters({ readStatus: newStatus }));
    dispatch(fetchLinks());
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
    dispatch(fetchLinks());
  };

  if (!sidebarOpen) return null;

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className="fixed inset-0 bg-black/50 lg:hidden z-40"
        onClick={() => dispatch(setSidebarOpen(false))}
      />

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border z-50 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-lg">Filters</h2>
          </div>
          <button
            onClick={() => dispatch(setSidebarOpen(false))}
            className="lg:hidden p-1 hover:bg-card-hover rounded"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Stats */}
          {stats && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <BarChart3 className="w-4 h-4 text-muted" />
                <h3 className="text-sm font-medium text-muted">Statistics</h3>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Total</span>
                  <span className="font-medium">{stats.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Read</span>
                  <span className="font-medium text-green-500">{stats.read}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Unread</span>
                  <span className="font-medium text-yellow-500">{stats.unread}</span>
                </div>
              </div>
            </div>
          )}

          {/* Read Status */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted mb-3">Status</h3>
            <button
              onClick={() => handleReadStatusClick(false)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                filters.readStatus === false
                  ? 'bg-primary text-white'
                  : 'hover:bg-card-hover'
              }`}
            >
              Unread
            </button>
            <button
              onClick={() => handleReadStatusClick(true)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                filters.readStatus === true
                  ? 'bg-primary text-white'
                  : 'hover:bg-card-hover'
              }`}
            >
              Read
            </button>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted mb-3">Categories</h3>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  filters.category === category
                    ? 'bg-primary text-white'
                    : 'hover:bg-card-hover'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Clear Filters */}
          {(filters.category || filters.readStatus !== undefined) && (
            <button
              onClick={handleClearFilters}
              className="w-full px-3 py-2 bg-card-hover hover:bg-border rounded-lg text-sm transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
