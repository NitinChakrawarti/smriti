'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setAddLinkModalOpen, addToast } from '@/store/slices/uiSlice';
import { addLink, fetchStats } from '@/store/slices/linksSlice';
import { X, Link as LinkIcon, Loader2 } from 'lucide-react';

export default function AddLinkModal() {
  const dispatch = useAppDispatch();
  const { addLinkModalOpen } = useAppSelector((state) => state.ui);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    dispatch(setAddLinkModalOpen(false));
    setUrl('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      dispatch(addToast({
        message: 'Please enter a URL',
        type: 'error',
      }));
      return;
    }

    setLoading(true);

    try {
      await dispatch(addLink({ url: url.trim(), source: 'web' })).unwrap();
      dispatch(fetchStats());
      dispatch(addToast({
        message: 'Link added successfully! Processing with AI...',
        type: 'success',
      }));
      handleClose();
    } catch (error: any) {
      dispatch(addToast({
        message: error.message || 'Failed to add link',
        type: 'error',
      }));
    } finally {
      setLoading(false);
    }
  };

  if (!addLinkModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg glass rounded-2xl p-6 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <LinkIcon className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-semibold">Add New Link</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-card-hover rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="url" className="block text-sm font-medium mb-2">
              URL
            </label>
            <input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/article"
              className="w-full px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="bg-card-hover rounded-lg p-4 text-sm text-muted">
            <p className="mb-2">✨ Our AI will automatically:</p>
            <ul className="space-y-1 ml-4">
              <li>• Generate a summary</li>
              <li>• Extract relevant tags</li>
              <li>• Classify the category</li>
              <li>• Fetch metadata</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 bg-card-hover hover:bg-border rounded-lg transition-colors font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-primary hover:bg-primary-hover text-white rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Add Link'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
