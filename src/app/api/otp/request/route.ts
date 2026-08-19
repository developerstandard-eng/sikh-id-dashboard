import { NextRequest, NextResponse } from 'next/server';
import { proxyToBackend } from '@/lib/backendProxy';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body?.email) {
    return NextResponse.json({ error: 'invalid_request', message: 'Email is required' }, { status: 400 });
  }

  const { data, status } = await proxyToBackend('/api/v1/auth/otp/request', { email: body.email });
  return NextResponse.json(data, { status });
}
