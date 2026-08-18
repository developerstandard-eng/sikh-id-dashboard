'use client';

import { useEffect, useState } from 'react';
import { getMyProfile, getToken, setTokens } from './api';

export interface ProfileData {
  user: {
    id: number;
    sikh_id: string;
    full_name: string;
    email: string;
    mobile: string | null;
    country: string | null;
    profile_completion: number;
    created_at: string;
  };
  about: Record<string, any> | null;
  professional: Record<string, any> | null;
  interests: { interest_tag: string }[];
  groupPrefs: { platform_name: string; subscribed: number }[];
  commPrefs: Record<string, any> | null;
  directory: Record<string, any> | null;
  sectionStatus: Record<string, boolean>;
}

/**
 * Reads ?access_token=&refresh_token= from the URL (dropped there by the
 * WordPress plugin's SSO redirect after a user logs in on any Sikh Group
 * site), stores them, then strips the params from the visible URL.
 */
export function useAuthFromUrl() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const access = params.get('access_token');
    const refresh = params.get('refresh_token');
    if (access && refresh) {
      setTokens(access, refresh);
      params.delete('access_token');
      params.delete('refresh_token');
      const clean = window.location.pathname + (params.toString() ? `?${params}` : '');
      window.history.replaceState({}, '', clean);
    }
  }, []);
}

export function useProfile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = async () => {
    if (!getToken()) {
      setLoading(false);
      setError('not_authenticated');
      return;
    }
    setLoading(true);
    try {
      const data = await getMyProfile();
      setProfile(data);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { profile, loading, error, reload };
}
