"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface EnrollData {
  secret: string;
  otpauthUri: string;
  qrSvg: string;
}

export default function OnboardPage() {
  const r = useRouter();
  const [data, setData] = useState<EnrollData | null>(null);
  const [code, setCode] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/readiness/mfa", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "begin-enroll" }),
      });
      const d = await res.json();
      if (!res.ok) {
        setErr(d.error || "could not start enrolment");
        return;
      }
      setData(d);
    })();
  }, []);

  async function confirm(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const res = await fetch("/api/readiness/mfa", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "confirm-enroll", code }),
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || "failed");
      setBackupCodes(d.backupCodes);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "failed");
    } finally {
      setBusy(false);
    }
  }

  if (backupCodes) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-2xl bloyi-fade-in">
          <div className="glass rounded-2xl p-8">
            <div className="text-3xl mb-3">🔑</div>
            <h1 className="text-2xl font-semibold mb-2">Backup codes — store these securely</h1>
            <p className="text-sm text-muted mb-6">
              Each code works once if you lose access to your authenticator. We
              cannot show them again.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
              {backupCodes.map((c) => (
                <code
                  key={c}
                  className="skeuo-raised rounded-lg px-3 py-2 text-sm text-center font-mono tracking-wide"
                >
                  {c}
                </code>
              ))}
            </div>
            <button
              onClick={() => r.push("/readiness/dashboard")}
              className="skeuo-btn rounded-lg px-6 py-3 text-sm font-semibold text-white"
            >
              I&apos;ve saved them — enter the workspace →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-3xl bloyi-fade-in">
        <div className="glass rounded-2xl p-8">
          <div className="text-3xl mb-3">📱</div>
          <h1 className="text-2xl font-semibold mb-2">Enroll multi-factor authentication</h1>
          <p className="text-sm text-muted mb-6">
            BLOYI enforces strict MFA on every login. Scan the QR with Google Authenticator,
            1Password, Microsoft Authenticator, or any TOTP app. Then enter the current 6-digit code.
          </p>

          {!data && !err && (
            <div className="text-sm text-muted">Generating your secret…</div>
          )}
          {err && (
            <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
              {err}
            </div>
          )}

          {data && (
            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-xl p-3 self-start">
                <div
                  className="w-full"
                  dangerouslySetInnerHTML={{ __html: data.qrSvg }}
                />
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.18em] text-muted mb-1.5">
                    Or paste this secret manually
                  </div>
                  <code className="skeuo-raised rounded-lg px-3 py-2 text-sm font-mono break-all block">
                    {data.secret}
                  </code>
                </div>
                <form onSubmit={confirm} className="space-y-3">
                  <Field label="6-digit code from your app">
                    <input
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      placeholder="123 456"
                      className="input-clean w-full rounded-lg px-4 py-3 text-xl tracking-[0.4em] text-center font-mono"
                      value={code}
                      onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                      autoFocus
                      required
                    />
                  </Field>
                  <button
                    type="submit"
                    disabled={busy}
                    className="skeuo-btn w-full rounded-lg px-4 py-3 text-sm font-semibold text-white disabled:opacity-50"
                  >
                    {busy ? "…" : "Confirm & generate backup codes"}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <div className="text-[10px] uppercase tracking-[0.18em] text-muted mb-1.5">
        {label}
      </div>
      {children}
    </label>
  );
}
