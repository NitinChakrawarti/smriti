'use client';

import { useEffect, useState } from 'react';
import { Download, X, Share2, MoreVertical } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const DISMISSED_KEY = 'smriti-pwa-prompt-dismissed';
const SHOW_DELAY_MS  = 3000;

type Platform = 'android-native' | 'android-manual' | 'ios' | 'desktop-manual';

function detectPlatform(hasNativePrompt: boolean): Platform {
  const ua = navigator.userAgent;
  const ios = /iphone|ipad|ipod/i.test(ua) && !(window as any).MSStream;
  if (ios) return 'ios';
  if (hasNativePrompt) return 'android-native';
  // Android Chrome over HTTP/IP — native prompt suppressed
  const android = /android/i.test(ua);
  if (android) return 'android-manual';
  return 'desktop-manual';
}

export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible,   setVisible]   = useState(false);
  const [platform,  setPlatform]  = useState<Platform>('android-manual');

  useEffect(() => {
    // Already installed or already dismissed — bail out
    if (
      localStorage.getItem(DISMISSED_KEY) ||
      window.matchMedia('(display-mode: standalone)').matches ||
      (navigator as any).standalone === true
    ) return;

    let showTimer: ReturnType<typeof setTimeout>;

    const onPrompt = (e: Event) => {
      e.preventDefault();
      clearTimeout(showTimer);
      const evt = e as BeforeInstallPromptEvent;
      setDeferredPrompt(evt);
      setPlatform(detectPlatform(true));
      // Small delay so it doesn't pop up instantly on load
      showTimer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    };

    window.addEventListener('beforeinstallprompt', onPrompt);

    // Fallback timer: if the native event never fires (HTTP / IP / iOS / desktop)
    // still show manual instructions after the delay
    showTimer = setTimeout(() => {
      setDeferredPrompt((current) => {
        // If the native event already fired and was stored, don't override
        if (current) return current;
        setPlatform(detectPlatform(false));
        setVisible(true);
        return null;
      });
    }, SHOW_DELAY_MS);

    return () => {
      clearTimeout(showTimer);
      window.removeEventListener('beforeinstallprompt', onPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted' || outcome === 'dismissed') dismiss();
  };

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, '1');
    setVisible(false);
  };

  if (!visible) return null;

  // ── Copy per platform ─────────────────────────────────────────────────────
  const copy: Record<Platform, { icon: React.ReactNode; title: string; body: React.ReactNode; cta?: string }> = {
    'android-native': {
      icon:  <Download className="h-5 w-5 text-indigo-600" />,
      title: 'Install Smriti',
      body:  'Share links, images and files directly from any app — one tap away.',
      cta:   'Install',
    },
    'android-manual': {
      icon:  <MoreVertical className="h-5 w-5 text-indigo-600" />,
      title: 'Add to Home Screen',
      body:  <>Tap <strong className="font-medium text-gray-700">⋮</strong> in Chrome, then choose <strong className="font-medium text-gray-700">"Add to Home screen"</strong> to share from any app.</>,
    },
    'ios': {
      icon:  <Share2 className="h-5 w-5 text-indigo-600" />,
      title: 'Add to Home Screen',
      body:  <>Tap <strong className="font-medium text-gray-700">Share</strong> at the bottom of Safari, then <strong className="font-medium text-gray-700">"Add to Home Screen"</strong>.</>,
    },
    'desktop-manual': {
      icon:  <Download className="h-5 w-5 text-indigo-600" />,
      title: 'Install Smriti',
      body:  'Click the install icon in your browser address bar to add Smriti as an app.',
    },
  };

  const { icon, title, body, cta } = copy[platform];

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Install Smriti"
      className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 animate-fade-in-up sm:bottom-6"
    >
      <div className="surface-strong rounded-2xl px-5 py-4">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50">
            {icon}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-gray-900">{title}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-gray-500">{body}</p>
          </div>

          <button
            onClick={dismiss}
            aria-label="Dismiss"
            className="mt-0.5 shrink-0 rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Show action buttons only when native prompt is available */}
        {platform === 'android-native' && (
          <div className="mt-4 flex gap-2">
            <button onClick={dismiss}       className="btn-secondary h-9 flex-1 text-xs">Not now</button>
            <button onClick={handleInstall} className="btn-primary  h-9 flex-1 text-xs">
              <Download className="h-3.5 w-3.5" />
              {cta}
            </button>
          </div>
        )}

        {/* For manual platforms just a dismiss link */}
        {platform !== 'android-native' && (
          <button
            onClick={dismiss}
            className="mt-3 w-full text-center text-xs text-gray-400 underline-offset-2 hover:text-gray-600 hover:underline"
          >
            Got it
          </button>
        )}
      </div>
    </div>
  );
}
