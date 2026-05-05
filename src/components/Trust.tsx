const trustItems = [
  { icon: "🔐", title: "100% IP ownership", desc: "Your code, your clients, your brand. We never touch your IP." },
  { icon: "👁️", title: "Transparent revenue share", desc: "One flat percentage. No platform fees, no processing fees, no surprises." },
  { icon: "🚪", title: "Exit-ready contracts", desc: "Graduate to your own company anytime. No lock-in, no penalties." },
];

export default function Trust() {
  return (
    <section className="py-14 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <span className="section-label mb-4">Trust</span>
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
            No fine print. <span className="gradient-text">No gotchas.</span>
          </h2>
          <p className="text-sm text-muted mt-2">Built on radical transparency.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {trustItems.map((item, i) => (
            <div key={i} className="glass rounded-xl p-5 text-center group cursor-default">
              <div className="w-12 h-12 rounded-full bg-white/[0.04] flex items-center justify-center mx-auto mb-3 text-xl group-hover:bg-white/[0.07] transition-colors">
                {item.icon}
              </div>
              <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
              <p className="text-[11px] text-muted leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
