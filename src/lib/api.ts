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

function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('sikh_id_refresh_token');
}

// The access token is short-lived (15m — see JWT_ACCESS_TTL on the backend),
// so any session longer than that needs this to silently mint a new one.
// Shared across concurrent 401s so they don't each hit /auth/refresh.
let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  const res = await fetch(`${API_BASE}/api/v1/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });
  if (!res.ok) return null;

  const data = await res.json().catch(() => null);
  if (!data?.accessToken) return null;
  localStorage.setItem('sikh_id_access_token', data.accessToken);
  return data.accessToken;
}

async function request(path: string, options: RequestInit = {}, retryOn401 = true): Promise<any> {
  const token = getToken();
  // FormData (photo upload) needs the browser to set its own multipart
  // boundary in Content-Type — forcing application/json here would break it.
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (res.status === 401 && retryOn401 && getRefreshToken()) {
    if (!refreshPromise) {
      refreshPromise = refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
    }
    const newToken = await refreshPromise;
    if (newToken) return request(path, options, false);
    clearTokens();
  }

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
async function ownRequest(path: string, body: object) {
  const res = await fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => null);
  if (!res.ok) throw new Error(data?.message || data?.error || `Request failed (${res.status})`);
  return data;
}

export const login = (email: string, password: string) => ownRequest('/api/login', { email, password });

export const forgotPassword = (email: string) => ownRequest('/api/forgot-password', { email });

export const resetPassword = (token: string, password: string) => ownRequest('/api/reset-password', { token, password });

export const requestLoginOtp = (email: string) => ownRequest('/api/otp/request', { email });

export const verifyLoginOtp = (email: string, code: string) => ownRequest('/api/otp/verify', { email, code });

// --- Profile ---
export const getMyProfile = () => request('/api/v1/profile/me');

export const updateAccount = (payload: object) =>
  request('/api/v1/profile/account', { method: 'PATCH', body: JSON.stringify(payload) });

export const updatePrivacy = (payload: object) =>
  request('/api/v1/profile/privacy', { method: 'PATCH', body: JSON.stringify(payload) });

export const changePassword = (current_password: string, new_password: string) =>
  request('/api/v1/auth/change-password', { method: 'POST', body: JSON.stringify({ current_password, new_password }) });

export const updateAbout = (payload: object) =>
  request('/api/v1/profile/about', { method: 'PATCH', body: JSON.stringify(payload) });

export const uploadProfilePhoto = (file: File) => {
  const formData = new FormData();
  formData.append('photo', file);
  return request('/api/v1/profile/photo', { method: 'POST', body: formData });
};

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
export const getNews = (params: Record<string, string> = {}) => {
  const qs = new URLSearchParams(params).toString();
  return request(`/api/v1/content/news${qs ? `?${qs}` : ''}`);
};
export const getHukamnamaToday = () => request('/api/v1/content/hukamnama/today');

export const rsvpEvent = (id: number) => request(`/api/v1/content/events/${id}/rsvp`, { method: 'POST' });
export const unrsvpEvent = (id: number) => request(`/api/v1/content/events/${id}/rsvp`, { method: 'DELETE' });

export const saveItem = (itemType: 'event' | 'news', itemId: number) =>
  request('/api/v1/content/saved', { method: 'POST', body: JSON.stringify({ item_type: itemType, item_id: itemId }) });
export const unsaveItem = (itemType: 'event' | 'news', itemId: number) =>
  request(`/api/v1/content/saved/${itemType}/${itemId}`, { method: 'DELETE' });
export const getSavedItems = () => request('/api/v1/content/saved');

export const getActivity = () => request('/api/v1/content/activity');

export const getNotifications = () => request('/api/v1/content/notifications');
export const markNotificationRead = (id: number) => request(`/api/v1/content/notifications/${id}/read`, { method: 'POST' });
export const markAllNotificationsRead = () => request('/api/v1/content/notifications/read-all', { method: 'POST' });

// --- Messages ---
export const getConversations = () => request('/api/v1/messages/conversations');
export const startConversation = (sikhId: string) =>
  request('/api/v1/messages/conversations', { method: 'POST', body: JSON.stringify({ sikh_id: sikhId }) });
export const getConversationMessages = (convId: number) => request(`/api/v1/messages/conversations/${convId}/messages`);
export const sendConversationMessage = (convId: number, body: string) =>
  request(`/api/v1/messages/conversations/${convId}/messages`, { method: 'POST', body: JSON.stringify({ body }) });
export const markConversationRead = (convId: number) => request(`/api/v1/messages/conversations/${convId}/read`, { method: 'POST' });
export const getMessagesUnreadCount = () => request('/api/v1/messages/unread-count');

// --- Support ---
export const getSupportTickets = () => request('/api/v1/support/tickets');
export const createSupportTicket = (subject: string, message: string) =>
  request('/api/v1/support/tickets', { method: 'POST', body: JSON.stringify({ subject, message }) });
