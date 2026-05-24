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
    <div className="fixed bottom-4 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 space-y-2 px-4 sm:bottom-6 sm:left-auto sm:right-6 sm:translate-x-0 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="surface-strong animate-fade-in-up rounded-xl px-4 py-3"
        >
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5">
              {toast.type === 'success' && <CheckCircle className="w-4 h-4 text-green-500" />}
              {toast.type === 'error'   && <XCircle     className="w-4 h-4 text-red-500"   />}
              {toast.type === 'info'    && <Info        className="w-4 h-4 text-indigo-500" />}
            </div>
            <p className="flex-1 text-sm text-gray-700">{toast.message}</p>
            <button
              onClick={() => dispatch(removeToast(toast.id))}
              className="shrink-0 rounded-md p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
