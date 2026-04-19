'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleSidebar, setAddLinkModalOpen } from '@/store/slices/uiSlice';
import { setFilters, fetchLinks } from '@/store/slices/linksSlice';
import { Menu, Plus, Search, LogOut, User, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

const contentTypes = [
  { value: 'all', label: 'All Types' },
  { value: 'article', label: 'Articles' },
  { value: 'video', label: 'Videos' },
  { value: 'documentation', label: 'Docs' },
  { value: 'blog', label: 'Blogs' },
];

export default function Header() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { sidebarOpen } = useAppSelector((state) => state.ui);
  const { filters } = useAppSelector((state) => state.links);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search functionality would be implemented here
    console.log('Search:', searchQuery);
  };

  const handleCategoryFilter = (category: Category | undefined) => {
    dispatch(setFilters({ category }));
    dispatch(fetchLinks());
    setShowCategoryDropdown(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <header className="h-16 border-b border-white/5 bg-[#0B0F14]/80 backdrop-blur-xl sticky top-0 z-30">
      <div className="h-full px-4 lg:px-6 flex items-center gap-4">
        {/* Left: Menu Toggle */}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-2 hover:bg-white/5 rounded-xl transition-colors"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Center: Search & Filters */}
        <div className="flex-1 flex items-center gap-3 max-w-3xl">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              placeholder="Search your saved knowledge..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-muted-foreground"
            />
          </form>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Add Content Button */}
          <button
            onClick={() => dispatch(setAddLinkModalOpen(true))}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary text-white rounded-xl transition-all font-medium shadow-lg shadow-primary/20 hover:shadow-primary/30"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1.5 hover:bg-white/5 rounded-xl transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary via-secondary to-accent-purple rounded-lg flex items-center justify-center ring-2 ring-white/10">
                <User className="w-4 h-4 text-white" />
              </div>
            </button>

            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-[#13131a] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-scale-in">
                  {user && (
                    <div className="px-4 py-3 border-b border-white/10">
                      <p className="text-sm font-semibold text-white">{user.name || 'User'}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{user.phoneNumber}</p>
                      {user.telegramUsername && (
                        <div className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                          <span>@{user.telegramUsername}</span>
                        </div>
                      )}
                    </div>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-white/5 transition-colors flex items-center gap-2 text-error"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
