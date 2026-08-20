'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import { Field, TextInput, Toggle } from '@/components/wizard/FormFields';
import { useAuthFromUrl, useProfile } from '@/lib/useAuth';
import { changePassword, updateAccount, updateCommunicationPreferences, updatePrivacy } from '@/lib/api';

type Tab = 'account' | 'privacy' | 'communication';

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

function SaveMsg({ text }: { text: string | null }) {
  if (!text) return null;
  return <p className="text-sm text-green-700 mt-3">{text}</p>;
}

export default function SettingsPage() {
  useAuthFromUrl();
  const { profile, loading, error, reload } = useProfile();
  const [tab, setTab] = useState<Tab>('account');

  // Read ?tab= directly rather than via useSearchParams() — matches
  // useAuthFromUrl()'s approach elsewhere in this app and avoids needing a
  // Suspense boundary just to pull one query param.
  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get('tab');
    if (requested === 'account' || requested === 'privacy' || requested === 'communication') {
      setTab(requested);
    }
  }, []);

  if (loading) return <div className="p-10 text-sm text-gray-400">Loading...</div>;

  if (error === 'not_authenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy text-white">
        <div className="text-center">
          <p className="mb-4">You need to be logged in to view Settings.</p>
          <Link href="/login" className="text-saffron underline">Go to login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 h-full overflow-y-auto bg-[#f5f6f8]">
        <TopBar fullName={profile?.user.full_name} sikhId={profile?.user.sikh_id} photoUrl={profile?.about?.photo_url} title="Settings" />
        <main className="p-8 max-w-2xl">
          <div className="flex mb-6 border border-gray-200 rounded-lg p-1 text-sm bg-white w-fit">
            {(['account', 'privacy', 'communication'] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`px-5 py-1.5 rounded-md font-medium capitalize transition-colors ${tab === t ? 'bg-navy text-white' : 'text-gray-500'}`}
              >
                {t}
              </button>
            ))}
          </div>

          {tab === 'account' && profile ? <AccountTab profile={profile} reload={reload} /> : null}
          {tab === 'privacy' && profile ? <PrivacyTab profile={profile} reload={reload} /> : null}
          {tab === 'communication' && profile ? <CommunicationTab profile={profile} reload={reload} /> : null}
        </main>
      </div>
    </div>
  );
}

