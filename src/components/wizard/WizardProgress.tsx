const STEPS = [
  { key: 'about_you', label: 'About you', pct: 30 },
  { key: 'professional', label: 'Professional', pct: 45 },
  { key: 'interests', label: 'Interests', pct: 60 },
  { key: 'group_preferences', label: 'Group preferences', pct: 75 },
  { key: 'communication_preferences', label: 'Communication', pct: 85 },
  { key: 'community_profile', label: 'Community', pct: 95 },
  { key: 'final_confirmation', label: "You're in", pct: 100 },
];

export { STEPS };

export default function WizardProgress({ currentIndex, completion }: { currentIndex: number; completion: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-500">
          Your Sikh ID is <span className="text-navy font-medium">{completion}%</span> complete
        </span>
        <span className="text-xs text-gray-400">
          Step {Math.min(currentIndex + 1, STEPS.length)} of {STEPS.length}
        </span>
      </div>
      <div className="flex gap-1.5">
        {STEPS.map((s, i) => (
          <div
            key={s.key}
            className={`h-1.5 flex-1 rounded-full ${i <= currentIndex ? 'bg-saffron' : 'bg-gray-200'}`}
            title={s.label}
          />
        ))}
      </div>
    </div>
  );
}
