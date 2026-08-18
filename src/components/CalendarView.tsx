'use client';

import { useMemo, useState } from 'react';

interface EventItem {
  id: number; title: string; event_type: string; event_date: string; event_time: string | null;
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const TYPE_DOT: Record<string, string> = {
  community: 'bg-saffron', business: 'bg-blue-500', award: 'bg-purple-500', webinar: 'bg-teal-500', other: 'bg-gray-400',
};

function toKey(d: Date) {
  return d.toISOString().slice(0, 10);
}

export default function CalendarView({ events }: { events: EventItem[] }) {
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const eventsByDay = useMemo(() => {
    const map: Record<string, EventItem[]> = {};
    for (const ev of events || []) {
      const key = ev.event_date.slice(0, 10);
      if (!map[key]) map[key] = [];
      map[key].push(ev);
    }
    return map;
  }, [events]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startWeekday = firstDay.getDay();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  const today = toKey(new Date());

  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const selectedEvents = selectedKey ? eventsByDay[selectedKey] || [] : [];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => setCursor(new Date(year, month - 1, 1))} className="text-gray-400 hover:text-navy text-sm px-2">‹</button>
        <div className="text-sm font-semibold text-navy">
          {cursor.toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
        </div>
        <button onClick={() => setCursor(new Date(year, month + 1, 1))} className="text-gray-400 hover:text-navy text-sm px-2">›</button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-1">
        {WEEKDAYS.map((w) => (
          <div key={w} className="text-[10px] text-gray-400 text-center font-medium">{w}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <div key={i} />;
          const key = toKey(d);
          const dayEvents = eventsByDay[key] || [];
          const isToday = key === today;
          const isSelected = key === selectedKey;
          return (
            <button
              key={i}
              onClick={() => setSelectedKey(dayEvents.length ? key : null)}
              className={`aspect-square rounded-lg text-xs flex flex-col items-center justify-center gap-0.5 transition-colors ${
                isSelected ? 'bg-navy text-white' : isToday ? 'bg-saffron/10 text-saffron font-semibold' : 'text-navy hover:bg-gray-50'
              }`}
            >
              <span>{d.getDate()}</span>
              {dayEvents.length > 0 ? (
                <span className="flex gap-0.5">
                  {dayEvents.slice(0, 3).map((ev) => (
                    <span key={ev.id} className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : TYPE_DOT[ev.event_type] || 'bg-gray-400'}`} />
                  ))}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {selectedEvents.length > 0 ? (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
          {selectedEvents.map((ev) => (
            <div key={ev.id} className="text-xs">
              <span className="font-medium text-navy">{ev.title}</span>
              {ev.event_time ? <span className="text-gray-400"> · {ev.event_time}</span> : null}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
