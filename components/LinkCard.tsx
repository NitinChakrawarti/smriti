'use client';

import { Link } from '@/types';
import { useAppDispatch } from '@/store/hooks';
import { toggleReadStatus, deleteLink, fetchStats } from '@/store/slices/linksSlice';
import { addToast } from '@/store/slices/uiSlice';
import { ExternalLink, Check, Trash2, Calendar } from 'lucide-react';
import { useState } from 'react';

interface LinkCardProps {
  link: Link;
}

export default function LinkCard({ link }: LinkCardProps) {
  const dispatch = useAppDispatch();
  const [imageError, setImageError] = useState(false);

  const handleToggleRead = async () => {
    try {
      await dispatch(toggleReadStatus({ id: link._id, readStatus: !link.readStatus })).unwrap();
      dispatch(fetchStats());
      dispatch(addToast({
        message: link.readStatus ? 'Marked as unread' : 'Marked as read',
        type: 'success',
      }));
    } catch (error) {
      dispatch(addToast({
        message: 'Failed to update status',
        type: 'error',
      }));
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this link?')) return;

    try {
      await dispatch(deleteLink(link._id)).unwrap();
      dispatch(fetchStats());
      dispatch(addToast({
        message: 'Link deleted successfully',
        type: 'success',
      }));
    } catch (error) {
      dispatch(addToast({
        message: 'Failed to delete link',
        type: 'error',
      }));
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Technology: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      Business: 'bg-green-500/10 text-green-400 border-green-500/20',
      Design: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      Marketing: 'bg-pink-500/10 text-pink-400 border-pink-500/20',
      Development: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      'AI/ML': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      Product: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      Other: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
    };
    return colors[category] || colors.Other;
  };

  return (
    <div className="group glass rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-300 animate-fade-in">
      {/* Thumbnail */}
      {link.thumbnail && !imageError ? (
        <div className="relative h-48 bg-card-hover overflow-hidden">
          <img
            src={link.thumbnail}
            alt={link.title}
            onError={() => setImageError(true)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>
      ) : (
        <div className="h-48 bg-gradient-to-br from-card-hover to-card flex items-center justify-center">
          <div className="text-6xl opacity-20">🔗</div>
        </div>
      )}

      {/* Content */}
      <div className="p-5 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-primary transition-colors">
            {link.title}
          </h3>
          <button
            onClick={handleToggleRead}
            className={`flex-shrink-0 p-1.5 rounded-lg transition-colors ${
              link.readStatus
                ? 'bg-green-500/20 text-green-400'
                : 'bg-card-hover hover:bg-border'
            }`}
            title={link.readStatus ? 'Mark as unread' : 'Mark as read'}
          >
            <Check className="w-4 h-4" />
          </button>
        </div>

        {/* Summary */}
        <p className="text-sm text-muted line-clamp-3">{link.summary}</p>

        {/* Tags */}
        {link.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {link.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 text-xs bg-card-hover rounded-md text-muted"
              >
                #{tag}
              </span>
            ))}
            {link.tags.length > 4 && (
              <span className="px-2 py-1 text-xs text-muted">
                +{link.tags.length - 4} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div className="flex items-center gap-3">
            <span className={`px-2 py-1 text-xs rounded-md border ${getCategoryColor(link.category)}`}>
              {link.category}
            </span>
            <div className="flex items-center gap-1 text-xs text-muted">
              <Calendar className="w-3 h-3" />
              {formatDate(link.createdAt)}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 hover:bg-card-hover rounded-lg transition-colors"
              title="Open link"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={handleDelete}
              className="p-1.5 hover:bg-red-500/10 hover:text-red-400 rounded-lg transition-colors"
              title="Delete link"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
