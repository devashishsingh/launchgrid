const personas = [
  { emoji: "💼", title: "Freelancers", desc: "Stop trading hours. Start selling products." },
  { emoji: "🎓", title: "Students", desc: "Your thesis could be a business." },
  { emoji: "🌙", title: "Side-Project Devs", desc: "Day job pays bills. Side project builds wealth." },
  { emoji: "🛡️", title: "Security Pros", desc: "Your tools deserve a legitimate sales channel." },
  { emoji: "🏠", title: "Indie Builders", desc: "Ship from anywhere. Sell to anyone." },
];

export default function Audience() {
  return (
    <section id="audience" className="py-14 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <span className="section-label mb-4">Who This Is For</span>
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
            If you build it, <span className="gradient-text">we&apos;ll help you sell it.</span>
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {personas.map((p, i) => (
            <div key={i} className="glass rounded-xl p-4 text-center group cursor-default">
              <div className="text-xl mb-2 group-hover:scale-110 transition-transform">{p.emoji}</div>
              <h3 className="font-semibold text-xs mb-0.5">{p.title}</h3>
              <p className="text-[11px] text-muted leading-snug">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
