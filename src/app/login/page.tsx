'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, setTokens } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="min-h-screen bg-navy flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl p-8 w-full max-w-sm">
        <div className="text-2xl font-bold text-navy mb-1">
          The Sikh <span className="text-saffron">ID</span>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          In production, users normally arrive here already signed in via a Sikh Group
          WordPress site's SSO redirect. This form is for direct testing against the API.
        </p>
        <form onSubmit={submit}>
          <label className="block mb-4">
            <span className="block text-sm font-medium text-navy mb-1.5">Email</span>
            <input
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/40"
            />
          </label>
          <label className="block mb-6">
            <span className="block text-sm font-medium text-navy mb-1.5">Password</span>
            <input
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/40"
            />
          </label>
          {error ? <p className="text-sm text-red-600 mb-4">{error}</p> : null}
          <button
            type="submit" disabled={loading}
            className="w-full bg-saffron text-white text-sm font-medium py-2.5 rounded-lg hover:bg-saffron-dark transition-colors disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
      </div>
    </div>
  );
}
