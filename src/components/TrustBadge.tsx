const benefits = [
  { icon: "📜", label: "Legal Trust", desc: "Backed by a registered company." },
  { icon: "🏢", label: "Credibility", desc: "Customers see an established entity." },
  { icon: "🎧", label: "Support", desc: "Professional complaint workflow." },
  { icon: "💳", label: "Payments", desc: "Proper invoicing & collection." },
  { icon: "📋", label: "Escalation", desc: "Creator → founder → resolution." },
  { icon: "💰", label: "Transparency", desc: "Every rupee tracked & verifiable." },
];

export default function TrustBadge() {
  return (
    <section className="py-14 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <span className="section-label mb-4">Trust Badge</span>
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
            A product of <span className="gradient-text">Launchbox.</span>
          </h2>
        </div>

        {/* Physical stamped badge — KEEP skeuo */}
        <div className="flex justify-center mb-10">
          <div className="skeuo-raised skeuo-stamp rounded-2xl p-8 text-center max-w-xs">
            <div className="skeuo-inset rounded-xl w-20 h-20 mx-auto flex items-center justify-center mb-4">
              <span className="text-3xl">🛡️</span>
            </div>
            <p className="text-[11px] font-bold text-accent tracking-[0.2em] uppercase mb-1">
              Verified Product
            </p>
            <p className="text-base font-bold">
              <span className="gradient-text">Launch</span>
              <span className="text-foreground">box</span>
              <span className="text-muted ml-1.5 text-xs font-normal">Certified</span>
            </p>
            <p className="text-[11px] text-muted mt-2">
              Commercially backed · Legally compliant · Support guaranteed
            </p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {benefits.map((b, i) => (
            <div key={i} className="glass rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-lg shrink-0">{b.icon}</span>
                <div>
                  <h3 className="font-semibold text-xs">{b.label}</h3>
                  <p className="text-[11px] text-muted leading-snug mt-0.5">{b.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
