'use client';

import { RefObject } from 'react';
import KhandaIcon from './KhandaIcon';

export interface SikhIdCardData {
  fullName: string;
  sikhId: string;
  photoUrl?: string | null;
  memberSince: number;
}

export default function SikhIdCard({
  data,
  frontRef,
  backRef,
  qrDataUrl,
}: {
  data: SikhIdCardData;
  frontRef: RefObject<HTMLDivElement>;
  backRef: RefObject<HTMLDivElement>;
  qrDataUrl: string | null;
}) {
  const initials = data.fullName
    ? data.fullName.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '—';

  return (
    <div className="flex flex-wrap gap-10 justify-center">
      <div>
        <div className="text-center text-[11px] tracking-wide text-gray-400 uppercase mb-2">Front</div>
        <div
          ref={frontRef}
          className="relative w-[340px] h-[214px] rounded-2xl overflow-hidden text-white p-5"
          style={{ background: 'linear-gradient(135deg,#0d1b3d,#132657)' }}
        >
          <KhandaIcon className="absolute -right-4 -bottom-6 w-40 h-40 text-white/10" />

          <div className="relative flex items-center justify-between">
            <div>
              <div className="text-sm font-bold leading-none">
                THE SIKH <span className="text-saffron">ID</span>
              </div>
              <div className="text-[8px] tracking-wide text-white/50 mt-1">ONE ID &middot; ONE COMMUNITY</div>
            </div>
            <div className="text-[9px] font-semibold bg-saffron/20 text-saffron border border-saffron/40 rounded-full px-2.5 py-1 flex items-center gap-1 whitespace-nowrap">
              <span>★</span> FOUNDING MEMBER
            </div>
          </div>

          <div className="relative flex items-center gap-3 mt-7">
            <div className="w-14 h-14 rounded-lg bg-saffron text-white flex items-center justify-center text-lg font-bold overflow-hidden shrink-0">
              {data.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={data.photoUrl} alt="" className="w-full h-full object-cover" />
              ) : (
                initials
              )}
            </div>
            <div className="min-w-0">
              <div className="text-base font-semibold leading-tight truncate">{data.fullName}</div>
              <div className="text-[10px] text-white/50 mt-0.5">MEMBER SINCE {data.memberSince}</div>
            </div>
          </div>

          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
            <div>
              <div className="text-[8px] text-white/40 tracking-wide">SIKH ID NUMBER</div>
              <div className="text-sm font-bold tracking-wide">{data.sikhId}</div>
            </div>
            <div className="w-10 h-10 bg-white rounded flex items-center justify-center overflow-hidden shrink-0">
              {qrDataUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={qrDataUrl} alt="Scan to verify" className="w-full h-full" />
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="text-center text-[11px] tracking-wide text-gray-400 uppercase mb-2">Back</div>
        <div ref={backRef} className="relative w-[340px] h-[214px] rounded-2xl overflow-hidden bg-[#fdfaf3] text-navy">
          <div
            className="h-14"
            style={{
              background:
                'repeating-linear-gradient(135deg,#132657,#132657 8px,#0d1b3d 8px,#0d1b3d 16px)',
            }}
          />
          <KhandaIcon className="absolute right-4 top-1/2 -translate-y-1/2 w-28 h-28 text-navy/5" />
          <div className="relative px-6 pt-5 text-center">
            <div className="text-sm font-bold">United. Inspired. Empowered.</div>
            <p className="text-[10px] text-gray-500 mt-2 leading-relaxed max-w-[240px] mx-auto">
              This card identifies the holder as a verified member of The Sikh Group community
              network. Scan the code to confirm membership.
            </p>
          </div>
          <div className="absolute bottom-3 left-5 right-5 flex items-end justify-between gap-2">
            <p className="text-[7px] text-gray-400 max-w-[180px] leading-snug">
              Community membership card only — not a government-issued identity document.
            </p>
            <div className="text-[9px] font-semibold text-saffron whitespace-nowrap">thesikhgroup.com</div>
          </div>
        </div>
      </div>
    </div>
  );
}
