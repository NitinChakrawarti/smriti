'use client';

import { Link, ContentType } from '@/types';
import { useAppDispatch } from '@/store/hooks';
import { toggleReadStatus, deleteLink, fetchStats } from '@/store/slices/linksSlice';
import { addToast } from '@/store/slices/uiSlice';
import { ExternalLink, Check, Trash2, Calendar, FileText, Video, BookOpen, Newspaper, Circle, Image as ImageIcon, FileType } from 'lucide-react';
import { useState } from 'react';

interface LinkCardProps {
  link: Link;
}

export default function LinkCard({ link }: LinkCardProps) {
  const dispatch = useAppDispatch();
  const [imageError, setImageError] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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
    if (!confirm('Are you sure you want to delete this?')) return;

    try {
      await dispatch(deleteLink(link._id)).unwrap();
      dispatch(fetchStats());
      dispatch(addToast({
        message: 'Deleted successfully',
        type: 'success',
      }));
    } catch (error) {
      dispatch(addToast({
        message: 'Failed to delete',
        type: 'error',
      }));
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      Technology: 'from-blue-500/20 to-blue-600/20 border-blue-500/30 text-blue-400',
      Business: 'from-green-500/20 to-green-600/20 border-green-500/30 text-green-400',
      Design: 'from-purple-500/20 to-purple-600/20 border-purple-500/30 text-purple-400',
      Marketing: 'from-pink-500/20 to-pink-600/20 border-pink-500/30 text-pink-400',
      Development: 'from-cyan-500/20 to-cyan-600/20 border-cyan-500/30 text-cyan-400',
      'AI/ML': 'from-indigo-500/20 to-indigo-600/20 border-indigo-500/30 text-indigo-400',
      Product: 'from-secondary/20 to-secondary/30 border-secondary/30 text-secondary',
      Other: 'from-gray-500/20 to-gray-600/20 border-gray-500/30 text-gray-400',
    };
    return colors[category] || colors.Other;
  };

  const getContentTypeIcon = () => {
    const icons: Record<ContentType, JSX.Element> = {
      article: <FileText className="w-4 h-4" />,
      video: <Video className="w-4 h-4" />,
      documentation: <BookOpen className="w-4 h-4" />,
      blog: <Newspaper className="w-4 h-4" />,
      news: <Newspaper className="w-4 h-4" />,
      other: <Circle className="w-4 h-4" />,
    };
    return icons[link.contentType] || icons.other;
  };

  // LINK CARD - With thumbnail
  if (link.contentType === 'article' || link.contentType === 'blog' || link.contentType === 'news') {
    return (
      <div
        className="group relative bg-white/[0.02] backdrop-blur-sm rounded-2xl overflow-hidden border border-white/5 hover:border-secondary/30 transition-all duration-300 animate-fade-in hover:shadow-2xl hover:shadow-secondary/10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Thumbnail */}
        {link.thumbnail && !imageError ? (
          <div className="relative h-44 bg-black/20 overflow-hidden">
            <img
              src={link.thumbnail}
              alt={link.title}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-[#0B0F14]/40 to-transparent" />
            
            {!link.readStatus && (
              <div className="absolute top-3 right-3">
                <div className="px-2.5 py-1 bg-secondary/90 backdrop-blur-sm rounded-lg text-[10px] font-bold text-white flex items-center gap-1 shadow-lg">
                  <Circle className="w-2 h-2 fill-current" />
                  NEW
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="h-44 bg-gradient-to-br from-brand-blue/10 to-secondary/10 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(247,147,30,0.1),transparent_50%)]" />
            <div className="relative text-5xl opacity-30">🔗</div>
          </div>
        )}

        {/* Content */}
        <div className="p-5 space-y-3">
          <div className="flex items-start gap-3">
            <h3 className="flex-1 font-semibold text-base leading-snug line-clamp-2 text-white/90 group-hover:text-white transition-colors">
              {link.title}
            </h3>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={handleToggleRead}
                className={`p-1.5 rounded-lg transition-all ${
                  link.readStatus
                    ? 'bg-success/20 text-success hover:bg-success/30'
                    : 'bg-white/5 hover:bg-white/10 text-muted-foreground'
                }`}
                title={link.readStatus ? 'Mark as unread' : 'Mark as read'}
              >
                <Check className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {link.summary}
          </p>

          {link.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {link.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 text-[11px] bg-white/5 hover:bg-white/10 rounded-md text-muted-foreground transition-colors"
                >
                  #{tag}
                </span>
              ))}
              {link.tags.length > 3 && (
                <span className="px-2 py-0.5 text-[11px] text-muted-foreground">
                  +{link.tags.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-white/5">
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-1 text-[11px] font-medium rounded-lg bg-gradient-to-r border ${getCategoryColor(link.category)}`}>
                {link.category}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <div className="text-[11px] text-muted-foreground flex items-center gap-1 mr-2">
                <Calendar className="w-3 h-3" />
                {formatDate(link.createdAt)}
              </div>
              
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 hover:bg-secondary/10 hover:text-secondary rounded-lg transition-colors text-muted-foreground"
                title="Open link"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <button
                onClick={handleDelete}
                className="p-1.5 hover:bg-error/10 hover:text-error rounded-lg transition-colors text-muted-foreground"
                title="Delete"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-brand-blue/5 pointer-events-none rounded-2xl" />
        )}
      </div>
    );
  }

  // TEXT CARD - Minimal design
  if (link.contentType === 'documentation') {
    return (
      <div
        className="group relative bg-gradient-to-br from-white/[0.03] to-white/[0.01] backdrop-blur-sm rounded-2xl overflow-hidden border border-white/5 hover:border-secondary/30 transition-all duration-300 animate-fade-in p-5 space-y-3"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-blue/20 to-secondary/20 flex items-center justify-center flex-shrink-0 border border-secondary/20">
            <FileText className="w-5 h-5 text-secondary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base leading-snug line-clamp-2 text-white/90 group-hover:text-white transition-colors mb-2">
              {link.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 bg-white/[0.02] p-3 rounded-lg border-l-2 border-secondary/30">
              {link.summary}
            </p>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleToggleRead}
              className={`p-1.5 rounded-lg transition-all ${
                link.readStatus
                  ? 'bg-success/20 text-success hover:bg-success/30'
                  : 'bg-white/5 hover:bg-white/10 text-muted-foreground'
              }`}
            >
              <Check className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {link.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pl-[52px]">
            {link.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 text-[11px] bg-white/5 hover:bg-white/10 rounded-md text-muted-foreground transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-white/5 pl-[52px]">
          <span className={`px-2.5 py-1 text-[11px] font-medium rounded-lg bg-gradient-to-r border ${getCategoryColor(link.category)}`}>
            {link.category}
          </span>

          <div className="flex items-center gap-1">
            <div className="text-[11px] text-muted-foreground flex items-center gap-1 mr-2">
              <Calendar className="w-3 h-3" />
              {formatDate(link.createdAt)}
            </div>
            
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 hover:bg-secondary/10 hover:text-secondary rounded-lg transition-colors text-muted-foreground"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={handleDelete}
              className="p-1.5 hover:bg-error/10 hover:text-error rounded-lg transition-colors text-muted-foreground"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-brand-blue/5 pointer-events-none rounded-2xl" />
        )}
      </div>
    );
  }

  // VIDEO CARD - Full image with overlay
  if (link.contentType === 'video') {
    return (
      <div
        className="group relative bg-white/[0.02] backdrop-blur-sm rounded-2xl overflow-hidden border border-white/5 hover:border-secondary/30 transition-all duration-300 animate-fade-in hover:shadow-2xl hover:shadow-secondary/10"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="relative h-56 bg-gradient-to-br from-brand-blue/20 to-secondary/20 overflow-hidden">
          {link.thumbnail && !imageError ? (
            <>
              <img
                src={link.thumbnail}
                alt={link.title}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-[#0B0F14]/60 to-transparent" />
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Video className="w-16 h-16 text-secondary/30" />
            </div>
          )}
          
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-secondary/90 backdrop-blur-sm flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
              <div className="w-0 h-0 border-t-8 border-t-transparent border-l-12 border-l-white border-b-8 border-b-transparent ml-1"></div>
            </div>
          </div>

          {/* Info Bar at Bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0B0F14] to-transparent">
            <h3 className="font-semibold text-base leading-snug line-clamp-2 text-white mb-2">
              {link.title}
            </h3>
            <div className="flex items-center justify-between">
              <span className={`px-2.5 py-1 text-[11px] font-medium rounded-lg bg-gradient-to-r border ${getCategoryColor(link.category)}`}>
                {link.category}
              </span>
              <div className="flex items-center gap-1">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 bg-white/10 hover:bg-secondary/20 hover:text-secondary rounded-lg transition-colors text-white"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={handleDelete}
                  className="p-1.5 bg-white/10 hover:bg-error/20 hover:text-error rounded-lg transition-colors text-white"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>

          {!link.readStatus && (
            <div className="absolute top-3 right-3">
              <div className="px-2.5 py-1 bg-secondary/90 backdrop-blur-sm rounded-lg text-[10px] font-bold text-white flex items-center gap-1 shadow-lg">
                <Circle className="w-2 h-2 fill-current" />
                NEW
              </div>
            </div>
          )}
        </div>

        {isHovered && (
          <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-transparent to-brand-blue/10 pointer-events-none rounded-2xl" />
        )}
      </div>
    );
  }

  // Default fallback
  return (
    <div className="group relative bg-white/[0.02] backdrop-blur-sm rounded-2xl overflow-hidden border border-white/5 hover:border-secondary/30 transition-all duration-300 p-5">
      <h3 className="font-semibold text-white mb-2">{link.title}</h3>
      <p className="text-sm text-muted-foreground">{link.summary}</p>
    </div>
  );
}
