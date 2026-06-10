'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchLinks, fetchStats, setPage } from '@/store/slices/linksSlice';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import LinkGrid from '@/components/LinkGrid';
import Pagination from '@/components/Pagination';
import AddLinkModal from '@/components/AddLinkModal';
import Toast from '@/components/Toast';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import EmptyState from '@/components/EmptyState';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const dispatch = useAppDispatch();
  const { links, loading, pagination, filters } = useAppSelector((state) => state.links);
  const { sidebarOpen } = useAppSelector((state) => state.ui);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  const activeSearch = filters.search?.trim() || '';

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (!token || !user) {
      window.location.href = '/landing';
      return;
    }

    setIsAuthenticated(true);
    setChecking(false);
    dispatch(fetchLinks());
    dispatch(fetchStats());
  }, [dispatch]);

  const handlePageChange = (page: number) => {
    dispatch(setPage(page));
    dispatch(fetchLinks());
    if (typeof document !== 'undefined') {
      document.querySelector('main')?.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-slate-950">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400 dark:text-slate-500" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="flex h-screen overflow-hidden bg-white dark:bg-slate-950">
      <Sidebar />

      <div
        className={`flex min-w-0 flex-1 flex-col transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-72' : 'ml-0'
        }`}
      >
        <Header />

        <main className="flex-1 overflow-y-auto">
          <div className="content-shell">
            {loading ? (
              <LoadingSkeleton />
            ) : links.length === 0 ? (
              activeSearch ? (
                <div className="surface-card flex min-h-[40vh] items-center justify-center p-8 text-center">
                  <div className="max-w-md">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
                      No matches
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-gray-500 dark:text-slate-400">
                      Nothing matched “{activeSearch}”
                      {filters.category ? ` in ${filters.category}` : ''}. Try a different term
                      {filters.category ? ' or clear the category filter' : ''}.
                    </p>
                  </div>
                </div>
              ) : (
                <EmptyState />
              )
            ) : (
              <>
                <LinkGrid links={links} />
                {pagination && (
                  <Pagination
                    page={pagination.page}
                    pages={pagination.pages}
                    total={pagination.total}
                    limit={pagination.limit}
                    onPageChange={handlePageChange}
                  />
                )}
              </>
            )}
          </div>
        </main>
      </div>

      <AddLinkModal />
      <Toast />
      <PWAInstallPrompt />
    </div>
  );
}
