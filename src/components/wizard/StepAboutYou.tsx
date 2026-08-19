'use client';

import { useRef, useState } from 'react';
import { Field, TextInput, Select, StepActions } from './FormFields';
import { updateAbout, uploadProfilePhoto } from '@/lib/api';

const OCCUPATIONS = ['Professional', 'Entrepreneur', 'Business owner', 'Student', 'Investor', 'Community leader', 'Other'];

export default function StepAboutYou({ onNext, onBack }: { onNext: () => void; onBack?: () => void }) {
  const [form, setForm] = useState({ photo_url: '', city: '', residence_country: '', occupation_type: '', date_of_birth: '' });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const { photo_url } = await uploadProfilePhoto(file);
      setForm((f) => ({ ...f, photo_url }));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

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

      <Field label="Profile photo">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center shrink-0">
            {form.photo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.photo_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-[10px] text-gray-400 text-center px-1">No photo</span>
            )}
          </div>
          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="text-sm border border-gray-300 rounded-lg px-3.5 py-2 hover:border-saffron transition-colors disabled:opacity-60"
            >
              {uploading ? 'Uploading...' : form.photo_url ? 'Change photo' : 'Upload photo'}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoSelect}
              className="hidden"
            />
            <p className="text-xs text-gray-400 mt-1.5">JPEG, PNG or WEBP, up to 5MB.</p>
          </div>
        </div>
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
