'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { NewsRow, NewsItem } from '@/components/NewsCorner';
import { useAuthFromUrl, useProfile } from '@/lib/useAuth';
import { getNews } from '@/lib/api';

export default function NewsPage() {
  useAuthFromUrl();
  const { profile, loading, error } = useProfile();
  const [items, setItems] = useState<NewsItem[] | null>(null);
  const [filter, setFilter] = useState<'all' | 'news' | 'update' | 'announcement' | 'press'>('all');

  useEffect(() => {
    if (!profile) return;
    getNews({ limit: '50' }).then(setItems).catch(() => setItems([]));
  }, [profile]);

  if (loading) return <div className="p-10 text-sm text-gray-400">Loading...</div>;

  if (error === 'not_authenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy text-white">
        <div className="text-center">
          <p className="mb-4">You need to be logged in to view news.</p>
          <Link href="/login" className="text-saffron underline">Go to login</Link>
        </div>
      </div>
    );
  }

  const filtered = (items || []).filter((n) => filter === 'all' || n.category === filter);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 h-full overflow-y-auto bg-[#f5f6f8]">
        <TopBar fullName={profile?.user.full_name} sikhId={profile?.user.sikh_id} photoUrl={profile?.about?.photo_url} title="News corner" />
        <main className="p-8 max-w-2xl">
          <p className="text-sm text-gray-500 mb-4">
            News, updates and announcements from across the Sikh Group ecosystem.
          </p>

          <div className="flex gap-2 mb-5 flex-wrap">
            {(['all', 'news', 'update', 'announcement', 'press'] as const).map((f) => (
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

          {items === null ? (
            <div className="text-sm text-gray-400">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-16 flex flex-col items-center text-center">
              <div className="text-3xl mb-3">📰</div>
              <div className="text-sm font-semibold text-navy mb-1">No news here</div>
              <p className="text-xs text-gray-400 max-w-xs">Check back soon — new posts are added regularly.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 p-5 space-y-4">
              {filtered.map((n) => <NewsRow key={n.id} n={n} />)}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
