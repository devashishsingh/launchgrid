export default function Hero() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden section-navy flex flex-col">
      {/* Ambient floating orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb orb-sage" style={{ top: "12%", left: "-6%" }} />
        <div
          className="orb orb-blue"
          style={{ bottom: "10%", right: "-4%", animationDelay: "2s" }}
        />
        <div
          className="orb orb-cyan"
          style={{ top: "55%", left: "40%", animationDelay: "4s", opacity: 0.12 }}
        />
      </div>

      {/* Top eyebrow row — sits below the fixed nav */}
      <div className="relative z-10 px-8 md:px-12 pt-32 md:pt-40 flex justify-between items-center">
        <span className="eyebrow text-taupe">
          <span className="inline-block w-2 h-2 rounded-full bg-sage mr-3 align-middle animate-pulse" />
          Independent. Incorporated. Indistinguishable.
        </span>
        <span className="hidden md:inline-block eyebrow text-taupe">
          ©  Blyoi · MMXXVI
        </span>
      </div>

      {/* Main headline block — flush left, editorial */}
      <div className="relative z-10 flex-1 flex flex-col justify-center px-6 md:px-12 py-16 md:py-24">
        <h1
          className="h-display text-white"
          style={{
            fontSize: "clamp(3.25rem, 14.5vw, 18rem)",
            lineHeight: 0.85,
          }}
        >
          <span className="block">Build Life</span>
          <span className="block text-outline">Like You</span>
          <span className="block">Own It.</span>
        </h1>
      </div>

      {/* Bottom row — taupe lede left, circular arrow right */}
      <div className="relative z-10 px-8 md:px-12 pb-12 md:pb-16 flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
        <p
          className="text-taupe text-sm md:text-[15px] leading-relaxed font-light"
          style={{ maxWidth: "340px" }}
        >
          Ship your software under a real company — without becoming one.
          We carry the legal weight, the invoicing rails and the trust badge
          buyers demand. You keep every line of code, every rupee of IP,
          and the freedom to walk the moment it stops serving you.
        </p>

        <a
          href="#lead-capture"
          aria-label="Begin"
          className="group relative shrink-0 w-16 h-16 md:w-20 md:h-20 rounded-full border border-white/40 flex items-center justify-center transition-all duration-700 hover:border-cyan hover:bg-white/5"
          style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
        >
          <svg
            className="w-5 h-5 md:w-6 md:h-6 text-white transition-transform duration-700 animate-bounce"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="square" strokeLinejoin="miter" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </a>
      </div>
    </section>
  );
}
