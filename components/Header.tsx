'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleSidebar, setAddLinkModalOpen } from '@/store/slices/uiSlice';
import { setFilters, fetchLinks } from '@/store/slices/linksSlice';
import { setSearchQuery, clearSearchQuery } from '@/store/slices/uiSlice';
import { Menu, Plus, Search, LogOut, User, Filter, X, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Category } from '@/types';
import BrandMark from './BrandMark';

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      dispatch(clearSearchQuery());
      return;
    }

    setShowCategoryFilter(false);
    setShowUserMenu(false);
  };

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
    <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
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
          <div className="hidden xl:block pr-2">
            <BrandMark compact />
          </div>

          {/* Search */}
          <form onSubmit={handleSearch} className="relative min-w-0 flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search your knowledge..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="input-base pl-9"
            />
          </form>

          {/* Category filter */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowCategoryFilter(!showCategoryFilter)}
              className={`inline-flex h-11 items-center gap-2 rounded-xl border px-4 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 ${
                filters.category
                  ? 'border-indigo-200 bg-indigo-50 text-indigo-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
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
                <div className="absolute right-0 top-full z-50 mt-1.5 w-56 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg animate-scale-in">
                  <div className="p-1.5">
                    <button
                      onClick={() => handleCategoryFilter(undefined)}
                      className="w-full rounded-lg px-3 py-2 text-left text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    >
                      All Categories
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleCategoryFilter(cat)}
                        className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                          filters.category === cat
                            ? 'bg-indigo-50 text-indigo-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-50'
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
              <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                <User className="h-3.5 w-3.5" />
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
            </button>

            {showUserMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
                <div className="absolute right-0 mt-1.5 w-64 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg z-50 animate-scale-in">
                  {user && (
                    <div className="border-b border-gray-100 px-4 py-3">
                      <p className="text-sm font-semibold text-gray-900">{user.name || 'User'}</p>
                      <p className="text-xs text-gray-500">{user.phoneNumber}</p>
                      {user.telegramUsername && (
                        <p className="mt-1 text-xs text-gray-400">@{user.telegramUsername}</p>
                      )}
                    </div>
                  )}
                  <div className="p-1.5">
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"
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
