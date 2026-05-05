import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/readiness/auth";
import { Store } from "@/lib/readiness/store";
import { SECTIONS } from "@/lib/readiness/sections";
import { recordSnapshot } from "@/lib/readiness/scoring";
import { ShellClient } from "@/components/readiness/ShellClient";

export default async function GuardedLayout({ children }: { children: React.ReactNode }) {
  const session = await getCurrentSession();
  if (!session) redirect("/readiness/login");
  const acc = Store.accounts.byId(session.accountId);
  if (!acc) redirect("/readiness/login");
  if (!acc.totpEnrolled) redirect("/readiness/onboard");
  if (!session.mfaPassed) redirect("/readiness/mfa");

  const snap = recordSnapshot(acc.id, "shell-load");
  const sections = SECTIONS.map((s) => ({
    id: s.id,
    order: s.order,
    title: s.title,
    emoji: s.emoji,
  }));

  return (
    <ShellClient
      account={{
        fullName: acc.fullName,
        companyName: acc.companyName,
        email: acc.email,
      }}
      sections={sections}
      initialSnap={{
        globalScore: snap.globalScore,
        tier: snap.tier,
        sectionScores: snap.sectionScores,
        unlockedSections: snap.unlockedSections,
      }}
    >
      {children}
    </ShellClient>
  );
}
