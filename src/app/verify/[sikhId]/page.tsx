'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { verifySikhId } from '@/lib/api';

interface VerifyResult {
  valid: boolean;
  sikh_id?: string;
  full_name?: string;
  member_since?: number;
}

export default function VerifyPage() {
  const params = useParams<{ sikhId: string }>();
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!params.sikhId) return;
    verifySikhId(params.sikhId)
      .then(setResult)
      .catch(() => setError(true));
  }, [params.sikhId]);

  return (
    <div className="min-h-screen bg-navy flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl max-w-sm w-full p-8 text-center">
        <div className="text-lg font-bold text-navy mb-6">
          THE SIKH <span className="text-saffron">ID</span>
        </div>

        {!result && !error ? (
          <p className="text-sm text-gray-400">Checking...</p>
        ) : error ? (
          <p className="text-sm text-red-600">Could not reach the verification service. Please try again shortly.</p>
        ) : result?.valid ? (
          <>
            <div className="w-14 h-14 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-2xl mx-auto mb-4">✓</div>
            <div className="text-sm font-semibold text-navy mb-1">Verified Sikh ID member</div>
            <div className="text-base font-medium text-navy mt-3">{result.full_name}</div>
            <div className="text-xs text-gray-400 mt-1">Sikh ID: {result.sikh_id}</div>
            <div className="text-xs text-gray-400">Member since {result.member_since}</div>
          </>
        ) : (
          <>
            <div className="w-14 h-14 rounded-full bg-red-100 text-red-700 flex items-center justify-center text-2xl mx-auto mb-4">✕</div>
            <div className="text-sm font-semibold text-navy mb-1">Not a valid Sikh ID</div>
            <p className="text-xs text-gray-400 mt-1">This card could not be verified against our records.</p>
          </>
        )}
      </div>
    </div>
  );
}
