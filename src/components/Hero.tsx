export default function Hero() {
  return (
    <section className="min-h-[80vh] flex items-center justify-center px-6 pt-20 mesh-gradient relative overflow-hidden">
      {/* Subtle ambient glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-[10%] w-96 h-96 bg-blue-500/[0.06] rounded-full blur-[100px] float-3d" />
        <div className="absolute bottom-1/4 right-[8%] w-80 h-80 bg-indigo-500/[0.04] rounded-full blur-[100px] float-3d" style={{ animationDelay: "3s" }} />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Live status badge — glass pill */}
        <div className="inline-flex items-center gap-2.5 glass-subtle rounded-full px-5 py-2 mb-6">
          <span className="skeuo-led" />
          <span className="text-xs font-semibold tracking-wide text-foreground/80 uppercase">Early Access — Now Open</span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.12]">
          <span className="gradient-text-warm">Sell your software</span>
          <br />
          <span className="gradient-text">without a company.</span>
        </h1>

        <p className="mt-4 text-sm sm:text-base text-muted max-w-lg mx-auto leading-relaxed">
          We provide the registered company, legal agreements, invoicing, payment collection &amp; payouts.
          You keep 100% of your IP and walk away anytime.
        </p>

        {/* CTA buttons — physical raised buttons (skeuo) */}
        <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
          <a href="#lead-capture" className="skeuo-btn text-white px-8 py-3 rounded-xl text-sm font-semibold">
            Apply to Launch →
          </a>
          <a href="#contact" className="skeuo-btn-secondary text-foreground px-8 py-3 rounded-xl text-sm font-medium">
            Book a Discovery Call
          </a>
        </div>

        {/* Dashboard-style stats panel — skeuo raised with inset gauges */}
        <div className="mt-10 skeuo-raised skeuo-stitched rounded-2xl p-5 max-w-2xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.06]">
            <div className="text-center px-4">
              <div className="skeuo-inset rounded-lg px-3 py-2 mb-2 inline-block">
                <p className="text-2xl sm:text-3xl font-bold gradient-text font-mono">₹0</p>
              </div>
              <p className="text-[11px] text-muted uppercase tracking-wider font-medium">Upfront Cost</p>
            </div>
            <div className="text-center px-4">
              <div className="skeuo-inset rounded-lg px-3 py-2 mb-2 inline-block">
                <p className="text-2xl sm:text-3xl font-bold gradient-text font-mono">100%</p>
              </div>
              <p className="text-[11px] text-muted uppercase tracking-wider font-medium">Your IP</p>
            </div>
            <div className="text-center px-4">
              <div className="skeuo-inset rounded-lg px-3 py-2 mb-2 inline-block">
                <p className="text-2xl sm:text-3xl font-bold gradient-text font-mono">Day 1</p>
              </div>
              <p className="text-[11px] text-muted uppercase tracking-wider font-medium">Start Selling</p>
            </div>
          </div>
        </div>

        {/* Trust chips — glass subtle */}
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {[
            { icon: "📜", label: "Legal Agreements" },
            { icon: "🧾", label: "GST Invoicing" },
            { icon: "💰", label: "Payout Tracking" },
            { icon: "🛡️", label: "Trust Badge" },
            { icon: "📊", label: "Creator Dashboard" },
            { icon: "🎧", label: "Support System" },
          ].map((chip) => (
            <span key={chip.label} className="glass-subtle rounded-full px-3 py-1 text-[11px] text-muted inline-flex items-center gap-1.5">
              <span>{chip.icon}</span>
              {chip.label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
