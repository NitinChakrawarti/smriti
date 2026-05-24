'use client';

import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setAddLinkModalOpen, addToast } from '@/store/slices/uiSlice';
import { addLink, fetchStats } from '@/store/slices/linksSlice';
import { X, Link as LinkIcon, Loader2, FileText, Image as ImageIcon, FileUp, Sparkles } from 'lucide-react';

type TabType = 'link' | 'text' | 'image' | 'pdf';

export default function AddLinkModal() {
  const dispatch = useAppDispatch();
  const { addLinkModalOpen } = useAppSelector((state) => state.ui);
  const [activeTab, setActiveTab] = useState<TabType>('link');
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    dispatch(setAddLinkModalOpen(false));
    setUrl('');
    setText('');
    setActiveTab('link');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'link' && !url.trim()) {
      dispatch(addToast({ message: 'Please enter a URL', type: 'error' }));
      return;
    }
    if (activeTab === 'text' && !text.trim()) {
      dispatch(addToast({ message: 'Please enter some text', type: 'error' }));
      return;
    }

    setLoading(true);
    try {
      if (activeTab === 'link') {
        await dispatch(addLink({ url: url.trim(), source: 'web' })).unwrap();
      }
      dispatch(fetchStats());
      dispatch(addToast({ message: 'Content added! Processing with AI...', type: 'success' }));
      handleClose();
    } catch (error: any) {
      dispatch(addToast({ message: error.message || 'Failed to add content', type: 'error' }));
    } finally {
      setLoading(false);
    }
  };

  if (!addLinkModalOpen) return null;

  const tabs = [
    { id: 'link' as TabType, label: 'Link',  icon: LinkIcon  },
    { id: 'text' as TabType, label: 'Text',  icon: FileText  },
    { id: 'image' as TabType, label: 'Image', icon: ImageIcon },
    { id: 'pdf'  as TabType, label: 'PDF',   icon: FileUp    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />

      <div className="surface-strong relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl animate-scale-in">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Add content</h2>
              <p className="mt-0.5 text-sm text-gray-500">Save and organize your knowledge</p>
            </div>
            <button onClick={handleClose} className="btn-icon">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-5 flex gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {activeTab === 'link' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="url" className="mb-1.5 block text-sm font-medium text-gray-700">
                  URL
                </label>
                <input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/article"
                  className="input-base"
                  disabled={loading}
                  autoFocus
                />
              </div>

              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <div className="flex items-start gap-3">
                  <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-indigo-500" />
                  <div className="text-sm">
                    <p className="font-medium text-gray-700">AI will automatically:</p>
                    <ul className="mt-2 space-y-1 text-gray-500">
                      {['Generate intelligent summary', 'Extract relevant tags', 'Classify category', 'Fetch metadata & thumbnail'].map((item) => (
                        <li key={item} className="flex items-center gap-2">
                          <span className="h-1 w-1 rounded-full bg-indigo-400 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'text' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="text" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Your Text
                </label>
                <textarea
                  id="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste or type your content here..."
                  rows={7}
                  className="textarea-base"
                  disabled={loading}
                  autoFocus
                />
              </div>
              <p className="flex items-center gap-2 text-sm text-gray-500">
                <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
                AI will analyze and create a structured knowledge entry.
              </p>
            </div>
          )}

          {(activeTab === 'image' || activeTab === 'pdf') && (
            <div className="rounded-xl border-2 border-dashed border-gray-200 p-10 text-center hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors">
              {activeTab === 'image'
                ? <ImageIcon className="mx-auto mb-3 h-10 w-10 text-gray-300" />
                : <FileUp    className="mx-auto mb-3 h-10 w-10 text-gray-300" />}
              <p className="text-sm text-gray-600">
                {activeTab === 'image' ? 'Drag & drop an image here' : 'Drag & drop a PDF here'}
              </p>
              <p className="mt-1 text-xs text-gray-400">or click to browse</p>
              <button type="button" className="btn-secondary mt-4 mx-auto">Choose File</button>
              <p className="mt-3 text-xs text-gray-400">
                {activeTab === 'image' ? 'JPG, PNG, GIF · Max 10 MB' : 'PDF · Max 25 MB'}
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col gap-2 pt-2 sm:flex-row">
            <button
              type="button"
              onClick={handleClose}
              className="btn-secondary w-full sm:flex-1"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary w-full sm:flex-1"
              disabled={loading}
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Processing...</>
              ) : (
                <><Sparkles className="w-4 h-4" />Save Content</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
