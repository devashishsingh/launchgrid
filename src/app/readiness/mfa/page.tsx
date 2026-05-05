"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MfaPage() {
  const r = useRouter();
  const [code, setCode] = useState("");
  const [backup, setBackup] = useState("");
  const [useBackup, setUseBackup] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const body = useBackup
        ? { action: "use-backup", backupCode: backup }
        : { action: "verify", code };
      const res = await fetch("/api/readiness/mfa", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "failed");
      r.push("/readiness/dashboard");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md bloyi-fade-in">
        <div className="glass rounded-2xl p-8">
          <div className="text-3xl mb-4">🛡️</div>
          <h1 className="text-2xl font-semibold mb-2">Multi-factor verification</h1>
          <p className="text-sm text-muted mb-6">
            Open your authenticator app and enter the current 6-digit code.
          </p>

          <form onSubmit={verify} className="space-y-4">
            {!useBackup ? (
              <input
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                placeholder="123 456"
                className="input-clean w-full rounded-lg px-4 py-4 text-2xl tracking-[0.4em] text-center font-mono"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                autoFocus
                required
              />
            ) : (
              <input
                placeholder="XXXX-XXXX-XX"
                className="input-clean w-full rounded-lg px-4 py-3 text-base tracking-[0.2em] text-center font-mono uppercase"
                value={backup}
                onChange={(e) => setBackup(e.target.value)}
                autoFocus
                required
              />
            )}

            {err && (
              <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
                {err}
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="skeuo-btn w-full rounded-lg px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {busy ? "…" : "Verify & enter workspace"}
            </button>
          </form>

          <button
            onClick={() => {
              setUseBackup((v) => !v);
              setErr(null);
            }}
            className="mt-6 text-xs text-muted hover:text-accent transition"
          >
            {useBackup ? "← Use authenticator app" : "Use a backup code →"}
          </button>
        </div>
      </div>
    </div>
  );
}
