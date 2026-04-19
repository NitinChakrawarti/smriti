import { Suspense } from 'react';
import SharePageClient from './share-page-client';

export default function SharePage() {
  return (
    <Suspense fallback={null}>
      <SharePageClient />
    </Suspense>
  );
}