'use client';

import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

// ── Types ────────────────────────────────────────────────────────────────────

export type BrowserType = 'chrome' | 'firefox' | 'edge' | 'unsupported';

interface ShouldShowBannerParams {
  viewportWidth: number;
  isDismissed: boolean;
  isExtensionInstalled: boolean;
  browserType: BrowserType;
}

// ── Pure functions (exported for testing) ────────────────────────────────────

const DISMISSED_KEY = 'smriti_extension_banner_dismissed';
const SHOW_DELAY_MS = 2500; // show within 3 seconds of page load

/**
 * Determines whether the install banner should be displayed.
 * Returns true iff:
 *  - viewport width >= 768px
 *  - banner has not been dismissed
 *  - extension is not already installed
 *  - browser is one of Chrome, Firefox, or Edge
 */
export function shouldShowBanner({
  viewportWidth,
  isDismissed,
  isExtensionInstalled,
  browserType,
}: ShouldShowBannerParams): boolean {
  return (
    viewportWidth >= 768 &&
    !isDismissed &&
    !isExtensionInstalled &&
    browserType !== 'unsupported'
  );
}

/**
 * Returns the extension store URL for the given browser type.
 * Uses placeholder URLs for now.
 */
export function getStoreUrl(browserType: 'chrome' | 'firefox' | 'edge'): string {
  const urls: Record<'chrome' | 'firefox' | 'edge', string> = {
    chrome: 'https://chrome.google.com/webstore/detail/smriti',
    firefox: 'https://addons.mozilla.org/en-US/firefox/addon/smriti',
    edge: 'https://microsoftedge.microsoft.com/addons/detail/smriti',
  };
  return urls[browserType];
}

/**
 * Detects the browser type from the user-agent string.
 * Order matters: Edge UA contains "Chrome", so check Edge first.
 */
export function detectBrowser(userAgent: string): BrowserType {
  if (/Edg\//i.test(userAgent)) return 'edge';
  if (/Firefox\//i.test(userAgent)) return 'firefox';
  if (/Chrome\//i.test(userAgent) && !/Edg\//i.test(userAgent)) return 'chrome';
  return 'unsupported';
}

// ── Component ────────────────────────────────────────────────────────────────

export default function InstallBanner() {
  const [visible, setVisible] = useState(false);
  const [browserType, setBrowserType] = useState<BrowserType>('unsupported');

  useEffect(() => {
    const browser = detectBrowser(navigator.userAgent);
    setBrowserType(browser);

    const isDismissed = localStorage.getItem(DISMISSED_KEY) === 'true';
    const isExtensionInstalled = document.documentElement.hasAttribute(
      'data-smriti-extension-installed'
    );
    const viewportWidth = window.innerWidth;

    // Initial check — if conditions aren't met, don't bother with timer
    if (
      !shouldShowBanner({
        viewportWidth,
        isDismissed,
        isExtensionInstalled,
        browserType: browser,
      })
    ) {
      return;
    }

    // Show banner after a short delay (within 3 seconds of page load)
    const showTimer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);

    return () => clearTimeout(showTimer);
  }, []);

  // Listen to window resize to track viewport width; hide below 768px
  useEffect(() => {
    if (!visible) return;

    const handleResize = () => {
      if (window.innerWidth < 768) {
        setVisible(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [visible]);

  // Re-show on resize above 768px (only if not dismissed and not installed)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        const isDismissed = localStorage.getItem(DISMISSED_KEY) === 'true';
        const isExtensionInstalled = document.documentElement.hasAttribute(
          'data-smriti-extension-installed'
        );
        if (
          shouldShowBanner({
            viewportWidth: window.innerWidth,
            isDismissed,
            isExtensionInstalled,
            browserType,
          })
        ) {
          setVisible(true);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [browserType]);

  const handleDismiss = () => {
    localStorage.setItem(DISMISSED_KEY, 'true');
    setVisible(false);
  };

  if (!visible || browserType === 'unsupported') return null;

  const storeUrl = getStoreUrl(browserType);

  return (
    <div
      role="banner"
      aria-label="Install Smriti browser extension"
      className="animate-fade-in-up rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-3 dark:border-indigo-500/20 dark:bg-indigo-500/10"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-indigo-100 dark:bg-indigo-500/20">
          <Download className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
        </div>

        <p className="min-w-0 flex-1 text-sm text-gray-700 dark:text-slate-200">
          Save any page to your Smriti vault with one click.{' '}
          <a
            href={storeUrl}
            target="_blank"
            rel="noopener"
            className="font-medium text-indigo-600 underline-offset-2 hover:underline dark:text-indigo-300"
          >
            Install our browser extension
          </a>
        </p>

        <button
          onClick={handleDismiss}
          aria-label="Dismiss install banner"
          className="shrink-0 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-300"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
