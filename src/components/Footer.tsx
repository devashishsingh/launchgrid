import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="relative section-navy overflow-hidden pt-24 md:pt-32 pb-8 px-6 md:px-12">
      {/* Ambient orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb orb-sage" style={{ bottom: "20%", left: "-8%" }} />
        <div className="orb orb-cyan" style={{ top: "10%", right: "-6%", animationDelay: "3s" }} />
      </div>

      <div className="relative z-10 max-w-[100rem] mx-auto">
        {/* Eyebrow */}
        <span className="eyebrow text-taupe">— Build life like you own it</span>

        {/* Massive headline */}
        <h2
          className="h-display text-white mt-8"
          style={{ fontSize: "clamp(4rem, 14vw, 16rem)", lineHeight: 0.85 }}
        >
          Let&apos;s
          <br />
          <span className="text-outline">Create.</span>
        </h2>

        {/* Email link */}
        <div className="mt-12 md:mt-16">
          <a
            href="mailto:hello@blyoi.com"
            className="inline-block font-light text-sage underline decoration-1"
            style={{
              fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
              textUnderlineOffset: "8px",
            }}
          >
            hello@blyoi.com
          </a>
        </div>

        {/* Mid section — links columns */}
        <div className="mt-20 md:mt-28 grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-12">
          <div>
            <h4 className="eyebrow text-taupe mb-5">Brand</h4>
            <div className="flex items-center gap-3">
              <Logo size={28} variant="dark" />
              <span className="font-display text-xl tracking-[0.18em] text-white">BLYOI</span>
            </div>
            <p className="text-[13px] text-taupe mt-4 leading-relaxed font-light max-w-[12.5rem]">
              Sell software without registering a company. We handle legal, invoicing
              &amp; compliance.
            </p>
          </div>

          <div>
            <h4 className="eyebrow text-taupe mb-5">Platform</h4>
            <ul className="space-y-3">
              <li><a href="#problem" className="text-sm text-white/80 hover:text-sage transition-colors duration-500">Why Blyoi</a></li>
              <li><a href="#solution" className="text-sm text-white/80 hover:text-sage transition-colors duration-500">Solution</a></li>
              <li><a href="#how-it-works" className="text-sm text-white/80 hover:text-sage transition-colors duration-500">Process</a></li>
              <li><a href="#lead-capture" className="text-sm text-white/80 hover:text-sage transition-colors duration-500">Apply</a></li>
            </ul>
          </div>

          <div>
            <h4 className="eyebrow text-taupe mb-5">Resources</h4>
            <ul className="space-y-3">
              <li><a href="#contact" className="text-sm text-white/80 hover:text-sage transition-colors duration-500">Contact</a></li>
              <li><a href="#" className="text-sm text-white/80 hover:text-sage transition-colors duration-500">FAQ</a></li>
              <li><a href="#" className="text-sm text-white/80 hover:text-sage transition-colors duration-500">Creator Guide</a></li>
              <li><a href="#" className="text-sm text-white/80 hover:text-sage transition-colors duration-500">Journal</a></li>
            </ul>
          </div>

          <div>
            <h4 className="eyebrow text-taupe mb-5">Connect</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-sm text-white/80 hover:text-sage transition-colors duration-500">Instagram</a></li>
              <li><a href="#" className="text-sm text-white/80 hover:text-sage transition-colors duration-500">LinkedIn</a></li>
              <li><a href="#" className="text-sm text-white/80 hover:text-sage transition-colors duration-500">X / Twitter</a></li>
              <li><a href="#" className="text-sm text-white/80 hover:text-sage transition-colors duration-500">Discord</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom legal bar */}
        <div className="mt-20 pt-8 border-t border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-[11px] uppercase tracking-[0.22em] text-white/50 font-medium">
            © {new Date().getFullYear()} Blyoi Innovations Private Limited.
          </p>
          <div className="flex items-center gap-8">
            <a href="#" className="text-[11px] uppercase tracking-[0.22em] text-white/50 hover:text-white transition-colors">Terms</a>
            <a href="#" className="text-[11px] uppercase tracking-[0.22em] text-white/50 hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-[11px] uppercase tracking-[0.22em] text-white/50 hover:text-white transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
