export default function Emotional() {
  return (
    <section className="py-14 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="section-label mb-4">Zero Downside</span>
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
            Heads you win. <span className="gradient-text">Tails you walk away clean.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="glass rounded-xl p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/[0.03] to-transparent pointer-events-none" />
            <div className="relative z-10">
              <div className="text-2xl mb-3">🚀</div>
              <h3 className="text-base font-bold mb-2 gradient-text">It takes off—</h3>
              <p className="text-sm text-muted leading-relaxed">
                Revenue grows. Clients multiply. Register your own company when ready — take everything with you. We&apos;re the launchpad, not the cage.
              </p>
            </div>
          </div>

          <div className="glass rounded-xl p-6">
            <div className="text-2xl mb-3">🛡️</div>
            <h3 className="text-base font-bold mb-2">It doesn&apos;t land—</h3>
            <p className="text-sm text-muted leading-relaxed">
              No company to close. No accountant to fire. No compliance nightmare. Walk away with lessons learned and zero liability.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
