'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setFilters, clearFilters, fetchLinks } from '@/store/slices/linksSlice';
import { setSidebarOpen } from '@/store/slices/uiSlice';
import { Home, Monitor, Briefcase, Palette, Megaphone, Code2, Cpu, Package, MoreHorizontal, BookmarkCheck, BookmarkX, Plus, Check, X, TrendingUp, LayoutDashboard } from 'lucide-react';
import { Category } from '@/types';
import { useState } from 'react';
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

const categoryIcons: Record<Category, typeof Monitor> = {
  Technology: Monitor,
  Business: Briefcase,
  Design: Palette,
  Marketing: Megaphone,
  Development: Code2,
  'AI/ML': Cpu,
  Product: Package,
  Other: MoreHorizontal,
};

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const pathname = usePathname();
  const { sidebarOpen } = useAppSelector((state) => state.ui);
  const { filters, stats } = useAppSelector((state) => state.links);

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

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

  const isDashboardPage = pathname?.startsWith('/dashboard');

  if (!sidebarOpen) return null;

  const navItemClass = (active: boolean) =>
    `flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
      active
        ? 'bg-indigo-50 text-indigo-700'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;

  return (
    <>
      {/* Mobile overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/30 lg:hidden animate-fade-in"
        onClick={() => dispatch(setSidebarOpen(false))}
      />

      <aside className="fixed left-0 top-0 z-50 flex h-screen w-72 max-w-[86vw] flex-col border-r border-gray-200 bg-white animate-slide-in">
        {/* Brand */}
        <div className="border-b border-gray-100 px-5 py-4">
          <BrandMark compact />
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {/* Dashboard nav */}
          <div className="space-y-1">
            <Link
              href="/dashboard"
              className={navItemClass(Boolean(isDashboardPage))}
            >
              <LayoutDashboard className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">Dashboard</span>
              {stats && (
                <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-xs font-semibold text-gray-600">
                  {stats.total}
                </span>
              )}
            </Link>
          </div>

          {/* Main nav */}
          <div className="space-y-1">
            <button
              onClick={handleAllContent}
              className={navItemClass(!filters.category && filters.readStatus === undefined)}
            >
              <Home className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">All Content</span>
              {stats && (
                <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-xs font-semibold text-gray-600">
                  {stats.total}
                </span>
              )}
            </button>

            <button
              onClick={() => handleReadStatusClick(false)}
              className={navItemClass(filters.readStatus === false)}
            >
              <BookmarkX className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">Unread</span>
              {stats && (
                <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-xs font-semibold text-gray-600">
                  {stats.unread}
                </span>
              )}
            </button>

            <button
              onClick={() => handleReadStatusClick(true)}
              className={navItemClass(filters.readStatus === true)}
            >
              <BookmarkCheck className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-left">Read</span>
              {stats && (
                <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-xs font-semibold text-gray-600">
                  {stats.read}
                </span>
              )}
            </button>
          </div>

          {/* Categories */}
          <div>
            <div className="mb-2 flex items-center justify-between px-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                Categories
              </p>
              <button
                onClick={() => setIsAddingCategory(true)}
                className="rounded-md p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                title="Add category"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="space-y-0.5">
              {isAddingCategory && (
                <div className="flex items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-2 animate-scale-in">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === 'Escape') {
                        setIsAddingCategory(false);
                        setNewCategoryName('');
                      }
                    }}
                    placeholder="Category name..."
                    className="flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
                    autoFocus
                  />
                  <button
                    onClick={() => { setIsAddingCategory(false); setNewCategoryName(''); }}
                    className="rounded p-0.5 text-green-600 hover:bg-green-100"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => { setIsAddingCategory(false); setNewCategoryName(''); }}
                    className="rounded p-0.5 text-gray-400 hover:bg-gray-200"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {categories.map((category) => {
                const count = getCategoryCount(category);
                const isActive = filters.category === category;
                const CategoryIcon = categoryIcons[category];

                return (
                  <button
                    key={category}
                    onClick={() => handleCategoryClick(category)}
                    className={navItemClass(isActive)}
                  >
                    <CategoryIcon className="h-4 w-4 shrink-0 text-gray-500" />
                    <span className="flex-1 text-left">{category}</span>
                    {count > 0 && (
                      <span className="rounded-md bg-gray-100 px-1.5 py-0.5 text-xs font-semibold text-gray-500">
                        {count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer stats */}
        {stats && (
          <div className="border-t border-gray-100 p-4">
            <div className="rounded-xl bg-gray-50 p-4">
              <div className="mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-indigo-500" />
                <span className="text-xs font-semibold text-gray-700">Your library</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <div className="text-xl font-bold text-gray-900">{stats.total}</div>
                  <div className="text-[10px] text-gray-500">Total</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-indigo-600">{stats.read}</div>
                  <div className="text-[10px] text-gray-500">Read</div>
                </div>
                <div>
                  <div className="text-xl font-bold text-gray-500">{stats.unread}</div>
                  <div className="text-[10px] text-gray-500">Unread</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
