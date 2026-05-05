import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/readiness/auth";
import { Store } from "@/lib/readiness/store";
import LedgerView from "@/components/readiness/LedgerView";

export default async function LedgerPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/readiness/login");
  const acc = Store.accounts.byId(session.accountId);
  if (!acc) redirect("/readiness/login");
  const entries = Store.ledger
    .forAccount(acc.id)
    .sort((a, b) => b.index - a.index);
  return <LedgerView initial={entries} />;
}
