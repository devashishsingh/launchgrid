"use client";

import { useState } from "react";
import type { ReadinessSection, ReadinessItem } from "@/lib/readiness/sections";
import type {
  ReadinessSubmission,
  EngineRun,
  EngineFinding,
} from "@/lib/readiness/store";

interface EngineLite {
  id: string;
  label: string;
  kind: "real" | "mock";
  description: string;
  inputSchema: { fields: { name: string; label: string; kind: string; placeholder?: string; required?: boolean }[] };
}

interface Props {
  section: ReadinessSection;
  submissions: ReadinessSubmission[];
  runs: EngineRun[];
  engines: Record<string, EngineLite>;
  unlocked: boolean;
}

export default function SectionDetail({ section, submissions: initSubs, runs: initRuns, engines, unlocked }: Props) {
  const [subs, setSubs] = useState<ReadinessSubmission[]>(initSubs);
  const [runs, setRuns] = useState<EngineRun[]>(initRuns);
  const [drawer, setDrawer] = useState<EngineRun | null>(null);

  function subFor(itemId: string) {
    return subs.find((s) => s.itemId === itemId && s.sectionId === section.id);
  }
  function latestRun(itemId: string) {
    return runs
      .filter((r) => r.itemId === itemId && r.sectionId === section.id)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      .pop();
  }

  async function submit(itemId: string, status: "pass" | "warn" | "fail" | "pending", value?: unknown, evidence?: string) {
    const res = await fetch("/api/readiness/submissions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sectionId: section.id, itemId, status, value, evidence }),
    });
    const d = await res.json();
    if (res.ok && d.submission) {
      setSubs((s) => {
        const i = s.findIndex((x) => x.itemId === itemId && x.sectionId === section.id);
        if (i >= 0) {
          const cp = [...s];
          cp[i] = d.submission;
          return cp;
        }
        return [...s, d.submission];
      });
    }
  }

  async function runEngine(item: ReadinessItem, input: Record<string, unknown>) {
    if (!item.engineRef) return;
    const res = await fetch("/api/readiness/engines/run", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ sectionId: section.id, itemId: item.id, engineId: item.engineRef, input }),
    });
    const d = await res.json();
    if (res.ok && d.run) {
      setRuns((r) => [...r, d.run]);
      setDrawer(d.run);
    } else {
      alert(d.error || "engine failed");
    }
  }

  if (!unlocked) {
    return (
      <div className="glass rounded-2xl p-12 text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="text-2xl font-semibold mb-2">Section locked</h1>
        <p className="text-sm text-muted">
          Reach 80% on the previous section to unlock {section.emoji} {section.title}.
        </p>
      </div>
    );
  }

  const passCount = section.items.filter((i) => {
    const r = i.kind === "engine" ? latestRun(i.id) : subFor(i.id);
    return r && (r.status === "pass" || (r as EngineRun).status === "pass");
  }).length;
  const pct = Math.round((passCount / section.items.length) * 100);

  return (
    <div className="space-y-6">
      <header className="glass rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 skeuo-raised rounded-xl flex items-center justify-center text-2xl">
            {section.emoji}
          </div>
          <div className="flex-1">
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted">
              Section {String(section.order).padStart(2, "0")} · weight {section.weight}
            </div>
            <h1 className="text-2xl font-semibold">{section.title}</h1>
            <p className="text-sm text-muted mt-1">{section.blurb}</p>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-[0.18em] text-muted">
              Items pass
            </div>
            <div className="text-3xl font-bold tabular-nums">
              {passCount}/{section.items.length}
            </div>
            <div className="text-xs text-muted">{pct}%</div>
          </div>
        </div>
      </header>

      <div className="space-y-3">
        {section.items.map((item) => (
          <ItemCard
            key={item.id}
            item={item}
            sub={subFor(item.id)}
            run={latestRun(item.id)}
            engine={item.engineRef ? engines[item.engineRef] : undefined}
            onSubmit={submit}
            onRun={runEngine}
            onOpen={(r) => setDrawer(r)}
          />
        ))}
      </div>

      {drawer && (
        <FindingsDrawer run={drawer} onClose={() => setDrawer(null)} />
      )}
    </div>
  );
}

