import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/backendProxy';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.email || !body?.code) {
    return NextResponse.json({ error: 'invalid_request', message: 'Email and code are required' }, { status: 400 });
  }

  const { data, status } = await proxyToBackend('/api/v1/auth/otp/verify', {
    email: body.email,
    code: body.code,
  });
  return NextResponse.json(data, { status });
}
