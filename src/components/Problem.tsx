const problems = [
  { icon: "🏢", title: "No legal entity", desc: "Without a registered company, you can't sign contracts, issue invoices, or close enterprise deals." },
  { icon: "🔒", title: "Compliance overhead", desc: "Registration, filings, and statutory obligations stall builders before the first line of revenue." },
  { icon: "🧾", title: "No GST invoicing", desc: "B2B buyers and procurement desks won't transact without compliant tax invoices." },
  { icon: "🛡️", title: "Missing trust layer", desc: "Buyers underwrite the entity, not the individual. Without one, conversion collapses." },
  { icon: "💳", title: "No payment infrastructure", desc: "No clean rails to collect, reconcile, or split revenue across stakeholders." },
  { icon: "📞", title: "No support framework", desc: "No formal complaint channel, refund process, or SLA — a deal-breaker in regulated buying." },
  { icon: "📊", title: "No back-office", desc: "You're stretched across sales, support, finance, and legal — none of it your craft." },
  { icon: "⚠️", title: "Opaque payout structure", desc: "Even when customers pay, reconciliation, taxes, and disbursement remain unclear." },
];

export default function Problem() {
  return (
    <section id="problem" className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className="section-label mb-4">
            <span className="text-red-400 text-xs">⛔</span>
            The Problem
          </span>
          <h2 className="font-display text-5xl sm:text-7xl md:text-8xl leading-[0.9] tracking-tight">
            Why great software <span className="gradient-text">never reaches customers.</span>
          </h2>
          <p className="text-sm text-muted mt-2 max-w-md mx-auto">
            The gap between &quot;built&quot; and &quot;sold&quot; isn&apos;t technical — it&apos;s structural.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {problems.map((p, i) => (
            <div key={i} className="glass rounded-xl p-4 group cursor-default">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0 text-base">
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
