const provisions = [
  { icon: "🏢", title: "Registered company umbrella", desc: "Sell SaaS, software, and digital products under our incorporated Indian entity — contracts, GST, and compliance handled end-to-end." },
  { icon: "📜", title: "Enterprise-grade agreements", desc: "Built-in IP assignment, payout schedules, refund policy, SLAs, and exit clauses — drafted to pass procurement and legal review." },
  { icon: "🛡️", title: "Verified trust badge", desc: "Earn the Blyoi Verified mark — instant credibility for B2B buyers, marketplaces, and enterprise procurement teams." },
  { icon: "💳", title: "Compliant payment intake", desc: "Accept domestic and international payments through audited banking and PG rails — every transaction reconciled to the rupee." },
  { icon: "💰", title: "Real-time payout ledger", desc: "Track every sale, platform fee, tax withholding, and disbursement in a transparent, audit-ready ledger." },
  { icon: "🎧", title: "Customer support workflow", desc: "A defined escalation matrix, ticketing system, and SLA tracking so every buyer complaint resolves on record." },
  { icon: "🔒", title: "Buyer trust pages", desc: "Company-backed product, refund, and support pages that close the credibility gap for first-time enterprise buyers." },
  { icon: "📊", title: "Creator command center", desc: "A single dashboard for products, sales, workflow stages, customer tickets, and payouts — built for indie operators." },
  { icon: "🔗", title: "Launch amplification", desc: "Distribution support across our partner network, marketplaces, and procurement channels to compound your day-one reach." },
];

export default function WhatWeProvide() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className="section-label mb-4">What You Get</span>
          <h2 className="font-display text-5xl sm:text-7xl md:text-8xl leading-[0.9] tracking-tight">
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
