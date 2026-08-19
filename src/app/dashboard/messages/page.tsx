'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { useAuthFromUrl, useProfile } from '@/lib/useAuth';
import {
  getConversations, getConversationMessages, markConversationRead, sendConversationMessage, startConversation,
} from '@/lib/api';

interface Conversation {
  id: number;
  other_user_id: number;
  other_full_name: string;
  other_sikh_id: string;
  last_message: string | null;
  unread: number;
  last_message_at: string | null;
}

interface Message {
  id: number;
  sender_id: number;
  body: string;
  created_at: string;
}

export default function MessagesPage() {
  useAuthFromUrl();
  const { profile, loading, error } = useProfile();
  const [conversations, setConversations] = useState<Conversation[] | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [newSikhId, setNewSikhId] = useState('');
  const [startError, setStartError] = useState<string | null>(null);
  const threadEndRef = useRef<HTMLDivElement>(null);

  const reloadConversations = () => getConversations().then(setConversations).catch(() => {});

  useEffect(() => {
    if (!profile) return;
    reloadConversations();
    const interval = setInterval(reloadConversations, 10000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  useEffect(() => {
    if (!activeId) return;
    const load = () => getConversationMessages(activeId).then(setMessages).catch(() => {});
    load();
    markConversationRead(activeId).then(reloadConversations).catch(() => {});
    const interval = setInterval(load, 4000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ block: 'end' });
  }, [messages]);

  const openConversation = (id: number) => {
    setActiveId(id);
  };

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    const sikhId = newSikhId.trim();
    if (!sikhId) return;
    setStartError(null);
    try {
      const data = await startConversation(sikhId);
      setNewSikhId('');
      await reloadConversations();
      setActiveId(data.conversation_id);
    } catch (e: any) {
      setStartError(e.message);
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeId || !input.trim()) return;
    const body = input.trim();
    setInput('');
    try {
      const sent = await sendConversationMessage(activeId, body);
      setMessages((prev) => [...prev, sent]);
      reloadConversations();
    } catch {
      setInput(body); // put it back so the user doesn't lose what they typed
    }
  };

  if (loading) return <div className="p-10 text-sm text-gray-400">Loading...</div>;

  if (error === 'not_authenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy text-white">
        <div className="text-center">
          <p className="mb-4">You need to be logged in to view messages.</p>
          <Link href="/login" className="text-saffron underline">Go to login</Link>
        </div>
      </div>
    );
  }

  const active = conversations?.find((c) => c.id === activeId) || null;
  const myId = profile?.user.id;

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 h-full overflow-y-auto bg-[#f5f6f8]">
        <TopBar fullName={profile?.user.full_name} sikhId={profile?.user.sikh_id} title="Messages" />
        <main className="p-8">
          <div className="grid grid-cols-[1fr_2fr] gap-5 max-w-4xl">
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col">
              <form onSubmit={handleStart} className="p-3 border-b border-gray-100 flex gap-2">
                <input
                  value={newSikhId}
                  onChange={(e) => setNewSikhId(e.target.value)}
                  placeholder="Sikh ID, e.g. TSG-10002"
                  className="flex-1 min-w-0 border border-gray-300 rounded-lg px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-saffron/40"
                />
                <button type="submit" className="text-xs font-medium border border-gray-300 rounded-lg px-3 py-2 hover:border-saffron">
                  Start
                </button>
              </form>
              {startError ? <p className="text-xs text-red-600 px-3 pt-2">{startError}</p> : null}

              <div className="flex-1 overflow-y-auto">
                {conversations === null ? (
                  <div className="p-4 text-xs text-gray-400">Loading...</div>
                ) : conversations.length === 0 ? (
                  <div className="p-4 text-xs text-gray-400">No conversations yet. Start one above using a member&apos;s Sikh ID.</div>
                ) : (
                  conversations.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => openConversation(c.id)}
                      className={`px-4 py-3 border-b border-gray-100 cursor-pointer ${activeId === c.id ? 'bg-gray-50' : 'hover:bg-gray-50'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-navy truncate">{c.other_full_name}</span>
                        {c.unread > 0 ? (
                          <span className="text-[10px] font-semibold bg-saffron text-white rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1 shrink-0">
                            {c.unread}
                          </span>
                        ) : null}
                      </div>
                      <div className="text-xs text-gray-400 truncate mt-0.5">{c.last_message || 'No messages yet'}</div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 flex flex-col" style={{ height: 480 }}>
              <div className="px-5 py-3.5 border-b border-gray-100 text-sm font-semibold text-navy">
                {active ? (
                  <>
                    {active.other_full_name} <span className="text-xs text-gray-400 font-normal">{active.other_sikh_id}</span>
                  </>
                ) : (
                  'Select a conversation'
                )}
              </div>
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-[70%] px-3.5 py-2 rounded-2xl text-sm leading-snug ${
                      m.sender_id === myId ? 'self-end bg-saffron text-white' : 'self-start bg-gray-100 text-navy'
                    }`}
                  >
                    {m.body}
                  </div>
                ))}
                <div ref={threadEndRef} />
              </div>
              <form onSubmit={handleSend} className="flex gap-2 p-3 border-t border-gray-100">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Write a message..."
                  disabled={!activeId}
                  className="flex-1 min-w-0 border border-gray-300 rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/40 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={!activeId}
                  className="bg-saffron text-white text-sm font-medium px-5 py-2 rounded-lg hover:bg-saffron-dark transition-colors disabled:opacity-60"
                >
                  Send
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
