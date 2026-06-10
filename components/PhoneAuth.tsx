'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { authApi } from '@/services/api';
import { ArrowRight, Loader2, Phone } from 'lucide-react';

type Step = 'phone' | 'telegram' | 'otp' | 'name';

const STEP_ORDER: Step[] = ['phone', 'telegram', 'otp', 'name'];

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

  const stepIndex = STEP_ORDER.indexOf(step);
  const stepTitle = {
    phone: 'Sign in',
    telegram: 'Link Telegram',
    otp: 'Enter the code',
    name: 'One last thing',
  }[step];

  const stepHint = {
    phone: 'We\'ll send a one-time code to your Telegram.',
    telegram: 'Send /start to the bot to get your Telegram ID.',
    otp: `Code sent to ${phoneNumber}.`,
    name: 'What should we call you?',
  }[step];

  return (
    <section className="px-4 py-12 sm:py-16">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-slate-100">
            {stepTitle}
          </h1>
          <p className="mt-1.5 text-sm text-gray-500 dark:text-slate-400">{stepHint}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900 sm:p-7">
          {/* Progress */}
          <div className="mb-6 flex items-center gap-1.5">
            {STEP_ORDER.map((item, index) => (
              <div
                key={item}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  index <= stepIndex
                    ? 'bg-indigo-500 dark:bg-indigo-400'
                    : 'bg-gray-200 dark:bg-slate-800'
                }`}
              />
            ))}
          </div>

          {error && (
            <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-300">
              {error}
            </div>
          )}

          {step === 'phone' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-4">
              <div>
                <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Phone number
                </label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 dark:text-slate-500" />
                  <input
                    id="phone"
                    type="tel"
                    inputMode="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+1 234 567 890"
                    className="input-base pl-9"
                    required
                    disabled={loading}
                    autoFocus
                  />
                </div>
                <p className="mt-1.5 text-xs text-gray-500 dark:text-slate-500">
                  Include the country code.
                </p>
              </div>
              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                Continue
              </button>
            </form>
          )}

          {step === 'telegram' && (
            <form onSubmit={handleTelegramSubmit} className="space-y-4">
              <div>
                <label htmlFor="telegram" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Telegram ID
                </label>
                <input
                  id="telegram"
                  type="text"
                  inputMode="numeric"
                  value={telegramId}
                  onChange={(e) => setTelegramId(e.target.value)}
                  placeholder="123456789"
                  className="input-base"
                  required
                  disabled={loading}
                  autoFocus
                />
                <p className="mt-1.5 text-xs text-gray-500 dark:text-slate-500">
                  Open the bot, send /myid, paste the number here.
                </p>
              </div>
              {devOTP && (
                <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2.5 text-sm text-indigo-700 dark:border-indigo-500/30 dark:bg-indigo-500/10 dark:text-indigo-300">
                  Dev OTP: <span className="font-semibold">{devOTP}</span>
                </div>
              )}
              <div className="flex gap-2">
                <button type="button" onClick={() => setStep('phone')} className="btn-secondary flex-1" disabled={loading}>
                  Back
                </button>
                <button type="submit" className="btn-primary flex-1" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  Continue
                </button>
              </div>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleOTPSubmit} className="space-y-4">
              <div>
                <label htmlFor="otp" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-slate-300">
                  6-digit code
                </label>
                <input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="input-base text-center text-lg tracking-[0.5em]"
                  required
                  disabled={loading}
                  autoFocus
                />
              </div>
              <div className="flex gap-2">
                <button type="button" onClick={() => setStep('phone')} className="btn-secondary flex-1" disabled={loading}>
                  Back
                </button>
                <button type="submit" className="btn-primary flex-1" disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                  Verify
                </button>
              </div>
            </form>
          )}

          {step === 'name' && (
            <form onSubmit={handleNameSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-slate-300">
                  Your name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  className="input-base"
                  required
                  disabled={loading}
                  autoFocus
                />
              </div>
              <button type="submit" className="btn-primary w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
                Finish
              </button>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-gray-500 dark:text-slate-500">
          Need help? Open the bot from{' '}
          <Link href="/landing" className="underline-offset-2 hover:underline">
            the home page
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
