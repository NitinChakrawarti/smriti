'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleSidebar, setAddLinkModalOpen } from '@/store/slices/uiSlice';
import { setFilters, setSearch, fetchLinks } from '@/store/slices/linksSlice';
import { setSearchQuery, clearSearchQuery } from '@/store/slices/uiSlice';
import { Menu, Plus, Search, LogOut, User, Filter, X, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Category } from '@/types';
import ThemeToggle from './ThemeToggle';

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

export default function Header() {
  const dispatch = useAppDispatch();
  const { sidebarOpen } = useAppSelector((state) => state.ui);
  const { searchQuery } = useAppSelector((state) => state.ui);
  const { filters } = useAppSelector((state) => state.links);
  const [user, setUser] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  // Debounce the search box into a server-side query (whole DB, within active filters)
  const appliedSearch = filters.search || '';
  const didMount = useRef(false);
  useEffect(() => {
    // Skip the very first run so we don't double-fetch on mount
    if (!didMount.current) {
      didMount.current = true;
      return;
    }
    const handle = setTimeout(() => {
      if (searchQuery.trim() !== appliedSearch) {
        dispatch(setSearch(searchQuery.trim()));
        dispatch(fetchLinks());
      }
    }, 400);
    return () => clearTimeout(handle);
  }, [searchQuery, appliedSearch, dispatch]);

  const handleCategoryFilter = (category: Category | undefined) => {
    dispatch(setFilters({ category }));
    dispatch(fetchLinks());
    setShowCategoryFilter(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <header className="shrink-0 z-30 border-b border-gray-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950 dark:shadow-black/20">
      <div className="flex min-h-[60px] flex-wrap items-center gap-3 px-4 py-3 sm:gap-4 sm:px-6 lg:flex-nowrap">
        {/* Sidebar toggle */}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="btn-icon"
          aria-label="Toggle sidebar"
        >
          <Menu className="h-4 w-4" />
        </button>

        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3 lg:flex-nowrap">
          {/* Search */}
          <div className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none dark:text-slate-500" />
            <input
              type="search"
              placeholder="Search your knowledge..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  dispatch(clearSearchQuery());
                  dispatch(setSearch(''));
                  dispatch(fetchLinks());
                }
              }}
              className="input-base pl-9"
              aria-label="Search"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  dispatch(clearSearchQuery());
                  dispatch(setSearch(''));
                  dispatch(fetchLinks());
                }}
                aria-label="Clear search"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Category filter */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowCategoryFilter(!showCategoryFilter)}
              className={`inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
                filters.category
                  ? 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-500/40 dark:bg-indigo-500/15 dark:text-indigo-200'
                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
              }`}
            >
              <Filter className="h-4 w-4" />
              <span>{filters.category || 'Filter'}</span>
              {filters.category && (
                <X
                  className="h-3.5 w-3.5"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCategoryFilter(undefined);
                  }}
                />
              )}
            </button>

            {showCategoryFilter && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowCategoryFilter(false)} />
                <div className="absolute right-0 top-full z-50 mt-1.5 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg animate-scale-in dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/40">
                  <div className="p-1.5">
                    <button
                      onClick={() => handleCategoryFilter(undefined)}
                      className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
                    >
                      All Categories
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleCategoryFilter(cat)}
                        className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                          filters.category === cat
                            ? 'bg-indigo-50 text-indigo-700 font-medium dark:bg-indigo-500/15 dark:text-indigo-200'
                            : 'text-gray-700 hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-800'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end">
          <ThemeToggle />

          <button
            onClick={() => dispatch(setAddLinkModalOpen(true))}
            className="btn-primary"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Content</span>
          </button>

          {/* User menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="btn-icon flex items-center gap-1.5 px-2 w-auto"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
                <User className="h-3.5 w-3.5" />
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400 dark:text-slate-500" />
            </button>

            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                <div className="absolute right-0 mt-1.5 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg z-50 animate-scale-in dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/40">
                  {user && (
                    <div className="border-b border-gray-100 px-4 py-3 dark:border-slate-800">
                      <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">{user.name || 'User'}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">{user.phoneNumber}</p>
                      {user.telegramUsername && (
                        <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">@{user.telegramUsername}</p>
                      )}
                    </div>
                  )}
                  <div className="p-1.5">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
