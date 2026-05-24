'use client';

import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import BrandMark from './BrandMark';

const TELEGRAM_BOT_URL = 'https://t.me/Link_space_bot';

type PublicShellProps = {
  children: React.ReactNode;
};

export default function PublicShell({ children }: PublicShellProps) {
  return (
    <div className="app-shell">
      <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/landing" aria-label="Smriti home">
            <BrandMark compact />
          </Link>

          <nav className="hidden items-center gap-2 sm:flex">
            <Link href="/landing" className="btn-ghost">
              Home
            </Link>
            <Link href="/about" className="btn-ghost">
              About
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <Link href="/login" className="btn-secondary">
              Login
            </Link>
            <a
              href={TELEGRAM_BOT_URL}
              target="_blank"
              rel="noreferrer"
              className="btn-primary"
            >
              <MessageSquare className="h-4 w-4" />
              Open bot
            </a>
          </div>
        </div>
      </header>

      <main>{children}</main>

      <footer className="border-t border-gray-200 px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <BrandMark compact />
          <div className="flex flex-col gap-2 sm:items-end">
            <div className="flex items-center gap-3">
              <Link href="/landing" className="transition-colors hover:text-gray-900">
                Home
              </Link>
              <Link href="/about" className="transition-colors hover:text-gray-900">
                About
              </Link>
              <a
                href={TELEGRAM_BOT_URL}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-gray-900"
              >
                Telegram bot
              </a>
            </div>
            <p>© 2026 Smriti. Knowledge that stays with you.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
