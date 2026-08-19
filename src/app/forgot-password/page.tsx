'use client';

import { useState } from 'react';
import Link from 'next/link';
import { forgotPassword } from '@/lib/api';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await forgotPassword(email);
      setSent(true);
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
        <p className="text-sm text-gray-500 mb-6">
          Enter the email on your account and we'll send you a link to reset your password.
        </p>

        {sent ? (
          <>
            <p className="text-sm text-navy bg-[#fff7ee] border border-[#f3d9b3] rounded-lg px-4 py-3 mb-6">
              If an account exists for {email}, a reset link is on its way. Check your inbox.
            </p>
            <Link href="/login" className="text-sm text-saffron hover:underline">Back to login</Link>
          </>
        ) : (
          <form onSubmit={submit}>
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
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
            <Link href="/login" className="block text-center text-xs text-gray-500 hover:text-navy mt-4">
              Back to login
            </Link>
          </form>
        )}
      </div>
    </div>
  );
}
