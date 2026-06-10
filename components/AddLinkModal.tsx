'use client';

import { useState, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setAddLinkModalOpen, addToast } from '@/store/slices/uiSlice';
import { addLink, addFile, fetchStats, fetchLinks } from '@/store/slices/linksSlice';
import { X, Link as LinkIcon, Loader2, Image as ImageIcon, FileUp } from 'lucide-react';

type TabType = 'link' | 'image' | 'pdf';

export default function AddLinkModal() {
  const dispatch = useAppDispatch();
  const { addLinkModalOpen } = useAppSelector((state) => state.ui);
  const [activeTab, setActiveTab] = useState<TabType>('link');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    dispatch(setAddLinkModalOpen(false));
    setUrl('');
    setFile(null);
    setActiveTab('link');
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] || null;
    setFile(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (activeTab === 'link' && !url.trim()) {
      dispatch(addToast({ message: 'Please enter a URL', type: 'error' }));
      return;
    }
    if ((activeTab === 'image' || activeTab === 'pdf') && !file) {
      dispatch(addToast({ message: `Please choose a ${activeTab === 'pdf' ? 'PDF' : 'image'} file`, type: 'error' }));
      return;
    }

    setLoading(true);
    try {
      if (activeTab === 'link') {
        await dispatch(addLink({ url: url.trim(), source: 'web' })).unwrap();
      } else if (file) {
        await dispatch(addFile({ file })).unwrap();
      }
      dispatch(fetchLinks());
      dispatch(fetchStats());
      dispatch(addToast({ message: 'Saved. Processing in background.', type: 'success' }));
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
    { id: 'image' as TabType, label: 'Image', icon: ImageIcon },
    { id: 'pdf'  as TabType, label: 'PDF',   icon: FileUp    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={handleClose} />

      <div className="surface-strong relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl animate-scale-in">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-5 dark:border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-slate-100">Add content</h2>
              <p className="mt-0.5 text-sm text-gray-500 dark:text-slate-400">Save a link, image, or PDF</p>
            </div>
            <button onClick={handleClose} className="btn-icon">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Tabs */}
          <div className="mt-5 flex gap-1 rounded-xl border border-gray-200 bg-gray-50 p-1 dark:border-slate-700 dark:bg-slate-800/60">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow-sm dark:bg-slate-900 dark:text-slate-100'
                      : 'text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200'
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
            <div className="space-y-2">
              <label htmlFor="url" className="block text-sm font-medium text-gray-700 dark:text-slate-300">
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
              <p className="text-xs text-gray-500 dark:text-slate-500">
                We'll fetch the page and generate a summary, tags, and category.
              </p>
            </div>
          )}

          {(activeTab === 'image' || activeTab === 'pdf') && (
            <div
              className="cursor-pointer rounded-xl border-2 border-dashed border-gray-200 p-10 text-center hover:border-indigo-300 hover:bg-indigo-50/30 transition-colors dark:border-slate-700 dark:hover:border-indigo-400 dark:hover:bg-indigo-500/10"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept={activeTab === 'image' ? 'image/*' : 'application/pdf'}
                onChange={handleFileChange}
                className="hidden"
                disabled={loading}
              />
              {activeTab === 'image'
                ? <ImageIcon className="mx-auto mb-3 h-10 w-10 text-gray-300 dark:text-slate-600" />
                : <FileUp    className="mx-auto mb-3 h-10 w-10 text-gray-300 dark:text-slate-600" />}
              {file ? (
                <p className="text-sm font-medium text-gray-700 break-all dark:text-slate-200">{file.name}</p>
              ) : (
                <>
                  <p className="text-sm text-gray-600 dark:text-slate-300">
                    {activeTab === 'image' ? 'Click to choose an image' : 'Click to choose a PDF'}
                  </p>
                  <p className="mt-1 text-xs text-gray-400 dark:text-slate-500">or tap to browse</p>
                </>
              )}
              <button
                type="button"
                className="btn-secondary mt-4 mx-auto"
                onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                disabled={loading}
              >
                {file ? 'Change File' : 'Choose File'}
              </button>
              <p className="mt-3 text-xs text-gray-400 dark:text-slate-500">
                {activeTab === 'image' ? 'JPG, PNG, GIF, WEBP · Max 10 MB' : 'PDF · Max 10 MB'}
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
                <><Loader2 className="w-4 h-4 animate-spin" />Saving...</>
              ) : (
                <>Save</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
