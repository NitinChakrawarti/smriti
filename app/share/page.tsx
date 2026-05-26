import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import SharePageClient from './share-page-client';

function ShareFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="flex flex-col items-center gap-4 text-center">
        <Loader2 className="h-7 w-7 animate-spin text-indigo-500" />
        <p className="text-sm text-gray-500">Saving to Smriti…</p>
      </div>
    </div>
  );
}

export default function SharePage() {
  return (
    <Suspense fallback={<ShareFallback />}>
      <SharePageClient />
    </Suspense>
  );
}
