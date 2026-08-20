'use client';

import { useState } from 'react';
import { CheckboxGrid, StepActions } from './FormFields';
import { updateInterests } from '@/lib/api';

const INTERESTS = [
  'Business & Entrepreneurship', 'Investment', 'Careers', 'Education', 'Charity & Seva',
  'Sikh History & Heritage', 'Sikh Community', 'Networking', 'Matrimony', 'Travel',
  'Technology', 'Leadership', 'Media & Entertainment', 'Sport', 'Young Professionals',
];

export default function StepInterests({ profile, onNext, onBack }: { profile?: any; onNext: () => void; onBack?: () => void }) {
  const [selected, setSelected] = useState<string[]>(
    () => (profile?.interests || []).map((i: any) => i.interest_tag)
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggle = (opt: string) => {
    setSelected((prev) => (prev.includes(opt) ? prev.filter((o) => o !== opt) : [...prev, opt]));
  };

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      await updateInterests(selected);
      onNext();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-navy mb-1">Your interests</h2>
      <p className="text-sm text-gray-500 mb-6">
        What are you interested in? This helps personalise your Sikh Group experience.
      </p>

      <CheckboxGrid options={INTERESTS} selected={selected} onToggle={toggle} columns={3} />

      {error ? <p className="text-sm text-red-600 mt-4">{error}</p> : null}
      <StepActions onBack={onBack} onNext={submit} loading={loading} />
    </div>
  );
}
