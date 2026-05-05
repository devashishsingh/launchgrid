import type { TrustScore } from "@/lib/marketplace-data";

function ScoreBar({ label, value }: { label: string; value: number }) {
  const pct = (value / 10) * 100;
  const color = value >= 9 ? "from-emerald-500 to-emerald-400" : value >= 8 ? "from-accent to-blue-400" : value >= 7 ? "from-amber-500 to-yellow-400" : "from-red-500 to-orange-400";
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted">{label}</span>
        <span className="font-medium">{value.toFixed(1)}</span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div className={`h-full rounded-full bg-gradient-to-r ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function TrustScoreBadge({ score, size = "md" }: { score: TrustScore; size?: "sm" | "md" | "lg" }) {
  const overall = score.overall;
  const color = overall >= 9 ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10" : overall >= 8 ? "text-accent border-accent/30 bg-accent/10" : overall >= 7 ? "text-amber-400 border-amber-500/30 bg-amber-500/10" : "text-red-400 border-red-500/30 bg-red-500/10";

  if (size === "sm") {
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full border ${color}`}>
        🛡️ {overall.toFixed(1)}
      </span>
    );
  }

  if (size === "lg") {
    return (
      <div className={`inline-flex flex-col items-center gap-1 px-5 py-3 rounded-2xl border ${color}`}>
        <span className="text-[10px] uppercase tracking-wider font-medium opacity-70">Trust Score</span>
        <span className="text-3xl font-bold">{overall.toFixed(1)}</span>
        <span className="text-[10px] opacity-60">/ 10</span>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border ${color}`}>
      <span>🛡️</span>
      <div>
        <p className="text-xs font-bold">{overall.toFixed(1)} / 10</p>
        <p className="text-[9px] opacity-60">Trust Score</p>
      </div>
    </div>
  );
}

export function TrustScoreBreakdown({ score }: { score: TrustScore }) {
  const { breakdown } = score;
  return (
    <div className="card-3d rounded-2xl p-6 space-y-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold text-sm">Launchbox Trust Score</h3>
        <TrustScoreBadge score={score} size="sm" />
      </div>
      <ScoreBar label="Support Quality" value={breakdown.support} />
      <ScoreBar label="Legal Completeness" value={breakdown.legalCompleteness} />
      <ScoreBar label="Product Testing" value={breakdown.productTesting} />
      <ScoreBar label="Security Basics" value={breakdown.securityBasics} />
      <ScoreBar label="Response SLA" value={breakdown.responseSLA} />
      <ScoreBar label="User Reviews" value={breakdown.reviews} />
      <ScoreBar label="Complaint Ratio" value={breakdown.complaintRatio} />
      <p className="text-[10px] text-muted/60 pt-2 border-t border-white/5">
        Score based on Launchbox verification framework. Updated after each review cycle.
      </p>
    </div>
  );
}
