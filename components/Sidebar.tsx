'use client';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setFilters, clearFilters, fetchLinks } from '@/store/slices/linksSlice';
import { setSidebarOpen } from '@/store/slices/uiSlice';
import { Home, Layers, BookmarkCheck, BookmarkX, Sparkles, Plus, Edit2, Trash2, Check, X } from 'lucide-react';
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

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      // TODO: Add API call to create category
      console.log('Add category:', newCategoryName);
      setNewCategoryName('');
      setIsAddingCategory(false);
    }
  };

  const handleEditCategory = (oldName: string) => {
    if (editCategoryName.trim() && editCategoryName !== oldName) {
      // TODO: Add API call to update category
      console.log('Edit category:', oldName, '→', editCategoryName);
      setEditingCategory(null);
      setEditCategoryName('');
    }
  };

  const handleDeleteCategory = (category: string) => {
    if (confirm(`Delete "${category}" category? Links will be moved to "Other".`)) {
      // TODO: Add API call to delete category
      console.log('Delete category:', category);
    }
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
        className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden z-40 animate-fade-in"
        onClick={() => dispatch(setSidebarOpen(false))}
      />

      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-[#0B0F14]/95 backdrop-blur-xl border-r border-white/10 z-50 flex flex-col lg:translate-x-0 animate-slide-in">
        {/* Logo */}
        <div className="h-16 px-5 flex items-center gap-3 border-b border-white/10">
          <div className="w-9 h-9 bg-gradient-to-br from-primary via-secondary to-accent-purple rounded-xl flex items-center justify-center shadow-lg shadow-primary/30 animate-glow">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg bg-gradient-to-r from-white via-primary-light to-secondary bg-clip-text text-transparent">
              Linko
            </h1>
            <p className="text-[10px] text-muted-foreground">AI Knowledge Hub</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Main Navigation */}
          <div className="space-y-1">
            <button
              onClick={handleAllContent}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                !filters.category && filters.readStatus === undefined
                  ? 'bg-gradient-to-r from-primary/20 to-secondary/20 text-white border border-primary/30 shadow-lg shadow-primary/10'
                  : 'text-muted hover:text-foreground hover:bg-white/5'
              }`}
            >
              <Home className="w-4 h-4" />
              <span className="flex-1 text-left">All Content</span>
              {stats && (
                <span className="text-xs px-2 py-0.5 rounded-md bg-white/10 font-semibold">
                  {stats.total}
                </span>
              )}
            </button>

            <button
              onClick={() => handleReadStatusClick(false)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                filters.readStatus === false
                  ? 'bg-gradient-to-r from-warning/20 to-warning/10 text-warning border border-warning/30'
                  : 'text-muted hover:text-foreground hover:bg-white/5'
              }`}
            >
              <BookmarkX className="w-4 h-4" />
              <span className="flex-1 text-left">Unread</span>
              {stats && (
                <span className="text-xs px-2 py-0.5 rounded-md bg-white/10 font-semibold">
                  {stats.unread}
                </span>
              )}
            </button>

            <button
              onClick={() => handleReadStatusClick(true)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                filters.readStatus === true
                  ? 'bg-gradient-to-r from-success/20 to-success/10 text-success border border-success/30'
                  : 'text-muted hover:text-foreground hover:bg-white/5'
              }`}
            >
              <BookmarkCheck className="w-4 h-4" />
              <span className="flex-1 text-left">Read</span>
              {stats && (
                <span className="text-xs px-2 py-0.5 rounded-md bg-white/10 font-semibold">
                  {stats.read}
                </span>
              )}
            </button>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <div className="flex items-center justify-between px-3 mb-2">
              <div className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-muted-foreground" />
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Categories
                </h3>
              </div>
              <button
                onClick={() => setIsAddingCategory(true)}
                className="p-1 hover:bg-white/10 rounded-lg transition-colors group"
                title="Add category"
              >
                <Plus className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary" />
              </button>
            </div>

            <div className="space-y-0.5">
              {/* Add Category Input */}
              {isAddingCategory && (
                <div className="flex items-center gap-1 px-2 py-1.5 bg-white/5 rounded-lg border border-primary/30">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleAddCategory();
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
                    onClick={handleAddCategory}
                    className="p-1 hover:bg-success/20 rounded text-success"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingCategory(false);
                      setNewCategoryName('');
                    }}
                    className="p-1 hover:bg-error/20 rounded text-error"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Category List */}
              {categories.map((category) => {
                const count = getCategoryCount(category);
                const isActive = filters.category === category;
                const isEditing = editingCategory === category;
                const isHovered = hoveredCategory === category;
                
                return (
                  <div
                    key={category}
                    className="relative group"
                    onMouseEnter={() => setHoveredCategory(category)}
                    onMouseLeave={() => setHoveredCategory(null)}
                  >
                    {isEditing ? (
                      <div className="flex items-center gap-1 px-2 py-1.5 bg-white/5 rounded-lg border border-primary/30">
                        <input
                          type="text"
                          value={editCategoryName}
                          onChange={(e) => setEditCategoryName(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleEditCategory(category);
                            if (e.key === 'Escape') {
                              setEditingCategory(null);
                              setEditCategoryName('');
                            }
                          }}
                          className="flex-1 bg-transparent text-sm outline-none text-white"
                          autoFocus
                        />
                        <button
                          onClick={() => handleEditCategory(category)}
                          className="p-1 hover:bg-success/20 rounded text-success"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingCategory(null);
                            setEditCategoryName('');
                          }}
                          className="p-1 hover:bg-error/20 rounded text-error"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleCategoryClick(category)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-white/10 text-white'
                            : 'text-muted hover:text-foreground hover:bg-white/5'
                        }`}
                      >
                        <span className="text-base">{categoryIcons[category]}</span>
                        <span className="flex-1 text-left">{category}</span>
                        {count > 0 && (
                          <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${
                            isActive ? 'bg-white/20' : 'bg-white/5 group-hover:bg-white/10'
                          }`}>
                            {count}
                          </span>
                        )}
                        {isHovered && !isActive && (
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setEditingCategory(category);
                                setEditCategoryName(category);
                              }}
                              className="p-1 hover:bg-primary/20 rounded text-primary"
                              title="Edit"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteCategory(category);
                              }}
                              className="p-1 hover:bg-error/20 rounded text-error"
                              title="Delete"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Stats */}
        {stats && (
          <div className="p-4 border-t border-white/10">
            <div className="bg-gradient-to-br from-primary/10 via-secondary/10 to-accent-purple/10 rounded-xl p-3 border border-primary/20 shadow-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <span className="text-xs font-semibold text-white/90">Your Library</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <div className="text-lg font-bold bg-gradient-to-r from-white to-primary bg-clip-text text-transparent">{stats.total}</div>
                  <div className="text-[10px] text-muted-foreground">Total</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-success">{stats.read}</div>
                  <div className="text-[10px] text-muted-foreground">Read</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-warning">{stats.unread}</div>
                  <div className="text-[10px] text-muted-foreground">Unread</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
