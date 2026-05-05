import { NextResponse } from "next/server";
import { READINESS_ENABLED } from "@/lib/readiness/flag";
import { Store, newId, type ReadinessSubmission } from "@/lib/readiness/store";
import { getCurrentAccount } from "@/lib/readiness/auth";
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
    submissions: Store.submissions.forAccount(ctx.account.id),
  });
}

export async function POST(req: Request) {
  const block = gated();
  if (block) return block;
  const ctx = await getCurrentAccount();
  if (!ctx) return NextResponse.json({ error: "auth" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as null | {
    sectionId?: string;
    itemId?: string;
    value?: unknown;
    evidence?: string;
    notes?: string;
    status?: "pass" | "warn" | "fail" | "pending";
    acceptedRisk?: boolean;
    acceptedRiskReason?: string;
  };
  if (!body || !body.sectionId || !body.itemId)
    return NextResponse.json({ error: "missing keys" }, { status: 400 });

  const section = findSection(body.sectionId);
  const item = findItem(body.sectionId, body.itemId);
  if (!section || !item)
    return NextResponse.json({ error: "unknown section/item" }, { status: 404 });

  if (!isSectionUnlocked(ctx.account.id, section.id))
    return NextResponse.json({ error: "section locked" }, { status: 403 });

  if (item.kind === "engine")
    return NextResponse.json({ error: "use /api/readiness/engines/run" }, { status: 400 });

  const status = body.status ?? "pending";
  const score =
    status === "pass" ? 100 : status === "warn" ? 60 : status === "fail" ? 0 : 0;
  const sub: ReadinessSubmission = {
    id: newId("sub"),
    accountId: ctx.account.id,
    sectionId: section.id,
    itemId: item.id,
    value: body.value ?? null,
    evidence: body.evidence ?? null,
    notes: body.notes ?? null,
    acceptedRisk: !!body.acceptedRisk,
    acceptedRiskReason: body.acceptedRiskReason ?? null,
    status,
    score,
    updatedAt: new Date().toISOString(),
  };
  Store.submissions.upsert(sub);
  appendLedger({
    accountId: ctx.account.id,
    sectionId: section.id,
    itemId: item.id,
    stage: section.id,
    action: `submit:${item.id}`,
    type: "manual",
    status,
    scoreImpact: score,
    meta: { acceptedRisk: !!body.acceptedRisk },
  });
  const snap = recordSnapshot(ctx.account.id, "submission");
  return NextResponse.json({ ok: true, submission: sub, snapshot: snap });
}
