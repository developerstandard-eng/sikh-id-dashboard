'use client';

import { useEffect, useState } from 'react';

interface Hukam {
  hukam_date: string;
  gurmukhi_text: string | null;
  transliteration: string | null;
  english_translation: string | null;
  source_name: string;
  source_url: string | null;
}

/**
 * A quiet, respectful banner — not a promotional flash. "Flashes on the
 * dashboard" is interpreted as: appears prominently at the top on load,
 * dismissible, reappears each new day. No animation gimmicks; the content
 * itself (today's actual reading) is what should draw attention.
 */
export default function HukamnamaBanner({ hukam }: { hukam: Hukam | null }) {
  const [dismissed, setDismissed] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);

  useEffect(() => {
    if (!hukam) return;
    const key = `sikh_id_hukam_dismissed_${hukam.hukam_date}`;
    if (localStorage.getItem(key)) setDismissed(true);
  }, [hukam]);

  if (!hukam || dismissed) return null;

  const dismiss = () => {
    localStorage.setItem(`sikh_id_hukam_dismissed_${hukam.hukam_date}`, '1');
    setDismissed(true);
  };

  return (
    <div className="bg-[#fff7ee] border border-[#f3d9b3] rounded-2xl px-6 py-5 mb-6 relative">
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="absolute top-3 right-4 text-[#b08a54] hover:text-[#8a5a1a] text-sm"
      >
        ✕
      </button>
      <div className="text-[11px] font-medium tracking-wide uppercase text-[#c17b1f] mb-2">
        Hukamnama · {new Date(hukam.hukam_date).toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
      </div>
      {hukam.gurmukhi_text ? (
        <p className="text-navy text-base leading-relaxed mb-2">{hukam.gurmukhi_text.replace(/\s*\n\s*/g, ' ')}</p>
      ) : null}
      {hukam.english_translation ? (
        <>
          <button
            type="button"
            onClick={() => setShowTranslation((v) => !v)}
            className="text-xs font-medium text-[#c17b1f] hover:underline"
          >
            {showTranslation ? 'Hide translation' : 'Show translation'}
          </button>
          {showTranslation ? (
            <p className="text-sm text-[#6b5638] leading-relaxed mt-1.5">{hukam.english_translation.replace(/\s*\n\s*/g, ' ')}</p>
          ) : null}
        </>
      ) : null}
      <div className="text-[11px] text-[#a98957] mt-3">
        {hukam.source_name}
        {hukam.source_url ? (
          <>
            {' · '}
            <a href={hukam.source_url} target="_blank" rel="noreferrer" className="underline">Source</a>
          </>
        ) : null}
      </div>
    </div>
  );
}
