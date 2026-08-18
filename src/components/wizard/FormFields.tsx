'use client';

export function Field({
  label, children, hint,
}: { label: string; children: React.ReactNode; hint?: string }) {
  return (
    <label className="block mb-5">
      <span className="block text-sm font-medium text-navy mb-1.5">{label}</span>
      {children}
      {hint ? <span className="block text-xs text-gray-400 mt-1">{hint}</span> : null}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/40 focus:border-saffron"
    />
  );
}

export function Select({ options, ...props }: { options: string[] } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className="w-full border border-gray-300 rounded-lg px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-saffron/40 focus:border-saffron"
    >
      <option value="">Select...</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}

export function CheckboxGrid({
  options, selected, onToggle, columns = 2,
}: { options: string[]; selected: string[]; onToggle: (opt: string) => void; columns?: number }) {
  return (
    <div className={`grid gap-2 ${columns === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
      {options.map((opt) => {
        const checked = selected.includes(opt);
        return (
          <button
            type="button"
            key={opt}
            onClick={() => onToggle(opt)}
            className={`text-left text-sm px-3.5 py-2.5 rounded-lg border transition-colors ${
              checked ? 'bg-saffron/10 border-saffron text-navy font-medium' : 'border-gray-200 text-gray-600 hover:border-gray-300'
            }`}
          >
            <span className={`inline-block w-3.5 h-3.5 mr-2 rounded-sm border align-middle ${checked ? 'bg-saffron border-saffron' : 'border-gray-300'}`} />
            {opt}
          </button>
        );
      })}
    </div>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex items-center justify-between w-full py-2.5 border-b border-gray-100 last:border-0"
    >
      <span className="text-sm text-navy">{label}</span>
      <span className={`w-9 h-5 rounded-full relative transition-colors ${checked ? 'bg-saffron' : 'bg-gray-200'}`}>
        <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${checked ? 'left-4' : 'left-0.5'}`} />
      </span>
    </button>
  );
}

export function StepActions({
  onBack, onNext, nextLabel = 'Continue', loading, skippable, onSkip,
}: { onBack?: () => void; onNext: () => void; nextLabel?: string; loading?: boolean; skippable?: boolean; onSkip?: () => void }) {
  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
      <div>
        {onBack ? (
          <button type="button" onClick={onBack} className="text-sm text-gray-500 hover:text-navy">
            ← Back
          </button>
        ) : <span />}
      </div>
      <div className="flex items-center gap-4">
        {skippable ? (
          <button type="button" onClick={onSkip} className="text-sm text-gray-400 hover:text-gray-600">
            Skip for now
          </button>
        ) : null}
        <button
          type="button"
          onClick={onNext}
          disabled={loading}
          className="bg-saffron text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:bg-saffron-dark transition-colors disabled:opacity-60"
        >
          {loading ? 'Saving...' : nextLabel}
        </button>
      </div>
    </div>
  );
}
