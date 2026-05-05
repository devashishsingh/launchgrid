"use client";

import { useState } from "react";
import type { LedgerEntry } from "@/lib/readiness/store";

export default function LedgerView({ initial }: { initial: LedgerEntry[] }) {
  const [entries] = useState<LedgerEntry[]>(initial);
  const [filter, setFilter] = useState("");
  const [verifyResult, setVerifyResult] = useState<null | { ok: boolean; total: number; brokenAt: number | null; brokenReason: string | null }>(null);

  const filtered = entries.filter((e) =>
    !filter
      ? true
      : `${e.action} ${e.stage} ${e.status} ${e.sectionId ?? ""} ${e.itemId ?? ""}`
          .toLowerCase()
          .includes(filter.toLowerCase())
  );

  async function verify() {
    const res = await fetch("/api/readiness/ledger?verify=1");
    const d = await res.json();
    setVerifyResult(d.integrity);
  }

  function exportCsv() {
    const header = "index,timestamp,stage,action,type,status,scoreImpact,sectionId,itemId,hash,prevHash";
    const rows = entries.map((e) =>
      [
        e.index,
        e.timestamp,
        e.stage,
        e.action,
        e.type,
        e.status,
        e.scoreImpact,
        e.sectionId ?? "",
        e.itemId ?? "",
        e.hash,
        e.prevHash,
      ]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    );
    const blob = new Blob([header + "\n" + rows.join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bloyi-ledger.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(entries, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bloyi-ledger.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-6">
      <header className="glass rounded-2xl p-6">
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted">
          Tamper-evident ledger
        </div>
        <h1 className="text-2xl font-semibold mt-1">Activity ledger</h1>
        <p className="text-sm text-muted mt-1">
          Every action is logged with a SHA-256 hash linked to the previous entry.
          Use <strong>Verify integrity</strong> to re-walk the chain.
        </p>
        <div className="flex flex-wrap gap-2 mt-4">
          <button onClick={verify} className="skeuo-btn rounded-lg px-4 py-2 text-xs font-semibold text-white">
            Verify integrity
          </button>
          <button onClick={exportCsv} className="skeuo-btn-secondary rounded-lg px-4 py-2 text-xs font-semibold">
            Export CSV
          </button>
          <button onClick={exportJson} className="skeuo-btn-secondary rounded-lg px-4 py-2 text-xs font-semibold">
            Export JSON
          </button>
          <input
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter…"
            className="input-clean rounded-lg px-3 py-2 text-xs flex-1 min-w-40"
          />
        </div>
        {verifyResult && (
          <div
            className={`mt-4 rounded-lg border px-4 py-3 text-xs ${
              verifyResult.ok
                ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                : "bg-red-500/10 text-red-300 border-red-500/30"
            }`}
          >
            {verifyResult.ok
              ? `✓ Integrity verified across ${verifyResult.total} entries.`
              : `✗ Integrity broken at index ${verifyResult.brokenAt}: ${verifyResult.brokenReason}.`}
          </div>
        )}
      </header>

      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-white/5 text-muted uppercase tracking-[0.15em]">
            <tr>
              <th className="px-3 py-2 text-left">#</th>
              <th className="px-3 py-2 text-left">Timestamp</th>
              <th className="px-3 py-2 text-left">Stage</th>
              <th className="px-3 py-2 text-left">Action</th>
              <th className="px-3 py-2 text-left">Type</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-right">Δ score</th>
              <th className="px-3 py-2 text-left">Hash</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e) => (
              <tr key={e.id} className="border-t border-white/5 hover:bg-white/[0.02]">
                <td className="px-3 py-2 tabular-nums text-muted">{e.index}</td>
                <td className="px-3 py-2 tabular-nums text-muted">
                  {new Date(e.timestamp).toLocaleString()}
                </td>
                <td className="px-3 py-2">{e.stage}</td>
                <td className="px-3 py-2 font-mono">{e.action}</td>
                <td className="px-3 py-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider border ${
                    e.type === "auto"
                      ? "bg-blue-500/10 text-blue-300 border-blue-500/30"
                      : "bg-white/5 text-muted border-white/10"
                  }`}>
                    {e.type}
                  </span>
                </td>
                <td className="px-3 py-2">{e.status}</td>
                <td className="px-3 py-2 text-right tabular-nums">{e.scoreImpact || ""}</td>
                <td className="px-3 py-2 font-mono text-muted">{e.hash.slice(0, 10)}…</td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-3 py-8 text-center text-muted">
                  No entries match.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