function StatusPill({ status }: { status: "pass" | "warn" | "fail" | "pending" | "error" }) {
  const map: Record<string, { bg: string; label: string }> = {
    pass: { bg: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30", label: "Pass" },
    warn: { bg: "bg-amber-500/15 text-amber-300 border-amber-500/30", label: "Warn" },
    fail: { bg: "bg-red-500/15 text-red-300 border-red-500/30", label: "Fail" },
    pending: { bg: "bg-slate-500/15 text-slate-300 border-slate-500/30", label: "Pending" },
    error: { bg: "bg-red-500/15 text-red-300 border-red-500/30", label: "Error" },
  };
  const s = map[status] ?? map.pending;
  return (
    <span className={`text-[10px] uppercase tracking-[0.15em] font-semibold px-2 py-0.5 rounded-full border ${s.bg}`}>
      {s.label}
    </span>
  );
}

function ItemCard({
  item,
  sub,
  run,
  engine,
  onSubmit,
  onRun,
  onOpen,
}: {
  item: ReadinessItem;
  sub: ReadinessSubmission | undefined;
  run: EngineRun | undefined;
  engine: EngineLite | undefined;
  onSubmit: (id: string, status: "pass" | "warn" | "fail" | "pending", value?: unknown, evidence?: string) => void;
  onRun: (item: ReadinessItem, input: Record<string, unknown>) => void;
  onOpen: (r: EngineRun) => void;
}) {
  const [inputVal, setInputVal] = useState<string>(typeof sub?.value === "string" ? sub.value : "");
  const [engineInputs, setEngineInputs] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const status =
    item.kind === "engine"
      ? run?.status ?? "pending"
      : sub?.status ?? "pending";

  return (
    <div className="glass rounded-xl p-5">
      <div className="flex items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">{item.label}</span>
            <StatusPill status={status} />
            {item.kind === "engine" && (
              <span
                className={`text-[10px] uppercase tracking-[0.15em] font-semibold px-2 py-0.5 rounded-full border ${
                  engine?.kind === "real"
                    ? "bg-blue-500/10 text-blue-300 border-blue-500/30"
                    : "bg-purple-500/10 text-purple-300 border-purple-500/30"
                }`}
              >
                {engine?.kind === "real" ? "Engine · real" : "Engine · preview"}
              </span>
            )}
          </div>
          {item.helpText && (
            <p className="text-xs text-muted mt-1.5">{item.helpText}</p>
          )}
        </div>
      </div>

      <div className="mt-4">
        {item.kind === "attestation" && (
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onSubmit(item.id, "pass")}
              className={`text-xs px-3 py-1.5 rounded-lg border ${
                status === "pass" ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/40" : "bg-white/5 border-white/10 hover:border-emerald-500/40"
              }`}
            >
              ✓ Confirm
            </button>
            <button
              onClick={() => onSubmit(item.id, "warn")}
              className={`text-xs px-3 py-1.5 rounded-lg border ${
                status === "warn" ? "bg-amber-500/15 text-amber-300 border-amber-500/40" : "bg-white/5 border-white/10 hover:border-amber-500/40"
              }`}
            >
              ! Partial
            </button>
            <button
              onClick={() => onSubmit(item.id, "fail")}
              className={`text-xs px-3 py-1.5 rounded-lg border ${
                status === "fail" ? "bg-red-500/15 text-red-300 border-red-500/40" : "bg-white/5 border-white/10 hover:border-red-500/40"
              }`}
            >
              ✗ Not yet
            </button>
          </div>
        )}

        {item.kind === "input" && (
          <div className="flex gap-2">
            <input
              className="input-clean flex-1 rounded-lg px-3 py-2 text-sm"
              value={inputVal}
              placeholder="Enter value…"
              onChange={(e) => setInputVal(e.target.value)}
            />
            <button
              onClick={() => onSubmit(item.id, inputVal.trim() ? "pass" : "fail", inputVal)}
              className="skeuo-btn rounded-lg px-4 py-2 text-xs font-semibold text-white"
            >
              Save
            </button>
          </div>
        )}

        {item.kind === "upload" && (
          <div className="flex gap-2">
            <input
              className="input-clean flex-1 rounded-lg px-3 py-2 text-sm"
              value={inputVal}
              placeholder="Paste URL or filename of the document"
              onChange={(e) => setInputVal(e.target.value)}
            />
            <button
              onClick={() => onSubmit(item.id, inputVal.trim() ? "pass" : "fail", inputVal, inputVal)}
              className="skeuo-btn rounded-lg px-4 py-2 text-xs font-semibold text-white"
            >
              Attach
            </button>
          </div>
        )}

        {item.kind === "engine" && engine && (
          <div className="space-y-2">
            <p className="text-xs text-muted">{engine.description}</p>
            {engine.inputSchema.fields.length > 0 && (
              <div className="grid gap-2">
                {engine.inputSchema.fields.map((f) => (
                  <label key={f.name} className="block">
                    <div className="text-[10px] uppercase tracking-[0.18em] text-muted mb-1">
                      {f.label}
                    </div>
                    {f.kind === "textarea" ? (
                      <textarea
                        className="input-clean w-full rounded-lg px-3 py-2 text-xs font-mono"
                        rows={5}
                        placeholder={f.placeholder}
                        value={engineInputs[f.name] ?? ""}
                        onChange={(e) =>
                          setEngineInputs((m) => ({ ...m, [f.name]: e.target.value }))
                        }
                      />
                    ) : (
                      <input
                        className="input-clean w-full rounded-lg px-3 py-2 text-sm"
                        type={f.kind === "url" ? "url" : "text"}
                        placeholder={f.placeholder}
                        value={engineInputs[f.name] ?? ""}
                        onChange={(e) =>
                          setEngineInputs((m) => ({ ...m, [f.name]: e.target.value }))
                        }
                      />
                    )}
                  </label>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={async () => {
                  setBusy(true);
                  try {
                    await onRun(item, engineInputs);
                  } finally {
                    setBusy(false);
                  }
                }}
                disabled={busy}
                className="skeuo-btn rounded-lg px-4 py-2 text-xs font-semibold text-white disabled:opacity-50"
              >
                {busy ? "Running…" : run ? "Re-run engine" : "Run engine"}
              </button>
              {run && (
                <button
                  onClick={() => onOpen(run)}
                  className="skeuo-btn-secondary rounded-lg px-4 py-2 text-xs font-semibold"
                >
                  View {run.findings.length} finding{run.findings.length === 1 ? "" : "s"}
                </button>
              )}
              {run && (
                <span className="text-xs text-muted ml-auto">
                  Last run: score <strong className="text-foreground">{run.score}</strong> ·{" "}
                  {new Date(run.createdAt).toLocaleString()}
                </span>
              )}
            </div>
            {engine.kind === "mock" && (
              <p className="text-[10px] text-purple-300/80 italic">
                Preview engine. Connect a real tool (Snyk, ZAP, Semgrep, k6, …) for production scans.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function FindingsDrawer({ run, onClose }: { run: EngineRun; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex justify-end"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl h-full overflow-y-auto bg-[#0c0c14] border-l border-white/10 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted">
              Engine result · {run.engineId} · {run.kind}
            </div>
            <div className="text-xl font-semibold mt-1">
              {run.findings.length} finding{run.findings.length === 1 ? "" : "s"}
            </div>
            <div className="text-xs text-muted mt-1">
              Score: <strong className="text-foreground">{run.score}</strong> · status: {run.status} · {run.durationMs}ms
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground text-xl px-2"
          >
            ×
          </button>
        </div>

        <div className="space-y-3">
          {run.findings.map((f) => (
            <FindingCard key={f.id} finding={f} />
          ))}
        </div>
      </div>
    </div>
  );
}

function FindingCard({ finding }: { finding: EngineFinding }) {
  return (
    <div className={`rounded-xl border p-4 bloyi-sev-${finding.severity}`}>
      <div className="flex items-center justify-between gap-3 mb-1">
        <div className="text-sm font-semibold">{finding.title}</div>
        <span className="text-[10px] uppercase tracking-[0.15em] font-semibold">
          {finding.severity}
        </span>
      </div>
      <p className="text-xs leading-relaxed mb-2 text-foreground/80">
        {finding.detail}
      </p>
      <div className="text-[10px] uppercase tracking-[0.18em] text-muted mb-1">
        Remediation
      </div>
      <p className="text-xs leading-relaxed text-foreground/70">{finding.remediation}</p>
    </div>
  );
}
