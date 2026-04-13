export default function ActivationHook() {
  return (
    <section className="py-14 px-6">
      <div className="max-w-3xl mx-auto text-center">
        <div className="glass-accent rounded-2xl p-8 sm:p-12 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-lg sm:text-xl font-bold leading-relaxed">
              Your best code is sitting in a
              <br />
              <span className="gradient-text">private repo collecting dust.</span>
            </p>
            <div className="w-12 h-[1px] bg-white/10 mx-auto my-5" />
            <p className="text-sm text-muted mb-1">Turn it into a product. Start earning from it.</p>
            <p className="text-sm text-foreground font-semibold">Build a reputation that compounds.</p>
            <a href="#lead-capture" className="inline-block mt-6 skeuo-btn text-white px-7 py-3 rounded-xl text-sm font-semibold">
              Start Selling Today
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
