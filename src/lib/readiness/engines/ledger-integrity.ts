/** Ledger integrity — re-walks the SHA-256 hash chain. */
import type { EngineAdapter, EngineResult } from "./types";
import { fid } from "./types";
import { verifyIntegrity } from "../ledger";

export const ledgerIntegrity: EngineAdapter = {
  id: "ledger-integrity",
  label: "Verify ledger integrity",
  kind: "real",
  description: "Re-walks the SHA-256 hash chain across every entry in the readiness ledger.",
  inputSchema: { fields: [] },
  async run(): Promise<EngineResult> {
    const r = verifyIntegrity();
    if (r.ok) {
      return {
        status: "pass",
        score: 100,
        findings: [
          {
            id: fid("ok"),
            severity: "info",
            title: `Ledger integrity verified — ${r.total} entries`,
            detail: "Every entry's hash matched its contents and pointed to its predecessor.",
            remediation: "Continue routine verification on a schedule.",
          },
        ],
        inputSummary: `${r.total} entries verified`,
      };
    }
    return {
      status: "fail",
      score: 0,
      findings: [
        {
          id: fid("broken"),
          severity: "critical",
          title: `Ledger integrity broken at index ${r.brokenAt}`,
          detail: `Reason: ${r.brokenReason}.`,
          remediation: "Investigate the data store; do not trust subsequent entries until restored from backup.",
        },
      ],
      inputSummary: `broken at ${r.brokenAt}`,
    };
  },
};
