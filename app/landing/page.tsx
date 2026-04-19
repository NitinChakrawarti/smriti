'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Sparkles, Link as LinkIcon, Brain, Search, Zap, Shield, Clock, Tag, ArrowRight, Check, Menu, X } from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/');
    }
  }, [router]);

  const features = [
    {
      icon: LinkIcon,
      title: 'Save Anything',
      description: 'Links, PDFs, images, and text - all in one place',
      gradient: 'from-blue-500 to-cyan-500',
    },
    {
      icon: Brain,
      title: 'AI Organization',
      description: 'Auto tags, categories, and intelligent summaries',
      gradient: 'from-secondary to-secondary-light',
    },
    {
      icon: Search,
      title: 'Instant Access',
      description: 'Powerful search and smart filters to find anything',
      gradient: 'from-purple-500 to-pink-500',
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Save content in seconds with AI processing',
      gradient: 'from-yellow-500 to-orange-500',
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data is encrypted and always protected',
      gradient: 'from-green-500 to-emerald-500',
    },
    {
      icon: Clock,
      title: 'Always Available',
      description: 'Access your knowledge from anywhere, anytime',
      gradient: 'from-indigo-500 to-blue-500',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Send or Upload',
      description: 'Share links, upload files, or paste text',
      icon: LinkIcon,
    },
    {
      number: '02',
      title: 'AI Processes',
      description: 'Smart categorization and tagging happens automatically',
      icon: Brain,
    },
    {
      number: '03',
      title: 'Access Anytime',
      description: 'Search, filter, and find your content instantly',
      icon: Search,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B0F14]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-brand-blue to-secondary rounded-xl flex items-center justify-center shadow-lg shadow-secondary/20">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="font-bold text-xl">
                <span className="text-brand-blue">Smart</span>
                <span className="text-secondary">Space</span>
              </h1>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-sm text-muted-foreground hover:text-white transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-muted-foreground hover:text-white transition-colors">
                How It Works
              </a>
              <button
                onClick={() => router.push('/login')}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-white transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push('/register')}
                className="px-5 py-2 bg-gradient-to-r from-secondary-light to-secondary hover:from-secondary hover:to-secondary-dark text-white rounded-xl transition-all font-semibold shadow-lg shadow-secondary/20"
              >
                Get Started
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 hover:bg-white/5 rounded-lg transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2 border-t border-white/5">
              <a href="#features" className="block px-4 py-2 text-sm text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="block px-4 py-2 text-sm text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                How It Works
              </a>
              <button
                onClick={() => router.push('/login')}
                className="w-full text-left px-4 py-2 text-sm text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => router.push('/register')}
                className="w-full px-4 py-2 bg-gradient-to-r from-secondary-light to-secondary text-white rounded-xl font-semibold"
              >
                Get Started
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <div className="space-y-8 animate-fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand-blue/20 to-secondary/20 border border-secondary/30 rounded-full text-sm">
                <Sparkles className="w-4 h-4 text-secondary" />
                <span className="text-white/90">AI-Powered Knowledge Hub</span>
              </div>

              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                Save Smarter.
                <br />
                <span className="text-brand-blue">Organize</span> Better.
                <br />
                <span className="text-secondary">Find</span> Faster.
              </h1>

              <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                Your personal knowledge organizer powered by AI. Save anything, find everything, and never lose track of important information again.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => router.push('/register')}
                  className="group px-8 py-4 bg-gradient-to-r from-secondary-light to-secondary hover:from-secondary hover:to-secondary-dark text-white rounded-xl transition-all font-semibold shadow-lg shadow-secondary/20 hover:shadow-secondary/30 hover:scale-105 flex items-center justify-center gap-2"
                >
                  Get Started Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => router.push('/login')}
                  className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-all font-semibold"
                >
                  Sign In
                </button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div>
                  <div className="text-3xl font-bold text-secondary">10K+</div>
                  <div className="text-sm text-muted-foreground">Items Saved</div>
                </div>
                <div className="w-px h-12 bg-white/10"></div>
                <div>
                  <div className="text-3xl font-bold text-secondary">500+</div>
                  <div className="text-sm text-muted-foreground">Active Users</div>
                </div>
                <div className="w-px h-12 bg-white/10"></div>
                <div>
                  <div className="text-3xl font-bold text-secondary">99%</div>
                  <div className="text-sm text-muted-foreground">Satisfaction</div>
                </div>
              </div>
            </div>

            {/* Right: Product Mockup */}
            <div className="relative animate-fade-in">
              <div className="absolute inset-0 bg-gradient-to-br from-secondary/20 to-brand-blue/20 rounded-3xl blur-3xl"></div>
              <div className="relative bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-sm rounded-3xl border border-white/10 p-6 shadow-2xl">
                {/* Mock Dashboard */}
                <div className="space-y-4">
                  {/* Mock Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-brand-blue to-secondary rounded-lg"></div>
                      <div className="text-sm font-semibold">
                        <span className="text-brand-blue">Smart</span>
                        <span className="text-secondary">Space</span>
                      </div>
                    </div>
                    <div className="px-3 py-1.5 bg-secondary/20 rounded-lg text-xs text-secondary font-semibold">
                      Dashboard
                    </div>
                  </div>

                  {/* Mock Content Cards */}
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="bg-white/5 rounded-xl p-4 border border-white/5 hover:border-secondary/30 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-brand-blue/20 to-secondary/20 rounded-lg flex-shrink-0"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-3 bg-white/10 rounded w-3/4"></div>
                            <div className="h-2 bg-white/5 rounded w-full"></div>
                            <div className="flex gap-2">
                              <div className="h-5 bg-secondary/20 rounded px-2 w-16"></div>
                              <div className="h-5 bg-white/5 rounded px-2 w-12"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 border border-secondary/20 rounded-full text-sm text-secondary font-semibold">
              <Sparkles className="w-4 h-4" />
              Features
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold">
              Everything You Need to
              <br />
              <span className="text-secondary">Organize Your Knowledge</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to make saving and finding information effortless
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="group relative bg-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/5 hover:border-secondary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-secondary/10 animate-fade-in-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${feature.gradient} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                  
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 via-transparent to-brand-blue/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none"></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-blue/10 border border-brand-blue/20 rounded-full text-sm text-brand-blue font-semibold">
              <Zap className="w-4 h-4" />
              How It Works
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold">
              Simple, Fast, and
              <br />
              <span className="text-secondary">Incredibly Smart</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get started in seconds and let AI do the heavy lifting
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection Lines */}
            <div className="hidden md:block absolute top-1/4 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-secondary/30 to-transparent"></div>

            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div
                  key={index}
                  className="relative bg-gradient-to-br from-white/[0.05] to-white/[0.02] backdrop-blur-sm rounded-2xl p-8 border border-white/10 text-center animate-fade-in-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <div className="relative inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-brand-blue to-secondary rounded-2xl mb-6 shadow-2xl shadow-secondary/30">
                    <Icon className="w-10 h-10 text-white" />
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-secondary rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">
                      {step.number}
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 text-white">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-brand-blue/20 via-secondary/20 to-brand-blue/20 rounded-3xl p-12 border border-secondary/30 text-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(247,147,30,0.1),transparent_70%)]"></div>
            
            <div className="relative space-y-6">
              <h2 className="text-4xl sm:text-5xl font-bold">
                Ready to Get
                <br />
                <span className="text-secondary">Organized?</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join hundreds of users who are already saving smarter with SmartSpace
              </p>
              <button
                onClick={() => router.push('/register')}
                className="group px-8 py-4 bg-gradient-to-r from-secondary-light to-secondary hover:from-secondary hover:to-secondary-dark text-white rounded-xl transition-all font-semibold shadow-lg shadow-secondary/20 hover:shadow-secondary/30 hover:scale-105 inline-flex items-center gap-2"
              >
                Start Free Today
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <p className="text-sm text-muted-foreground">
                No credit card required • Free forever
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-blue to-secondary rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold">
                <span className="text-brand-blue">Smart</span>
                <span className="text-secondary">Space</span>
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 SmartSpace. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
