import { NextResponse } from "next/server";
import { READINESS_ENABLED } from "@/lib/readiness/flag";
import { getCurrentSession, getCurrentAccount } from "@/lib/readiness/auth";
import { Store } from "@/lib/readiness/store";

export async function GET() {
  if (!READINESS_ENABLED)
    return NextResponse.json({ error: "Readiness disabled" }, { status: 404 });
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ authed: false });
  const acc = Store.accounts.byId(session.accountId);
  if (!acc) return NextResponse.json({ authed: false });
  return NextResponse.json({
    authed: true,
    mfaPassed: session.mfaPassed,
    needsMfaEnrollment: !acc.totpEnrolled,
    account: {
      id: acc.id,
      email: acc.email,
      fullName: acc.fullName,
      companyName: acc.companyName,
    },
  });
}
