export default function KhandaIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" className={className} aria-hidden="true">
      <circle cx="100" cy="100" r="72" stroke="currentColor" strokeWidth="6" />
      <path d="M100 20 L112 90 L100 180 L88 90 Z" fill="currentColor" />
      <path
        d="M40 60 C70 75 70 125 40 140"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M160 60 C130 75 130 125 160 140"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
