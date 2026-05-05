import { NextResponse } from "next/server";
import { READINESS_ENABLED } from "@/lib/readiness/flag";
import { Store, newId, type EngineRun } from "@/lib/readiness/store";
import { getCurrentAccount } from "@/lib/readiness/auth";
import { ENGINES, getEngine } from "@/lib/readiness/engines";
import { findItem, findSection } from "@/lib/readiness/sections";
import { recordSnapshot, isSectionUnlocked } from "@/lib/readiness/scoring";
import { appendLedger } from "@/lib/readiness/ledger";

function gated() {
  if (!READINESS_ENABLED)
    return NextResponse.json({ error: "Readiness disabled" }, { status: 404 });
  return null;
}

export async function GET() {
  const block = gated();
  if (block) return block;
  const ctx = await getCurrentAccount();
  if (!ctx) return NextResponse.json({ error: "auth" }, { status: 401 });
  return NextResponse.json({
    engines: Object.values(ENGINES).map((e) => ({
      id: e.id,
      label: e.label,
      kind: e.kind,
      description: e.description,
      inputSchema: e.inputSchema,
    })),
    runs: Store.engineRuns.forAccount(ctx.account.id),
  });
}
