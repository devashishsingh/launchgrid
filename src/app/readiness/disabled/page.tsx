export default function ReadinessDisabled() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="glass rounded-2xl p-12 max-w-lg text-center">
        <div className="text-5xl mb-4">🛑</div>
        <h1 className="text-3xl font-semibold mb-3">Readiness module is disabled</h1>
        <p className="text-muted leading-relaxed">
          The BLOYI readiness workspace has been turned off via{" "}
          <code className="text-accent">ENABLE_READINESS=false</code>. Set the flag back to{" "}
          <code className="text-accent">true</code> and restart the server to re-enable it.
        </p>
      </div>
    </div>
  );
}
