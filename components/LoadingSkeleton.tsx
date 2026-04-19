'use client';

export default function LoadingSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="glass rounded-xl overflow-hidden">
          {/* Image skeleton */}
          <div className="h-48 skeleton" />

          {/* Content skeleton */}
          <div className="p-5 space-y-3">
            {/* Title */}
            <div className="h-6 skeleton rounded w-3/4" />

            {/* Summary */}
            <div className="space-y-2">
              <div className="h-4 skeleton rounded" />
              <div className="h-4 skeleton rounded" />
              <div className="h-4 skeleton rounded w-2/3" />
            </div>

            {/* Tags */}
            <div className="flex gap-2">
              <div className="h-6 w-16 skeleton rounded" />
              <div className="h-6 w-20 skeleton rounded" />
              <div className="h-6 w-16 skeleton rounded" />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3">
              <div className="h-6 w-24 skeleton rounded" />
              <div className="flex gap-2">
                <div className="h-8 w-8 skeleton rounded" />
                <div className="h-8 w-8 skeleton rounded" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
