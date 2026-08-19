import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/backendProxy';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.token || !body?.password) {
    return NextResponse.json({ error: 'invalid_request', message: 'Token and password are required' }, { status: 400 });
  }

  const { data, status } = await proxyToBackend('/api/v1/auth/reset-password', {
    token: body.token,
    password: body.password,
  });
  return NextResponse.json(data, { status });
}
