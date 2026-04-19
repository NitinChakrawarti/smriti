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
      dispatch(addToast({
        message: 'Please enter a URL',
        type: 'error',
      }));
      return;
    }

    if (activeTab === 'text' && !text.trim()) {
      dispatch(addToast({
        message: 'Please enter some text',
        type: 'error',
      }));
      return;
    }

    setLoading(true);

    try {
      if (activeTab === 'link') {
        await dispatch(addLink({ url: url.trim(), source: 'web' })).unwrap();
      }
      // Add handlers for other types here
      
      dispatch(fetchStats());
      dispatch(addToast({
        message: 'Content added successfully! Processing with AI...',
        type: 'success',
      }));
      handleClose();
    } catch (error: any) {
      dispatch(addToast({
        message: error.message || 'Failed to add content',
        type: 'error',
      }));
    } finally {
      setLoading(false);
    }
  };

  if (!addLinkModalOpen) return null;

  const tabs = [
    { id: 'link' as TabType, label: 'Link', icon: LinkIcon },
    { id: 'text' as TabType, label: 'Text', icon: FileText },
    { id: 'image' as TabType, label: 'Image', icon: ImageIcon },
    { id: 'pdf' as TabType, label: 'PDF', icon: FileUp },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-2xl bg-[#13131a] border border-white/10 rounded-3xl shadow-2xl animate-scale-in">
        {/* Header */}
        <div className="px-6 py-5 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl border border-primary/30">
                <Sparkles className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Add Content</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Save and organize your knowledge</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-white/5 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-5">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-primary/20 to-secondary/20 text-white border border-primary/30 shadow-lg shadow-primary/10'
                      : 'bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Link Tab */}
          {activeTab === 'link' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="url" className="block text-sm font-medium mb-2 text-white/90">
                  URL
                </label>
                <input
                  id="url"
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com/article"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-muted-foreground"
                  disabled={loading}
                  autoFocus
                />
              </div>

              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-4 border border-primary/20">
                <div className="flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                    <p className="text-white/90 font-medium mb-2">AI will automatically:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-primary"></span>
                        Generate intelligent summary
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-primary"></span>
                        Extract relevant tags
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-primary"></span>
                        Classify category
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-1 h-1 rounded-full bg-primary"></span>
                        Fetch metadata & thumbnail
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Text Tab */}
          {activeTab === 'text' && (
            <div className="space-y-4">
              <div>
                <label htmlFor="text" className="block text-sm font-medium mb-2 text-white/90">
                  Your Text
                </label>
                <textarea
                  id="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste or type your content here..."
                  rows={8}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all placeholder:text-muted-foreground resize-none"
                  disabled={loading}
                  autoFocus
                />
              </div>

              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl p-4 border border-primary/20">
                <p className="text-sm text-white/90">
                  <Sparkles className="w-4 h-4 text-primary inline mr-2" />
                  AI will analyze your text and create a structured knowledge entry
                </p>
              </div>
            </div>
          )}

          {/* Image Tab */}
          {activeTab === 'image' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-white/10 rounded-xl p-12 text-center hover:border-primary/30 transition-colors">
                <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-white/90 mb-2">Drag & drop an image here</p>
                <p className="text-xs text-muted-foreground mb-4">or click to browse</p>
                <button
                  type="button"
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors"
                >
                  Choose File
                </button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                Supported formats: JPG, PNG, GIF (Max 10MB)
              </p>
            </div>
          )}

          {/* PDF Tab */}
          {activeTab === 'pdf' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-white/10 rounded-xl p-12 text-center hover:border-primary/30 transition-colors">
                <FileUp className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-sm text-white/90 mb-2">Drag & drop a PDF here</p>
                <p className="text-xs text-muted-foreground mb-4">or click to browse</p>
                <button
                  type="button"
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm transition-colors"
                >
                  Choose File
                </button>
              </div>
              <p className="text-xs text-muted-foreground text-center">
                AI will extract text and create searchable content (Max 25MB)
              </p>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary text-white rounded-xl transition-all font-medium flex items-center justify-center gap-2 shadow-lg shadow-primary/20"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Save Content
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
