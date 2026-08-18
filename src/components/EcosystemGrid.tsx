const LIVE_PLATFORMS = [
  { name: 'The Sikh Directory', tagline: 'The Global Sikh Business Directory' },
  { name: 'The Sikh Awards', tagline: 'Honouring Excellence. Inspiring Generations.' },
  { name: 'The Sikh 100', tagline: 'Recognising the Most Influential Sikhs' },
  { name: 'The Sikh Match', tagline: 'Connecting Hearts. Building Families.' },
  { name: 'The Sikh Alert', tagline: 'Stay Informed. Stay Connected.' },
  { name: 'The Sikh Billionaires Club', tagline: 'Uniting Sikh Billionaires Worldwide.' },
  { name: 'The Sikh Watch', tagline: 'Heritage. Precision. Timeless Excellence.' },
  { name: 'The Sikh Consultancy', tagline: 'Expert Advice. Real Solutions.' },
];

const FUTURE_PLATFORMS = [
  { name: 'The Sikh Charity', tagline: 'Serving Humanity. Transforming Lives.' },
  { name: 'The Sikh Bank', tagline: 'Ethical Banking. Empowering Communities.' },
  { name: 'The Sikh Metaverse', tagline: 'Innovate. Connect. Experience the Future.' },
];

export default function EcosystemGrid() {
  return (
    <>
      <h2 className="text-sm font-semibold text-navy tracking-wide uppercase mb-3">
        Your Sikh Group ecosystem
      </h2>
      <div className="grid grid-cols-4 gap-4 mb-8">
        {LIVE_PLATFORMS.map((p) => (
          <div key={p.name} className="bg-white rounded-xl border border-gray-200 p-5 hover:border-saffron/60 transition-colors">
            <div className="text-sm font-semibold text-navy mb-1">{p.name}</div>
            <p className="text-xs text-gray-500 mb-3 leading-relaxed">{p.tagline}</p>
            <button className="text-xs font-medium text-saffron hover:underline">Access now →</button>
          </div>
        ))}
      </div>

      <h2 className="text-sm font-semibold text-navy tracking-wide uppercase mb-3">
        Future projects — coming soon
      </h2>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {FUTURE_PLATFORMS.map((p) => (
          <div key={p.name} className="bg-gray-50 rounded-xl border border-dashed border-gray-300 p-5">
            <div className="text-sm font-semibold text-navy mb-1">{p.name}</div>
            <p className="text-xs text-gray-500 leading-relaxed">{p.tagline}</p>
          </div>
        ))}
      </div>
    </>
  );
}
