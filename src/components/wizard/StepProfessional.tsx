'use client';

import { useState } from 'react';
import { Field, TextInput, Select, StepActions } from './FormFields';
import { updateProfessional } from '@/lib/api';

const INDUSTRIES = [
  'Finance', 'Technology', 'Property', 'Healthcare', 'Education', 'Legal',
  'Media & Entertainment', 'Hospitality', 'Retail', 'Manufacturing', 'Professional Services', 'Other',
];

export default function StepProfessional({ profile, onNext, onBack }: { profile?: any; onNext: () => void; onBack?: () => void }) {
  const professional = profile?.professional || {};
  const [form, setForm] = useState({
    job_title: professional.job_title || '',
    company: professional.company || '',
    industry: professional.industry || '',
    experience_years: professional.experience_years != null ? String(professional.experience_years) : '',
    linkedin_url: professional.linkedin_url || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      await updateProfessional({ ...form, experience_years: form.experience_years ? Number(form.experience_years) : null });
      onNext();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-navy mb-1">Your professional profile</h2>
      <p className="text-sm text-gray-500 mb-6">This is where Sikh ID becomes genuinely useful across the ecosystem.</p>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Job title / position">
          <TextInput value={form.job_title} onChange={(e) => setForm({ ...form, job_title: e.target.value })} />
        </Field>
        <Field label="Company / organisation">
          <TextInput value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Industry">
          <Select options={INDUSTRIES} value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} />
        </Field>
        <Field label="Years of experience">
          <TextInput type="number" min={0} value={form.experience_years} onChange={(e) => setForm({ ...form, experience_years: e.target.value })} />
        </Field>
      </div>

      <Field label="LinkedIn profile" hint="Optional">
        <TextInput placeholder="https://linkedin.com/in/..." value={form.linkedin_url} onChange={(e) => setForm({ ...form, linkedin_url: e.target.value })} />
      </Field>

      {error ? <p className="text-sm text-red-600 mb-2">{error}</p> : null}
      <StepActions onBack={onBack} onNext={submit} loading={loading} />
    </div>
  );
}
