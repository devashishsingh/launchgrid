/**
 * BLOYI Readiness — append-only hash-chained ledger.
 * Every readiness action MUST go through appendLedger().
 */
import { createHash } from "crypto";
import { Store, newId, type LedgerEntry } from "./store";

function hashEntry(e: Omit<LedgerEntry, "hash">): string {
  const payload = JSON.stringify({
    index: e.index,
    timestamp: e.timestamp,
    accountId: e.accountId,
    sectionId: e.sectionId,
    itemId: e.itemId,
    stage: e.stage,
    action: e.action,
    type: e.type,
    status: e.status,
    scoreImpact: e.scoreImpact,
    prevHash: e.prevHash,
    meta: e.meta ?? null,
  });
  return createHash("sha256").update(payload).digest("hex");
}

export function appendLedger(input: {
  accountId: string;
  sectionId?: string | null;
  itemId?: string | null;
  stage: string;
  action: string;
  type: "manual" | "auto";
  status: string;
  scoreImpact?: number;
  meta?: Record<string, unknown>;
}): LedgerEntry {
  const all = Store.ledger.all();
  const last = all[all.length - 1];
  const index = last ? last.index + 1 : 0;
  const prevHash = last ? last.hash : "0".repeat(64);
  const partial: Omit<LedgerEntry, "hash"> = {
    id: newId("ldg"),
    index,
    timestamp: new Date().toISOString(),
    accountId: input.accountId,
    sectionId: input.sectionId ?? null,
    itemId: input.itemId ?? null,
    stage: input.stage,
    action: input.action,
    type: input.type,
    status: input.status,
    scoreImpact: input.scoreImpact ?? 0,
    prevHash,
    meta: input.meta,
  };
  const entry: LedgerEntry = { ...partial, hash: hashEntry(partial) };
  Store.ledger.append(entry);
  return entry;
}

export interface IntegrityResult {
  ok: boolean;
  total: number;
  brokenAt: number | null;
  brokenReason: string | null;
}

export function verifyIntegrity(accountId?: string): IntegrityResult {
  const all = accountId ? Store.ledger.forAccount(accountId) : Store.ledger.all();
  let prevHash = "0".repeat(64);
  let prevIndex = -1;
  for (const e of all) {
    if (accountId === undefined) {
      // global: check chain on full ledger
      if (e.index !== prevIndex + 1)
        return { ok: false, total: all.length, brokenAt: e.index, brokenReason: "index gap" };
      if (e.prevHash !== prevHash)
        return { ok: false, total: all.length, brokenAt: e.index, brokenReason: "prevHash mismatch" };
    }
    const expected = hashEntry({
      id: e.id,
      index: e.index,
      timestamp: e.timestamp,
      accountId: e.accountId,
      sectionId: e.sectionId,
      itemId: e.itemId,
      stage: e.stage,
      action: e.action,
      type: e.type,
      status: e.status,
      scoreImpact: e.scoreImpact,
      prevHash: e.prevHash,
      meta: e.meta,
    });
    if (expected !== e.hash)
      return { ok: false, total: all.length, brokenAt: e.index, brokenReason: "hash mismatch" };
    prevHash = e.hash;
    prevIndex = e.index;
  }
  return { ok: true, total: all.length, brokenAt: null, brokenReason: null };
}
