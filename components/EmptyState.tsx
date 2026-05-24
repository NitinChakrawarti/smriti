'use client';

import { useAppDispatch } from '@/store/hooks';
import { setAddLinkModalOpen } from '@/store/slices/uiSlice';
import { Plus, Link as LinkIcon } from 'lucide-react';

export default function EmptyState() {
  const dispatch = useAppDispatch();

  return (
    <div className="flex min-h-[55vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-200 bg-gray-50">
          <LinkIcon className="h-7 w-7 text-gray-400" />
        </div>

        <h2 className="text-xl font-semibold text-gray-900">Your knowledge vault is empty</h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-gray-500">
          Start by saving a link. Smriti will clean the page, summarize it, and turn it into a searchable memory.
        </p>

        <button
          onClick={() => dispatch(setAddLinkModalOpen(true))}
          className="btn-primary mt-8 mx-auto"
        >
          <Plus className="w-4 h-4" />
          Add your first link
        </button>
      </div>
    </div>
  );
}
