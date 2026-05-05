import { redirect } from "next/navigation";
import { READINESS_ENABLED } from "@/lib/readiness/flag";
import { getCurrentSession } from "@/lib/readiness/auth";
import { Store } from "@/lib/readiness/store";

export default async function ReadinessRoot() {
  if (!READINESS_ENABLED) redirect("/readiness/disabled");
  const session = await getCurrentSession();
  if (!session) redirect("/readiness/login");
  const acc = Store.accounts.byId(session.accountId);
  if (!acc) redirect("/readiness/login");
  if (!acc.totpEnrolled) redirect("/readiness/onboard");
  if (!session.mfaPassed) redirect("/readiness/mfa");
  redirect("/readiness/dashboard");
}
