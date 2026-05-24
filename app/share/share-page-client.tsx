'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { addLink } from '@/store/slices/linksSlice';
import { addToast } from '@/store/slices/uiSlice';
import { Loader2, CheckCircle2, XCircle, Share2, Sparkles, Bot, Shield } from 'lucide-react';
import BrandMark from '@/components/BrandMark';

export default function SharePageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [status, setStatus] = useState<'processing' | 'success' | 'error' | 'auth-required'>('processing');
  const [message, setMessage] = useState('Processing shared link...');

  useEffect(() => {
    const handleShare = async () => {
      // Check authentication first
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');

      if (!token || !user) {
        setStatus('auth-required');
        setMessage('Please login to save shared links');
        
        // Store the shared URL in sessionStorage to process after login
        const url = searchParams.get('url');
        const text = searchParams.get('text');
        const title = searchParams.get('title');
        
        const sharedUrl = url || extractUrlFromText(text || '');
        if (sharedUrl) {
          sessionStorage.setItem('pendingSharedUrl', sharedUrl);
          if (title) sessionStorage.setItem('pendingSharedTitle', title);
        }
        
        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/login');
        }, 2000);
        return;
      }

      // Get shared data from URL params
      const url = searchParams.get('url');
      const text = searchParams.get('text');
      const title = searchParams.get('title');

      // Extract URL from text if not in url param
      const sharedUrl = url || extractUrlFromText(text || '');

      if (!sharedUrl) {
        setStatus('error');
        setMessage('No URL found in shared content');
        
        setTimeout(() => {
          router.push('/');
        }, 2000);
        return;
      }

      try {
        setMessage(`Saving: ${title || sharedUrl}`);
        await dispatch(addLink({ url: sharedUrl, source: 'pwa-share' })).unwrap();
        
        setStatus('success');
        setMessage('Link saved successfully! AI is categorizing it...');
        
        dispatch(addToast({
          message: 'Link added and categorized by AI!',
          type: 'success',
        }));
        
        // Redirect to home after 1.5 seconds
        setTimeout(() => {
          router.push('/');
        }, 1500);
      } catch (error: any) {
        setStatus('error');
        setMessage(error.message || 'Failed to save link');
        
        dispatch(addToast({
          message: error.message || 'Failed to add link',
          type: 'error',
        }));
        
        // Redirect to home after 2 seconds
        setTimeout(() => {
          router.push('/');
        }, 2000);
      }
    };

    handleShare();
  }, [searchParams, dispatch, router]);

  const extractUrlFromText = (text: string): string | null => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const match = text.match(urlRegex);
    return match ? match[0] : null;
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="section-shell w-full max-w-2xl text-center">
        <div className="mx-auto mb-6 flex justify-center">
          <BrandMark compact />
        </div>

        <div className="flex justify-center">
          {status === 'processing' && (
            <Loader2 className="w-16 h-16 animate-spin text-[#4d79ff]" />
          )}
          {status === 'success' && (
            <CheckCircle2 className="w-16 h-16 text-[#27d7c4]" />
          )}
          {status === 'error' && (
            <XCircle className="w-16 h-16 text-red-400" />
          )}
          {status === 'auth-required' && (
            <Share2 className="w-16 h-16 text-[#7c5cff]" />
          )}
        </div>

        <div className="mt-6 space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-white">
            {status === 'processing' && 'Processing...'}
            {status === 'success' && 'Success!'}
            {status === 'error' && 'Error'}
            {status === 'auth-required' && 'Login Required'}
          </h2>
          <p className="break-words text-sm leading-7 text-slate-400">{message}</p>
        </div>

        <div className="mt-8 grid gap-3 text-left sm:grid-cols-3">
          {[
            ['Save', 'Capture the URL'],
            ['Enrich', 'AI cleans and tags'],
            ['Store', 'Add to your vault'],
          ].map(([title, text]) => (
            <div key={title} className="metric-shell rounded-2xl text-left">
              <div className="mb-2 inline-flex rounded-xl bg-white/10 p-2 text-[#27d7c4]">
                <Sparkles className="h-4 w-4" />
              </div>
              <p className="text-sm font-semibold text-white">{title}</p>
              <p className="text-sm text-slate-400">{text}</p>
            </div>
          ))}
        </div>

        {status === 'processing' && (
          <div className="mt-8 h-1.5 w-full rounded-full bg-white/10">
            <div className="h-1.5 w-[60%] animate-pulse rounded-full bg-gradient-to-r from-[#7c5cff] via-[#4d79ff] to-[#27d7c4]" />
          </div>
        )}
      </div>
    </div>
  );
}