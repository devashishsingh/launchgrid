import type { TrustBadge } from "@/lib/marketplace-data";

const badgeConfig: Record<TrustBadge, { label: string; icon: string; color: string }> = {
  launchdock_verified: { label: "Launchbox Verified", icon: "✅", color: "bg-accent/10 text-accent border-accent/20" },
  tested: { label: "Tested", icon: "🧪", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  legal_ready: { label: "Legal Ready", icon: "⚖️", color: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  security_checked: { label: "Security Checked", icon: "🔒", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  support_ready: { label: "Support Ready", icon: "🎧", color: "bg-teal-500/10 text-teal-400 border-teal-500/20" },
  indie_founder: { label: "Indie Founder", icon: "🚀", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
};

export function TrustBadgeChip({ badge }: { badge: TrustBadge }) {
  const config = badgeConfig[badge];
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium rounded-full border ${config.color}`}>
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
}

export function TrustBadgeRow({ badges, max }: { badges: TrustBadge[]; max?: number }) {
  const shown = max ? badges.slice(0, max) : badges;
  const remaining = max ? badges.length - max : 0;
  return (
    <div className="flex flex-wrap gap-1">
      {shown.map((b) => (
        <TrustBadgeChip key={b} badge={b} />
      ))}
      {remaining > 0 && (
        <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full border bg-white/5 text-muted border-white/10">
          +{remaining} more
        </span>
      )}
    </div>
  );
}

export function TrustBadgeGrid({ badges }: { badges: TrustBadge[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {badges.map((b) => {
        const config = badgeConfig[b];
        return (
          <div key={b} className={`flex items-center gap-2 px-3 py-2 rounded-xl border ${config.color}`}>
            <span className="text-base">{config.icon}</span>
            <span className="text-xs font-medium">{config.label}</span>
          </div>
        );
      })}
    </div>
  );
}
