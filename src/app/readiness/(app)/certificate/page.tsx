import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/readiness/auth";
import { Store } from "@/lib/readiness/store";
import { SECTIONS } from "@/lib/readiness/sections";
import { recordSnapshot } from "@/lib/readiness/scoring";

export default async function CertificatePage() {
  const session = await getCurrentSession();
  if (!session) redirect("/readiness/login");
  const acc = Store.accounts.byId(session.accountId);
  if (!acc) redirect("/readiness/login");
  const snap = recordSnapshot(acc.id, "certificate");

  const tierCls =
    snap.tier === "platinum"
      ? "bloyi-medal bloyi-medal-platinum"
      : snap.tier === "gold"
        ? "bloyi-medal"
        : snap.tier === "silver"
          ? "bloyi-medal bloyi-medal-silver"
          : snap.tier === "bronze"
            ? "bloyi-medal bloyi-medal-bronze"
            : "bloyi-medal grayscale";

  return (
    <div className="space-y-6">
      <div className="glass-accent rounded-2xl p-10 text-center">
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted mb-4">
          BLOYI Enterprise Readiness Certificate
        </div>
        <div className={`w-32 h-32 rounded-full ${tierCls} mx-auto flex items-center justify-center text-5xl mb-6`}>
          🏅
        </div>
        <div className={`text-xs uppercase tracking-[0.3em] font-semibold bloyi-tier-${snap.tier} mb-2`}>
          {snap.tier} tier
        </div>
        <div className="text-6xl font-bold tabular-nums">{snap.globalScore}</div>
        <div className="text-sm text-muted mt-1">/ 1000 readiness score</div>
        <div className="mt-8">
          <div className="text-2xl font-semibold gradient-text">{acc.companyName}</div>
          <div className="text-sm text-muted">issued to {acc.fullName} · {acc.email}</div>
          <div className="text-[10px] text-muted mt-3 tracking-[0.18em] uppercase">
            Issued {new Date(snap.createdAt).toLocaleDateString()} · ledger entry signed
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-6">
          <h2 className="text-xs uppercase tracking-[0.2em] text-muted mb-4">Section breakdown</h2>
          <div className="space-y-2">
            {SECTIONS.map((s) => {
              const v = snap.sectionScores[s.id] ?? 0;
              return (
                <div key={s.id} className="flex items-center gap-3 text-xs">
                  <span className="w-6">{s.emoji}</span>
                  <span className="flex-1 truncate">{s.title}</span>
                  <span className="tabular-nums w-10 text-right">{v}%</span>
                  <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="h-full"
                      style={{
                        width: `${v}%`,
                        background:
                          v >= 80
                            ? "linear-gradient(90deg, #34d399, #10b981)"
                            : v >= 50
                              ? "linear-gradient(90deg, #fbbf24, #f59e0b)"
                              : "linear-gradient(90deg, #fb923c, #f97316)",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass rounded-2xl p-6">
          <h2 className="text-xs uppercase tracking-[0.2em] text-muted mb-4">Tiers</h2>
          <ul className="text-sm space-y-2">
            <li className="flex items-center gap-2"><span className="bloyi-tier-platinum">●</span> Platinum — score ≥ 920</li>
            <li className="flex items-center gap-2"><span className="bloyi-tier-gold">●</span> Gold — score ≥ 800</li>
            <li className="flex items-center gap-2"><span className="bloyi-tier-silver">●</span> Silver — score ≥ 600</li>
            <li className="flex items-center gap-2"><span className="bloyi-tier-bronze">●</span> Bronze — score ≥ 400</li>
            <li className="flex items-center gap-2 text-muted">○ Unrated — below 400</li>
          </ul>
          <p className="text-xs text-muted mt-6 leading-relaxed">
            Each section unlocks once the previous one reaches 80%. The certificate
            updates in real time as you complete items and re-run engines.
          </p>
          <Link
            href="/readiness/dashboard"
            className="mt-4 inline-block skeuo-btn-secondary rounded-lg px-4 py-2 text-xs font-semibold"
          >
            ← Back to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
