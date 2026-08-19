'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { resetPassword } from '@/lib/api';
import EyeIcon from '@/components/EyeIcon';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Read ?token= directly rather than via useSearchParams(), matching
  // useAuthFromUrl()'s approach elsewhere in this app — avoids needing a
  // Suspense boundary just to pull one query param.
  useEffect(() => {
    setToken(new URLSearchParams(window.location.search).get('token'));
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (!token) {
      setError('Reset link is missing its token');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(token, password);
      setDone(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm">
        <div className="text-2xl font-bold text-navy mb-1">
          The Sikh <span className="text-saffron">ID</span>
        </div>

        {done ? (
          <>
            <p className="text-sm text-navy bg-[#fff7ee] border border-[#f3d9b3] rounded-lg px-4 py-3 mt-5 mb-6">
              Your password has been updated. You've been logged out everywhere else for safety.
            </p>
            <Link href="/login" className="text-sm text-saffron hover:underline">Log in now</Link>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-6">Choose a new password for your account.</p>
            {token === null ? null : !token ? (
              <p className="text-sm text-red-600">
                This reset link is invalid or missing its token. <Link href="/forgot-password" className="underline">Request a new one</Link>.
              </p>
            ) : (
              <form onSubmit={submit}>
                <label className="block mb-4">
                  <span className="block text-sm font-medium text-navy mb-1.5">New password</span>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'} required minLength={8}
                      value={password} onChange={(e) => setPassword(e.target.value)}
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
                  <span className="block text-xs text-gray-400 mt-1">At least 8 characters</span>
                </label>
                <label className="block mb-6">
                  <span className="block text-sm font-medium text-navy mb-1.5">Confirm new password</span>
                  <input
                    type={showPassword ? 'text' : 'password'} required minLength={8}
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/40"
                  />
                </label>
                {error ? <p className="text-sm text-red-600 mb-4">{error}</p> : null}
                <button
                  type="submit" disabled={loading}
                  className="w-full bg-saffron text-white text-sm font-medium py-2.5 rounded-lg hover:bg-saffron-dark transition-colors disabled:opacity-60"
                >
                  {loading ? 'Updating...' : 'Update password'}
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
