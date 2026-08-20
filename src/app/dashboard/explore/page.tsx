'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { EventCard, EventItem } from '@/components/EventsCards';
import { NewsRow, NewsItem } from '@/components/NewsCorner';
import { useAuthFromUrl, useProfile } from '@/lib/useAuth';
import { getEvents, getNews } from '@/lib/api';

const EVENT_TYPES: { value: string; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'community', label: 'Community' },
  { value: 'business', label: 'Business' },
  { value: 'award', label: 'Awards' },
  { value: 'webinar', label: 'Webinar' },
];

const NEWS_CATEGORIES: { value: string; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'news', label: 'News' },
  { value: 'update', label: 'Update' },
  { value: 'announcement', label: 'Announcement' },
  { value: 'press', label: 'Press' },
];

function FilterChips({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex gap-2 mb-3 flex-wrap">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`text-xs px-3.5 py-1.5 rounded-full border transition-colors ${
            value === o.value ? 'bg-saffron/10 border-saffron text-navy font-medium' : 'border-gray-200 text-gray-500 hover:border-gray-300'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export default function ExplorePage() {
  useAuthFromUrl();
  const { profile, loading, error } = useProfile();
  const [events, setEvents] = useState<EventItem[] | null>(null);
  const [news, setNews] = useState<NewsItem[] | null>(null);
  const [eventType, setEventType] = useState('');
  const [newsCategory, setNewsCategory] = useState('');

  useEffect(() => {
    if (!profile) return;
    getEvents().then(setEvents).catch(() => setEvents([]));
    getNews({ limit: '50' }).then(setNews).catch(() => setNews([]));
  }, [profile]);

  // "View all" links from the dashboard's Business events card carry
  // ?type=business so this page opens pre-filtered to that section,
  // matching the design's per-card deep links. Read directly rather than
  // via useSearchParams() — matches useAuthFromUrl()'s approach elsewhere
  // in this app and avoids needing a Suspense boundary.
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('type');
    if (requested) setEventType(requested);
  }, []);

  if (loading) return <div className="p-10 text-sm text-gray-400">Loading...</div>;

  if (error === 'not_authenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy text-white">
        <div className="text-center">
          <p className="mb-4">You need to be logged in to view events and news.</p>
          <Link href="/login" className="text-saffron underline">Go to login</Link>
        </div>
      </div>
    );
  }

  const filteredEvents = (events || []).filter((e) => !eventType || e.event_type === eventType);
  const filteredNews = (news || []).filter((n) => !newsCategory || n.category === newsCategory);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 h-full overflow-y-auto bg-[#f5f6f8]">
        <TopBar fullName={profile?.user.full_name} sikhId={profile?.user.sikh_id} photoUrl={profile?.about?.photo_url} title="Events & News" />
        <main className="p-8">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <h2 className="text-sm font-semibold text-navy mb-3">Events</h2>
              <FilterChips options={EVENT_TYPES} value={eventType} onChange={setEventType} />
              <div className="bg-white rounded-xl border border-gray-200 px-5">
                {events === null ? (
                  <div className="text-sm text-gray-400 py-8 text-center">Loading...</div>
                ) : filteredEvents.length === 0 ? (
                  <div className="text-sm text-gray-400 py-8 text-center">No events match this filter.</div>
                ) : (
                  filteredEvents.map((ev) => <EventCard key={ev.id} ev={ev} />)
                )}
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-navy mb-3">News corner</h2>
              <FilterChips options={NEWS_CATEGORIES} value={newsCategory} onChange={setNewsCategory} />
              <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                {news === null ? (
                  <div className="text-sm text-gray-400 py-8 text-center">Loading...</div>
                ) : filteredNews.length === 0 ? (
                  <div className="text-sm text-gray-400 py-8 text-center">No posts match this filter.</div>
                ) : (
                  filteredNews.map((n) => <NewsRow key={n.id} n={n} />)
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
