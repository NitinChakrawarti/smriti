'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowRight,
  Brain,
  Check,
  Clock3,
  Link as LinkIcon,
  Search,
  Shield,
  Zap,
} from 'lucide-react';
import PublicShell from '@/components/PublicShell';

const TELEGRAM_BOT_URL = 'https://t.me/Link_space_bot';

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) router.push('/');
  }, [router]);

  const features = [
    { icon: LinkIcon, title: 'Capture instantly',    text: 'Save a link from Telegram without breaking your flow.' },
    { icon: Brain,    title: 'AI enrichment',        text: 'Summaries, tags, and category signals are created automatically.' },
    { icon: Search,   title: 'Search later',         text: 'Find what you saved by topic, recency, or content type.' },
    { icon: Zap,      title: 'Fast everywhere',      text: 'The same experience stays usable on mobile and desktop.' },
    { icon: Shield,   title: 'Private by default',   text: 'Your personal vault stays authenticated and isolated.' },
    { icon: Clock3,   title: 'Built for recall',     text: 'Recent saves and clean metadata make returning simple.' },
  ];

  const steps = [
    ['01', 'Share a link',         'Send a URL through the Telegram bot or web flow.'],
    ['02', 'Smriti processes it',  'The system cleans, summarizes, and classifies the content.'],
    ['03', 'Retrieve when needed', 'Search the dashboard when the link matters again.'],
  ];

  return (
    <PublicShell>
      {/* Hero */}
      <section className="relative overflow-hidden px-4 pb-20 pt-20 sm:px-6 sm:pb-28 sm:pt-24 lg:px-8">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-[-120px] h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-100/50 blur-3xl" />
          <div className="absolute right-[-80px] top-24 h-56 w-56 rounded-full bg-sky-100/60 blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center animate-fade-in-up">
            <span className="chip mb-6 inline-flex">
              Telegram-first knowledge capture
            </span>

            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
              Capture links.{' '}
              <br className="hidden sm:block" />
              Turn them into{' '}
              <span className="text-indigo-600">useful memory.</span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-gray-500 sm:text-lg">
              Smriti keeps the experience quiet and intentional: save a link, let AI organize it, and return later to a private vault that is easy to scan and recall.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={() => router.push('/register')}
                className="btn-primary w-full sm:w-auto"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </button>
              <a
                href={TELEGRAM_BOT_URL}
                target="_blank"
                rel="noreferrer"
                className="btn-secondary w-full sm:w-auto"
              >
                Open in Telegram
              </a>
              <button
                onClick={() => router.push('/login')}
                className="btn-ghost w-full sm:w-auto"
              >
                Log in
              </button>
            </div>

            <div className="mx-auto mt-10 grid max-w-2xl gap-3 sm:grid-cols-3">
              {[
                ['1 tap', 'Save from Telegram'],
                ['AI ready', 'Summaries and tags included'],
                ['Private', 'Only your account can access it'],
              ].map(([label, text]) => (
                <div key={label} className="rounded-2xl border border-gray-200 bg-white/80 p-4 text-left shadow-sm backdrop-blur">
                  <div className="text-sm font-semibold text-gray-900">{label}</div>
                  <div className="mt-1 text-xs leading-relaxed text-gray-500">{text}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap justify-center gap-2">
              {['No manual sorting', 'Private by default', 'Fast on mobile'].map((item) => (
                <span key={item} className="chip">
                  <Check className="h-3.5 w-3.5 text-indigo-500" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-gray-100 px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <span className="chip mb-4 inline-flex">
              A cleaner way to revisit what matters
            </span>
            <h2 className="text-3xl font-semibold text-gray-900 sm:text-4xl">
              Everything you need to{' '}
              <span className="text-indigo-600">keep knowledge organized</span>
            </h2>
            <p className="mt-4 text-base text-gray-500">
              Simple tools that stay out of your way.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
                >
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-100">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-900">{feature.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">{feature.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-gray-100 px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-semibold text-gray-900 sm:text-4xl">How it works</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {steps.map(([step, title, text]) => (
              <div key={step} className="text-center">
                <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-lg font-bold text-indigo-600">
                  {step}
                </div>
                <h3 className="text-base font-semibold text-gray-900">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gray-100 px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <div className="mx-auto max-w-2xl rounded-2xl border border-gray-200 bg-gray-50 px-8 py-12 text-center sm:px-12">
          <h2 className="text-3xl font-semibold text-gray-900 sm:text-4xl">
            Build a cleaner{' '}
            <span className="text-indigo-600">personal knowledge system.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-base text-gray-500">
            Start with the Telegram bot, then move into the dashboard whenever you want to search, filter, and revisit what you saved.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button
              onClick={() => router.push('/register')}
              className="btn-primary w-full sm:w-auto"
            >
              Start Free Today
              <ArrowRight className="h-4 w-4" />
            </button>
            <a
              href={TELEGRAM_BOT_URL}
              target="_blank"
              rel="noreferrer"
              className="btn-secondary w-full sm:w-auto"
            >
              Open in Telegram
            </a>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
