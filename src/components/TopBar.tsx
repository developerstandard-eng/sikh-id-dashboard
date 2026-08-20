'use client';

import Link from 'next/link';

interface Props {
  fullName?: string;
  sikhId?: string;
  photoUrl?: string | null;
  title: string;
}

export default function TopBar({ fullName, sikhId, photoUrl, title }: Props) {
  const initials = fullName
    ? fullName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '—';

  return (
    <header className="flex items-center justify-between px-8 py-5 bg-white border-b border-gray-200">
      <h1 className="text-lg font-semibold text-navy">{title}</h1>
      <div className="flex items-center gap-6">
        <button className="text-sm text-gray-500 hover:text-navy">EN</button>
        <Link href="/dashboard/notifications" className="relative text-gray-500 hover:text-navy" aria-label="Notifications">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M6 9a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9Z" />
            <path d="M10 19a2 2 0 0 0 4 0" />
          </svg>
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-navy text-white text-xs flex items-center justify-center font-medium overflow-hidden shrink-0">
            {photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className="leading-tight">
            <div className="text-sm font-medium text-navy">{fullName || 'Guest'}</div>
            <div className="text-xs text-gray-400">{sikhId ? `Sikh ID: ${sikhId}` : ''}</div>
          </div>
        </div>
      </div>
    </header>
  );
}
