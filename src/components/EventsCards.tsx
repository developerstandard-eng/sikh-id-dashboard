'use client';

interface EventItem {
  id: number; title: string; description: string | null; event_type: string;
  location: string | null; is_virtual: number; event_date: string; event_time: string | null;
  cta_label: string | null; cta_url: string | null;
}

const TYPE_LABEL: Record<string, string> = {
  community: 'Community', business: 'Business', award: 'Awards', webinar: 'Webinar', other: 'Event',
};

function EventCard({ ev }: { ev: EventItem }) {
  const date = new Date(ev.event_date);
  return (
    <div className="flex gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="w-11 h-11 rounded-lg bg-navy text-white flex flex-col items-center justify-center shrink-0">
        <span className="text-[9px] uppercase leading-none">{date.toLocaleDateString(undefined, { month: 'short' })}</span>
        <span className="text-sm font-semibold leading-none mt-0.5">{date.getDate()}</span>
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-navy truncate">{ev.title}</span>
        </div>
        <div className="text-xs text-gray-400 mt-0.5">
          {TYPE_LABEL[ev.event_type] || 'Event'}
          {ev.event_time ? ` · ${ev.event_time}` : ''}
          {ev.location ? ` · ${ev.is_virtual ? 'Virtual' : ev.location}` : ''}
        </div>
        {ev.cta_url ? (
          <a href={ev.cta_url} className="text-xs text-saffron font-medium hover:underline mt-0.5 inline-block">
            {ev.cta_label || 'View details'} →
          </a>
        ) : null}
      </div>
    </div>
  );
}

export function UpcomingEventsCard({ events }: { events: EventItem[] }) {
  const upcoming = (events || []).filter((e) => e.event_type !== 'business').slice(0, 4);
  if (upcoming.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-1">
        <div className="text-xs text-gray-400 uppercase tracking-wide">Upcoming events</div>
        <a href="#" className="text-xs text-saffron font-medium hover:underline">View all</a>
      </div>
      {upcoming.map((ev) => <EventCard key={ev.id} ev={ev} />)}
    </div>
  );
}

export function BusinessEventsCard({ events }: { events: EventItem[] }) {
  const business = (events || []).filter((e) => e.event_type === 'business').slice(0, 4);
  if (business.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">Business events</div>
      {business.map((ev) => <EventCard key={ev.id} ev={ev} />)}
    </div>
  );
}
