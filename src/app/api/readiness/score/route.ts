import { NextResponse } from "next/server";
import { READINESS_ENABLED } from "@/lib/readiness/flag";
import { Store } from "@/lib/readiness/store";
import { getCurrentAccount } from "@/lib/readiness/auth";
import { recordSnapshot } from "@/lib/readiness/scoring";

export async function GET() {
  if (!READINESS_ENABLED)
    return NextResponse.json({ error: "Readiness disabled" }, { status: 404 });
  const ctx = await getCurrentAccount();
  if (!ctx) return NextResponse.json({ error: "auth" }, { status: 401 });
  // always recompute on read; ensures stale snapshots never mislead
  const snap = recordSnapshot(ctx.account.id, "read");
  return NextResponse.json({
    snapshot: snap,
    history: Store.scores.forAccount(ctx.account.id).slice(-20),
    account: {
      id: ctx.account.id,
      email: ctx.account.email,
      fullName: ctx.account.fullName,
      companyName: ctx.account.companyName,
    },
  });
}
