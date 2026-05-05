import Link from "next/link";
import { getCurrentSession } from "@/lib/readiness/auth";
import { Store } from "@/lib/readiness/store";
import { SECTIONS } from "@/lib/readiness/sections";
import { recordSnapshot } from "@/lib/readiness/scoring";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/readiness/login");
  const acc = Store.accounts.byId(session.accountId);
  if (!acc) redirect("/readiness/login");
  const snap = recordSnapshot(acc.id, "dashboard");
  const next = SECTIONS.find(
    (s) => snap.unlockedSections.includes(s.id) && (snap.sectionScores[s.id] ?? 0) < 80
  ) ?? SECTIONS[0];

  return (
    <div className="space-y-8">
      <section className="grid md:grid-cols-3 gap-6">
        <div className="glass rounded-2xl p-6 md:col-span-2">
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted mb-2">
            Welcome back, {acc.fullName.split(" ")[0]}
          </div>
          <h1 className="text-3xl font-semibold mb-2 leading-tight">
            Take <span className="gradient-text">{acc.companyName}</span> enterprise-ready.
          </h1>
          <p className="text-sm text-muted leading-relaxed max-w-2xl">
            Eighteen progressive gates — identity, security, compliance, governance.
            Real engines run scans. A tamper-evident ledger records every action.
            Hit Gold to unlock your shareable certificate.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href={`/readiness/sections/${next.id}`}
              className="skeuo-btn rounded-lg px-5 py-2.5 text-sm font-semibold text-white"
            >
              Continue → {next.emoji} {next.title}
            </Link>
            <Link
              href="/readiness/ledger"
              className="skeuo-btn-secondary rounded-lg px-5 py-2.5 text-sm font-semibold text-foreground"
            >
              Open ledger
            </Link>
          </div>
        </div>

        <div className="glass-accent rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <Medal tier={snap.tier} />
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted mt-4">
            Current readiness
          </div>
          <div className="text-5xl font-bold tabular-nums my-1">
            {snap.globalScore}
          </div>
          <div className="text-xs text-muted">/ 1000</div>
          <div className={`mt-2 text-xs font-semibold uppercase tracking-[0.18em] bloyi-tier-${snap.tier}`}>
            {snap.tier}
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-xs uppercase tracking-[0.2em] text-muted mb-4">
          18 Sections
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SECTIONS.map((s) => {
            const score = snap.sectionScores[s.id] ?? 0;
            const unlocked = snap.unlockedSections.includes(s.id);
            return (
              <Link
                key={s.id}
                href={unlocked ? `/readiness/sections/${s.id}` : "#"}
                onClick={(e) => !unlocked && e.preventDefault()}
                className={`glass bloyi-card-hover rounded-xl p-5 block ${unlocked ? "" : "opacity-50 cursor-not-allowed"}`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 skeuo-raised rounded-lg flex items-center justify-center text-lg shrink-0">
                    {unlocked ? s.emoji : "🔒"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-muted mb-0.5">
                      Section {String(s.order).padStart(2, "0")}
                    </div>
                    <div className="text-sm font-semibold leading-tight">
                      {s.title}
                    </div>
                  </div>
                  <span className="text-xs tabular-nums text-muted">{score}%</span>
                </div>
                <p className="text-xs text-muted mt-3 line-clamp-2">{s.blurb}</p>
                <div className="mt-3 h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full"
                    style={{
                      width: `${score}%`,
                      background:
                        score >= 80
                          ? "linear-gradient(90deg, #34d399, #10b981)"
                          : score >= 50
                            ? "linear-gradient(90deg, #fbbf24, #f59e0b)"
                            : "linear-gradient(90deg, #fb923c, #f97316)",
                    }}
                  />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function Medal({ tier }: { tier: string }) {
  const cls =
    tier === "platinum"
      ? "bloyi-medal bloyi-medal-platinum"
      : tier === "gold"
        ? "bloyi-medal"
        : tier === "silver"
          ? "bloyi-medal bloyi-medal-silver"
          : tier === "bronze"
            ? "bloyi-medal bloyi-medal-bronze"
            : "bloyi-medal";
  return (
    <div
      className={`w-24 h-24 rounded-full ${cls} flex items-center justify-center text-3xl ${
        tier === "none" ? "grayscale" : ""
      }`}
    >
      🏅
    </div>
  );
}
