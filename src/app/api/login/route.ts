import { NextRequest, NextResponse } from 'next/server';

// Server-side proxy for the standalone test-login form. The backend's
// /api/v1/auth/login requires an X-Site-Secret header; attaching it here
// (server-side) instead of in lib/api.ts keeps the shared secret out of the
// browser bundle, since only NEXT_PUBLIC_* vars ever reach client JS.
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.email || !body?.password) {
    return NextResponse.json({ error: 'invalid_request', message: 'Email and password are required' }, { status: 400 });
  }

  const upstream = await fetch(`${API_BASE}/api/v1/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Site-Secret': process.env.SITE_SHARED_SECRET || '',
      'X-Site-Domain': process.env.SITE_DOMAIN || '',
    },
    body: JSON.stringify({ email: body.email, password: body.password }),
  });

  const data = await upstream.json().catch(() => null);
  return NextResponse.json(data, { status: upstream.status });
}
