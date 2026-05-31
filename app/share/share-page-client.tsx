'use client';

import { useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { addLink } from '@/store/slices/linksSlice';
import { addToast } from '@/store/slices/uiSlice';
import {
  enqueueShare,
  requestBackgroundSync,
  notifySW,
} from '@/lib/share-queue';
import { Loader2 } from 'lucide-react';
import BrandMark from '@/components/BrandMark';

// Extract the first URL from a block of text
function extractUrl(text: string): string | null {
  const m = text.match(/(https?:\/\/[^\s]+)/);
  return m ? m[0] : null;
}

export default function SharePageClient() {
  const router     = useRouter();
  const params     = useSearchParams();
  const dispatch   = useAppDispatch();
  const processed  = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    processed.current = true;

    const run = async () => {
      // ── Auth check ──────────────────────────────────────────────────────
      const token = localStorage.getItem('token');
      const user  = localStorage.getItem('user');

      if (!token || !user) {
        // Store shared content so login page can resume
        const sharedUrl   = params.get('url') || extractUrl(params.get('text') || '');
        const sharedTitle = params.get('title');
        if (sharedUrl) {
          sessionStorage.setItem('pendingSharedUrl', sharedUrl);
          if (sharedTitle) sessionStorage.setItem('pendingSharedTitle', sharedTitle);
        }
        router.replace('/login');
        return;
      }

      // ── Resolve what was shared ─────────────────────────────────────────
      const urlParam   = params.get('url')   || '';
      const textParam  = params.get('text')  || '';
      const titleParam = params.get('title') || '';

      // Files stashed by the SW in Cache Storage
      const pendingId  = params.get('pendingId');
      const fileCount  = parseInt(params.get('fileCount') || '0', 10);
      const fileNames  = params.get('fileNames')?.split(',').map(decodeURIComponent) || [];
      const fileTypes  = params.get('fileTypes')?.split(',') || [];

      const sharedUrl  = urlParam || extractUrl(textParam);

      // ── Ingest ──────────────────────────────────────────────────────────
      if (sharedUrl) {
        await ingestUrl(sharedUrl, titleParam, token);
      } else if (pendingId && fileCount > 0) {
        await ingestFiles(pendingId, fileCount, fileNames, fileTypes, token);
      } else {
        // Nothing useful shared
        dispatch(addToast({ message: 'Nothing to save', type: 'info' }));
        router.replace('/');
      }
    };

    run();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── URL ingestion ────────────────────────────────────────────────────────
  async function ingestUrl(url: string, title: string, token: string) {
    try {
      await dispatch(addLink({ url, source: 'pwa-share' })).unwrap();
      onSuccess('Saved to Smriti');
    } catch (err: any) {
      if (!navigator.onLine) {
        // Queue for later
        await enqueueShare({ url, title, text: undefined, token }).catch(() => {});
        requestBackgroundSync();
        onQueued();
      } else {
        onError(err?.message || 'Failed to save');
      }
    }
  }

  // ── File ingestion via FormData → existing /api/share → backend ──────────
  async function ingestFiles(
    pendingId: string,
    count: number,
    names: string[],
    types: string[],
    token: string
  ) {
    try {
      const cache = await caches.open('smriti-pending-files');
      const formData = new FormData();
      formData.append('source', 'pwa-share');

      for (let i = 0; i < count; i++) {
        const cacheKey = `/${pendingId}/${i}/${names[i]}`;
        const response = await cache.match(cacheKey);
        if (!response) continue;
        const blob = await response.blob();
        const file = new File([blob], names[i], { type: types[i] || blob.type });
        formData.append('files', file);
        await cache.delete(cacheKey);
      }

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(`${apiUrl}/links/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || `Upload failed (${res.status})`);
      }

      onSuccess('Saved to Smriti');
    } catch (err: any) {
      if (!navigator.onLine) {
        onQueued();
      } else {
        onError(err?.message || 'Failed to upload file');
      }
    }
  }

  function onSuccess(message: string) {
    dispatch(addToast({ message, type: 'success' }));
    notifySW('Saved to Smriti', message);
    returnToPreviousApp();
  }

  function onQueued() {
    dispatch(addToast({ message: 'Queued — will save when online', type: 'info' }));
    returnToPreviousApp();
  }

  function onError(message: string) {
    dispatch(addToast({ message, type: 'error' }));
    setTimeout(() => router.replace('/'), 2000);
  }

  function returnToPreviousApp() {
    try {
      window.close();
    } catch {
      // Ignore browsers that block closing the current window.
    }

    setTimeout(() => {
      if (window.closed) return;

      if (window.history.length > 1) {
        window.history.back();
      } else {
        router.replace('/');
      }
    }, 50);
  }

  // Minimal loading UI — shown only for the brief moment before redirect
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <BrandMark compact />
        <Loader2 className="h-7 w-7 animate-spin text-indigo-500" />
        <p className="text-sm text-gray-500">Saving to Smriti…</p>
      </div>
    </div>
  );
}
