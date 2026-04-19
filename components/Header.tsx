'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { toggleSidebar, setAddLinkModalOpen } from '@/store/slices/uiSlice';
import { setFilters, fetchLinks } from '@/store/slices/linksSlice';
import { Menu, Plus, Search, LogOut, User, Filter, X, Sparkles, Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
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

export default function Header() {
  const dispatch = useAppDispatch();
  const { sidebarOpen } = useAppSelector((state) => state.ui);
  const { filters } = useAppSelector((state) => state.links);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<any>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search:', searchQuery);
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
    <header className="h-16 border-b border-white/10 bg-background-card/80 backdrop-blur-2xl sticky top-0 z-30 shadow-lg relative">
      {/* Decorative gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent"></div>
      
      <div className="h-full px-4 lg:px-6 flex items-center gap-4">
        {/* Left: Menu Toggle */}
        <button
          onClick={() => dispatch(toggleSidebar())}
          className="p-2.5 hover:bg-gradient-to-br hover:from-secondary/20 hover:to-secondary/10 rounded-xl transition-all group relative overflow-hidden"
          aria-label="Toggle sidebar"
        >
          <Menu className="w-5 h-5 relative z-10 group-hover:text-secondary transition-colors" />
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/0 to-secondary/0 group-hover:from-secondary/10 group-hover:to-secondary/5 transition-all"></div>
        </button>

        {/* Center: Search & Filters */}
        <div className="flex-1 flex items-center gap-3 max-w-4xl">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 relative group">
            <div className={`absolute inset-0 bg-gradient-to-r from-secondary/20 to-brand-blue/20 rounded-2xl blur-xl transition-opacity ${
              searchFocused ? 'opacity-100' : 'opacity-0'
            }`}></div>
            
            <div className="relative">
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                searchFocused ? 'text-secondary' : 'text-muted-foreground'
              }`} />
              <input
                type="text"
                placeholder="Search your knowledge..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary/50 focus:bg-white/10 transition-all placeholder:text-muted-foreground hover:bg-white/[0.07] shadow-inner"
              />
              {searchFocused && (
                <div className="absolute inset-0 border-2 border-secondary/30 rounded-2xl pointer-events-none animate-pulse"></div>
              )}
            </div>
          </form>

          {/* Filter Button */}
          <div className="hidden md:block relative">
            <button
              onClick={() => setShowCategoryFilter(!showCategoryFilter)}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold transition-all relative overflow-hidden group ${
                filters.category
                  ? 'bg-gradient-to-r from-secondary/20 to-secondary/10 text-secondary border border-secondary/30 shadow-glow'
                  : 'bg-white/5 hover:bg-white/10 text-muted-foreground border border-white/10 hover:border-white/20'
              }`}
            >
              {filters.category && (
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-transparent animate-pulse"></div>
              )}
              <Filter className="w-4 h-4 relative z-10" />
              <span className="relative z-10">{filters.category || 'Filter'}</span>
              {filters.category && (
                <X
                  className="w-3.5 h-3.5 relative z-10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCategoryFilter(undefined);
                  }}
                />
              )}
            </button>

            {showCategoryFilter && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowCategoryFilter(false)}
                />
                <div className="absolute top-full mt-2 right-0 w-64 bg-background-elevated border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-scale-in backdrop-blur-xl">
                  <div className="p-2 space-y-1">
                    <button
                      onClick={() => handleCategoryFilter(undefined)}
                      className="w-full px-4 py-2.5 text-left text-sm hover:bg-white/5 rounded-xl transition-all text-muted-foreground font-medium"
                    >
                      All Categories
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleCategoryFilter(cat)}
                        className={`w-full px-4 py-2.5 text-left text-sm rounded-xl transition-all font-medium ${
                          filters.category === cat
                            ? 'bg-gradient-to-r from-secondary/20 to-transparent text-secondary'
                            : 'hover:bg-white/5 text-foreground'
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
        <div className="flex items-center gap-2">
          {/* Add Content Button - Eye-catching */}
          <button
            onClick={() => dispatch(setAddLinkModalOpen(true))}
            className="group relative flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-secondary-light via-secondary to-secondary-dark hover:from-secondary hover:to-secondary-dark text-white rounded-2xl transition-all font-bold shadow-neon hover:shadow-glow-lg hover:scale-105 overflow-hidden"
          >
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-secondary-light to-secondary opacity-0 group-hover:opacity-100 blur-xl transition-opacity"></div>
            
            <Plus className="w-5 h-5 relative z-10 group-hover:rotate-90 transition-transform duration-300" />
            <span className="hidden sm:inline relative z-10">Add Content</span>
            
            {/* Sparkle effect */}
            <Sparkles className="w-4 h-4 relative z-10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="group flex items-center gap-2 p-1.5 hover:bg-white/5 rounded-2xl transition-all"
            >
              <div className="relative w-10 h-10 bg-gradient-to-br from-brand-blue via-secondary to-brand-blue-light rounded-2xl flex items-center justify-center ring-2 ring-white/10 shadow-lg group-hover:ring-secondary/50 transition-all overflow-hidden">
                <User className="w-5 h-5 text-white relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-secondary/0 to-secondary/0 group-hover:from-secondary/20 group-hover:to-secondary/10 transition-all"></div>
              </div>
            </button>

            {showUserMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-72 bg-background-elevated border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-scale-in backdrop-blur-xl">
                  {user && (
                    <div className="px-5 py-4 border-b border-white/10 bg-gradient-to-br from-secondary/10 via-brand-blue/10 to-transparent relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary/20 to-transparent rounded-full blur-3xl"></div>
                      
                      <div className="relative">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-12 h-12 bg-gradient-to-br from-secondary-light to-secondary rounded-2xl flex items-center justify-center shadow-glow">
                            <User className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-white">{user.name || 'User'}</p>
                            <p className="text-xs text-muted-foreground">{user.phoneNumber}</p>
                          </div>
                        </div>
                        {user.telegramUsername && (
                          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground bg-white/5 rounded-lg px-3 py-2">
                            <span className="w-2 h-2 rounded-full bg-success animate-pulse"></span>
                            <span>@{user.telegramUsername}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full px-5 py-3 text-left text-sm hover:bg-error/10 transition-all flex items-center gap-3 text-error font-semibold group"
                  >
                    <LogOut className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Bottom decorative gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent"></div>
    </header>
  );
}
