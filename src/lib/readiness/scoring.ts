/**
 * BLOYI Readiness — scoring & gating.
 *
 * Per-item score (0..100) comes from either the user's manual submission
 * (pass=100, warn=60, fail=0, pending=0) or from the latest engine run
 * for items with kind=engine.
 *
 * Section score = weighted average of item scores (0..100).
 * Global score = weighted average of section scores × 10 → (0..1000).
 *
 * Gating: section N+1 unlocks once section N reaches GATE_THRESHOLD.
 * Section 1 is always unlocked.
 */
import { Store, newId, type ScoreSnapshot, type ReadinessSubmission, type EngineRun } from "./store";
import { SECTIONS, type ReadinessSection } from "./sections";
import { appendLedger } from "./ledger";

export const GATE_THRESHOLD = 80;

export type Tier = "none" | "bronze" | "silver" | "gold" | "platinum";

export const TIER_THRESHOLDS: Array<[Tier, number]> = [
  ["platinum", 920],
  ["gold", 800],
  ["silver", 600],
  ["bronze", 400],
  ["none", 0],
];

export function tierFor(globalScore: number): Tier {
  for (const [t, n] of TIER_THRESHOLDS) {
    if (globalScore >= n) return t;
  }
  return "none";
}

function itemScore(
  section: ReadinessSection,
  itemId: string,
  subs: ReadinessSubmission[],
  runs: EngineRun[]
): number {
  const item = section.items.find((i) => i.id === itemId);
  if (!item) return 0;
  if (item.kind === "engine") {
    const matching = runs
      .filter((r) => r.sectionId === section.id && r.itemId === itemId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    const latest = matching[matching.length - 1];
    if (!latest) return 0;
    return Math.max(0, Math.min(100, latest.score));
  }
  const sub = subs.find((s) => s.sectionId === section.id && s.itemId === itemId);
  if (!sub) return 0;
  if (sub.acceptedRisk) return 60; // accepted risk capped at warn
  switch (sub.status) {
    case "pass": return 100;
    case "warn": return 60;
    case "fail": return 0;
    case "pending": return 0;
  }
}

export function sectionScore(
  section: ReadinessSection,
  subs: ReadinessSubmission[],
  runs: EngineRun[]
): number {
  let totalW = 0;
  let acc = 0;
  for (const it of section.items) {
    const w = it.weight;
    totalW += w;
    acc += w * itemScore(section, it.id, subs, runs);
  }
  if (totalW === 0) return 0;
  return Math.round(acc / totalW);
}

export function computeSnapshot(accountId: string): ScoreSnapshot {
  const subs = Store.submissions.forAccount(accountId);
  const runs = Store.engineRuns.forAccount(accountId);
  const sectionScores: Record<string, number> = {};
  let totalW = 0;
  let acc = 0;
  for (const sec of SECTIONS) {
    const s = sectionScore(sec, subs, runs);
    sectionScores[sec.id] = s;
    totalW += sec.weight;
    acc += sec.weight * s;
  }
  const sectionAvg = totalW ? acc / totalW : 0;
  const globalScore = Math.round(sectionAvg * 10);

  // gating: walk in order; unlock next as long as previous is >= threshold
  const unlocked: string[] = [];
  let allow = true;
  for (const sec of SECTIONS) {
    if (allow) unlocked.push(sec.id);
    if (sectionScores[sec.id] < GATE_THRESHOLD) allow = false;
  }

  const snap: ScoreSnapshot = {
    id: newId("snap"),
    accountId,
    sectionScores,
    globalScore,
    tier: tierFor(globalScore),
    unlockedSections: unlocked,
    createdAt: new Date().toISOString(),
  };
  return snap;
}

/** Compute, persist, and ledger a fresh snapshot. */
export function recordSnapshot(accountId: string, reason: string): ScoreSnapshot {
  const prev = Store.scores.latest(accountId);
  const snap = computeSnapshot(accountId);
  // only persist if changed (avoid spamming)
  if (
    !prev ||
    prev.globalScore !== snap.globalScore ||
    prev.tier !== snap.tier ||
    JSON.stringify(prev.sectionScores) !== JSON.stringify(snap.sectionScores)
  ) {
    Store.scores.append(snap);
    appendLedger({
      accountId,
      stage: "scoring",
      action: `score_recomputed:${reason}`,
      type: "auto",
      status: snap.tier,
      scoreImpact: prev ? snap.globalScore - prev.globalScore : snap.globalScore,
      meta: { globalScore: snap.globalScore, tier: snap.tier },
    });
  }
  return snap;
}

export function isSectionUnlocked(accountId: string, sectionId: string): boolean {
  const snap = Store.scores.latest(accountId) ?? computeSnapshot(accountId);
  return snap.unlockedSections.includes(sectionId);
}
