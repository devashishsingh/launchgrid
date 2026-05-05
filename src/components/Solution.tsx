const features = [
  { icon: "📝", title: "Sign Contracts", desc: "Legal agreements under a registered entity." },
  { icon: "🧾", title: "Send Invoices", desc: "GST-compliant invoices from day one." },
  { icon: "💳", title: "Accept Payments", desc: "Proper banking channels, no grey areas." },
  { icon: "🔓", title: "Keep Everything", desc: "Your code, IP, clients — always yours." },
];

export default function Solution() {
  return (
    <section id="solution" className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className="section-label mb-4">
            <span className="text-green-400 text-xs">✅</span>
            The Solution
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
            Operate like a company. <span className="gradient-text">Without becoming one.</span>
          </h2>
          <p className="text-sm text-muted mt-2 max-w-md mx-auto">
            We provide the legal &amp; commercial infrastructure. You provide the talent.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {features.map((f, i) => (
            <div key={i} className="glass rounded-xl p-5 text-center group cursor-default">
              <div className="w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center mx-auto mb-3 text-xl group-hover:bg-white/[0.07] transition-colors">
                {f.icon}
              </div>
              <h3 className="font-semibold text-sm mb-1">{f.title}</h3>
              <p className="text-[11px] text-muted leading-snug">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
