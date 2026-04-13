const isItems = [
  "A registered legal entity you operate under",
  "Real contracts, real invoices, real banking",
  "Transparent revenue share — no hidden fees",
];

const isNotItems = [
  "Not a reseller — your client, your deal",
  "Not a marketing agency — we don't find customers",
  "Not a consultancy — we don't form companies for you",
];

export default function WhatWeAre() {
  return (
    <section className="py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <span className="section-label mb-4">Clarity</span>
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
            Crystal clear on <span className="gradient-text">what this is.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* What We Are — glass with green tint */}
          <div className="glass rounded-xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/[0.04] to-transparent pointer-events-none" />
            <div className="relative z-10">
              <h3 className="text-sm font-semibold mb-4 gradient-text">What We Are</h3>
              <ul className="space-y-3">
                {isItems.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <span className="w-5 h-5 rounded bg-green-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </span>
                    <span className="text-sm text-foreground/90">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* What We Are Not — glass plain */}
          <div className="glass rounded-xl p-6">
            <h3 className="text-sm font-semibold mb-4 text-muted">What We Are Not</h3>
            <ul className="space-y-3">
              {isNotItems.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded bg-white/[0.04] flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-muted/60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                  </span>
                  <span className="text-sm text-muted">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
