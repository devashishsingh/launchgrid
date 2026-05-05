const steps = [
  {
    num: "01",
    title: "Submit your product",
    desc: "Share your GitHub link, deployment URL, and a plain-English description of what you built. No pitch deck. No investor lingo. Just show us what works.",
  },
  {
    num: "02",
    title: "Assessment",
    desc: "Our team reviews your product across 8 domains — code quality, security, authentication, data privacy, governance, support, documentation, and compliance. You get a full findings report, not a score. We tell you exactly what to fix and how.",
  },
  {
    num: "03",
    title: "Get certified",
    desc: "Clear the findings, earn the Blyoi Badge. Your product is now officially listed under Blyoi Innovations — a registered Indian company that enterprise buyers can legally contract with. You get an embeddable badge and a verifiable certificate.",
  },
  {
    num: "04",
    title: "Sign the creator agreement",
    desc: "We agree on your subscription, commission rate, and exit milestone. One agreement. Plain English. Your code, your product, and your intellectual property stay yours — always. We sign. You countersign. Payouts get configured.",
  },
  {
    num: "05",
    title: "Start selling",
    desc: "Your product goes live on the Blyoi marketplace. We pitch it. Contracts get signed under our name. Invoices go out under our GST. Payments land with us. You do none of that.",
  },
  {
    num: "06",
    title: "Track & exit on your terms",
    desc: "Every sale, every commission deduction, and every payout is visible in real time. When you hit your revenue milestone — take a happy exit, register your own company, and keep everything you built.",
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="section-label mb-4">Process</span>
          <h2 className="font-display text-5xl sm:text-7xl md:text-8xl leading-[0.9] tracking-tight">
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
