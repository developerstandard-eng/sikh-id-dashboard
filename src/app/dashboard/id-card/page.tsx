'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/Sidebar';
import TopBar from '@/components/TopBar';
import SikhIdCard from '@/components/SikhIdCard';
import { useAuthFromUrl, useProfile } from '@/lib/useAuth';

export default function IdCardPage() {
  useAuthFromUrl();
  const { profile, loading, error } = useProfile();
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState<'png' | 'pdf' | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  const completion = profile?.user.profile_completion ?? 0;
  const sikhId = profile?.user.sikh_id;

  useEffect(() => {
    if (!sikhId || completion < 100) return;
    const verifyUrl = `${window.location.origin}/verify/${sikhId}`;
    import('qrcode')
      .then(({ default: QRCode }) => QRCode.toDataURL(verifyUrl, { margin: 0, width: 160 }))
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(null));
  }, [sikhId, completion]);

  if (loading) return <div className="p-10 text-sm text-gray-400">Loading...</div>;

  if (error === 'not_authenticated') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-navy text-white">
        <div className="text-center">
          <p className="mb-4">You need to be logged in to view your Sikh ID card.</p>
          <Link href="/login" className="text-saffron underline">Go to login</Link>
        </div>
      </div>
    );
  }

  const downloadPng = async () => {
    if (!frontRef.current || !backRef.current) return;
    setBusy('png');
    setExportError(null);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const [frontCanvas, backCanvas] = await Promise.all([
        html2canvas(frontRef.current, { scale: 2, backgroundColor: null }),
        html2canvas(backRef.current, { scale: 2, backgroundColor: null }),
      ]);
      const gap = 32 * 2;
      const combined = document.createElement('canvas');
      combined.width = frontCanvas.width + backCanvas.width + gap;
      combined.height = Math.max(frontCanvas.height, backCanvas.height);
      const ctx = combined.getContext('2d');
      if (!ctx) throw new Error('Canvas not supported');
      ctx.drawImage(frontCanvas, 0, 0);
      ctx.drawImage(backCanvas, frontCanvas.width + gap, 0);

      const link = document.createElement('a');
      link.download = `sikh-id-${sikhId}.png`;
      link.href = combined.toDataURL('image/png');
      link.click();
    } catch {
      setExportError('Could not generate the image. Please try again.');
    } finally {
      setBusy(null);
    }
  };

  const downloadPdf = async () => {
    if (!frontRef.current || !backRef.current) return;
    setBusy('pdf');
    setExportError(null);
    try {
      const html2canvas = (await import('html2canvas')).default;
      const { jsPDF } = await import('jspdf');
      const [frontCanvas, backCanvas] = await Promise.all([
        html2canvas(frontRef.current, { scale: 3, backgroundColor: '#0d1b3d' }),
        html2canvas(backRef.current, { scale: 3, backgroundColor: '#fdfaf3' }),
      ]);

      // Standard ID-1 card size (85.6mm x 54mm), one side per page for printing.
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: [85.6, 54] });
      pdf.addImage(frontCanvas.toDataURL('image/png'), 'PNG', 0, 0, 85.6, 54);
      pdf.addPage([85.6, 54], 'landscape');
      pdf.addImage(backCanvas.toDataURL('image/png'), 'PNG', 0, 0, 85.6, 54);
      pdf.save(`sikh-id-${sikhId}.pdf`);
    } catch {
      setExportError('Could not generate the PDF. Please try again.');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 h-full overflow-y-auto bg-[#f5f6f8]">
        <TopBar fullName={profile?.user.full_name} sikhId={profile?.user.sikh_id} photoUrl={profile?.about?.photo_url} title="My Sikh ID card" />
        <main className="p-8">
          {completion < 100 ? (
            <div className="bg-white rounded-2xl border border-gray-200 p-16 flex flex-col items-center text-center max-w-lg mx-auto">
              <div className="text-3xl mb-3">🪪</div>
              <div className="text-sm font-semibold text-navy mb-1">Complete your profile to unlock your Sikh ID card</div>
              <p className="text-xs text-gray-400 max-w-xs mb-5">
                Your Sikh ID card is generated once your profile reaches 100% completion.
                You&apos;re at {completion}% right now.
              </p>
              <Link
                href="/dashboard/profile"
                className="inline-block bg-saffron text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-saffron-dark transition-colors"
              >
                Complete your profile
              </Link>
            </div>
          ) : (
            <>
              <SikhIdCard
                data={{
                  fullName: profile?.user.full_name || '',
                  sikhId: profile?.user.sikh_id || '',
                  photoUrl: profile?.about?.photo_url,
                  memberSince: profile?.user.created_at ? new Date(profile.user.created_at).getFullYear() : new Date().getFullYear(),
                }}
                frontRef={frontRef}
                backRef={backRef}
                qrDataUrl={qrDataUrl}
              />

              <div className="flex items-center justify-center gap-3 mt-8">
                <button
                  type="button"
                  onClick={downloadPdf}
                  disabled={busy !== null}
                  className="bg-saffron text-white text-sm font-medium px-5 py-2.5 rounded-lg hover:bg-saffron-dark transition-colors disabled:opacity-60"
                >
                  {busy === 'pdf' ? 'Preparing...' : 'Download PDF (print)'}
                </button>
                <button
                  type="button"
                  onClick={downloadPng}
                  disabled={busy !== null}
                  className="bg-white border border-gray-300 text-navy text-sm font-medium px-5 py-2.5 rounded-lg hover:border-saffron transition-colors disabled:opacity-60"
                >
                  {busy === 'png' ? 'Preparing...' : 'Download PNG (share)'}
                </button>
              </div>
              {exportError ? <p className="text-sm text-red-600 text-center mt-3">{exportError}</p> : null}
              <p className="text-xs text-gray-400 text-center mt-4">
                The QR code links to a public verification page confirming your Sikh ID is genuine.
              </p>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
