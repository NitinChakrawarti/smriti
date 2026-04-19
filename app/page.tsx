'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchLinks, fetchStats } from '@/store/slices/linksSlice';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import LinkGrid from '@/components/LinkGrid';
import AddLinkModal from '@/components/AddLinkModal';
import Toast from '@/components/Toast';
import EmptyState from '@/components/EmptyState';
import LoadingSkeleton from '@/components/LoadingSkeleton';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { links, loading } = useAppSelector((state) => state.links);
  const { sidebarOpen } = useAppSelector((state) => state.ui);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    console.log('🏠 Home page: Checking authentication...');
    
    // Check authentication
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    console.log('🔑 Token from storage:', token ? 'EXISTS' : 'MISSING');
    console.log('👤 User from storage:', user ? 'EXISTS' : 'MISSING');

    if (!token || !user) {
      console.log('❌ Not authenticated, redirecting to landing...');
      // Redirect to landing page instead of login
      window.location.href = '/landing';
      return;
    }

    console.log('✅ Authenticated! Loading dashboard...');
    setIsAuthenticated(true);
    setChecking(false);

    // Fetch data
    dispatch(fetchLinks());
    dispatch(fetchStats());
  }, [dispatch]);

  // Show loading while checking auth
  if (checking) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#0B0F14]">
        <div className="text-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex h-screen bg-[#0B0F14]">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        {/* Header */}
        <Header />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1600px] mx-auto p-6 lg:p-8">
            {loading ? (
              <LoadingSkeleton />
            ) : links.length === 0 ? (
              <EmptyState />
            ) : (
              <LinkGrid links={links} />
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <AddLinkModal />

      {/* Toast Notifications */}
      <Toast />
    </div>
  );
}
