'use client';

import Image from 'next/image';

type BrandMarkProps = {
  variant?: 'dark' | 'light';
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  showTagline?: boolean;
  compact?: boolean;
};

const sizeMap = {
  sm: 'h-7 w-7',
  md: 'h-9 w-9',
  lg: 'h-12 w-12',
};

export default function BrandMark({
  variant = 'light',
  size = 'md',
  showText = true,
  showTagline = false,
  compact = false,
}: BrandMarkProps) {
  const src = variant === 'light' ? '/logo/logo_light.jpeg' : '/logo/dark_logo.png';

  return (
    <div className={`flex items-center ${compact ? 'gap-2' : 'gap-3'}`}>
      <div
        className={`relative ${sizeMap[size]} overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900`}
      >
        <Image src={src} alt="Smriti logo" fill sizes="64px" className="object-cover" priority={size === 'lg'} />
      </div>

      {showText && (
        <div className="leading-tight">
          <div className={`${compact ? 'text-base' : 'text-lg'} font-semibold tracking-tight text-gray-900 dark:text-slate-100`}>
            <span>Smriti</span>
          </div>
          <div className="text-[10px] uppercase tracking-[0.4em] text-gray-400 dark:text-slate-500">स्मृति</div>
          {showTagline && <div className="mt-0.5 text-xs text-gray-500 dark:text-slate-400">A vault for things you save.</div>}
        </div>
      )}
    </div>
  );
}
