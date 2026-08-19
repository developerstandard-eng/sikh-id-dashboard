'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { useAuthFromUrl, useProfile } from '@/lib/useAuth';
import { createSupportTicket, getSupportTickets } from '@/lib/api';

const FAQS = [
  {
    q: 'How do I complete my Sikh ID profile?',
    a: 'Go to My Profile from the sidebar — it walks you through each stage and your completion percentage updates as you go.',
  },
  {
    q: 'Can I use one Sikh ID across multiple Sikh Group sites?',
    a: "Yes — once logged in on one Sikh Group site, you're automatically recognised on the others without logging in again.",
  },
  {
    q: 'How do I appear in The Sikh Directory?',
    a: 'Complete the Community Profile step in your profile wizard and choose "Yes, list my business," or toggle it in Settings → Privacy.',
  },
  {
    q: 'How do I stop receiving reminder emails?',
    a: 'Go to Settings → Communication and turn off the Email channel, or turn off specific topics.',
  },
  {
    q: 'Can other members message me?',
    a: 'By default, yes. Turn this off from Settings → Privacy → Allow other members to message me.',
  },
];

interface Ticket {
  id: number;
  subject: string;
  status: 'open' | 'resolved';
  created_at: string;
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left flex items-center justify-between px-5 py-3.5 text-sm font-medium text-navy"
      >
        {q}
        <span className="text-gray-400 ml-3">{open ? '−' : '+'}</span>
      </button>
      {open ? <div className="px-5 pb-4 text-xs text-gray-500 leading-relaxed">{a}</div> : null}
    </div>
  );
}

export default function HelpPage() {
  useAuthFromUrl();
  const { profile, loading, error } = useProfile();
  const [tickets, setTickets] = useState<Ticket[] | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const reloadTickets = () => getSupportTickets().then(setTickets).catch(() => setTickets([]));

  useEffect(() => {
    if (!profile) return;
    reloadTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const submitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setSubmitError(null);
    setSent(false);
    try {
      await createSupportTicket(subject, message);
      setSubject('');
      setMessage('');
      setSent(true);
      await reloadTickets();
    } catch (e: any) {
      setSubmitError(e.message);
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="p-10 text-sm text-gray-400">Loading...</div>;

  if (error === 'not_authenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy text-white">
        <div className="text-center">
          <p className="mb-4">You need to be logged in to view Help & Support.</p>
          <Link href="/login" className="text-saffron underline">Go to login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 h-full overflow-y-auto bg-[#f5f6f8]">
        <TopBar fullName={profile?.user.full_name} sikhId={profile?.user.sikh_id} title="Help & Support" />
        <main className="p-8 max-w-2xl">
          <h3 className="text-sm font-semibold text-navy mb-3">Frequently asked questions</h3>
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-8">
            {FAQS.map((f) => <FaqItem key={f.q} q={f.q} a={f.a} />)}
          </div>

          <h3 className="text-sm font-semibold text-navy mb-3">Contact support</h3>
          <form onSubmit={submitTicket} className="bg-white rounded-2xl border border-gray-200 p-6 mb-8">
            <label className="block mb-4">
              <span className="block text-sm font-medium text-navy mb-1.5">Subject</span>
              <input
                required value={subject} onChange={(e) => setSubject(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/40"
              />
            </label>
            <label className="block mb-4">
              <span className="block text-sm font-medium text-navy mb-1.5">How can we help?</span>
              <textarea
                required rows={4} value={message} onChange={(e) => setMessage(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/40"
              />
            </label>
            {submitError ? <p className="text-sm text-red-600 mb-3">{submitError}</p> : null}
            <button
              type="submit" disabled={sending}
              className="bg-saffron text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-saffron-dark transition-colors disabled:opacity-60"
            >
              {sending ? 'Sending...' : 'Send message'}
            </button>
            {sent ? <p className="text-sm text-green-700 mt-3">Your message has been sent — our team will follow up by email.</p> : null}
          </form>

          <h3 className="text-sm font-semibold text-navy mb-3">Your past requests</h3>
          {tickets === null ? (
            <div className="text-sm text-gray-400">Loading...</div>
          ) : tickets.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-10 text-center">
              <p className="text-xs text-gray-400">Anything you send above will show up here.</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {tickets.map((t) => (
                <div key={t.id} className="flex items-center justify-between px-5 py-4 border-b border-gray-100 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-navy">{t.subject}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{new Date(t.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  </div>
                  <span
                    className={`text-[10px] font-medium uppercase tracking-wide px-2 py-1 rounded ${
                      t.status === 'resolved' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}
                  >
                    {t.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
