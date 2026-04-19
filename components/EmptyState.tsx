'use client';

import { useAppDispatch } from '@/store/hooks';
import { setAddLinkModalOpen } from '@/store/slices/uiSlice';
import { Plus, Link as LinkIcon } from 'lucide-react';

export default function EmptyState() {
  const dispatch = useAppDispatch();

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center space-y-6 max-w-md">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="p-6 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full">
            <LinkIcon className="w-16 h-16 text-primary" />
          </div>
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h2 className="text-2xl font-bold">No links yet</h2>
          <p className="text-muted">
            Start building your knowledge base by adding your first link.
            Our AI will automatically process and organize it for you.
          </p>
        </div>

        {/* Action */}
        <button
          onClick={() => dispatch(setAddLinkModalOpen(true))}
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors font-medium"
        >
          <Plus className="w-5 h-5" />
          Add Your First Link
        </button>

        {/* Features */}
        <div className="pt-6 space-y-3 text-sm text-muted">
          <p className="font-medium text-foreground">What happens next?</p>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span>AI generates a summary</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span>Automatic tag extraction</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-primary">✓</span>
              <span>Smart category classification</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
