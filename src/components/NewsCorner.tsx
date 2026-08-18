'use client';

const CATEGORY_LABEL: Record<string, string> = {
  news: 'News', update: 'Update', announcement: 'Announcement', press: 'Press',
};

interface NewsItem {
  id: number; title: string; body: string; category: string;
  cta_label: string | null; cta_url: string | null; published_at: string;
}

export default function NewsCorner({ items }: { items: NewsItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="text-xs text-gray-400 uppercase tracking-wide mb-3">News corner</div>
      <div className="space-y-4">
        {items.slice(0, 5).map((n) => (
          <div key={n.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase tracking-wide bg-saffron/10 text-saffron font-medium px-1.5 py-0.5 rounded">
                {CATEGORY_LABEL[n.category] || n.category}
              </span>
              <span className="text-[11px] text-gray-350 text-gray-400">
                {new Date(n.published_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            </div>
            <div className="text-sm font-medium text-navy mb-1">{n.title}</div>
            <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{n.body}</p>
            {n.cta_url ? (
              <a href={n.cta_url} className="text-xs text-saffron font-medium hover:underline mt-1 inline-block">
                {n.cta_label || 'Read more'} →
              </a>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
