'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { clearTokens } from '@/lib/api';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: 'home' },
  { label: 'My Profile', href: '/dashboard/profile', icon: 'user' },
  { label: 'My Activity', href: '/dashboard/activity', icon: 'activity' },
  { label: 'Saved & Favourites', href: '/dashboard/saved', icon: 'star' },
  { label: 'Messages', href: '/dashboard/messages', icon: 'mail' },
  { label: 'Notifications', href: '/dashboard/notifications', icon: 'bell' },
  { label: 'Settings', href: '/dashboard/settings', icon: 'settings' },
  { label: 'Help & Support', href: '/dashboard/help', icon: 'help' },
];

function Icon({ name }: { name: string }) {
  // Minimal inline icon set — no external icon font dependency for the shipped app
  const common = { width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8 };
  switch (name) {
    case 'home':
      return <svg {...common}><path d="M3 11.5 12 4l9 7.5M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" /></svg>;
    case 'user':
      return <svg {...common}><circle cx="12" cy="8" r="3.5" /><path d="M4.5 20c1.2-3.5 4-5.5 7.5-5.5s6.3 2 7.5 5.5" /></svg>;
    case 'activity':
      return <svg {...common}><path d="M3 12h4l2-7 4 14 2-7h6" /></svg>;
    case 'star':
      return <svg {...common}><path d="M12 3.5 14.6 9l6 .9-4.3 4.2 1 6-5.3-2.8-5.3 2.8 1-6-4.3-4.2 6-.9L12 3.5Z" /></svg>;
    case 'mail':
      return <svg {...common}><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 6.5 8 6 8-6" /></svg>;
    case 'bell':
      return <svg {...common}><path d="M6 9a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9Z" /><path d="M10 19a2 2 0 0 0 4 0" /></svg>;
    case 'settings':
      return <svg {...common}><circle cx="12" cy="12" r="3" /><path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2-1.2L14 3h-4l-.6 2.6a7 7 0 0 0-2 1.2l-2.3-.9-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-.9c.6.5 1.3.9 2 1.2L10 21h4l.6-2.6c.7-.3 1.4-.7 2-1.2l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2Z" /></svg>;
    case 'help':
      return <svg {...common}><circle cx="12" cy="12" r="9" /><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.8.4-1 .8-1 1.7" /><circle cx="12" cy="17" r=".6" fill="currentColor" /></svg>;
    default:
      return null;
  }
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="w-64 bg-navy text-white flex flex-col shrink-0 min-h-screen">
      <div className="px-6 pt-6 pb-5 border-b border-white/10">
        <div className="text-xs tracking-wide text-white/60 uppercase">The Sikh Group</div>
        <div className="text-lg font-semibold">United. Inspired. Empowered.</div>
        <div className="mt-4">
          <div className="text-2xl font-bold leading-none">
            The Sikh <span className="text-saffron">ID</span>
          </div>
          <div className="text-[11px] text-white/50 mt-1">
            One ID. One community. <span className="text-saffron">Endless possibilities.</span>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-colors ${
                active ? 'bg-saffron text-white font-medium' : 'text-white/80 hover:bg-white/5'
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon name={item.icon} />
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mx-4 mb-4 rounded-xl bg-white/5 p-4">
        <div className="text-sm font-medium text-saffron mb-1">Need help?</div>
        <p className="text-xs text-white/60 mb-3">We're here to help you make the most of your Sikh ID.</p>
        <button className="w-full text-xs border border-white/20 rounded-md py-2 hover:bg-white/10 transition-colors">
          Contact support
        </button>
      </div>

      <div className="px-4 mb-6">
        <button
          onClick={() => { clearTokens(); router.push('/login'); }}
          className="w-full text-xs border border-white/20 rounded-md py-2 text-white/70 hover:bg-white/5 transition-colors"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
