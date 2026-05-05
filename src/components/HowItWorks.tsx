const steps = [
  { num: "01", title: "Submit your product", desc: "Fill a short form. Tell us what you've built. No pitch deck." },
  { num: "02", title: "Discovery call", desc: "A personal call to understand your product and vision." },
  { num: "03", title: "Sign agreement", desc: "We agree on terms, sign the creator agreement, set up payouts." },
  { num: "04", title: "Get activated", desc: "Creator account live. Launchbox badge on your product." },
  { num: "05", title: "Start selling", desc: "Listed under our company. Contracts, invoices, payments — handled." },
  { num: "06", title: "Track & earn", desc: "Every sale, fee, and payout visible in your dashboard." },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="section-label mb-4">Process</span>
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
            From code to cash <span className="gradient-text">in six steps.</span>
          </h2>
          <p className="text-sm text-muted mt-2">No bureaucracy. No waiting. Start selling the moment you join.</p>
        </div>

        {/* Timeline — skeuo metal steps + glass content cards */}
        <div className="relative">
          {/* Vertical rail */}
          <div className="absolute left-[23px] top-0 bottom-0 w-[2px] hidden sm:block" style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 40%, transparent 100%)',
          }} />

          <div className="space-y-3">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-5 items-start group">
                {/* Metal step number (skeuo) */}
                <div className="relative z-10 shrink-0">
                  <div className="skeuo-metal w-12 h-12 rounded-full flex items-center justify-center text-sm font-mono font-bold text-accent group-hover:border-accent/40 transition-colors">
                    <span>{step.num}</span>
                  </div>
                </div>
                {/* Glass content card */}
                <div className="glass rounded-xl px-4 py-3 flex-1">
                  <h3 className="font-semibold text-sm group-hover:text-accent transition-colors">{step.title}</h3>
                  <p className="text-[11px] text-muted mt-0.5 leading-snug">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
