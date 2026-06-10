'use client';

import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import BrandMark from './BrandMark';
import ThemeToggle from './ThemeToggle';

const TELEGRAM_BOT_URL = 'https://t.me/Link_space_bot';

type PublicShellProps = {
  children: React.ReactNode;
};

export default function PublicShell({ children }: PublicShellProps) {
  return (
    <div className="app-shell">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-950">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/landing" aria-label="Smriti home">
            <BrandMark compact />
          </Link>

          <nav className="hidden items-center gap-1 sm:flex">
            <Link href="/landing" className="btn-ghost">Home</Link>
            <Link href="/about" className="btn-ghost">About</Link>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href="/login" className="btn-secondary">Sign in</Link>
            <a
              href={TELEGRAM_BOT_URL}
              target="_blank"
              rel="noreferrer"
              className="btn-primary hidden sm:inline-flex"
            >
              <MessageSquare className="h-4 w-4" />
              Open bot
            </a>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-gray-200 px-4 py-8 sm:px-6 lg:px-8 dark:border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col items-start gap-4 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between dark:text-slate-400">
          <BrandMark compact />
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-gray-900 dark:hover:text-slate-200">About</Link>
            <a
              href={TELEGRAM_BOT_URL}
              target="_blank"
              rel="noreferrer"
              className="hover:text-gray-900 dark:hover:text-slate-200"
            >
              Telegram bot
            </a>
            <span className="text-xs">© {new Date().getFullYear()} Smriti</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
