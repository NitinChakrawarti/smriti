'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { removeToast } from '@/store/slices/uiSlice';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

const TOAST_DURATION_MS = 5000;

export default function Toast() {
  const dispatch = useAppDispatch();
  const { toasts } = useAppSelector((state) => state.ui);

  useEffect(() => {
    if (toasts.length === 0) return;
    const timers = toasts.map((toast) =>
      setTimeout(() => dispatch(removeToast(toast.id)), TOAST_DURATION_MS),
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts, dispatch]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 space-y-2 px-4 sm:bottom-6 sm:left-auto sm:right-6 sm:translate-x-0 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="surface-strong animate-fade-in-up rounded-xl px-4 py-3"
          role="status"
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5 shrink-0">
              {toast.type === 'success' && <CheckCircle className="h-4 w-4 text-green-500 dark:text-green-400" />}
              {toast.type === 'error' && <XCircle className="h-4 w-4 text-red-500 dark:text-red-400" />}
              {toast.type === 'info' && <Info className="h-4 w-4 text-indigo-500 dark:text-indigo-400" />}
            </div>
            <p className="flex-1 text-sm text-gray-700 dark:text-slate-200">{toast.message}</p>
            <button
              onClick={() => dispatch(removeToast(toast.id))}
              aria-label="Dismiss"
              className="shrink-0 rounded-md p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
