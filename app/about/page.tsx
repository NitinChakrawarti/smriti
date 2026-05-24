'use client';

import { ArrowRight, Bot, BookOpen, Sparkles, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import PublicShell from '@/components/PublicShell';

const highlights = [
  {
    icon: Bot,
    title: 'AI-powered capture',
    text: 'Turns shared links into summaries, tags, and useful categories automatically.',
  },
  {
    icon: BookOpen,
    title: 'Knowledge vault',
    text: 'Stores content in one clean dashboard so it is easy to search and revisit later.',
  },
  {
    icon: ShieldCheck,
    title: 'Private by design',
    text: 'Built to keep your saved knowledge organized, personal, and secure.',
  },
];

export default function AboutPage() {
  return (
    <PublicShell>
      <section className="relative overflow-hidden px-4 pb-16 pt-16 sm:px-6 sm:pb-20 sm:pt-20 lg:px-8">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-[-120px] h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-100/50 blur-3xl" />
          <div className="absolute right-[-80px] top-24 h-56 w-56 rounded-full bg-sky-100/60 blur-3xl" />
        </div>

        <div className="mx-auto max-w-6xl space-y-8 animate-fade-in-up">
          <div className="mx-auto max-w-3xl text-center">
            <span className="chip mb-5 inline-flex">✨ Product overview</span>
            <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
              About <span className="text-indigo-600">Smriti</span>
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-gray-500 sm:text-lg">
              Smriti is a lightweight AI knowledge workspace that captures links, organizes them
              automatically, and gives you a clean place to search, scan, and revisit what matters.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {highlights.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
                >
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 transition-colors group-hover:bg-indigo-100">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h2 className="text-base font-semibold text-gray-900">{item.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-gray-500">{item.text}</p>
                </div>
              );
            })}
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-indigo-500" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                  What it does
                </h2>
              </div>
              <p className="text-sm leading-7 text-gray-600">
                It turns a shared URL into a structured card with summary, tags, and categories,
                then keeps everything available inside a fast dashboard built for real-world use.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-indigo-500" />
                <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500">
                  Why it fits
                </h2>
              </div>
              <p className="text-sm leading-7 text-gray-600">
                Built for people who want a calm, private, and efficient way to manage knowledge
                without manual tagging or cluttered bookmarks.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center gap-3 pt-2 sm:flex-row">
            <Link href="/register" className="btn-primary w-full sm:w-auto">
              Start exploring
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/landing" className="btn-secondary w-full sm:w-auto">
              Back to home
            </Link>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}