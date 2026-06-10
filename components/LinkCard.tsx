'use client';

import { Link, ContentType } from '@/types';
import { useAppDispatch } from '@/store/hooks';
import {
  toggleReadStatus,
  deleteLink,
  fetchStats,
  fetchLinks,
  setReminder,
  clearReminder,
  setKeep,
} from '@/store/slices/linksSlice';
import { addToast } from '@/store/slices/uiSlice';
import { authApi } from '@/services/api';
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
  Image as ImageIcon,
  FileUp,
  StickyNote,
  Bell,
  BellOff,
  Pin,
  PinOff,
} from 'lucide-react';
import { useState } from 'react';

interface LinkCardProps {
  link: Link;
}

const REMINDER_OPTIONS = [1, 3, 5, 7, 14, 30];

export default function LinkCard({ link }: LinkCardProps) {
  const dispatch = useAppDispatch();
  const [imageError, setImageError] = useState(false);
  const [reminderMenuOpen, setReminderMenuOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  const reminderActive = Boolean(link.reminderAt) && !link.reminderSent;

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
      dispatch(fetchLinks());
      dispatch(fetchStats());
      dispatch(addToast({ message: 'Deleted successfully', type: 'success' }));
    } catch {
      dispatch(addToast({ message: 'Failed to delete', type: 'error' }));
    }
  };

  const handleSetReminder = async (days: number) => {
    setReminderMenuOpen(false);
    setBusy(true);
    try {
      await dispatch(setReminder({ id: link._id, days })).unwrap();
      dispatch(addToast({ message: `Reminder set for ${days} day${days > 1 ? 's' : ''}`, type: 'success' }));
    } catch (error: any) {
      if (error?.code === 'EMAIL_REQUIRED') {
        const email = window.prompt('Enter your email to receive reminders:');
        if (!email) {
          dispatch(addToast({ message: 'Email is required for reminders', type: 'error' }));
          setBusy(false);
          return;
        }
        try {
          await authApi.updateMe({ email: email.trim() });
          await dispatch(setReminder({ id: link._id, days })).unwrap();
          dispatch(addToast({ message: `Email saved · reminder set for ${days} day${days > 1 ? 's' : ''}`, type: 'success' }));
        } catch (retryError: any) {
          dispatch(addToast({
            message: retryError?.response?.data?.message || retryError?.message || 'Failed to set reminder',
            type: 'error',
          }));
        }
      } else {
        dispatch(addToast({ message: error?.message || 'Failed to set reminder', type: 'error' }));
      }
    } finally {
      setBusy(false);
    }
  };

  const handleClearReminder = async () => {
    setReminderMenuOpen(false);
    setBusy(true);
    try {
      await dispatch(clearReminder(link._id)).unwrap();
      dispatch(addToast({ message: 'Reminder cleared', type: 'success' }));
    } catch {
      dispatch(addToast({ message: 'Failed to clear reminder', type: 'error' }));
    } finally {
      setBusy(false);
    }
  };

  const handleToggleKeep = async () => {
    setBusy(true);
    try {
      await dispatch(setKeep({ id: link._id, keep: !link.keep })).unwrap();
      dispatch(addToast({
        message: link.keep ? 'Unpinned (auto-delete re-armed)' : 'Pinned (won\'t auto-delete)',
        type: 'success',
      }));
    } catch {
      dispatch(addToast({ message: 'Failed to update pin', type: 'error' }));
    } finally {
      setBusy(false);
    }
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  const daysUntilExpiry = () => {
    if (link.keep || !link.expiresAt) return null;
    const diff = new Date(link.expiresAt).getTime() - Date.now();
    if (diff <= 0) return 0;
    return Math.ceil(diff / (24 * 60 * 60 * 1000));
  };

  const getContentTypeIcon = () => {
    const icons: Record<ContentType, JSX.Element> = {
      article:       <FileText className="w-3.5 h-3.5" />,
      video:         <Video    className="w-3.5 h-3.5" />,
      documentation: <BookOpen className="w-3.5 h-3.5" />,
      blog:          <Newspaper className="w-3.5 h-3.5" />,
      news:          <Newspaper className="w-3.5 h-3.5" />,
      pdf:           <FileUp   className="w-3.5 h-3.5" />,
      image:         <ImageIcon className="w-3.5 h-3.5" />,
      text:          <StickyNote className="w-3.5 h-3.5" />,
      other:         <Circle   className="w-3.5 h-3.5" />,
    };
    return icons[link.contentType] || icons.other;
  };

  const openHref = link.url || link.fileUrl || '';
  const expiresIn = daysUntilExpiry();

  return (
    <div className="surface-card surface-card-hover group flex h-full flex-col">
      {/* Thumbnail */}
      {link.thumbnail && !imageError ? (
        <div className="relative h-40 overflow-hidden bg-gray-100 dark:bg-slate-800">
          <img
            src={link.thumbnail}
            alt={link.title}
            onError={() => setImageError(true)}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center bg-gray-50 dark:bg-slate-900/60">
          <LinkIcon className="h-10 w-10 text-gray-300 dark:text-slate-600" />
        </div>
      )}

      <div className="flex flex-1 flex-col gap-4 p-5">
        {/* Type badge + read toggle */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-[11px] font-medium text-gray-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300">
              {getContentTypeIcon()}
              {link.contentType}
            </span>
            {!link.readStatus && (
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-medium text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
                <Circle className="h-2 w-2 fill-current" />
                New
              </span>
            )}
            {link.keep && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[11px] font-medium text-amber-600 dark:bg-amber-500/15 dark:text-amber-300">
                <Pin className="h-3 w-3" />
                Pinned
              </span>
            )}
          </div>

          <button
            onClick={handleToggleRead}
            className={`shrink-0 rounded-lg border p-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 ${
              link.readStatus
                ? 'border-green-200 bg-green-50 text-green-600 dark:border-green-500/40 dark:bg-green-500/15 dark:text-green-300'
                : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500 dark:hover:border-slate-600 dark:hover:text-slate-300'
            }`}
            title={link.readStatus ? 'Mark as unread' : 'Mark as read'}
          >
            <Check className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Title */}
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-gray-900 dark:text-slate-100">
          {link.title}
        </h3>

        {/* Summary */}
        <p className="line-clamp-3 text-sm leading-relaxed text-gray-500 dark:text-slate-400">
          {link.summary}
        </p>

        {/* Tags */}
        {link.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {link.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="rounded-full border border-gray-100 bg-gray-50 px-2 py-0.5 text-[11px] text-gray-500 dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400">
                #{tag}
              </span>
            ))}
            {link.tags.length > 4 && (
              <span className="px-1 py-0.5 text-[11px] text-gray-400 dark:text-slate-500">+{link.tags.length - 4}</span>
            )}
          </div>
        )}

        {/* Reminder / expiry status line */}
        <div className="flex flex-wrap items-center gap-2 text-[11px]">
          {reminderActive && link.reminderAt && (
            <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-2 py-0.5 font-medium text-indigo-600 dark:bg-indigo-500/15 dark:text-indigo-300">
              <Bell className="h-3 w-3" />
              Reminder {formatDate(link.reminderAt)}
            </span>
          )}
          {!link.keep && expiresIn !== null && (
            <span className="inline-flex items-center gap-1 text-gray-400 dark:text-slate-500">
              <Trash2 className="h-3 w-3" />
              {expiresIn === 0 ? 'Expiring soon' : `Expires in ${expiresIn} day${expiresIn > 1 ? 's' : ''}`}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between gap-2 border-t border-gray-100 pt-4 dark:border-slate-800">
          <span className="rounded-full border border-gray-200 bg-gray-50 px-2.5 py-0.5 text-[11px] font-medium text-gray-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300">
            {link.category}
          </span>

          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-1 text-[11px] text-gray-400 dark:text-slate-500">
              <Calendar className="h-3 w-3" />
              {formatDate(link.createdAt)}
            </span>

            {/* Reminder control */}
            <div className="relative">
              <button
                onClick={() => setReminderMenuOpen((open) => !open)}
                disabled={busy}
                className={`rounded-lg border p-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 disabled:opacity-50 ${
                  reminderActive
                    ? 'border-indigo-200 bg-indigo-50 text-indigo-600 dark:border-indigo-500/40 dark:bg-indigo-500/15 dark:text-indigo-300'
                    : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500 dark:hover:border-slate-600 dark:hover:text-slate-300'
                }`}
                title={reminderActive ? 'Reminder set' : 'Set a reminder'}
              >
                <Bell className="h-3.5 w-3.5" />
              </button>

              {reminderMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setReminderMenuOpen(false)} />
                  <div className="absolute bottom-full right-0 z-20 mb-2 w-44 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-900 dark:shadow-black/40">
                    <p className="px-2 py-1 text-[11px] font-medium text-gray-400 dark:text-slate-500">Remind me in</p>
                    {REMINDER_OPTIONS.map((days) => (
                      <button
                        key={days}
                        onClick={() => handleSetReminder(days)}
                        className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left text-sm text-gray-600 hover:bg-gray-50 dark:text-slate-300 dark:hover:bg-slate-800"
                      >
                        <Bell className="h-3.5 w-3.5 text-indigo-400 dark:text-indigo-300" />
                        {days} day{days > 1 ? 's' : ''}
                      </button>
                    ))}
                    {reminderActive && (
                      <button
                        onClick={handleClearReminder}
                        className="mt-1 flex w-full items-center gap-2 rounded-lg border-t border-gray-100 px-2 py-1.5 text-left text-sm text-red-500 hover:bg-red-50 dark:border-slate-800 dark:text-red-400 dark:hover:bg-red-500/10"
                      >
                        <BellOff className="h-3.5 w-3.5" />
                        Clear reminder
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Keep / pin toggle */}
            <button
              onClick={handleToggleKeep}
              disabled={busy}
              className={`rounded-lg border p-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-1 disabled:opacity-50 ${
                link.keep
                  ? 'border-amber-200 bg-amber-50 text-amber-600 dark:border-amber-500/40 dark:bg-amber-500/15 dark:text-amber-300'
                  : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500 dark:hover:border-slate-600 dark:hover:text-slate-300'
              }`}
              title={link.keep ? 'Unpin (allow auto-delete)' : 'Pin (prevent auto-delete)'}
            >
              {link.keep ? <PinOff className="h-3.5 w-3.5" /> : <Pin className="h-3.5 w-3.5" />}
            </button>

            {openHref && (
              <a
                href={openHref}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-gray-200 bg-white p-1.5 text-gray-400 hover:border-gray-300 hover:text-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-1 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500 dark:hover:border-slate-600 dark:hover:text-slate-300"
                title="Open"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}

            <button
              onClick={handleDelete}
              className="rounded-lg border border-gray-200 bg-white p-1.5 text-gray-400 hover:border-red-200 hover:bg-red-50 hover:text-red-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-1 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500 dark:hover:border-red-500/40 dark:hover:bg-red-500/10 dark:hover:text-red-400"
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
