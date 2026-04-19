'use client';

import { Sparkles, Link as LinkIcon, Brain, Search, Zap, Shield, Clock } from 'lucide-react';

/**
 * SmartSpace Design System Showcase
 * This page demonstrates all the design components and patterns
 * Visit: /showcase
 */

export default function ShowcasePage() {
  return (
    <div className="min-h-screen bg-[#0B0F14] text-white p-8">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-blue to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-secondary/20">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold">
              <span className="text-brand-blue">Smart</span>
              <span className="text-secondary">Space</span>
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">Design System Showcase</p>
        </div>

        {/* Colors */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Brand Colors</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="h-24 bg-brand-blue rounded-xl border border-white/10"></div>
              <p className="text-sm font-medium">Brand Blue</p>
              <p className="text-xs text-muted-foreground">#142C4F</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 bg-secondary rounded-xl border border-white/10"></div>
              <p className="text-sm font-medium">Brand Orange</p>
              <p className="text-xs text-muted-foreground">#F7931E</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 bg-secondary-light rounded-xl border border-white/10"></div>
              <p className="text-sm font-medium">Orange Light</p>
              <p className="text-xs text-muted-foreground">#FDBA3B</p>
            </div>
            <div className="space-y-2">
              <div className="h-24 bg-gradient-to-r from-secondary-light to-secondary rounded-xl"></div>
              <p className="text-sm font-medium">Orange Gradient</p>
              <p className="text-xs text-muted-foreground">Primary CTA</p>
            </div>
          </div>
        </section>

        {/* Buttons */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Buttons</h2>
          <div className="flex flex-wrap gap-4">
            <button className="px-6 py-3 bg-gradient-to-r from-secondary-light to-secondary hover:from-secondary hover:to-secondary-dark text-white rounded-xl font-semibold shadow-lg shadow-secondary/20 hover:shadow-secondary/30 transition-all">
              Primary CTA
            </button>
            <button className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl font-semibold transition-all">
              Secondary
            </button>
            <button className="px-6 py-3 bg-brand-blue hover:bg-brand-blue/80 text-white rounded-xl font-semibold transition-all">
              Brand Blue
            </button>
            <button className="p-3 hover:bg-white/5 rounded-xl transition-colors">
              <Sparkles className="w-5 h-5" />
            </button>
          </div>
        </section>

        {/* Cards */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Cards</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {/* Standard Card */}
            <div className="bg-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:border-secondary/30 transition-all">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4">
                <LinkIcon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Standard Card</h3>
              <p className="text-muted-foreground">Basic card with glassmorphism effect</p>
            </div>

            {/* Card with Glow */}
            <div className="group relative bg-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:border-secondary/30 transition-all hover:shadow-2xl hover:shadow-secondary/10">
              <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary-light rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Brain className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Card with Glow</h3>
              <p className="text-muted-foreground">Hover to see the glow effect</p>
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none"></div>
            </div>

            {/* Elevated Card */}
            <div className="bg-gradient-to-br from-brand-blue/20 to-secondary/20 rounded-2xl p-6 border border-secondary/30">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Elevated Card</h3>
              <p className="text-muted-foreground">Card with gradient background</p>
            </div>
          </div>
        </section>

        {/* Badges */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Badges</h2>
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1.5 bg-secondary/20 border border-secondary/30 text-secondary rounded-lg text-sm font-medium">
              Orange Badge
            </span>
            <span className="px-3 py-1.5 bg-brand-blue/20 border border-brand-blue/30 text-brand-blue rounded-lg text-sm font-medium">
              Blue Badge
            </span>
            <span className="px-3 py-1.5 bg-success/20 border border-success/30 text-success rounded-lg text-sm font-medium">
              Success
            </span>
            <span className="px-3 py-1.5 bg-warning/20 border border-warning/30 text-warning rounded-lg text-sm font-medium">
              Warning
            </span>
            <span className="px-3 py-1.5 bg-error/20 border border-error/30 text-error rounded-lg text-sm font-medium">
              Error
            </span>
            <span className="px-3 py-1.5 bg-white/5 rounded-lg text-sm text-muted-foreground">
              Neutral
            </span>
          </div>
        </section>

        {/* Inputs */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Inputs</h2>
          <div className="space-y-4 max-w-2xl">
            <div>
              <label className="block text-sm font-medium mb-2">Text Input</label>
              <input
                type="text"
                placeholder="Enter text..."
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary/50 transition-all placeholder:text-muted-foreground"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Search Input</label>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary/50 transition-all"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Textarea</label>
              <textarea
                placeholder="Enter longer text..."
                rows={4}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary/50 transition-all placeholder:text-muted-foreground resize-none"
              />
            </div>
          </div>
        </section>

        {/* Typography */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Typography</h2>
          <div className="space-y-4">
            <div>
              <h1 className="text-5xl font-bold mb-2">Heading 1</h1>
              <p className="text-sm text-muted-foreground">text-5xl font-bold</p>
            </div>
            <div>
              <h2 className="text-4xl font-semibold mb-2">Heading 2</h2>
              <p className="text-sm text-muted-foreground">text-4xl font-semibold</p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-2">Heading 3</h3>
              <p className="text-sm text-muted-foreground">text-2xl font-semibold</p>
            </div>
            <div>
              <p className="text-base mb-2">Body text - Regular paragraph with normal weight and size</p>
              <p className="text-sm text-muted-foreground">text-base</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">Small text - Used for secondary information</p>
              <p className="text-sm text-muted-foreground">text-sm text-muted-foreground</p>
            </div>
          </div>
        </section>

        {/* Icons */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Icon Containers</h2>
          <div className="flex flex-wrap gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-brand-blue to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-secondary/20">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
              <LinkIcon className="w-8 h-8 text-white" />
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-secondary to-secondary-light rounded-xl flex items-center justify-center">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
              <Search className="w-8 h-8 text-white" />
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
        </section>

        {/* Animations */}
        <section className="space-y-6">
          <h2 className="text-3xl font-bold">Animations</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/[0.02] rounded-2xl p-6 border border-white/5 animate-fade-in">
              <p className="text-center font-medium">Fade In</p>
              <p className="text-center text-sm text-muted-foreground mt-2">animate-fade-in</p>
            </div>
            <div className="bg-white/[0.02] rounded-2xl p-6 border border-white/5 animate-fade-in-up">
              <p className="text-center font-medium">Fade In Up</p>
              <p className="text-center text-sm text-muted-foreground mt-2">animate-fade-in-up</p>
            </div>
            <div className="bg-white/[0.02] rounded-2xl p-6 border border-white/5 animate-scale-in">
              <p className="text-center font-medium">Scale In</p>
              <p className="text-center text-sm text-muted-foreground mt-2">animate-scale-in</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="text-center py-12 border-t border-white/5">
          <p className="text-muted-foreground">
            SmartSpace Design System • Built with Tailwind CSS
          </p>
        </div>
      </div>
    </div>
  );
}
