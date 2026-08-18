'use client';

import { useState } from 'react';
import { Toggle, StepActions } from './FormFields';
import { updateCommunicationPreferences } from '@/lib/api';

const CHANNELS = [
  { key: 'channel_email', label: 'Email' },
  { key: 'channel_sms', label: 'SMS / text' },
  { key: 'channel_push', label: 'Push notifications' },
  { key: 'channel_whatsapp', label: 'WhatsApp' },
];

const TOPICS = [
  { key: 'topic_alerts', label: 'Important alerts' },
  { key: 'topic_community_news', label: 'Community news' },
  { key: 'topic_events', label: 'Events' },
  { key: 'topic_business', label: 'Business opportunities' },
  { key: 'topic_awards', label: 'Awards & recognition' },
  { key: 'topic_new_projects', label: 'New Sikh Group projects' },
];

export default function StepCommunicationPreferences({ onNext, onBack }: { onNext: () => void; onBack?: () => void }) {
  const [form, setForm] = useState<Record<string, boolean>>({
    channel_email: true, channel_sms: false, channel_push: false, channel_whatsapp: false,
    topic_alerts: true, topic_community_news: true, topic_events: true,
    topic_business: true, topic_awards: true, topic_new_projects: true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      await updateCommunicationPreferences(form);
      onNext();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-navy mb-1">Communication preferences</h2>
      <p className="text-sm text-gray-500 mb-6">How would you like to hear from us? Stay in control of your inbox.</p>

      <div className="mb-6">
        <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">Channels</div>
        <div className="bg-white rounded-lg border border-gray-200 px-4">
          {CHANNELS.map((c) => (
            <Toggle key={c.key} label={c.label} checked={form[c.key]} onChange={(v) => setForm({ ...form, [c.key]: v })} />
          ))}
        </div>
      </div>

      <div>
        <div className="text-xs text-gray-400 uppercase tracking-wide mb-2">What you want to hear about</div>
        <div className="bg-white rounded-lg border border-gray-200 px-4">
          {TOPICS.map((t) => (
            <Toggle key={t.key} label={t.label} checked={form[t.key]} onChange={(v) => setForm({ ...form, [t.key]: v })} />
          ))}
        </div>
      </div>

      {error ? <p className="text-sm text-red-600 mt-4">{error}</p> : null}
      <StepActions onBack={onBack} onNext={submit} loading={loading} />
    </div>
  );
}
