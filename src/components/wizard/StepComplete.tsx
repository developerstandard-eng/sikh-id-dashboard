'use client';

import Link from 'next/link';

export default function StepComplete({ completion }: { completion: number }) {
  return (
    <div className="text-center py-8">
      <div className="text-5xl mb-4">🎉</div>
      <h2 className="text-2xl font-semibold text-navy mb-2">Your Sikh ID is complete</h2>
      <p className="text-sm text-gray-500 mb-6">
        Welcome to The Sikh Group. Your Sikh ID is now ready to connect you across our growing global ecosystem.
      </p>
      <div className="max-w-xs mx-auto mb-8">
        <div className="progress-track h-2">
          <div className="progress-fill h-2" style={{ width: `${completion}%` }} />
        </div>
        <div className="text-xs text-saffron font-medium mt-1">{completion}%</div>
      </div>
      <Link
        href="/dashboard"
        className="inline-block bg-saffron text-white text-sm font-medium px-6 py-3 rounded-lg hover:bg-saffron-dark transition-colors"
      >
        Explore your Sikh Group
      </Link>
    </div>
  );
}
