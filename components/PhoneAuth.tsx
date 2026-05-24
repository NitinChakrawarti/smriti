'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { authApi } from '@/services/api';
import { ArrowRight, Brain, Database, Loader2, MessageSquare, Phone, Shield, Sparkles } from 'lucide-react';

type Step = 'phone' | 'telegram' | 'otp' | 'name';

export default function PhoneAuth() {
  const [step, setStep] = useState<Step>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [telegramId, setTelegramId] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [devOTP, setDevOTP] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) window.location.href = '/';
  }, []);

  const handleAuthSuccess = (token: string, user: any) => {
    if (!token || !user) {
      setError('Authentication failed. Please try again.');
      setLoading(false);
      return;
    }
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setLoading(false);
    setError('');

    const pendingUrl = sessionStorage.getItem('pendingSharedUrl');
    const pendingTitle = sessionStorage.getItem('pendingSharedTitle');

    setTimeout(() => {
      if (pendingUrl) {
        sessionStorage.removeItem('pendingSharedUrl');
        sessionStorage.removeItem('pendingSharedTitle');
        const params = new URLSearchParams();
        params.set('url', pendingUrl);
        if (pendingTitle) params.set('title', pendingTitle);
        window.location.href = `/share?${params.toString()}`;
      } else {
        window.location.href = '/';
      }
    }, 250);
  };

  const requestOTP = async () => {
    try {
      const response = await authApi.requestOTP(phoneNumber, telegramId || undefined);
      if (response.otp) setDevOTP(response.otp);
      setStep('otp');
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
      setLoading(false);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authApi.checkTelegram(phoneNumber);
      if (response.hasTelegram) {
        await requestOTP();
      } else {
        setStep('telegram');
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to check phone number');
      setLoading(false);
    }
  };

  const handleTelegramSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await authApi.linkTelegram(phoneNumber, telegramId);
      await requestOTP();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to link Telegram');
      setLoading(false);
    }
  };

  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authApi.verifyOTP(phoneNumber, otp);
      if (!response.token && !response.user) {
        setStep('name');
        setLoading(false);
        return;
      }
      handleAuthSuccess(response.token, response.user);
    } catch (err: any) {
      if (err.response?.data?.requiresName) {
        setStep('name');
        setLoading(false);
        return;
      }
      setError(err.response?.data?.message || 'Invalid OTP');
      setLoading(false);
    }
  };

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await authApi.verifyOTP(phoneNumber, otp, name);
      handleAuthSuccess(response.token, response.user);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to complete signup');
      setLoading(false);
    }
  };

  const stepIndex = step === 'phone' ? 0 : step === 'telegram' ? 1 : step === 'otp' ? 2 : 3;

  return (
    <section className="page-shell py-16 sm:py-20 lg:py-24">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-2 lg:items-start">

        {/* Left: value props */}
        <div className="space-y-6">
          <span className="chip">
            <MessageSquare className="h-3.5 w-3.5 text-indigo-500" />
            Telegram OTP access
          </span>
          <h1 className="text-3xl font-semibold leading-tight tracking-tight text-gray-900 sm:text-4xl">
            Sign in with a short, secure flow.
          </h1>
          <p className="text-base leading-relaxed text-gray-500">
            Enter your phone number, verify the code, and return to your saved knowledge without extra steps.
          </p>

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              [Brain,    'AI summaries',   'Clean, searchable context'],
              [Database, 'Private storage', 'Your own vault'],
              [Sparkles, 'Fast capture',   'Built for recall'],
            ].map(([Icon, title, text]) => (
              <div key={title as string} className="metric-shell">
                <div className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Icon className="h-4 w-4" />
                </div>
                <p className="text-sm font-semibold text-gray-900">{title as string}</p>
                <p className="mt-1 text-xs text-gray-500">{text as string}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: form */}
        <div className="section-shell">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between border-b border-gray-100 pb-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Secure access</p>
              <h2 className="mt-1 text-xl font-semibold text-gray-900">Continue with OTP</h2>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Shield className="h-5 w-5" />
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-6 flex items-center gap-1.5">
            {['phone', 'telegram', 'otp', 'name'].map((item, index) => (
              <div
                key={item}
                className={`h-1.5 flex-1 rounded-full transition-colors ${
                  index <= stepIndex ? 'bg-indigo-500' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {step === 'phone' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  <input
                    id="phone"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1234567890"
                    className="input-base pl-9"
                    required
                    disabled={loading}
                    autoFocus
                  />
                </div>
                <p className="mt-1.5 text-xs text-gray-400">Include the country code.</p>
              </div>
              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Continue
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
          )}

          {step === 'telegram' && (
            <form onSubmit={handleTelegramSubmit} className="space-y-4">
              <div>
                <label htmlFor="telegram" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Telegram ID
                </label>
                <input
                  id="telegram"
                  type="text"
                  value={telegramId}
                  onChange={(e) => setTelegramId(e.target.value)}
                  placeholder="123456789"
                  className="input-base"
                  required
                  disabled={loading}
                  autoFocus
                />
              </div>
              {devOTP && (
                <div className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">
                  Dev OTP: <span className="font-semibold">{devOTP}</span>
                </div>
              )}
              <div className="flex gap-2">
                <button type="button" onClick={() => setStep('phone')} className="btn-secondary flex-1" disabled={loading}>Back</button>
                <button type="submit" className="btn-primary flex-1" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Continue
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </button>
              </div>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleOTPSubmit} className="space-y-4">
              <div>
                <label htmlFor="otp" className="mb-1.5 block text-sm font-medium text-gray-700">
                  One-time code
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className="input-base"
                  required
                  disabled={loading}
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setStep('phone')} className="btn-secondary flex-1" disabled={loading}>Back</button>
                <button type="submit" className="btn-primary flex-1" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  Verify
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </button>
              </div>
            </form>
          )}

          {step === 'name' && (
            <form onSubmit={handleNameSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700">
                  Your name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  className="input-base"
                  required
                  disabled={loading}
                  autoFocus
                />
              </div>
              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                Complete signup
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
            </form>
          )}

          <div className="mt-6 border-t border-gray-100 pt-5 text-center">
            <p className="text-sm text-gray-500">Need a new account?</p>
            <Link href="/register" className="btn-secondary mt-3 w-full">
              Create account
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
