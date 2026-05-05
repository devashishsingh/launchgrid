const problems = [
  { icon: "🏢", title: "No company", desc: "Can't legally sell, sign contracts, or issue invoices." },
  { icon: "🔒", title: "Legal fear", desc: "Registration, compliance, and tax filing stop you before you start." },
  { icon: "🧾", title: "No GST/invoicing", desc: "No proper invoices kills B2B deals and enterprise trust." },
  { icon: "🛡️", title: "No trust layer", desc: "Customers need a real company behind the product." },
  { icon: "💳", title: "No payment rails", desc: "No clean way to accept, track, or split revenue." },
  { icon: "📞", title: "No support framework", desc: "No complaint channel, refund process, or SLA." },
  { icon: "📊", title: "No back-office", desc: "You're wearing every hat—sales, support, finance, legal." },
  { icon: "⚠️", title: "No payout structure", desc: "Even when customers pay, the money path is unclear." },
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
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
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
