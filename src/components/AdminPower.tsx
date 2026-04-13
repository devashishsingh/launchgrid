const powers = [
  { icon: "📝", title: "Contracts", desc: "Legal agreements under our entity." },
  { icon: "🧾", title: "Invoicing", desc: "Professional invoices, proper compliance." },
  { icon: "✅", title: "Tax & Compliance", desc: "We handle the regulatory maze." },
  { icon: "💰", title: "Payment Collection", desc: "Funds flow clean and trackable." },
];

export default function AdminPower() {
  return (
    <section className="py-14 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <span className="section-label mb-4">What We Handle</span>
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
            You build. <span className="gradient-text">We handle the rest.</span>
          </h2>
        </div>

        {/* Glass outer panel with LED indicators (skeuo) inside */}
        <div className="glass rounded-2xl p-5">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {powers.map((p, i) => (
              <div key={i} className="rounded-xl p-4 text-center group bg-white/[0.02] border border-white/[0.04]">
                <div className="text-xl mb-2 group-hover:scale-110 transition-transform">{p.icon}</div>
                <h3 className="font-semibold text-xs mb-0.5">{p.title}</h3>
                <p className="text-[11px] text-muted leading-snug">{p.desc}</p>
                <div className="flex justify-center mt-2">
                  <div className="skeuo-led" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
