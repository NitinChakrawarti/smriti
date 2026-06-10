'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  FileText,
  Image as ImageIcon,
  Link as LinkIcon,
  MessageSquare,
  Search,
  Sparkles,
  Brain,
  Clock,
} from 'lucide-react';
import PublicShell from '@/components/PublicShell';

const TELEGRAM_BOT_URL = 'https://t.me/Link_space_bot';

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) router.push('/');
  }, [router]);

  return (
    <PublicShell>
      {/* ─── Hero ─── */}
      <section className="relative px-4 pt-24 pb-32 sm:px-6 lg:px-8 overflow-hidden">
        {/* Ambient light */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 h-[420px] w-[720px] rounded-full bg-indigo-200/40 blur-[100px] dark:bg-indigo-500/[0.07]" />
        </div>

        <div className="relative mx-auto max-w-2xl text-center">
          <h1 className="text-[2.5rem] leading-[1.1] font-extrabold tracking-tight text-gray-900 sm:text-6xl dark:text-white">
            Your second brain,<br className="hidden sm:block" /> minus the clutter.
          </h1>
          <p className="mt-5 text-base text-gray-500 sm:text-lg sm:leading-relaxed dark:text-slate-400 max-w-lg mx-auto">
            Drop links, images, or PDFs. AI reads, tags, and files them. You search one box later.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button onClick={() => router.push('/login')} className="btn-primary px-7">
              Start for free
              <ArrowRight className="h-4 w-4" />
            </button>
            <a href={TELEGRAM_BOT_URL} target="_blank" rel="noreferrer" className="btn-secondary px-7">
              <MessageSquare className="h-4 w-4" />
              Telegram bot
            </a>
          </div>
        </div>
      </section>

      {/* ─── Bento grid ─── */}
      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {/* Card 1 — large */}
          <div className="sm:col-span-2 lg:col-span-2 rounded-xl border border-gray-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
              <Brain className="h-5 w-5" />
              <span className="text-xs font-semibold uppercase tracking-wider">AI processing</span>
            </div>
            <h3 className="mt-4 text-xl font-semibold text-gray-900 dark:text-white">
              Save a link. Get back a summary, tags, and category.
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-gray-500 dark:text-slate-400 max-w-md">
              Gemini reads the page, extracts what matters, and organizes it for you. Images get vision analysis. PDFs get text extraction. No manual work.
            </p>
          </div>

          {/* Card 2 */}
          <div className="rounded-xl border border-gray-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
            <Search className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
            <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">
              One search box
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
              Titles, tags, content, file names. Everything is indexed and searchable instantly.
            </p>
          </div>

          {/* Card 3 */}
          <div className="rounded-xl border border-gray-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
            <MessageSquare className="h-5 w-5 text-sky-500 dark:text-sky-400" />
            <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">
              Telegram native
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
              Forward a message to the bot. Done. It shows up in your vault seconds later.
            </p>
          </div>

          {/* Card 4 */}
          <div className="rounded-xl border border-gray-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
            <Clock className="h-5 w-5 text-amber-500 dark:text-amber-400" />
            <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">
              Reminders + auto-cleanup
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
              Get email nudges for things you want to revisit. Stale items clean themselves up after 30 days.
            </p>
          </div>

          {/* Card 5 */}
          <div className="rounded-xl border border-gray-200 bg-white p-8 dark:border-slate-800 dark:bg-slate-900">
            <Sparkles className="h-5 w-5 text-purple-500 dark:text-purple-400" />
            <h3 className="mt-4 text-base font-semibold text-gray-900 dark:text-white">
              Image intelligence
            </h3>
            <p className="mt-2 text-sm text-gray-500 dark:text-slate-400">
              Upload a screenshot or diagram. AI reads the visual content, generates a title and tags.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Content types strip ─── */}
      <section className="border-t border-gray-100 dark:border-slate-800 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-center text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-slate-500">
            What you can save
          </p>
          <div className="mt-8 flex justify-center gap-10 sm:gap-16">
            {[
              { icon: LinkIcon, label: 'Links' },
              { icon: ImageIcon, label: 'Images' },
              { icon: FileText, label: 'PDFs' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-slate-300">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-sm font-medium text-gray-700 dark:text-slate-300">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How it works ─── */}
      <section className="border-t border-gray-100 dark:border-slate-800 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
            Three steps. Zero friction.
          </h2>

          <div className="mt-12 space-y-10">
            {[
              { n: '01', title: 'Drop it in', desc: 'Paste a URL, upload a file, or forward to the Telegram bot.' },
              { n: '02', title: 'AI does the work', desc: 'Content is scraped, images are analyzed, PDFs are parsed. Summary, tags, and category appear automatically.' },
              { n: '03', title: 'Search anytime', desc: 'Type a word. Filter by category. Everything you saved is one query away.' },
            ].map(({ n, title, desc }) => (
              <div key={n} className="flex gap-5">
                <span className="shrink-0 text-2xl font-black text-gray-200 dark:text-slate-700 tabular-nums">{n}</span>
                <div>
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-slate-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="border-t border-gray-100 dark:border-slate-800 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-white">
            Ready to stop losing links?
          </h2>
          <p className="mt-3 text-sm text-gray-500 dark:text-slate-400">
            Sign in with your phone. Telegram delivers the OTP. No passwords.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <button onClick={() => router.push('/login')} className="btn-primary px-7">
              Get started
              <ArrowRight className="h-4 w-4" />
            </button>
            <a href={TELEGRAM_BOT_URL} target="_blank" rel="noreferrer" className="btn-secondary px-7">
              Open the bot
            </a>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
