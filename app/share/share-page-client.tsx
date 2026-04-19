'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { addLink } from '@/store/slices/linksSlice';
import { addToast } from '@/store/slices/uiSlice';
import { Loader2, CheckCircle2, XCircle, Share2 } from 'lucide-react';

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
    <div className="flex items-center justify-center min-h-screen bg-[#0B0F14]">
      <div className="text-center space-y-6 p-8 max-w-md">
        {/* Icon */}
        <div className="flex justify-center">
          {status === 'processing' && (
            <Loader2 className="w-16 h-16 animate-spin text-blue-500" />
          )}
          {status === 'success' && (
            <CheckCircle2 className="w-16 h-16 text-green-500" />
          )}
          {status === 'error' && (
            <XCircle className="w-16 h-16 text-red-500" />
          )}
          {status === 'auth-required' && (
            <Share2 className="w-16 h-16 text-yellow-500" />
          )}
        </div>

        {/* Message */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-white">
            {status === 'processing' && 'Processing...'}
            {status === 'success' && 'Success!'}
            {status === 'error' && 'Error'}
            {status === 'auth-required' && 'Login Required'}
          </h2>
          <p className="text-gray-400 text-sm break-words">{message}</p>
        </div>

        {/* Progress indicator */}
        {status === 'processing' && (
          <div className="w-full bg-gray-800 rounded-full h-1.5">
            <div className="bg-blue-500 h-1.5 rounded-full animate-pulse" style={{ width: '60%' }}></div>
          </div>
        )}
      </div>
    </div>
  );
}