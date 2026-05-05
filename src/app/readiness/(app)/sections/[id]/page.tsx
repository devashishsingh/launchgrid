import { redirect, notFound } from "next/navigation";
import { getCurrentSession } from "@/lib/readiness/auth";
import { Store } from "@/lib/readiness/store";
import { findSection } from "@/lib/readiness/sections";
import { isSectionUnlocked } from "@/lib/readiness/scoring";
import { ENGINES } from "@/lib/readiness/engines";
import SectionDetail from "@/components/readiness/SectionDetail";

interface Params {
  params: Promise<{ id: string }>;
}

export default async function SectionPage({ params }: Params) {
  const { id } = await params;
  const session = await getCurrentSession();
  if (!session) redirect("/readiness/login");
  const acc = Store.accounts.byId(session.accountId);
  if (!acc) redirect("/readiness/login");

  const section = findSection(id);
  if (!section) notFound();

  const subs = Store.submissions.forAccount(acc.id).filter((s) => s.sectionId === id);
  const runs = Store.engineRuns.forAccount(acc.id).filter((r) => r.sectionId === id);
  const engines = Object.fromEntries(
    Object.values(ENGINES).map((e) => [
      e.id,
      {
        id: e.id,
        label: e.label,
        kind: e.kind,
        description: e.description,
        inputSchema: e.inputSchema,
      },
    ])
  );
  const unlocked = isSectionUnlocked(acc.id, id);

  return (
    <SectionDetail
      section={section}
      submissions={subs}
      runs={runs}
      engines={engines}
      unlocked={unlocked}
    />
  );
}
