const provisions = [
  { icon: "🏢", title: "Company Umbrella", desc: "Sell under our registered entity. Contracts & compliance handled." },
  { icon: "📜", title: "Legal Agreements", desc: "IP, payouts, refunds, SLAs, exit terms — all covered." },
  { icon: "🛡️", title: "Trust Badge", desc: "Instant credibility with the Launchbox verified badge." },
  { icon: "💳", title: "Payment Intake", desc: "Clean payment collection through proper banking channels." },
  { icon: "💰", title: "Payout Ledger", desc: "Every sale, fee, and disbursement visible in real time." },
  { icon: "🎧", title: "Support Workflow", desc: "Escalation matrix and SLA tracking for every customer." },
  { icon: "🔒", title: "Trust Pages", desc: "Company-backed pages that give buyers confidence." },
  { icon: "📊", title: "Creator Dashboard", desc: "Products, sales, workflow stages, payouts — one place." },
  { icon: "🔗", title: "Launch Promotion", desc: "Amplify your launch through our professional network." },
];

export default function WhatWeProvide() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className="section-label mb-4">What You Get</span>
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
            Everything you need to <span className="gradient-text">sell with confidence.</span>
          </h2>
          <p className="text-sm text-muted mt-2 max-w-md mx-auto">
            Focus on building. We handle the business infrastructure.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {provisions.map((p, i) => (
            <div key={i} className="glass rounded-xl p-4 group cursor-default">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0 text-base group-hover:bg-white/[0.07] transition-colors">
                  {p.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="font-semibold text-sm leading-tight">{p.title}</h3>
                  <p className="text-[11px] text-muted leading-snug mt-1">{p.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
