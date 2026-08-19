'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import EcosystemGrid from '@/components/EcosystemGrid';
import HukamnamaBanner from '@/components/HukamnamaBanner';
import NewsCorner from '@/components/NewsCorner';
import { UpcomingEventsCard, BusinessEventsCard } from '@/components/EventsCards';
import CalendarView from '@/components/CalendarView';
import { useAuthFromUrl, useProfile } from '@/lib/useAuth';
import { getEvents, getNews, getHukamnamaToday } from '@/lib/api';
import Link from 'next/link';

// The section a user still needs to finish, in stage order — mirrors
// completionScore.service.js on the backend so the "X things left" list
// here always matches what actually moves the percentage.
const SECTION_LABELS: Record<string, string> = {
  about_you: 'Add a profile photo',
  professional: 'Add your professional information',
  interests: 'Choose your interests',
  group_preferences: 'Choose your Sikh Group preferences',
  communication_preferences: 'Choose your communication preferences',
  community_profile: 'Complete your community profile',
  final_confirmation: 'Confirm your Sikh ID',
};

export default function DashboardPage() {
  useAuthFromUrl();
  const { profile, loading, error } = useProfile();
  const [events, setEvents] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [hukam, setHukam] = useState<any>(null);

  useEffect(() => {
    if (!profile) return;
    getEvents().then(setEvents).catch(() => {});
    getNews().then(setNews).catch(() => {});
    getHukamnamaToday().then(setHukam).catch(() => {});
  }, [profile]);

  if (loading) {
    return <div className="p-10 text-sm text-gray-400">Loading your Sikh ID...</div>;
  }

  if (error === 'not_authenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy text-white">
        <div className="text-center">
          <p className="mb-4">You need to be logged in to view your dashboard.</p>
          <Link href="/login" className="text-saffron underline">Go to login</Link>
        </div>
      </div>
    );
  }

  const completion = profile?.user.profile_completion ?? 0;
  const remaining = Object.entries(profile?.sectionStatus || {}).filter(([, done]) => !done);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 h-full overflow-y-auto bg-[#f5f6f8]">
        <TopBar fullName={profile?.user.full_name} sikhId={profile?.user.sikh_id} title="Dashboard" />

        <main className="p-8">
          <HukamnamaBanner hukam={hukam} />

          {/* Welcome banner */}
          <div className="bg-navy rounded-2xl p-8 mb-8 relative overflow-hidden">
            <div className="relative z-10 max-w-xl">
              <h2 className="text-white text-2xl font-semibold mb-2">
                Welcome back, {profile?.user.full_name?.split(' ')[0] || 'friend'} 👋
              </h2>
              <p className="text-white/60 text-sm mb-6">
                Your Sikh ID is your gateway to a world of connections, opportunities and impact.
              </p>

              {completion < 100 ? (
                <Link
                  href="/dashboard/profile"
                  className="inline-block bg-saffron text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-saffron-dark transition-colors mb-5"
                >
                  Complete your profile
                </Link>
              ) : null}

              <div className="flex items-center gap-3">
                <span className="text-xs text-white/60 whitespace-nowrap">
                  Your profile is {completion}% complete
                </span>
                <div className="progress-track h-2 w-64">
                  <div className="progress-fill h-2" style={{ width: `${completion}%` }} />
                </div>
                <span className="text-xs text-saffron font-medium">{completion}%</span>
              </div>
            </div>
            <div className="absolute right-8 top-1/2 -translate-y-1/2 text-white/10 text-6xl font-bold hidden lg:block">
              ID
            </div>
          </div>

          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2">
              <EcosystemGrid />

              <h2 className="text-sm font-semibold text-navy tracking-wide uppercase mb-3">
                Stay engaged
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-8">
                <CalendarView events={events} />
                <div className="space-y-4">
                  <UpcomingEventsCard events={events} />
                  <BusinessEventsCard events={events} />
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* Profile summary */}
              <div className="bg-navy rounded-xl p-5 text-white">
                <div className="text-xs text-white/50 uppercase tracking-wide mb-3">My profile summary</div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-medium">
                    {profile?.user.full_name?.[0] || '?'}
                  </div>
                  <div>
                    <div className="font-medium">{profile?.user.full_name}</div>
                    <div className="text-xs text-white/50">{profile?.user.sikh_id}</div>
                  </div>
                </div>
                <Link href="/dashboard/profile" className="text-xs text-saffron font-medium hover:underline">
                  View my profile →
                </Link>
              </div>

              {/* What's left */}
              {completion < 100 && remaining.length > 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="text-xs text-gray-400 uppercase tracking-wide mb-3">
                    {remaining.length} things left to complete
                  </div>
                  <ul className="space-y-2 mb-4">
                    {remaining.slice(0, 4).map(([key]) => (
                      <li key={key} className="flex items-center gap-2 text-sm text-navy">
                        <span className="w-4 h-4 rounded-full border border-gray-300 shrink-0" />
                        {SECTION_LABELS[key] || key}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/dashboard/profile"
                    className="block text-center bg-saffron text-white text-xs font-medium py-2 rounded-lg hover:bg-saffron-dark transition-colors"
                  >
                    Complete my profile
                  </Link>
                </div>
              ) : (
                <div className="bg-white rounded-xl border border-gray-200 p-5">
                  <div className="text-sm font-medium text-navy mb-1">Your Sikh ID is complete 🎉</div>
                  <p className="text-xs text-gray-500">You're set up across the full Sikh Group ecosystem.</p>
                </div>
              )}

              {/* Quick actions */}
              <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="text-xs text-gray-400 uppercase tracking-wide mb-3">Quick actions</div>
                <ul className="space-y-2 text-sm text-navy">
                  {['Update profile', 'Account settings', 'Privacy & security', 'Manage preferences'].map((a) => (
                    <li key={a} className="flex items-center justify-between py-1.5 cursor-pointer hover:text-saffron">
                      {a}
                      <span className="text-gray-300">›</span>
                    </li>
                  ))}
                </ul>
              </div>

              <NewsCorner items={news} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
