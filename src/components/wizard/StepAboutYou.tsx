'use client';

import { useState } from 'react';
import { Field, TextInput, Select, StepActions } from './FormFields';
import { updateAbout } from '@/lib/api';

const OCCUPATIONS = ['Professional', 'Entrepreneur', 'Business owner', 'Student', 'Investor', 'Community leader', 'Other'];

export default function StepAboutYou({ onNext, onBack }: { onNext: () => void; onBack?: () => void }) {
  const [form, setForm] = useState({ photo_url: '', city: '', residence_country: '', occupation_type: '', date_of_birth: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      await updateAbout(form);
      onNext();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-navy mb-1">About you</h2>
      <p className="text-sm text-gray-500 mb-6">Tell us a little more about yourself.</p>

      <Field label="Profile photo URL" hint="Upload support can be added later — for now, paste a hosted image URL.">
        <TextInput
          placeholder="https://..."
          value={form.photo_url}
          onChange={(e) => setForm({ ...form, photo_url: e.target.value })}
        />
      </Field>

      <Field label="Date of birth" hint="Optional, with privacy controls.">
        <TextInput type="date" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="City">
          <TextInput value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
        </Field>
        <Field label="Country of residence">
          <TextInput value={form.residence_country} onChange={(e) => setForm({ ...form, residence_country: e.target.value })} />
        </Field>
      </div>

      <Field label="What best describes you?">
        <Select options={OCCUPATIONS} value={form.occupation_type} onChange={(e) => setForm({ ...form, occupation_type: e.target.value })} />
      </Field>

      {error ? <p className="text-sm text-red-600 mb-2">{error}</p> : null}
      <StepActions onBack={onBack} onNext={submit} loading={loading} />
    </div>
  );
}
