'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { useAuthFromUrl, useProfile } from '@/lib/useAuth';
import { getSavedItems, unsaveItem } from '@/lib/api';

interface SavedItem {
  item_type: 'event' | 'news';
  item_id: number;
  label: string;
  meta: string;
  saved_at: string;
}

const TYPE_LABEL: Record<string, string> = { event: 'Event', news: 'News' };

export default function SavedPage() {
  useAuthFromUrl();
  const { profile, loading, error } = useProfile();
  const [items, setItems] = useState<SavedItem[] | null>(null);
  const [filter, setFilter] = useState<'all' | 'event' | 'news'>('all');

  const reloadSaved = () => getSavedItems().then(setItems).catch(() => setItems([]));

  useEffect(() => {
    if (!profile) return;
    reloadSaved();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const remove = async (item: SavedItem) => {
    setItems((prev) => (prev || []).filter((i) => !(i.item_type === item.item_type && i.item_id === item.item_id)));
    try {
      await unsaveItem(item.item_type, item.item_id);
    } catch {
      reloadSaved(); // re-sync if the delete actually failed server-side
    }
  };

  if (loading) return <div className="p-10 text-sm text-gray-400">Loading...</div>;

  if (error === 'not_authenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy text-white">
        <div className="text-center">
          <p className="mb-4">You need to be logged in to view saved items.</p>
          <Link href="/login" className="text-saffron underline">Go to login</Link>
        </div>
      </div>
    );
  }

  const filtered = (items || []).filter((i) => filter === 'all' || i.item_type === filter);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 h-full overflow-y-auto bg-[#f5f6f8]">
        <TopBar fullName={profile?.user.full_name} sikhId={profile?.user.sikh_id} title="Saved & Favourites" />
        <main className="p-8 max-w-2xl">
          <p className="text-sm text-gray-500 mb-4">
            Bookmark events and news across the Sikh Group ecosystem and find them all here.
          </p>

          <div className="flex gap-2 mb-5">
            {(['all', 'event', 'news'] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`text-xs px-3.5 py-1.5 rounded-full border transition-colors ${
                  filter === f ? 'bg-saffron/10 border-saffron text-navy font-medium' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                {f === 'all' ? 'All' : TYPE_LABEL[f]}
              </button>
            ))}
          </div>

          {items === null ? (
            <div className="text-sm text-gray-400">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-16 flex flex-col items-center text-center">
              <div className="text-3xl mb-3">⭐</div>
              <div className="text-sm font-semibold text-navy mb-1">Nothing saved yet</div>
              <p className="text-xs text-gray-400 max-w-xs">
                Tap the save icon on any event or news post to bookmark it here.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {filtered.map((i) => (
                <div key={`${i.item_type}-${i.item_id}`} className="flex items-start justify-between gap-4 px-5 py-4 border-b border-gray-100 last:border-0">
                  <div>
                    <span className="text-[10px] uppercase tracking-wide bg-gray-100 text-gray-500 font-medium px-1.5 py-0.5 rounded">
                      {TYPE_LABEL[i.item_type]}
                    </span>
                    <div className="text-sm font-medium text-navy mt-1.5">{i.label}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{i.meta}</div>
                  </div>
                  <button type="button" onClick={() => remove(i)} className="text-xs text-gray-400 hover:text-red-600 shrink-0">
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
