'use client';

import { Sparkles, Link as LinkIcon, Brain, Search, Zap, Shield, Clock, Palette, Layers3, BadgeCheck, Bot, MessageSquare } from 'lucide-react';
import BrandMark from '@/components/BrandMark';

/**
 * SmartSpace Design System Showcase
 * This page demonstrates all the design components and patterns
 * Visit: /showcase
 */

export default function ShowcasePage() {
  return (
    <div className="min-h-screen px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-12">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-2xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <BrandMark compact />
            <div className="max-w-2xl space-y-3 text-left lg:text-right">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-slate-300">
                <Palette className="h-4 w-4 text-[#27d7c4]" />
                Smriti design system
              </div>
              <p className="text-base leading-7 text-slate-400">
                This page documents the cool glass surfaces, brand gradients, and component motifs used across public and private screens.
              </p>
            </div>
          </div>
        </div>

        {/* Colors */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Layers3 className="h-5 w-5 text-[#27d7c4]" />
            <h2 className="text-3xl font-semibold">Brand colors</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-24 rounded-2xl border border-white/10 bg-[#4d79ff]"></div>
              <p className="text-sm font-medium">Primary Blue</p>
              <p className="text-xs text-slate-400">#4D79FF</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 rounded-2xl border border-white/10 bg-[#7c5cff]"></div>
              <p className="text-sm font-medium">Violet Accent</p>
              <p className="text-xs text-slate-400">#7C5CFF</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 rounded-2xl border border-white/10 bg-[#27d7c4]"></div>
              <p className="text-sm font-medium">Cyan Mint</p>
              <p className="text-xs text-slate-400">#27D7C4</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 rounded-2xl bg-gradient-to-r from-[#7c5cff] via-[#4d79ff] to-[#27d7c4]"></div>
              <p className="text-sm font-medium">Hero Gradient</p>
              <p className="text-xs text-slate-400">Primary CTA and glow</p>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <BadgeCheck className="h-5 w-5 text-[#7c5cff]" />
            <h2 className="text-3xl font-semibold">Buttons</h2>
          </div>
          <div className="flex flex-wrap gap-4">
            <button className="rounded-full bg-gradient-to-r from-[#7c5cff] via-[#4d79ff] to-[#27d7c4] px-6 py-3 font-semibold text-white transition-transform hover:scale-[1.01]">
              Primary CTA
            </button>
            <button className="rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white transition-colors hover:bg-white/10">
              Secondary
            </button>
            <button className="rounded-full bg-[#0b0f14] px-6 py-3 font-semibold text-white ring-1 ring-white/10 transition-colors hover:bg-white/5">
              Ink Button
            </button>
            <button className="rounded-full p-3 transition-colors hover:bg-white/5">
              <Sparkles className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* Cards */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <Bot className="h-5 w-5 text-[#27d7c4]" />
            <h2 className="text-3xl font-semibold">Cards</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Standard Card */}
            <div className="rounded-[1.6rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl transition-all hover:border-white/20">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7c5cff] to-[#4d79ff]">
                <LinkIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Glass card</h3>
              <p className="text-slate-400">A quiet card surface for content and metadata.</p>
            </div>

            {/* Card with Glow */}
            <div className="group relative rounded-[1.6rem] border border-white/10 bg-white/[0.05] p-6 backdrop-blur-xl transition-all hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#27d7c4] to-[#4d79ff] transition-transform group-hover:scale-110">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Glow card</h3>
              <p className="text-slate-400">Hover reveals the cool gradient aura.</p>
              <div className="pointer-events-none absolute inset-0 rounded-[1.6rem] bg-[radial-gradient(circle_at_20%_20%,rgba(124,92,255,0.14),transparent_28%),radial-gradient(circle_at_80%_10%,rgba(39,215,196,0.1),transparent_25%)] opacity-0 transition-opacity group-hover:opacity-100"></div>
            </div>

            {/* Elevated Card */}
            <div className="rounded-[1.6rem] border border-white/10 bg-gradient-to-br from-white/[0.08] via-white/[0.05] to-white/[0.08] p-6 backdrop-blur-xl">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7c5cff] via-[#4d79ff] to-[#27d7c4]">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Elevated card</h3>
              <p className="text-slate-400">Use for highlighted metrics and summary panels.</p>
            </div>
          </div>
        </section>

        {/* Badges */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <MessageSquare className="h-5 w-5 text-[#4d79ff]" />
            <h2 className="text-3xl font-semibold">Badges</h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <span className="rounded-full border border-[#7c5cff]/30 bg-[#7c5cff]/15 px-3 py-1.5 text-sm font-medium text-[#b5a7ff]">
              Violet badge
            </span>
            <span className="rounded-full border border-[#4d79ff]/30 bg-[#4d79ff]/15 px-3 py-1.5 text-sm font-medium text-[#a8c1ff]">
              Blue badge
            </span>
            <span className="rounded-full border border-success/30 bg-success/20 px-3 py-1.5 text-sm font-medium text-success">
              Success
            </span>
            <span className="rounded-full border border-warning/30 bg-warning/20 px-3 py-1.5 text-sm font-medium text-warning">
              Warning
            </span>
            <span className="rounded-full border border-error/30 bg-error/20 px-3 py-1.5 text-sm font-medium text-error">
              Error
            </span>
            <span className="rounded-full bg-white/5 px-3 py-1.5 text-sm text-slate-400">
              Neutral
            </span>
          </div>
        </section>

        {/* Inputs */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold">Inputs</h2>
          <div className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-sm font-medium mb-2">Text Input</label>
              <input
                type="text"
                placeholder="Enter text..."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4d79ff]/50 focus:border-[#4d79ff]/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Search Input</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 pl-11 pr-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4d79ff]/50 focus:border-[#4d79ff]/50 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Textarea</label>
              <textarea
                placeholder="Enter longer text..."
                rows={4}
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#4d79ff]/50 focus:border-[#4d79ff]/50 transition-all"
              />
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold">Typography</h2>
          <div className="space-y-4">
            <div>
              <h1 className="text-5xl font-semibold mb-2">Heading 1</h1>
              <p className="text-sm text-slate-400">text-5xl font-semibold</p>
            </div>
            <div>
              <h2 className="text-4xl font-semibold mb-2">Heading 2</h2>
              <p className="text-sm text-slate-400">text-4xl font-semibold</p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-2">Heading 3</h3>
              <p className="text-sm text-slate-400">text-2xl font-semibold</p>
            </div>
            <div>
              <p className="text-base mb-2">Body text - Regular paragraph with normal weight and size</p>
              <p className="text-sm text-slate-400">text-base</p>
            </div>
            <div>
              <p className="text-sm text-slate-400 mb-2">Small text - Used for secondary information</p>
              <p className="text-sm text-slate-400">text-sm text-slate-400</p>
            </div>
          </div>
        </section>

        {/* Icons */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold">Icon containers</h2>
          <div className="flex flex-wrap gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7c5cff] via-[#4d79ff] to-[#27d7c4] shadow-[0_16px_35px_rgba(77,121,255,0.22)]">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4d79ff] to-[#27d7c4]">
              <LinkIcon className="w-8 h-8 text-white" />
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7c5cff] to-[#4d79ff]">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#27d7c4] to-[#7c5cff]">
              <Search className="w-8 h-8 text-white" />
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#0ea5e9] to-[#4d79ff]">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7c5cff] to-[#27d7c4]">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
        </section>

        {/* Animations */}
        <section className="space-y-6">
          <h2 className="text-3xl font-semibold">Animations</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 animate-fade-in">
              <p className="text-center font-medium">Fade In</p>
              <p className="mt-2 text-center text-sm text-slate-400">animate-fade-in</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 animate-fade-in-up">
              <p className="text-center font-medium">Fade In Up</p>
              <p className="mt-2 text-center text-sm text-slate-400">animate-fade-in-up</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 animate-scale-in">
              <p className="text-center font-medium">Scale In</p>
              <p className="mt-2 text-center text-sm text-slate-400">animate-scale-in</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="border-t border-white/10 py-12 text-center">
          <p className="text-slate-400">
            Smriti Design System • Built with Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  );
}
