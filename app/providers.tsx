'use client';

import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';

function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    // Register the SW
    navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {});

    // Request notification permission (non-blocking — user can ignore)
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {});
    }

    // Drain the offline queue when the browser/PWA comes back online
    const handleOnline = async () => {
      try {
        const { getPendingShares, markShareDone, incrementRetry, clearDoneShares, notifySW } =
          await import('@/lib/share-queue');

        const token = localStorage.getItem('token');
        if (!token) return;

        const pending = await getPendingShares();
        for (const item of pending) {
          if (item.retries > 4) continue; // give up after 5 attempts
          try {
            const res = await fetch('/api/share/ingest', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ url: item.url, text: item.text, title: item.title, token }),
            });
            if (res.ok && item.id != null) {
              await markShareDone(item.id);
              notifySW('Saved to Smriti', item.url || item.text || 'Content saved');
            } else if (item.id != null) {
              await incrementRetry(item.id);
            }
          } catch {
            if (item.id != null) await incrementRetry(item.id).catch(() => {});
          }
        }

        await clearDoneShares();
      } catch {
        // Queue module failed to load — silently ignore
      }
    };

    window.addEventListener('online', handleOnline);

    // Also try immediately in case we missed an earlier reconnect
    if (navigator.onLine) handleOnline();

    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <ServiceWorkerRegistrar />
      {children}
    </Provider>
  );
}
