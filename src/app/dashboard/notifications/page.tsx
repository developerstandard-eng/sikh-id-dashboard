'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { useAuthFromUrl, useProfile } from '@/lib/useAuth';
import { getNotifications, markAllNotificationsRead, markNotificationRead } from '@/lib/api';
import { timeAgo } from '@/lib/timeAgo';

interface NotificationItem {
  id: number;
  icon: string;
  title: string;
  link_url: string | null;
  read_at: string | null;
  created_at: string;
}

export default function NotificationsPage() {
  useAuthFromUrl();
  const { profile, loading, error } = useProfile();
  const [items, setItems] = useState<NotificationItem[] | null>(null);

  useEffect(() => {
    if (!profile) return;
    getNotifications().then((d) => setItems(d.items)).catch(() => setItems([]));
  }, [profile]);

  const markRead = async (item: NotificationItem) => {
    if (item.read_at) return;
    setItems((prev) => (prev || []).map((i) => (i.id === item.id ? { ...i, read_at: new Date().toISOString() } : i)));
    try {
      await markNotificationRead(item.id);
    } catch {
      // best-effort — a stale unread flag isn't worth a retry loop here
    }
  };

  const markAll = async () => {
    setItems((prev) => (prev || []).map((i) => ({ ...i, read_at: i.read_at || new Date().toISOString() })));
    try {
      await markAllNotificationsRead();
    } catch {
      // no-op
    }
  };

  if (loading) return <div className="p-10 text-sm text-gray-400">Loading...</div>;

  if (error === 'not_authenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy text-white">
        <div className="text-center">
          <p className="mb-4">You need to be logged in to view notifications.</p>
          <Link href="/login" className="text-saffron underline">Go to login</Link>
        </div>
      </div>
    );
  }

  const unreadCount = (items || []).filter((i) => !i.read_at).length;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 h-full overflow-y-auto bg-[#f5f6f8]">
        <TopBar fullName={profile?.user.full_name} sikhId={profile?.user.sikh_id} photoUrl={profile?.about?.photo_url} title="Notifications" />
        <main className="p-8 max-w-2xl">
          {unreadCount > 0 ? (
            <div className="flex justify-end mb-3">
              <button type="button" onClick={markAll} className="text-xs text-saffron font-medium hover:underline">
                Mark all as read
              </button>
            </div>
          ) : null}

          {items === null ? (
            <div className="text-sm text-gray-400">Loading...</div>
          ) : items.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-16 flex flex-col items-center text-center">
              <div className="text-3xl mb-3">🔔</div>
              <div className="text-sm font-semibold text-navy mb-1">No notifications yet</div>
              <p className="text-xs text-gray-400 max-w-xs">
                New events, news, and reminders will show up here.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {items.map((n) => {
                const body = (
                  <div
                    className="flex items-start gap-3 px-5 py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50 cursor-pointer"
                    onClick={() => markRead(n)}
                  >
                    <span className="text-base leading-none mt-0.5">{n.icon}</span>
                    <div className="flex-1">
                      <div className="text-sm text-navy">{n.title}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{timeAgo(n.created_at)}</div>
                    </div>
                    {!n.read_at ? <span className="w-2 h-2 rounded-full bg-saffron mt-1.5 shrink-0" /> : null}
                  </div>
                );
                return n.link_url ? (
                  <Link key={n.id} href={n.link_url}>{body}</Link>
                ) : (
                  <div key={n.id}>{body}</div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
