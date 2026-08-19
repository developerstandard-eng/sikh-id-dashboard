// Shared by the app/api/* route handlers that forward straight to backend
// auth endpoints requiring X-Site-Secret — keeps the shared secret out of
// the browser bundle (see app/api/login/route.ts for the original pattern).
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export async function proxyToBackend(path: string, body: object) {
  const upstream = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Site-Secret': process.env.SITE_SHARED_SECRET || '',
      'X-Site-Domain': process.env.SITE_DOMAIN || '',
    },
    body: JSON.stringify(body),
  });

  const data = await upstream.json().catch(() => null);
  return { data, status: upstream.status };
}
