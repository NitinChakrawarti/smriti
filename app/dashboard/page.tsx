'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchStats } from '@/store/slices/linksSlice';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import InstallBanner from '@/components/InstallBanner';
import AddLinkModal from '@/components/AddLinkModal';
import Toast from '@/components/Toast';
import {
  BookCheck,
  BookOpen,
  Library,
  Loader2,
  ArrowRight,
  Sparkles,
  TrendingUp,
  FolderOpen,
} from 'lucide-react';

function pct(value: number, total: number) {
  if (!total) return 0;
  return Math.round((value / total) * 100);
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { stats } = useAppSelector((state) => state.links);
  const { sidebarOpen } = useAppSelector((state) => state.ui);
  const [checking, setChecking] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      window.location.href = '/landing';
      return;
    }

    try {
      const parsed = JSON.parse(user);
      setUserName(parsed.name || '');
    } catch {}

    setIsAuthenticated(true);
    setChecking(false);

    (async () => {
      try {
        await dispatch(fetchStats()).unwrap();
      } finally {
        setLoadingStats(false);
      }
    })();
  }, [dispatch]);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-slate-950">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400 dark:text-slate-500" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const total = stats?.total ?? 0;
  const read = stats?.read ?? 0;
  const unread = stats?.unread ?? 0;
  const categories = stats?.categories ?? [];
  const readPercent = pct(read, total);

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-slate-950">
      <Sidebar />

      <div
        className={`flex min-w-0 flex-1 flex-col transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-72' : 'ml-0'
        }`}
      >
        <Header />

        <div className="content-shell pt-4">
          <InstallBanner />
        </div>

        <main className="flex-1 overflow-y-auto">
          <div className="content-shell space-y-8 pb-12">
            {/* Greeting + CTA */}
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight text-gray-900 sm:text-3xl dark:text-slate-100">
                  {getGreeting()}{userName ? `, ${userName}` : ''} 👋
                </h1>
                <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">
                  Here's what's happening in your knowledge vault.
                </p>
              </div>
              <div className="flex gap-2">
                <Link href="/" className="btn-secondary">
                  Browse
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Stat cards */}
            <section className="grid gap-4 sm:grid-cols-3">
              {/* Total */}
              <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-indigo-50 to-white p-5 dark:border-slate-800 dark:from-indigo-500/10 dark:to-slate-900">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-300">
                    <Library className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Total Saved</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                      {loadingStats ? '—' : total}
                    </p>
                  </div>
                </div>
                <Sparkles className="absolute -bottom-2 -right-2 h-16 w-16 text-indigo-100 dark:text-indigo-500/10" />
              </div>

              {/* Read */}
              <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-emerald-50 to-white p-5 dark:border-slate-800 dark:from-emerald-500/10 dark:to-slate-900">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-300">
                    <BookCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Read</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                      {loadingStats ? '—' : read}
                    </p>
                  </div>
                </div>
                {total > 0 && (
                  <p className="mt-3 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                    {readPercent}% completed
                  </p>
                )}
              </div>

              {/* Unread */}
              <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-gradient-to-br from-amber-50 to-white p-5 dark:border-slate-800 dark:from-amber-500/10 dark:to-slate-900">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-500/20 dark:text-amber-300">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-slate-400">Unread</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                      {loadingStats ? '—' : unread}
                    </p>
                  </div>
                </div>
                {total > 0 && (
                  <p className="mt-3 text-xs font-medium text-amber-600 dark:text-amber-400">
                    {pct(unread, total)}% remaining
                  </p>
                )}
              </div>
            </section>

            {/* Reading progress */}
            {total > 0 && !loadingStats && (
              <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-slate-100">Reading Progress</h2>
                </div>
                <div className="flex items-center gap-4">
                  {/* Circular progress */}
                  <div className="relative h-20 w-20 shrink-0">
                    <svg className="h-20 w-20 -rotate-90" viewBox="0 0 36 36">
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="text-gray-100 dark:text-slate-800"
                      />
                      <path
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={`${readPercent}, 100`}
                        strokeLinecap="round"
                        className="text-indigo-500 dark:text-indigo-400"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-900 dark:text-slate-100">{readPercent}%</span>
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-slate-300">
                        You've read <span className="font-semibold text-gray-900 dark:text-slate-100">{read}</span> of{' '}
                        <span className="font-semibold text-gray-900 dark:text-slate-100">{total}</span> items
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-slate-800">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                        style={{ width: `${Math.max(2, readPercent)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      {unread === 0
                        ? '🎉 All caught up! Great job.'
                        : `${unread} item${unread === 1 ? '' : 's'} waiting for you`}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* Categories breakdown */}
            <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                  <FolderOpen className="h-4 w-4 text-gray-500 dark:text-slate-400" />
                  <h2 className="text-sm font-semibold text-gray-900 dark:text-slate-100">Categories</h2>
                </div>
                {categories.length > 0 && (
                  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-slate-800 dark:text-slate-300">
                    {categories.length} active
                  </span>
                )}
              </div>

              {loadingStats ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-16 rounded-xl skeleton" />
                  ))}
                </div>
              ) : categories.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <FolderOpen className="h-10 w-10 text-gray-200 dark:text-slate-700 mb-3" />
                  <p className="text-sm text-gray-500 dark:text-slate-400">
                    Save something to see categories here.
                  </p>
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {categories.map((category) => {
                    const percent = pct(category.count, total);
                    return (
                      <div
                        key={category._id}
                        className="group flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-4 transition-colors hover:border-indigo-200 hover:bg-indigo-50/30 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:border-indigo-500/30 dark:hover:bg-indigo-500/5"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-sm font-medium text-gray-700 dark:text-slate-200 truncate">
                              {category._id}
                            </span>
                            <span className="ml-2 shrink-0 text-xs font-semibold text-gray-500 dark:text-slate-400">
                              {category.count}
                            </span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-gray-200 dark:bg-slate-700">
                            <div
                              className="h-full rounded-full bg-indigo-500 dark:bg-indigo-400 transition-all duration-500"
                              style={{ width: `${Math.max(6, percent)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Quick tip / empty state */}
            {total === 0 && !loadingStats && (
              <section className="rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/50 p-8 text-center dark:border-slate-700 dark:bg-slate-900/50">
                <Sparkles className="mx-auto h-10 w-10 text-indigo-400 dark:text-indigo-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                  Start building your knowledge vault
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-slate-400 max-w-md mx-auto">
                  Save links, images, and PDFs. Smriti will automatically organize, summarize, and tag everything with AI.
                </p>
                <Link href="/" className="btn-primary mt-5 inline-flex">
                  Get started
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </section>
            )}
          </div>
        </main>

        <AddLinkModal />
        <Toast />
      </div>
    </div>
  );
}
