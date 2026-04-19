'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/services/api';
import { Loader2, Phone, MessageSquare, Shield, ArrowRight, Check } from 'lucide-react';

type Step = 'phone' | 'telegram' | 'otp' | 'name';

export default function PhoneAuth() {
  const router = useRouter();
  
  // Form state
  const [step, setStep] = useState<Step>('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [telegramId, setTelegramId] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasTelegram, setHasTelegram] = useState(false);
  const [devOTP, setDevOTP] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      console.log('🔄 Already logged in, redirecting to home...');
      window.location.href = '/';
    }
  }, []);

  // Helper function to handle successful authentication
  const handleAuthSuccess = (token: string, user: any) => {
    console.log('✅ Authentication successful');
    console.log('📦 Token:', token);
    console.log('👤 User:', user);
    
    if (!token || !user) {
      console.error('❌ Missing token or user');
      setError('Authentication failed. Please try again.');
      setLoading(false);
      return;
    }
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    
    console.log('💾 Saved to localStorage');
    
    // Stop loading state before redirect
    setLoading(false);
    setError('');
    
    console.log('🔄 Redirecting in 300ms...');
    
    // Check if there's a pending shared URL
    const pendingUrl = sessionStorage.getItem('pendingSharedUrl');
    const pendingTitle = sessionStorage.getItem('pendingSharedTitle');
    
    // Delay to ensure localStorage is written and UI updates
    setTimeout(() => {
      console.log('🚀 Executing redirect now...');
      
      if (pendingUrl) {
        console.log('📎 Found pending shared URL, redirecting to share page...');
        sessionStorage.removeItem('pendingSharedUrl');
        sessionStorage.removeItem('pendingSharedTitle');
        
        const params = new URLSearchParams();
        params.set('url', pendingUrl);
        if (pendingTitle) params.set('title', pendingTitle);
        
        window.location.href = `/share?${params.toString()}`;
      } else {
        window.location.href = '/';
      }
    }, 300);
  };

  // Step 1: Enter phone number
  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Check if phone has Telegram linked
      const checkResponse = await authApi.checkTelegram(phoneNumber);
      setHasTelegram(checkResponse.hasTelegram);
      
      if (checkResponse.hasTelegram) {
        // Has Telegram, go directly to OTP request
        await requestOTP();
      } else {
        // No Telegram, need to link first
        setStep('telegram');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to check phone number');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Link Telegram ID
  const handleTelegramSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Link Telegram account
      await authApi.linkTelegram(phoneNumber, telegramId);
      
      // Now request OTP
      await requestOTP();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to link Telegram');
      setLoading(false);
    }
  };

  // Request OTP
  const requestOTP = async () => {
    try {
      const response = await authApi.requestOTP(phoneNumber, telegramId || undefined);
      
      // Store dev OTP if provided
      if (response.otp) {
        setDevOTP(response.otp);
      }
      
      setStep('otp');
      setLoading(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to send OTP');
      setLoading(false);
    }
  };

  // Step 3: Verify OTP
  const handleOTPSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authApi.verifyOTP(phoneNumber, otp);
      
      console.log('✅ OTP Verification Response:', response);
      
      // Check if error is because user needs to provide name
      if (!response.token && !response.user) {
        setIsNewUser(true);
        setStep('name');
        setLoading(false);
        return;
      }
      
      // Success - login complete
      handleAuthSuccess(response.token, response.user);
    } catch (err: any) {
      console.error('❌ OTP Verification Error:', err);
      console.error('❌ Error Response:', err.response?.data);
      
      // Check if error is because user needs to provide name
      if (err.response?.data?.requiresName) {
        setIsNewUser(true);
        setStep('name');
        setLoading(false);
        return;
      }
      
      setError(err.response?.data?.message || 'Invalid OTP');
      setLoading(false);
    }
  };

  // Step 4: Enter name (for new users)
  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authApi.verifyOTP(phoneNumber, otp, name);
      
      console.log('✅ Name Submission Response:', response);
      
      // Success - registration complete
      handleAuthSuccess(response.token, response.user);
    } catch (err: any) {
      console.error('❌ Name Submission Error:', err);
      console.error('❌ Error Response:', err.response?.data);
      setError(err.response?.data?.message || 'Failed to complete signup');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-card p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 bg-gradient-to-br from-brand-blue to-secondary rounded-2xl flex items-center justify-center shadow-lg shadow-secondary/30">
              <MessageSquare className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold mb-2">
            <span className="text-brand-blue">Smart</span>
            <span className="text-secondary">Space</span>
          </h1>
          <p className="text-muted">Secure login with Telegram OTP</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className={`w-2 h-2 rounded-full transition-all ${step === 'phone' ? 'bg-secondary w-8' : 'bg-border'}`} />
          <div className={`w-2 h-2 rounded-full transition-all ${step === 'telegram' ? 'bg-secondary w-8' : 'bg-border'}`} />
          <div className={`w-2 h-2 rounded-full transition-all ${step === 'otp' ? 'bg-secondary w-8' : 'bg-border'}`} />
          <div className={`w-2 h-2 rounded-full transition-all ${step === 'name' ? 'bg-secondary w-8' : 'bg-border'}`} />
        </div>

        {/* Form Card */}
        <div className="glass rounded-3xl p-8 shadow-card animate-scale-in">
          {error && (
            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-xl text-error text-sm flex items-start gap-3">
              <span className="text-lg">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Step 1: Phone Number */}
          {step === 'phone' && (
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-brand-blue/10 rounded-2xl mb-4">
                  <Phone className="w-8 h-8 text-brand-blue" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Enter Your Phone</h2>
                <p className="text-muted text-sm">We'll send an OTP to your Telegram</p>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium mb-2">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1234567890"
                  className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-lg"
                  required
                  disabled={loading}
                  autoFocus
                />
                <p className="text-xs text-muted mt-2">Include country code (e.g., +1 for US)</p>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-4 bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-hover text-white rounded-xl transition-all font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-glow"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Checking...
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Step 2: Telegram ID */}
          {step === 'telegram' && (
            <form onSubmit={handleTelegramSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-blue/10 rounded-2xl mb-4">
                  <MessageSquare className="w-8 h-8 text-accent-blue" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Link Telegram</h2>
                <p className="text-muted text-sm">Connect your Telegram to receive OTP</p>
              </div>

              <div className="bg-card-hover rounded-xl p-4 space-y-3 text-sm">
                <p className="font-medium">📱 How to get your Telegram ID:</p>
                <ol className="space-y-2 ml-4 text-muted">
                  <li>1. Open Telegram and search for our bot</li>
                  <li>2. Send <code className="px-2 py-1 bg-card rounded text-secondary">/start</code></li>
                  <li>3. Send <code className="px-2 py-1 bg-card rounded text-secondary">/myid</code></li>
                  <li>4. Copy your Telegram ID and paste below</li>
                </ol>
              </div>

              <div>
                <label htmlFor="telegram" className="block text-sm font-medium mb-2">
                  Telegram ID
                </label>
                <input
                  id="telegram"
                  type="text"
                  value={telegramId}
                  onChange={(e) => setTelegramId(e.target.value)}
                  placeholder="123456789"
                  className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-lg"
                  required
                  disabled={loading}
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep('phone')}
                  className="flex-1 px-6 py-4 bg-card-hover hover:bg-card-elevated border border-border rounded-xl transition-all font-medium"
                  disabled={loading}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-4 bg-gradient-to-r from-secondary-light to-secondary hover:from-secondary hover:to-secondary-dark text-white rounded-xl transition-all font-semibold flex items-center justify-center gap-2 shadow-lg shadow-secondary/20"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Linking...
                    </>
                  ) : (
                    <>
                      Send OTP
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Step 3: OTP Verification */}
          {step === 'otp' && (
            <form onSubmit={handleOTPSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-success/10 rounded-2xl mb-4">
                  <Shield className="w-8 h-8 text-success" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Enter OTP</h2>
                <p className="text-muted text-sm">Check your Telegram for the code</p>
              </div>

              {devOTP && (
                <div className="bg-warning/10 border border-warning/20 rounded-xl p-4 text-center">
                  <p className="text-sm text-warning mb-2">🔧 Development Mode</p>
                  <p className="text-2xl font-mono font-bold text-warning">{devOTP}</p>
                </div>
              )}

              <div>
                <label htmlFor="otp" className="block text-sm font-medium mb-2">
                  Verification Code
                </label>
                <input
                  id="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-4 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all text-center text-3xl font-mono tracking-widest"
                  required
                  disabled={loading}
                  autoFocus
                />
                <p className="text-xs text-muted mt-2 text-center">Enter the 6-digit code</p>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-4 bg-gradient-to-r from-secondary-light to-secondary hover:from-secondary hover:to-secondary-dark text-white rounded-xl transition-all font-semibold flex items-center justify-center gap-2 shadow-lg shadow-secondary/20 hover:shadow-secondary/30 disabled:opacity-50"
                disabled={loading || otp.length !== 6}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify & Continue
                    <Check className="w-5 h-5" />
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setStep('phone')}
                className="w-full text-sm text-muted hover:text-foreground transition-colors"
                disabled={loading}
              >
                ← Use different phone number
              </button>
            </form>
          )}

          {/* Step 4: Name (for new users) */}
          {step === 'name' && (
            <form onSubmit={handleNameSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-accent-purple/10 rounded-2xl mb-4">
                  <Check className="w-8 h-8 text-accent-purple" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Welcome!</h2>
                <p className="text-muted text-sm">Tell us your name to complete signup</p>
              </div>

              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full px-4 py-3 bg-card border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-lg"
                  required
                  disabled={loading}
                  autoFocus
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-4 bg-gradient-to-r from-primary to-secondary hover:from-primary-hover hover:to-secondary-hover text-white rounded-xl transition-all font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-glow"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Complete Signup
                    <Check className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="mt-8 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-sm text-muted">
            <Shield className="w-4 h-4" />
            <span>Secured with Telegram OTP</span>
          </div>
          
          <p className="text-xs text-muted">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}
