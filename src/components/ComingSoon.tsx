'use client';

import Link from 'next/link';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { useAuthFromUrl, useProfile } from '@/lib/useAuth';

interface Props {
  title: string;
  description: string;
}

// Shared placeholder for sidebar sections that are on the roadmap but not
// built yet, so navigating to them lands on an on-brand page instead of a 404.
export default function ComingSoon({ title, description }: Props) {
  useAuthFromUrl();
  const { profile, loading, error } = useProfile();

  if (loading) {
    return <div className="p-10 text-sm text-gray-400">Loading your Sikh ID...</div>;
  }

  if (error === 'not_authenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy text-white">
        <div className="text-center">
          <p className="mb-4">You need to be logged in to view your dashboard.</p>
          <Link href="/login" className="text-saffron underline">Go to login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 h-full overflow-y-auto bg-[#f5f6f8]">
        <TopBar fullName={profile?.user.full_name} sikhId={profile?.user.sikh_id} title={title} />
        <main className="p-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-16 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-saffron/10 text-saffron flex items-center justify-center text-2xl font-semibold mb-5">
              ✦
            </div>
            <h2 className="text-lg font-semibold text-navy mb-2">{title} is coming soon</h2>
            <p className="text-sm text-gray-500 max-w-sm">{description}</p>
            <Link
              href="/dashboard"
              className="mt-6 inline-block bg-saffron text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-saffron-dark transition-colors"
            >
              Back to dashboard
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
