'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { EventCard, EventItem } from '@/components/EventsCards';
import { useAuthFromUrl, useProfile } from '@/lib/useAuth';
import { getEvents } from '@/lib/api';

export default function EventsPage() {
  useAuthFromUrl();
  const { profile, loading, error } = useProfile();
  const [events, setEvents] = useState<EventItem[] | null>(null);
  const [filter, setFilter] = useState<'all' | 'community' | 'business' | 'award' | 'webinar'>('all');

  useEffect(() => {
    if (!profile) return;
    getEvents().then(setEvents).catch(() => setEvents([]));
  }, [profile]);

  if (loading) return <div className="p-10 text-sm text-gray-400">Loading...</div>;

  if (error === 'not_authenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy text-white">
        <div className="text-center">
          <p className="mb-4">You need to be logged in to view events.</p>
          <Link href="/login" className="text-saffron underline">Go to login</Link>
        </div>
      </div>
    );
  }

  const filtered = (events || []).filter((e) => filter === 'all' || e.event_type === filter);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 h-full overflow-y-auto bg-[#f5f6f8]">
        <TopBar fullName={profile?.user.full_name} sikhId={profile?.user.sikh_id} photoUrl={profile?.about?.photo_url} title="Upcoming events" />
        <main className="p-8 max-w-2xl">
          <p className="text-sm text-gray-500 mb-4">
            Everything happening across the Sikh Group ecosystem, soonest first.
          </p>

          <div className="flex gap-2 mb-5 flex-wrap">
            {(['all', 'community', 'business', 'award', 'webinar'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`text-xs px-3.5 py-1.5 rounded-full border capitalize transition-colors ${
                  filter === f ? 'bg-saffron/10 border-saffron text-navy font-medium' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                {f === 'all' ? 'All' : f}
              </button>
            ))}
          </div>

          {events === null ? (
            <div className="text-sm text-gray-400">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-16 flex flex-col items-center text-center">
              <div className="text-3xl mb-3">📅</div>
              <div className="text-sm font-semibold text-navy mb-1">No events here</div>
              <p className="text-xs text-gray-400 max-w-xs">Check back soon — new events are added regularly.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 px-5">
              {filtered.map((ev) => <EventCard key={ev.id} ev={ev} />)}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
