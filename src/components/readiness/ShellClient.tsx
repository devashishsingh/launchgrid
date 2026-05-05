"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface SectionLite {
  id: string;
  order: number;
  title: string;
  emoji: string;
}

interface ScoreSnap {
  globalScore: number;
  tier: "none" | "bronze" | "silver" | "gold" | "platinum";
  sectionScores: Record<string, number>;
  unlockedSections: string[];
}

export interface ShellProps {
  account: { fullName: string; companyName: string; email: string };
  sections: SectionLite[];
  initialSnap: ScoreSnap;
  children: React.ReactNode;
}

const TIER_LABEL: Record<ScoreSnap["tier"], string> = {
  none: "Unrated",
  bronze: "Bronze",
  silver: "Silver",
  gold: "Gold",
  platinum: "Platinum",
};

export function ShellClient({ account, sections, initialSnap, children }: ShellProps) {
  const path = usePathname();
  const router = useRouter();
  const [snap, setSnap] = useState(initialSnap);

  useEffect(() => {
    // refresh score whenever route changes
    fetch("/api/readiness/score")
      .then((r) => r.json())
      .then((d) => {
        if (d.snapshot) setSnap(d.snapshot);
      })
      .catch(() => {});
  }, [path]);

  async function logout() {
    await fetch("/api/readiness/auth", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    router.push("/readiness/login");
  }

  return (
    <div className="min-h-screen flex">
      {/* sidebar */}
      <aside className="w-72 shrink-0 border-r border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 h-screen overflow-y-auto">
        <div className="px-5 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl skeuo-raised flex items-center justify-center text-base font-bold gradient-text">
              B
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted">
                BLOYI
              </div>
              <div className="text-sm font-semibold leading-tight">
                Readiness
              </div>
            </div>
          </div>
        </div>

        <nav className="p-3 space-y-1">
          <NavLink href="/readiness/dashboard" path={path} emoji="🎯" label="Dashboard" />
          <NavLink href="/readiness/ledger" path={path} emoji="📜" label="Ledger" />
          <NavLink href="/readiness/certificate" path={path} emoji="🏅" label="Certificate" />
        </nav>

        <div className="px-3 py-2 mt-2 text-[10px] uppercase tracking-[0.2em] text-muted">
          18 Sections
        </div>
        <div className="px-2 pb-4 space-y-0.5">
          {sections.map((s) => {
            const score = snap.sectionScores[s.id] ?? 0;
            const unlocked = snap.unlockedSections.includes(s.id);
            const active = path === `/readiness/sections/${s.id}`;
            return (
              <Link
                key={s.id}
                href={unlocked ? `/readiness/sections/${s.id}` : "#"}
                onClick={(e) => !unlocked && e.preventDefault()}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition ${
                  active
                    ? "bg-blue-500/10 border border-blue-500/30"
                    : "border border-transparent hover:bg-white/5"
                } ${!unlocked ? "opacity-50" : ""}`}
              >
                <span className="text-base">{unlocked ? s.emoji : "🔒"}</span>
                <span className="flex-1 leading-tight">
                  <div className="text-[10px] text-muted uppercase tracking-wider">
                    {String(s.order).padStart(2, "0")}
                  </div>
                  <div className="text-foreground font-medium truncate">{s.title}</div>
                </span>
                <RingBadge score={score} />
              </Link>
            );
          })}
        </div>
      </aside>

      {/* main */}
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-20 backdrop-blur-xl bg-black/40 border-b border-white/5 px-8 py-4 flex items-center gap-6">
          <div className="flex-1 min-w-0">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted">
              {account.companyName}
            </div>
            <div className="text-sm font-medium truncate">{account.fullName}</div>
          </div>
          <div className="skeuo-inset rounded-xl px-4 py-2 flex items-center gap-3">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted">
              Readiness
            </div>
            <div className="text-2xl font-bold tabular-nums">{snap.globalScore}</div>
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted">
              / 1000
            </div>
            <span className={`text-xs font-semibold uppercase tracking-[0.15em] bloyi-tier-${snap.tier}`}>
              {TIER_LABEL[snap.tier]}
            </span>
          </div>
          <button
            onClick={logout}
            className="text-xs text-muted hover:text-accent transition px-3 py-1.5 rounded-lg border border-white/5"
          >
            Sign out
          </button>
        </header>

        <main className="p-8 max-w-6xl mx-auto bloyi-fade-in">{children}</main>
      </div>
    </div>
  );
}

function NavLink({ href, path, emoji, label }: { href: string; path: string; emoji: string; label: string }) {
  const active = path === href;
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
        active ? "bg-blue-500/10 border border-blue-500/30" : "border border-transparent hover:bg-white/5"
      }`}
    >
      <span className="text-base">{emoji}</span>
      <span>{label}</span>
    </Link>
  );
}

function RingBadge({ score }: { score: number }) {
  const r = 9;
  const c = 2 * Math.PI * r;
  const off = c - (Math.max(0, Math.min(100, score)) / 100) * c;
  const color = score >= 80 ? "#34d399" : score >= 50 ? "#fbbf24" : score > 0 ? "#fb923c" : "#475569";
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" className="bloyi-progress-ring shrink-0">
      <circle cx="11" cy="11" r={r} stroke="rgba(255,255,255,0.08)" strokeWidth="2" fill="none" />
      <circle
        cx="11"
        cy="11"
        r={r}
        stroke={color}
        strokeWidth="2"
        fill="none"
        strokeDasharray={c}
        strokeDashoffset={off}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.4s ease" }}
      />
    </svg>
  );
}
