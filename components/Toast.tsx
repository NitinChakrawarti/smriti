'use client';

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { removeToast } from '@/store/slices/uiSlice';
import { CheckCircle, XCircle, Info, X } from 'lucide-react';

export default function Toast() {
  const dispatch = useAppDispatch();
  const { toasts } = useAppSelector((state) => state.ui);

  useEffect(() => {
    toasts.forEach((toast) => {
      const timer = setTimeout(() => {
        dispatch(removeToast(toast.id));
      }, 5000);

      return () => clearTimeout(timer);
    });
  }, [toasts, dispatch]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="glass rounded-lg p-4 min-w-[300px] max-w-md animate-fade-in shadow-lg"
        >
          <div className="flex items-start gap-3">
            {/* Icon */}
            <div className="flex-shrink-0">
              {toast.type === 'success' && (
                <CheckCircle className="w-5 h-5 text-green-400" />
              )}
              {toast.type === 'error' && (
                <XCircle className="w-5 h-5 text-red-400" />
              )}
              {toast.type === 'info' && (
                <Info className="w-5 h-5 text-blue-400" />
              )}
            </div>

            {/* Message */}
            <p className="flex-1 text-sm">{toast.message}</p>

            {/* Close button */}
            <button
              onClick={() => dispatch(removeToast(toast.id))}
              className="flex-shrink-0 p-1 hover:bg-card-hover rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
