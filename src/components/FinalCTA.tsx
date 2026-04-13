export default function FinalCTA() {
  return (
    <section className="py-16 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <div className="glass-accent rounded-2xl p-10 sm:p-14 relative overflow-hidden">
          <div className="relative z-10">
            <span className="section-label mb-5">
              <span className="skeuo-led" />
              Ready?
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
              Stop planning.
              <br />
              <span className="gradient-text">Start selling.</span>
            </h2>
            <p className="mt-3 text-sm text-muted max-w-md mx-auto">
              Your product. Our company. Revenue from day one.
            </p>
            <div className="w-12 h-[1px] bg-white/10 mx-auto my-6" />
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a href="#lead-capture" className="skeuo-btn text-white px-8 py-3.5 rounded-xl text-sm font-semibold">
                Apply for Early Access
              </a>
              <a href="#contact" className="skeuo-btn-secondary text-foreground px-8 py-3.5 rounded-xl text-sm font-medium">
                Ask a Question
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
