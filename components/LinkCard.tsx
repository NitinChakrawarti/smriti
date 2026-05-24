'use client';

import { Link, ContentType } from '@/types';
import { useAppDispatch } from '@/store/hooks';
import { toggleReadStatus, deleteLink, fetchStats } from '@/store/slices/linksSlice';
import { addToast } from '@/store/slices/uiSlice';
import {
  ExternalLink,
  Check,
  Trash2,
  Calendar,
  FileText,
  Video,
  BookOpen,
  Newspaper,
  Circle,
  Link as LinkIcon,
} from 'lucide-react';
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
    } catch {
      dispatch(addToast({ message: 'Failed to update status', type: 'error' }));
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this?')) return;
    try {
      await dispatch(deleteLink(link._id)).unwrap();
      dispatch(fetchStats());
      dispatch(addToast({ message: 'Deleted successfully', type: 'success' }));
    } catch {
      dispatch(addToast({ message: 'Failed to delete', type: 'error' }));
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const getContentTypeIcon = () => {
    const icons: Record<ContentType, JSX.Element> = {
      article:       <FileText className="w-3.5 h-3.5" />,
      video:         <Video    className="w-3.5 h-3.5" />,
      documentation: <BookOpen className="w-3.5 h-3.5" />,
      blog:          <Newspaper className="w-3.5 h-3.5" />,
      news:          <Newspaper className="w-3.5 h-3.5" />,
      other:         <Circle   className="w-3.5 h-3.5" />,
    };
    return icons[link.contentType] || icons.other;
  };

  return (
    <div className="surface-card surface-card-hover group flex h-full flex-col">
      {/* Thumbnail */}
      {link.thumbnail && !imageError ? (
        <div className="relative h-40 overflow-hidden bg-gray-100">
          <img
            src={link.thumbnail}
            alt={link.title}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center bg-gray-50">
          <LinkIcon className="h-10 w-10 text-gray-300" />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-4 p-5">
        {/* Type badge + read toggle */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-600">
              {getContentTypeIcon()}
              {link.contentType}
            </span>
            {!link.readStatus && (
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-600">
                <Circle className="h-2 w-2 fill-current" />
                New
              </span>
            )}
          </div>

          <button
            onClick={handleToggleRead}
            className={`shrink-0 rounded-lg border p-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 ${
              link.readStatus
                ? 'border-green-200 bg-green-50 text-green-600'
                : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-600'
            }`}
            title={link.readStatus ? 'Mark as unread' : 'Mark as read'}
          >
            <Check className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Title */}
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-gray-900">
          {link.title}
        </h3>

        {/* Summary */}
        <p className="line-clamp-3 text-sm leading-relaxed text-gray-500">
          {link.summary}
        </p>

        {/* Tags */}
        {link.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {link.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="rounded-full border border-gray-100 bg-gray-50 px-2 py-0.5 text-[11px] text-gray-500">
                #{tag}
              </span>
            ))}
            {link.tags.length > 4 && (
              <span className="px-1 py-0.5 text-[11px] text-gray-400">+{link.tags.length - 4}</span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-gray-100 pt-4">
          <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[11px] font-medium text-gray-600">
            {link.category}
          </span>

          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-1 text-[11px] text-gray-400">
              <Calendar className="h-3 w-3" />
              {formatDate(link.createdAt)}
            </span>

            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-gray-200 bg-white p-1.5 text-gray-400 hover:border-gray-300 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1"
              title="Open link"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </a>

            <button
              onClick={handleDelete}
              className="rounded-lg border border-gray-200 bg-white p-1.5 text-gray-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-1"
              title="Delete"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
