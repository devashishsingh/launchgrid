import { NextResponse } from "next/server";
import { READINESS_ENABLED } from "@/lib/readiness/flag";
import { Store } from "@/lib/readiness/store";
import { getCurrentAccount } from "@/lib/readiness/auth";
import { verifyIntegrity } from "@/lib/readiness/ledger";

export async function GET(req: Request) {
  if (!READINESS_ENABLED)
    return NextResponse.json({ error: "Readiness disabled" }, { status: 404 });
  const ctx = await getCurrentAccount();
  if (!ctx) return NextResponse.json({ error: "auth" }, { status: 401 });
  const url = new URL(req.url);
  if (url.searchParams.get("verify") === "1") {
    return NextResponse.json({ integrity: verifyIntegrity() });
  }
  return NextResponse.json({
    entries: Store.ledger.forAccount(ctx.account.id),
  });
}
