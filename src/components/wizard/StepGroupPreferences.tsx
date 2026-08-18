'use client';

import { useState } from 'react';
import { CheckboxGrid, StepActions } from './FormFields';
import { updateGroupPreferences } from '@/lib/api';

const LIVE_PLATFORMS = [
  'The Sikh Directory', 'The Sikh Awards', 'The Sikh 100', 'The Sikh Match',
  'The Sikh Alert', 'The Sikh Billionaires Club', 'The Sikh Watch', 'The Sikh Consultancy',
];

const FUTURE_PLATFORMS = ['The Sikh Charity', 'The Sikh Bank', 'The Sikh Metaverse'];

export default function StepGroupPreferences({ onNext, onBack }: { onNext: () => void; onBack?: () => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = (opt: string) => {
    setSelected((prev) => (prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]));
  };

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      const platforms = [...LIVE_PLATFORMS, ...FUTURE_PLATFORMS].map((name) => ({
        name,
        subscribed: selected.includes(name),
      }));
      await updateGroupPreferences(platforms);
      onNext();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-navy mb-1">Your Sikh Group preferences</h2>
      <p className="text-sm text-gray-500 mb-4">Which Sikh Group platforms would you like to hear from?</p>

      <CheckboxGrid options={LIVE_PLATFORMS} selected={selected} onToggle={toggle} columns={2} />

      <p className="text-sm text-gray-500 mt-6 mb-4">Notify me when these future platforms launch:</p>
      <CheckboxGrid options={FUTURE_PLATFORMS} selected={selected} onToggle={toggle} columns={2} />

      {error ? <p className="text-sm text-red-600 mt-4">{error}</p> : null}
      <StepActions onBack={onBack} onNext={submit} loading={loading} />
    </div>
  );
}
