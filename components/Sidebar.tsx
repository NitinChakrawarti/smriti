'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setFilters, clearFilters, fetchLinks } from '@/store/slices/linksSlice';
import { setSidebarOpen } from '@/store/slices/uiSlice';
import { Home, Layers, BookmarkCheck, BookmarkX, Plus, Edit2, Trash2, Check, X, Sparkles, TrendingUp } from 'lucide-react';
import { Category } from '@/types';
import { useState } from 'react';

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

const categoryIcons: Record<string, string> = {
  Technology: '💻',
  Business: '💼',
  Design: '🎨',
  Marketing: '📢',
  Development: '⚡',
  'AI/ML': '🤖',
  Product: '📦',
  Other: '📌',
};

const categoryColors: Record<string, string> = {
  Technology: 'from-blue-500 to-cyan-500',
  Business: 'from-green-500 to-emerald-500',
  Design: 'from-purple-500 to-pink-500',
  Marketing: 'from-pink-500 to-rose-500',
  Development: 'from-cyan-500 to-blue-500',
  'AI/ML': 'from-indigo-500 to-purple-500',
  Product: 'from-orange-500 to-amber-500',
  Other: 'from-gray-500 to-slate-500',
};

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const { sidebarOpen } = useAppSelector((state) => state.ui);
  const { filters, stats } = useAppSelector((state) => state.links);
  
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

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

  const handleAllContent = () => {
    dispatch(clearFilters());
    dispatch(fetchLinks());
  };

  const getCategoryCount = (category: Category) => {
    if (!stats?.categories) return 0;
    const cat = stats.categories.find((c) => c._id === category);
    return cat?.count || 0;
  };

  if (!sidebarOpen) return null;

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm lg:hidden z-40 animate-fade-in"
        onClick={() => dispatch(setSidebarOpen(false))}
      />

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-72 bg-gradient-to-b from-background-card via-background-elevated to-background-card border-r border-white/10 z-50 flex flex-col lg:translate-x-0 animate-slide-in shadow-2xl">
        {/* Decorative gradient line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-50"></div>
        
        {/* Logo */}
        <div className="h-20 px-6 flex items-center gap-3 border-b border-white/10 relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 via-transparent to-transparent"></div>
          
          <div className="relative flex items-center gap-3 animate-fade-in-up">
            <div className="w-11 h-11 bg-gradient-to-br from-secondary-light via-secondary to-secondary-dark rounded-2xl flex items-center justify-center shadow-neon animate-pulse-glow relative">
              <Sparkles className="w-6 h-6 text-white" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"></div>
            </div>
            <div>
              <h1 className="font-bold text-xl leading-tight tracking-tight">
                <span className="text-brand-blue-light">Smart</span>
                <span className="gradient-text">Space</span>
              </h1>
              <p className="text-[10px] text-muted-foreground font-medium">AI Knowledge Hub</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-8">
          {/* Main Navigation */}
          <div className="space-y-2">
            <button
              onClick={handleAllContent}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all group relative overflow-hidden ${
                !filters.category && filters.readStatus === undefined
                  ? 'bg-gradient-to-r from-secondary/20 via-secondary/15 to-transparent text-white shadow-lg shadow-secondary/20'
                  : 'text-muted hover:text-foreground hover:bg-white/5'
              }`}
            >
              {!filters.category && filters.readStatus === undefined && (
                <div className="absolute inset-0 bg-gradient-to-r from-secondary/10 to-transparent animate-pulse"></div>
              )}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                !filters.category && filters.readStatus === undefined
                  ? 'bg-gradient-to-br from-secondary-light to-secondary shadow-glow'
                  : 'bg-white/5 group-hover:bg-white/10'
              }`}>
                <Home className="w-5 h-5" />
              </div>
              <span className="flex-1 text-left">All Content</span>
              {stats && (
                <span className={`text-xs px-2.5 py-1 rounded-lg font-bold ${
                  !filters.category && filters.readStatus === undefined
                    ? 'bg-secondary/30 text-secondary'
                    : 'bg-white/10'
                }`}>
                  {stats.total}
                </span>
              )}
            </button>

            <button
              onClick={() => handleReadStatusClick(false)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all group relative overflow-hidden ${
                filters.readStatus === false
                  ? 'bg-gradient-to-r from-warning/20 via-warning/15 to-transparent text-warning shadow-lg shadow-warning/20'
                  : 'text-muted hover:text-foreground hover:bg-white/5'
              }`}
            >
              {filters.readStatus === false && (
                <div className="absolute inset-0 bg-gradient-to-r from-warning/10 to-transparent animate-pulse"></div>
              )}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                filters.readStatus === false
                  ? 'bg-gradient-to-br from-warning to-orange-500 shadow-glow'
                  : 'bg-white/5 group-hover:bg-white/10'
              }`}>
                <BookmarkX className="w-5 h-5" />
              </div>
              <span className="flex-1 text-left">Unread</span>
              {stats && (
                <span className="text-xs px-2.5 py-1 rounded-lg bg-white/10 font-bold">
                  {stats.unread}
                </span>
              )}
            </button>

            <button
              onClick={() => handleReadStatusClick(true)}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all group relative overflow-hidden ${
                filters.readStatus === true
                  ? 'bg-gradient-to-r from-success/20 via-success/15 to-transparent text-success shadow-lg shadow-success/20'
                  : 'text-muted hover:text-foreground hover:bg-white/5'
              }`}
            >
              {filters.readStatus === true && (
                <div className="absolute inset-0 bg-gradient-to-r from-success/10 to-transparent animate-pulse"></div>
              )}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                filters.readStatus === true
                  ? 'bg-gradient-to-br from-success to-emerald-500 shadow-glow'
                  : 'bg-white/5 group-hover:bg-white/10'
              }`}>
                <BookmarkCheck className="w-5 h-5" />
              </div>
              <span className="flex-1 text-left">Read</span>
              {stats && (
                <span className="text-xs px-2.5 py-1 rounded-lg bg-white/10 font-bold">
                  {stats.read}
                </span>
              )}
            </button>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-4 mb-3">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-secondary" />
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wider">
                  Categories
                </h3>
              </div>
              <button
                onClick={() => setIsAddingCategory(true)}
                className="p-1.5 hover:bg-secondary/20 rounded-lg transition-all group"
                title="Add category"
              >
                <Plus className="w-4 h-4 text-muted-foreground group-hover:text-secondary transition-colors" />
              </button>
            </div>

            <div className="space-y-1.5">
              {/* Add Category Input */}
              {isAddingCategory && (
                <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-secondary/10 to-transparent rounded-xl border border-secondary/30 animate-scale-in">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        console.log('Add category:', newCategoryName);
                        setNewCategoryName('');
                        setIsAddingCategory(false);
                      }
                      if (e.key === 'Escape') {
                        setIsAddingCategory(false);
                        setNewCategoryName('');
                      }
                    }}
                    placeholder="Category name..."
                    className="flex-1 bg-transparent text-sm outline-none text-white placeholder:text-muted-foreground"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      console.log('Add category:', newCategoryName);
                      setNewCategoryName('');
                      setIsAddingCategory(false);
                    }}
                    className="p-1.5 hover:bg-success/20 rounded-lg text-success transition-all"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingCategory(false);
                      setNewCategoryName('');
                    }}
                    className="p-1.5 hover:bg-error/20 rounded-lg text-error transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Category List */}
              {categories.map((category) => {
                const count = getCategoryCount(category);
                const isActive = filters.category === category;
                const isHovered = hoveredCategory === category;
                const gradient = categoryColors[category];
                
                return (
                  <div
                    key={category}
                    className="relative group"
                    onMouseEnter={() => setHoveredCategory(category)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    <button
                      onClick={() => handleCategoryClick(category)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative overflow-hidden ${
                        isActive
                          ? 'bg-gradient-to-r from-white/10 to-transparent text-white shadow-lg'
                          : 'text-muted hover:text-foreground hover:bg-white/5'
                      }`}
                    >
                      {isActive && (
                        <>
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-secondary-light to-secondary rounded-r-full shadow-glow"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-secondary/5 to-transparent animate-pulse"></div>
                        </>
                      )}
                      
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-lg relative ${
                        isActive ? `bg-gradient-to-br ${gradient} shadow-glow` : 'bg-white/5 group-hover:bg-white/10'
                      }`}>
                        {categoryIcons[category]}
                        {isActive && (
                          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-lg"></div>
                        )}
                      </div>
                      
                      <span className="flex-1 text-left">{category}</span>
                      
                      {count > 0 && (
                        <span className={`text-xs px-2 py-0.5 rounded-lg font-bold ${
                          isActive ? 'bg-secondary/30 text-secondary' : 'bg-white/5 group-hover:bg-white/10'
                        }`}>
                          {count}
                        </span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Stats */}
        {stats && (
          <div className="p-4 border-t border-white/10 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-gradient-to-t from-secondary/5 to-transparent"></div>
            
            <div className="relative bg-gradient-to-br from-secondary/10 via-brand-blue/10 to-secondary/10 rounded-2xl p-4 border border-secondary/20 shadow-xl backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-secondary-light to-secondary flex items-center justify-center shadow-glow">
                  <TrendingUp className="w-4 h-4 text-white" />
                </div>
                <span className="text-xs font-bold text-white/90">Your Library</span>
              </div>
              
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-white/5 rounded-xl p-2 backdrop-blur-sm">
                  <div className="text-2xl font-bold gradient-text">{stats.total}</div>
                  <div className="text-[10px] text-muted-foreground font-medium">Total</div>
                </div>
                <div className="bg-white/5 rounded-xl p-2 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-success">{stats.read}</div>
                  <div className="text-[10px] text-muted-foreground font-medium">Read</div>
                </div>
                <div className="bg-white/5 rounded-xl p-2 backdrop-blur-sm">
                  <div className="text-2xl font-bold text-warning">{stats.unread}</div>
                  <div className="text-[10px] text-muted-foreground font-medium">Unread</div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Decorative gradient line at bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-secondary to-transparent opacity-50"></div>
      </aside>
    </>
  );
}
