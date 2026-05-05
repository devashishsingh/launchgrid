"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const r = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr(null);
    try {
      const body =
        mode === "login"
          ? { action: "login", email, password }
          : { action: "register", email, password, fullName, companyName };
      const res = await fetch("/api/readiness/auth", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "failed");
      r.push(data.needsMfaEnrollment ? "/readiness/onboard" : "/readiness/mfa");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md bloyi-fade-in">
        <Link
          href="/"
          className="text-xs text-muted uppercase tracking-[0.2em] mb-6 inline-block hover:text-accent transition"
        >
          ← Back to bloyi
        </Link>
        <div className="glass rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl skeuo-raised flex items-center justify-center text-lg font-bold gradient-text">
              B
            </div>
            <div>
              <div className="text-xs text-muted uppercase tracking-[0.18em]">
                BLOYI · Readiness
              </div>
              <div className="text-lg font-semibold">
                {mode === "login" ? "Sign in" : "Create account"}
              </div>
            </div>
          </div>
          <p className="text-sm text-muted mb-6 mt-3">
            {mode === "login"
              ? "Enterprise-grade MFA. Real engines. Tamper-evident ledger."
              : "Begin your enterprise-readiness journey. Strict MFA enforced."}
          </p>

          <form onSubmit={submit} className="space-y-4">
            {mode === "register" && (
              <>
                <Field label="Full name">
                  <input
                    className="input-clean w-full rounded-lg px-3 py-2.5 text-sm"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    autoComplete="name"
                    required
                  />
                </Field>
                <Field label="Company name">
                  <input
                    className="input-clean w-full rounded-lg px-3 py-2.5 text-sm"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    autoComplete="organization"
                    required
                  />
                </Field>
              </>
            )}
            <Field label="Email">
              <input
                type="email"
                className="input-clean w-full rounded-lg px-3 py-2.5 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </Field>
            <Field label="Password">
              <input
                type="password"
                className="input-clean w-full rounded-lg px-3 py-2.5 text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                minLength={mode === "register" ? 10 : undefined}
                required
              />
            </Field>

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
              {busy ? "…" : mode === "login" ? "Continue → MFA" : "Create account"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <button
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-xs text-muted hover:text-accent transition"
            >
              {mode === "login"
                ? "No account yet? Register →"
                : "Already have an account? Sign in →"}
            </button>
          </div>
        </div>

        <p className="text-[10px] uppercase tracking-[0.2em] text-muted/60 text-center mt-6">
          Secure · MFA-enforced · audit-logged
        </p>
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
