import { NextResponse } from "next/server";
import { READINESS_ENABLED } from "@/lib/readiness/flag";
import { Store, newId, type EngineRun } from "@/lib/readiness/store";
import { getCurrentAccount } from "@/lib/readiness/auth";
import { getEngine } from "@/lib/readiness/engines";
import { findItem, findSection } from "@/lib/readiness/sections";
import { recordSnapshot, isSectionUnlocked } from "@/lib/readiness/scoring";
import { appendLedger } from "@/lib/readiness/ledger";

export async function POST(req: Request) {
  if (!READINESS_ENABLED)
    return NextResponse.json({ error: "Readiness disabled" }, { status: 404 });
  const ctx = await getCurrentAccount();
  if (!ctx) return NextResponse.json({ error: "auth" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as null | {
    sectionId?: string;
    itemId?: string;
    engineId?: string;
    input?: Record<string, unknown>;
  };
  if (!body || !body.sectionId || !body.itemId || !body.engineId)
    return NextResponse.json({ error: "missing keys" }, { status: 400 });

  const section = findSection(body.sectionId);
  const item = findItem(body.sectionId, body.itemId);
  if (!section || !item)
    return NextResponse.json({ error: "unknown section/item" }, { status: 404 });
  if (item.kind !== "engine" || item.engineRef !== body.engineId)
    return NextResponse.json({ error: "engine mismatch" }, { status: 400 });
  if (!isSectionUnlocked(ctx.account.id, section.id))
    return NextResponse.json({ error: "section locked" }, { status: 403 });

  const engine = getEngine(body.engineId);
  if (!engine)
    return NextResponse.json({ error: "unknown engine" }, { status: 404 });

  const started = Date.now();
  let result;
  try {
    result = await engine.run({
      accountId: ctx.account.id,
      sectionId: section.id,
      itemId: item.id,
      input: body.input ?? {},
    });
  } catch (e) {
    appendLedger({
      accountId: ctx.account.id,
      sectionId: section.id,
      itemId: item.id,
      stage: section.id,
      action: `engine:${engine.id}`,
      type: "auto",
      status: "error",
      meta: { error: e instanceof Error ? e.message : "unknown" },
    });
    return NextResponse.json({ error: "engine failed" }, { status: 500 });
  }

  const run: EngineRun = {
    id: newId("run"),
    accountId: ctx.account.id,
    sectionId: section.id,
    itemId: item.id,
    engineId: engine.id,
    kind: engine.kind,
    status: result.status,
    score: result.score,
    findings: result.findings,
    inputSummary: result.inputSummary,
    durationMs: Date.now() - started,
    createdAt: new Date().toISOString(),
  };
  Store.engineRuns.append(run);
  appendLedger({
    accountId: ctx.account.id,
    sectionId: section.id,
    itemId: item.id,
    stage: section.id,
    action: `engine:${engine.id}`,
    type: "auto",
    status: result.status,
    scoreImpact: result.score,
    meta: { kind: engine.kind, findings: result.findings.length, durationMs: run.durationMs },
  });
  const snap = recordSnapshot(ctx.account.id, `engine:${engine.id}`);
  return NextResponse.json({ ok: true, run, snapshot: snap });
}
