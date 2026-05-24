'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchStats } from '@/store/slices/linksSlice';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import AddLinkModal from '@/components/AddLinkModal';
import Toast from '@/components/Toast';
import { BarChart3, BookCheck, BookOpen, Loader2, Sparkles, ArrowRight } from 'lucide-react';

function formatPercent(value: number) {
  return `${Math.round(value)}%`;
}

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const { stats } = useAppSelector((state) => state.links);
  const { sidebarOpen } = useAppSelector((state) => state.ui);
  const [checking, setChecking] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      window.location.href = '/landing';
      return;
    }

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
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-7 w-7 animate-spin text-indigo-500" />
          <p className="text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const total = stats?.total ?? 0;
  const read = stats?.read ?? 0;
  const unread = stats?.unread ?? 0;
  const readRate = total > 0 ? (read / total) * 100 : 0;
  const unreadRate = total > 0 ? (unread / total) * 100 : 0;
  const topCategories = stats?.categories ?? [];

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <div className={`flex min-w-0 flex-1 flex-col transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : 'ml-0'}`}>
        <Header />

        <main className="flex-1">
          <div className="content-shell space-y-8">
            <section className="relative overflow-hidden rounded-[2rem] border border-gray-200 bg-white px-6 py-8 shadow-sm sm:px-8 sm:py-10">
              <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute left-1/2 top-[-120px] h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-100/50 blur-3xl" />
                <div className="absolute right-[-80px] top-20 h-56 w-56 rounded-full bg-sky-100/60 blur-3xl" />
              </div>

              <div className="mx-auto max-w-3xl text-center animate-fade-in-up">
                <span className="chip mb-5 inline-flex">
                  <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                  Dashboard overview
                </span>

                <h1 className="text-3xl font-semibold tracking-tight text-gray-900 sm:text-4xl lg:text-5xl">
                  Your saved links, at a glance.
                </h1>

                <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-500 sm:text-lg">
                  A concise view of everything coming from <span className="font-medium text-gray-700">/links/stats</span> so you can see the size of the library, the read balance, and the categories that dominate it.
                </p>

                <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link href="/" className="btn-primary w-full sm:w-auto">
                    Open library
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <span className="chip w-full justify-center sm:w-auto">
                    Updated from live stats data
                  </span>
                </div>
              </div>
            </section>

            <section className="grid gap-6 md:grid-cols-3">
              {[
                {
                  title: 'Total saved',
                  value: total,
                  helper: 'All captured items in your vault',
                  icon: BarChart3,
                  accent: 'bg-indigo-50 text-indigo-600',
                  bar: 'bg-indigo-500',
                },
                {
                  title: 'Read',
                  value: read,
                  helper: total > 0 ? `${formatPercent(readRate)} of your library` : 'No items yet',
                  icon: BookCheck,
                  accent: 'bg-emerald-50 text-emerald-600',
                  bar: 'bg-emerald-500',
                },
                {
                  title: 'Unread',
                  value: unread,
                  helper: total > 0 ? `${formatPercent(unreadRate)} waiting to revisit` : 'No items yet',
                  icon: BookOpen,
                  accent: 'bg-amber-50 text-amber-600',
                  bar: 'bg-amber-500',
                },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <article key={item.title} className="surface-card animate-fade-in-up p-6 sm:p-7">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">{item.title}</p>
                        <div className="mt-2 text-4xl font-semibold tracking-tight text-gray-950">
                          {loadingStats ? '—' : item.value}
                        </div>
                        <p className="mt-2 text-sm leading-6 text-gray-500">{item.helper}</p>
                      </div>

                      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${item.accent}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                    </div>

                    <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className={`h-full rounded-full ${item.bar}`}
                        style={{ width: loadingStats ? '0%' : `${Math.max(8, Math.min(100, item.value ? (item.value / Math.max(total, 1)) * 100 : 0))}%` }}
                      />
                    </div>
                  </article>
                );
              })}
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
              <div className="surface-card animate-fade-in-up p-6 sm:p-7">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">Category distribution</h2>
                    <p className="mt-1 text-sm text-gray-500">A light breakdown of the categories returned by the API.</p>
                  </div>
                  <span className="chip hidden sm:inline-flex">{topCategories.length} categories</span>
                </div>

                <div className="mt-6 space-y-4">
                  {loadingStats && (
                    <div className="space-y-3">
                      {[...Array(4)].map((_, index) => (
                        <div key={index} className="rounded-2xl border border-gray-100 p-4">
                          <div className="h-4 w-32 rounded-full skeleton" />
                          <div className="mt-4 h-2 rounded-full skeleton" />
                        </div>
                      ))}
                    </div>
                  )}

                  {!loadingStats && topCategories.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
                      No category stats yet.
                    </div>
                  )}

                  {!loadingStats && topCategories.map((category, index) => {
                    const percent = total > 0 ? (category.count / total) * 100 : 0;
                    const palette = [
                      'bg-indigo-500',
                      'bg-sky-500',
                      'bg-emerald-500',
                      'bg-amber-500',
                    ];
                    const barColor = palette[index % palette.length];

                    return (
                      <div key={category._id} className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{category._id}</p>
                            <p className="mt-1 text-xs text-gray-500">{formatPercent(percent)} of total</p>
                          </div>
                          <div className="text-right">
                            <p className="text-lg font-semibold text-gray-900">{category.count}</p>
                            <p className="text-xs text-gray-500">items</p>
                          </div>
                        </div>

                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
                          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${Math.max(8, percent)}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-6">
                <div className="surface-card animate-fade-in-up p-6 sm:p-7">
                  <h2 className="text-lg font-semibold text-gray-900">Reading balance</h2>
                  <p className="mt-1 text-sm text-gray-500">A simple split that matches the rest of the app’s calm visual language.</p>

                  <div className="mt-6 space-y-5">
                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm text-gray-600">
                        <span>Read</span>
                        <span>{loadingStats ? '—' : formatPercent(readRate)}</span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                        <div className="h-full rounded-full bg-emerald-500" style={{ width: loadingStats ? '0%' : `${readRate}%` }} />
                      </div>
                    </div>

                    <div>
                      <div className="mb-2 flex items-center justify-between text-sm text-gray-600">
                        <span>Unread</span>
                        <span>{loadingStats ? '—' : formatPercent(unreadRate)}</span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                        <div className="h-full rounded-full bg-amber-500" style={{ width: loadingStats ? '0%' : `${unreadRate}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="surface-card animate-fade-in-up p-6 sm:p-7">
                  <h2 className="text-lg font-semibold text-gray-900">Status snapshot</h2>
                  <p className="mt-1 text-sm text-gray-500">A quick check of the main counts in one compact block.</p>
                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-emerald-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">Read</p>
                      <p className="mt-2 text-2xl font-semibold text-emerald-900">{loadingStats ? '—' : read}</p>
                    </div>
                    <div className="rounded-2xl bg-amber-50 p-4">
                      <p className="text-xs font-medium uppercase tracking-wide text-amber-700">Unread</p>
                      <p className="mt-2 text-2xl font-semibold text-amber-900">{loadingStats ? '—' : unread}</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </main>

        <AddLinkModal />
        <Toast />
      </div>
    </div>
  );
}