'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { addLink } from '@/store/slices/linksSlice';
import { addToast } from '@/store/slices/uiSlice';
import { Loader2 } from 'lucide-react';

export default function SharePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const handleShare = async () => {
      // Get shared data from URL params
      const url = searchParams.get('url');
      const text = searchParams.get('text');
      const title = searchParams.get('title');

      // Extract URL from text if not in url param
      const sharedUrl = url || extractUrlFromText(text || '');

      if (!sharedUrl) {
        dispatch(addToast({
          message: 'No URL found in shared content',
          type: 'error',
        }));
        router.push('/');
        return;
      }

      try {
        await dispatch(addLink({ url: sharedUrl, source: 'web' })).unwrap();
        dispatch(addToast({
          message: 'Link added successfully!',
          type: 'success',
        }));
        router.push('/');
      } catch (error: any) {
        dispatch(addToast({
          message: error.message || 'Failed to add link',
          type: 'error',
        }));
        router.push('/');
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
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto" />
        <p className="text-lg">Processing shared link...</p>
      </div>
    </div>
  );
}
