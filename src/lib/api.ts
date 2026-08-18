const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('sikh_id_access_token');
}

export function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem('sikh_id_access_token', accessToken);
  localStorage.setItem('sikh_id_refresh_token', refreshToken);
}

export function clearTokens() {
  localStorage.removeItem('sikh_id_access_token');
  localStorage.removeItem('sikh_id_refresh_token');
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new Error(data?.message || data?.error || `Request failed (${res.status})`);
  }
  return data;
}

// --- Auth (standalone login — normally a user arrives here already
// authenticated via the WordPress plugin's SSO redirect, which drops the
// token in the URL; see useAuthFromUrl() in lib/useAuth.ts) ---
// Goes through this app's own /api/login route (not directly to the
// backend) so the site secret is attached server-side and never reaches
// the browser bundle — see src/app/api/login/route.ts.
export const login = (email: string, password: string) =>
  fetch('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
    .then(async (res) => {
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.message || data?.error || `Request failed (${res.status})`);
      return data;
    });

// --- Profile ---
export const getMyProfile = () => request('/api/v1/profile/me');

export const updateAbout = (payload: object) =>
  request('/api/v1/profile/about', { method: 'PATCH', body: JSON.stringify(payload) });

export const updateProfessional = (payload: object) =>
  request('/api/v1/profile/professional', { method: 'PATCH', body: JSON.stringify(payload) });

export const updateInterests = (interests: string[]) =>
  request('/api/v1/profile/interests', { method: 'PUT', body: JSON.stringify({ interests }) });

export const updateGroupPreferences = (platforms: { name: string; subscribed: boolean }[]) =>
  request('/api/v1/profile/group-preferences', { method: 'PUT', body: JSON.stringify({ platforms }) });

export const updateCommunicationPreferences = (payload: object) =>
  request('/api/v1/profile/communication-preferences', { method: 'PATCH', body: JSON.stringify(payload) });

export const updateCommunityProfile = (payload: object) =>
  request('/api/v1/profile/community', { method: 'PATCH', body: JSON.stringify(payload) });

// --- Engagement content ---
export const getEvents = (params: Record<string, string> = {}) => {
  const qs = new URLSearchParams(params).toString();
  return request(`/api/v1/content/events${qs ? `?${qs}` : ''}`);
};
export const getNews = () => request('/api/v1/content/news');
export const getHukamnamaToday = () => request('/api/v1/content/hukamnama/today');
