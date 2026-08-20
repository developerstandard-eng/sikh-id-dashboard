'use client';

import { useState } from 'react';
import Link from 'next/link';
import { saveItem, unsaveItem } from '@/lib/api';

const CATEGORY_LABEL: Record<string, string> = {
  news: 'News', update: 'Update', announcement: 'Announcement', press: 'Press',
};

export interface NewsItem {
  id: number; title: string; body: string; category: string;
  cta_label: string | null; cta_url: string | null; published_at: string; saved?: number;
}

export function NewsRow({ n }: { n: NewsItem }) {
  const [saved, setSaved] = useState(!!n.saved);
  const [busy, setBusy] = useState(false);

  const toggleSave = async () => {
    setBusy(true);
    try {
      if (saved) {
        await unsaveItem('news', n.id);
        setSaved(false);
      } else {
        await saveItem('news', n.id);
        setSaved(true);
      }
    } catch {
      // no-op
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
      <div className="flex items-center justify-between gap-2 mb-1">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wide bg-saffron/10 text-saffron font-medium px-1.5 py-0.5 rounded">
            {CATEGORY_LABEL[n.category] || n.category}
          </span>
          <span className="text-[11px] text-gray-400">
            {new Date(n.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
        </div>
        <button
          type="button"
          onClick={toggleSave}
          disabled={busy}
          aria-label={saved ? 'Unsave' : 'Save'}
          className={`shrink-0 text-sm ${saved ? 'text-saffron' : 'text-gray-300 hover:text-gray-400'}`}
        >
          {saved ? '★' : '☆'}
        </button>
      </div>
      <div className="text-sm font-medium text-navy mb-1">{n.title}</div>
      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{n.body}</p>
      {n.cta_url ? (
        <a href={n.cta_url} className="text-xs text-saffron font-medium hover:underline mt-1 inline-block">
          {n.cta_label || 'Read more'} →
        </a>
      ) : null}
    </div>
  );
}

export default function NewsCorner({ items }: { items: NewsItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="text-xs text-gray-400 uppercase tracking-wide">News corner</div>
        <Link href="/dashboard/news" className="text-xs text-saffron font-medium hover:underline">View all</Link>
      </div>
      <div className="space-y-4">
        {items.slice(0, 5).map((n) => <NewsRow key={n.id} n={n} />)}
      </div>
    </div>
  );
}
