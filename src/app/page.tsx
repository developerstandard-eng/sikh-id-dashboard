'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getToken } from '@/lib/api';

// Sends a signed-in visitor straight to their dashboard and everyone else
// to the login screen, instead of always landing on /dashboard (which used
// to render a "logged in as guest" flash before the auth check kicked in).
export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace(getToken() ? '/dashboard' : '/login');
  }, [router]);

  return null;
}
