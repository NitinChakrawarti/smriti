'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchLinks, fetchStats } from '@/store/slices/linksSlice';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import LinkGrid from '@/components/LinkGrid';
import AddLinkModal from '@/components/AddLinkModal';
import Toast from '@/components/Toast';
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import EmptyState from '@/components/EmptyState';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const dispatch = useAppDispatch();
  const { links, loading } = useAppSelector((state) => state.links);
  const { sidebarOpen, searchQuery } = useAppSelector((state) => state.ui);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  const filteredLinks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) return links;

    return links.filter((link) => {
      const searchableText = [
        link.title,
        link.description,
        link.summary,
        link.url,
        link.category,
        ...link.tags,
      ]
        .join(' ')
        .toLowerCase();

      return searchableText.includes(query);
    });
  }, [links, searchQuery]);

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

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <div className={`flex min-w-0 flex-1 flex-col transition-all duration-300 ${sidebarOpen ? 'lg:ml-72' : 'ml-0'}`}>
        <Header />

        <main className="flex-1">
          <div className="content-shell">
            {loading ? (
              <LoadingSkeleton />
            ) : filteredLinks.length === 0 ? (
              searchQuery.trim() ? (
                <div className="surface-card flex min-h-[40vh] items-center justify-center p-8 text-center">
                  <div className="max-w-md">
                    <h2 className="text-xl font-semibold text-gray-900">No matching links</h2>
                    <p className="mt-3 text-sm leading-relaxed text-gray-500">
                      Nothing matched “{searchQuery}”. Try a title, tag, category, or part of the URL.
                    </p>
                  </div>
                </div>
              ) : (
                <EmptyState />
              )
            ) : links.length === 0 ? (
              <EmptyState />
            ) : (
              <LinkGrid links={filteredLinks} />
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
