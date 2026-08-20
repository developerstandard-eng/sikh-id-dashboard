'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { useAuthFromUrl, useProfile } from '@/lib/useAuth';
import { getActivity } from '@/lib/api';
import { timeAgo } from '@/lib/timeAgo';

interface ActivityItem {
  icon: string;
  description: string;
  created_at: string;
}

export default function ActivityPage() {
  useAuthFromUrl();
  const { profile, loading, error } = useProfile();
  const [items, setItems] = useState<ActivityItem[] | null>(null);

  useEffect(() => {
    if (!profile) return;
    getActivity().then(setItems).catch(() => setItems([]));
  }, [profile]);

  if (loading) return <div className="p-10 text-sm text-gray-400">Loading...</div>;

  if (error === 'not_authenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy text-white">
        <div className="text-center">
          <p className="mb-4">You need to be logged in to view your activity.</p>
          <Link href="/login" className="text-saffron underline">Go to login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 h-full overflow-y-auto bg-[#f5f6f8]">
        <TopBar fullName={profile?.user.full_name} sikhId={profile?.user.sikh_id} photoUrl={profile?.about?.photo_url} title="My Activity" />
        <main className="p-8 max-w-2xl">
          <p className="text-sm text-gray-500 mb-5">
            A timeline of your engagement across the Sikh Group network.
          </p>

          {items === null ? (
            <div className="text-sm text-gray-400">Loading...</div>
          ) : items.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-16 flex flex-col items-center text-center">
              <div className="text-3xl mb-3">✨</div>
              <div className="text-sm font-semibold text-navy mb-1">No activity yet</div>
              <p className="text-xs text-gray-400 max-w-xs">
                Complete more of your profile, RSVP to events, or save something — it&apos;ll show up here.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {items.map((a, i) => (
                <div key={i} className="flex items-start gap-3 px-5 py-4 border-b border-gray-100 last:border-0">
                  <span className="text-base leading-none mt-0.5">{a.icon}</span>
                  <div>
                    <div className="text-sm text-navy">{a.description}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{timeAgo(a.created_at)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