function AccountTab({ profile, reload }: { profile: any; reload: () => Promise<void> }) {
  const [form, setForm] = useState({
    full_name: profile.user.full_name || '',
    mobile: profile.user.mobile || '',
    country: profile.user.country || '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  const saveDetails = async () => {
    setSaving(true);
    setError(null);
    setSaved(null);
    try {
      await updateAccount(form);
      await reload();
      setSaved('Saved.');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const [pw, setPw] = useState({ current_password: '', new_password: '' });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);
  const [pwSaved, setPwSaved] = useState<string | null>(null);

  const savePassword = async () => {
    setPwSaving(true);
    setPwError(null);
    setPwSaved(null);
    try {
      await changePassword(pw.current_password, pw.new_password);
      setPw({ current_password: '', new_password: '' });
      setPwSaved('Password updated.');
    } catch (e: any) {
      setPwError(e.message);
    } finally {
      setPwSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-navy mb-4">Account details</h3>
        <Field label="Full name">
          <TextInput value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Mobile">
            <TextInput value={form.mobile} onChange={(e) => setForm({ ...form, mobile: e.target.value })} />
          </Field>
          <Field label="Country">
            <TextInput value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
          </Field>
        </div>
        {error ? <p className="text-sm text-red-600 mb-2">{error}</p> : null}
        <button
          type="button"
          onClick={saveDetails}
          disabled={saving}
          className="bg-saffron text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-saffron-dark transition-colors disabled:opacity-60"
        >
          {saving ? 'Saving...' : 'Save details'}
        </button>
        <SaveMsg text={saved} />
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <h3 className="text-sm font-semibold text-navy mb-4">Change password</h3>
        <Field label="Current password">
          <TextInput type="password" value={pw.current_password} onChange={(e) => setPw({ ...pw, current_password: e.target.value })} />
        </Field>
        <Field label="New password" hint="At least 8 characters.">
          <TextInput type="password" value={pw.new_password} onChange={(e) => setPw({ ...pw, new_password: e.target.value })} />
        </Field>
        {pwError ? <p className="text-sm text-red-600 mb-2">{pwError}</p> : null}
        <button
          type="button"
          onClick={savePassword}
          disabled={pwSaving || !pw.current_password || pw.new_password.length < 8}
          className="bg-saffron text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-saffron-dark transition-colors disabled:opacity-60"
        >
          {pwSaving ? 'Updating...' : 'Update password'}
        </button>
        <SaveMsg text={pwSaved} />
      </div>
    </div>
  );
}

function PrivacyTab({ profile, reload }: { profile: any; reload: () => Promise<void> }) {
  const [dobVisible, setDobVisible] = useState(profile.about?.dob_visibility === 'public');
  const [wantsListing, setWantsListing] = useState(!!profile.directory?.wants_listing);
  const [allowDms, setAllowDms] = useState(!!profile.user.allow_direct_messages);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setSaving(true);
    setError(null);
    setSaved(null);
    try {
      await updatePrivacy({
        dob_visibility: dobVisible ? 'public' : 'private',
        wants_listing: wantsListing,
        allow_direct_messages: allowDms,
      });
      await reload();
      setSaved('Privacy settings saved.');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="text-sm font-semibold text-navy mb-2">Privacy</h3>
      <div className="border-t border-gray-100">
        <Toggle checked={dobVisible} onChange={setDobVisible} label="Show my date of birth to other members" />
        <Toggle checked={wantsListing} onChange={setWantsListing} label="Appear in The Sikh Directory" />
        <Toggle checked={allowDms} onChange={setAllowDms} label="Allow other members to message me" />
      </div>
      {error ? <p className="text-sm text-red-600 mt-3">{error}</p> : null}
      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="mt-5 bg-saffron text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-saffron-dark transition-colors disabled:opacity-60"
      >
        {saving ? 'Saving...' : 'Save privacy settings'}
      </button>
      <SaveMsg text={saved} />
    </div>
  );
}

function CommunicationTab({ profile, reload }: { profile: any; reload: () => Promise<void> }) {
  const defaults: Record<string, boolean> = {
    channel_email: true, channel_sms: false, channel_push: false, channel_whatsapp: false,
    topic_alerts: true, topic_community_news: true, topic_events: true,
    topic_business: true, topic_awards: true, topic_new_projects: true,
  };
  const [form, setForm] = useState<Record<string, boolean>>(() => {
    const cp = profile.commPrefs || {};
    const merged = { ...defaults };
    for (const key of Object.keys(defaults)) {
      if (cp[key] != null) merged[key] = !!cp[key];
    }
    return merged;
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const save = async () => {
    setSaving(true);
    setError(null);
    setSaved(null);
    try {
      await updateCommunicationPreferences(form);
      await reload();
      setSaved('Communication preferences saved.');
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="text-sm font-semibold text-navy mb-2">Channels</h3>
      <div className="border-t border-gray-100 mb-6">
        {CHANNELS.map((c) => (
          <Toggle key={c.key} label={c.label} checked={form[c.key]} onChange={(v) => setForm({ ...form, [c.key]: v })} />
        ))}
      </div>

      <h3 className="text-sm font-semibold text-navy mb-2">Topics</h3>
      <div className="border-t border-gray-100">
        {TOPICS.map((t) => (
          <Toggle key={t.key} label={t.label} checked={form[t.key]} onChange={(v) => setForm({ ...form, [t.key]: v })} />
        ))}
      </div>

      {error ? <p className="text-sm text-red-600 mt-3">{error}</p> : null}
      <button
        type="button"
        onClick={save}
        disabled={saving}
        className="mt-5 bg-saffron text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-saffron-dark transition-colors disabled:opacity-60"
      >
        {saving ? 'Saving...' : 'Save preferences'}
      </button>
      <SaveMsg text={saved} />
    </div>
  );
}
