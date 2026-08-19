'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { login, requestLoginOtp, setTokens, verifyLoginOtp } from '@/lib/api';
import EyeIcon from '@/components/EyeIcon';

function PasswordLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await login(email, password);
      setTokens(data.accessToken, data.refreshToken);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit}>
      <label className="block mb-4">
        <span className="block text-sm font-medium text-navy mb-1.5">Email</span>
        <input
          type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/40"
        />
      </label>
      <label className="block mb-1.5">
        <span className="block text-sm font-medium text-navy mb-1.5">Password</span>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/40"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy"
          >
            <EyeIcon open={showPassword} />
          </button>
        </div>
      </label>
      <div className="text-right mb-6">
        <Link href="/forgot-password" className="text-xs text-saffron hover:underline">Forgot password?</Link>
      </div>
      {error ? <p className="text-sm text-red-600 mb-4">{error}</p> : null}
      <button
        type="submit" disabled={loading}
        className="w-full bg-saffron text-white text-sm font-medium py-2.5 rounded-lg hover:bg-saffron-dark transition-colors disabled:opacity-60"
      >
        {loading ? 'Logging in...' : 'Log in'}
      </button>
    </form>
  );
}

function OtpLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await requestLoginOtp(email);
      setSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await verifyLoginOtp(email, code);
      setTokens(data.accessToken, data.refreshToken);
      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!sent) {
    return (
      <form onSubmit={sendCode}>
        <label className="block mb-6">
          <span className="block text-sm font-medium text-navy mb-1.5">Email</span>
          <input
            type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/40"
          />
        </label>
        {error ? <p className="text-sm text-red-600 mb-4">{error}</p> : null}
        <button
          type="submit" disabled={loading}
          className="w-full bg-saffron text-white text-sm font-medium py-2.5 rounded-lg hover:bg-saffron-dark transition-colors disabled:opacity-60"
        >
          {loading ? 'Sending code...' : 'Send login code'}
        </button>
      </form>
    );
  }

  return (
    <form onSubmit={verifyCode}>
      <p className="text-sm text-gray-500 mb-4">We sent a 6-digit code to {email}. Enter it below to log in.</p>
      <label className="block mb-6">
        <span className="block text-sm font-medium text-navy mb-1.5">Login code</span>
        <input
          type="text" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} required value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
          className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm tracking-[0.4em] text-center focus:outline-none focus:ring-2 focus:ring-saffron/40"
        />
      </label>
      {error ? <p className="text-sm text-red-600 mb-4">{error}</p> : null}
      <button
        type="submit" disabled={loading}
        className="w-full bg-saffron text-white text-sm font-medium py-2.5 rounded-lg hover:bg-saffron-dark transition-colors disabled:opacity-60"
      >
        {loading ? 'Verifying...' : 'Verify & log in'}
      </button>
      <button
        type="button"
        onClick={() => { setSent(false); setCode(''); setError(null); }}
        className="w-full text-xs text-gray-500 hover:text-navy mt-3"
      >
        Use a different email or resend code
      </button>
    </form>
  );
}

// Email-code login is built and working end-to-end but held back from the
// UI for now — flip this on when it's ready to ship.
const OTP_LOGIN_ENABLED = false;

export default function LoginPage() {
  const [mode, setMode] = useState<'password' | 'otp'>('password');

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm">
        <div className="text-2xl font-bold text-navy mb-1">
          The Sikh <span className="text-saffron">ID</span>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Already have a Sikh ID from another Sikh Group site? Just log in below — your ID works everywhere.
        </p>

        {OTP_LOGIN_ENABLED ? (
          <div className="flex mb-6 border border-gray-200 rounded-lg p-1 text-sm">
            <button
              type="button"
              onClick={() => setMode('password')}
              className={`flex-1 py-1.5 rounded-md font-medium transition-colors ${mode === 'password' ? 'bg-navy text-white' : 'text-gray-500'}`}
            >
              Password
            </button>
            <button
              type="button"
              onClick={() => setMode('otp')}
              className={`flex-1 py-1.5 rounded-md font-medium transition-colors ${mode === 'otp' ? 'bg-navy text-white' : 'text-gray-500'}`}
            >
              Email code
            </button>
          </div>
        ) : null}

        {OTP_LOGIN_ENABLED && mode === 'otp' ? <OtpLoginForm /> : <PasswordLoginForm />}
      </div>
    </div>
  );
}
