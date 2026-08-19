import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/backendProxy';

// Server-side proxy for the standalone test-login form. The backend's
// /api/v1/auth/login requires an X-Site-Secret header; attaching it here
// (server-side) instead of in lib/api.ts keeps the shared secret out of the
// browser bundle, since only NEXT_PUBLIC_* vars ever reach client JS.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.email || !body?.password) {
    return NextResponse.json({ error: 'invalid_request', message: 'Email and password are required' }, { status: 400 });
  }

  const { data, status } = await proxyToBackend('/api/v1/auth/login', { email: body.email, password: body.password });
  return NextResponse.json(data, { status });
}
