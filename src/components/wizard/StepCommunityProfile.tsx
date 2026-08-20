'use client';

import { useState } from 'react';
import { Field, TextInput, Select, StepActions } from './FormFields';
import { updateCommunityProfile } from '@/lib/api';

const CATEGORIES = ['Retail', 'Professional Services', 'Technology', 'Hospitality', 'Healthcare', 'Education', 'Other'];

export default function StepCommunityProfile({ profile, onNext, onBack }: { profile?: any; onNext: () => void; onBack?: () => void }) {
  const directory = profile?.directory || {};
  const [wantsListing, setWantsListing] = useState<boolean | null>(
    profile?.directory ? !!directory.wants_listing : null
  );
  const [form, setForm] = useState({
    business_name: directory.business_name || '',
    website: directory.website || '',
    business_category: directory.business_category || '',
    city: directory.city || '',
    country: directory.country || '',
    description: directory.description || '',
    contact_details: directory.contact_details || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setLoading(true);
    setError(null);
    try {
      await updateCommunityProfile({ wants_listing: !!wantsListing, ...(wantsListing ? form : {}) });
      onNext();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-navy mb-1">Your community profile</h2>
      <p className="text-sm text-gray-500 mb-6">Would you like to appear in The Sikh Directory?</p>

      <div className="flex gap-3 mb-6">
        <button
          type="button"
          onClick={() => setWantsListing(true)}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium border ${wantsListing === true ? 'bg-saffron text-white border-saffron' : 'border-gray-300 text-gray-600'}`}
        >
          Yes, list my business
        </button>
        <button
          type="button"
          onClick={() => setWantsListing(false)}
          className={`px-5 py-2.5 rounded-lg text-sm font-medium border ${wantsListing === false ? 'bg-navy text-white border-navy' : 'border-gray-300 text-gray-600'}`}
        >
          Not right now
        </button>
      </div>

      {wantsListing ? (
        <div className="border-t border-gray-100 pt-6">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Business / organisation name">
              <TextInput value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} />
            </Field>
            <Field label="Website">
              <TextInput value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} />
            </Field>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Category">
              <Select options={CATEGORIES} value={form.business_category} onChange={(e) => setForm({ ...form, business_category: e.target.value })} />
            </Field>
            <Field label="City">
              <TextInput value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            </Field>
            <Field label="Country">
              <TextInput value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
            </Field>
          </div>
          <Field label="Short description">
            <TextInput value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </Field>
          <Field label="Business contact details">
            <TextInput value={form.contact_details} onChange={(e) => setForm({ ...form, contact_details: e.target.value })} />
          </Field>
        </div>
      ) : null}

      {error ? <p className="text-sm text-red-600 mt-2">{error}</p> : null}
      <StepActions onBack={onBack} onNext={submit} loading={loading} nextLabel={wantsListing === null ? 'Choose an option first' : 'Continue'} />
    </div>
  );
}
