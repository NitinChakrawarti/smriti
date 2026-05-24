'use client';

export default function LoadingSkeleton() {
  return (
    <div className="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3 xl:gap-8">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="surface-card flex h-full flex-col overflow-hidden">
          <div className="h-36 sm:h-44 skeleton" />
          <div className="space-y-4 p-5 sm:p-6">
            <div className="h-6 w-3/4 rounded-full skeleton" />
            <div className="space-y-2">
              <div className="h-4 rounded-full skeleton" />
              <div className="h-4 rounded-full skeleton" />
              <div className="h-4 w-2/3 rounded-full skeleton" />
            </div>
            <div className="flex gap-2">
              <div className="h-6 w-16 rounded-full skeleton" />
              <div className="h-6 w-20 rounded-full skeleton" />
              <div className="h-6 w-16 rounded-full skeleton" />
            </div>
            <div className="flex items-center justify-between pt-4">
              <div className="h-6 w-24 rounded-full skeleton" />
              <div className="flex gap-2">
                <div className="h-8 w-8 rounded-xl skeleton" />
                <div className="h-8 w-8 rounded-xl skeleton" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
