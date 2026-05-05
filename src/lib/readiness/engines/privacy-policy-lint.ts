/** Privacy policy lint — fetches URL, checks for required clauses. */
import type { EngineAdapter, EngineResult } from "./types";
import { fid } from "./types";
import type { EngineFinding } from "../store";

const CLAUSES: Array<{ id: string; label: string; re: RegExp; weight: number }> = [
  { id: "data_collected", label: "Data collected", re: /\b(personal data|information we collect|data we collect|data collected)\b/i, weight: 15 },
  { id: "lawful_basis", label: "Lawful basis (GDPR)", re: /\b(lawful basis|consent|legitimate interest|contractual necessity)\b/i, weight: 15 },
  { id: "rights", label: "Subject rights", re: /\b(right to access|right to erasure|right to be forgotten|right to rectif)/i, weight: 15 },
  { id: "retention", label: "Retention policy", re: /\bretain|retention\b/i, weight: 10 },
  { id: "transfers", label: "International transfers", re: /\b(international transfer|cross-border|standard contractual clauses|SCC)\b/i, weight: 10 },
  { id: "contact", label: "Contact / DPO", re: /\b(contact us|data protection officer|DPO|privacy@)/i, weight: 10 },
  { id: "cookies", label: "Cookies / tracking", re: /\bcookie|tracking\b/i, weight: 10 },
  { id: "children", label: "Children's data", re: /\bchildren|minors|under (the age of )?(13|16|18)\b/i, weight: 5 },
  { id: "updates", label: "Policy updates", re: /\b(update|effective date|last updated)\b/i, weight: 10 },
];

export const privacyPolicyLint: EngineAdapter = {
  id: "privacy-policy-lint",
  label: "Privacy policy lint",
  kind: "real",
  description: "We fetch your privacy policy URL and check for clauses required by GDPR-style regulations.",
  inputSchema: {
    fields: [
      { name: "url", label: "Privacy policy URL", kind: "url", required: true, placeholder: "https://example.com/privacy" },
    ],
  },
  async run(ctx): Promise<EngineResult> {
    const url = String(ctx.input.url ?? "").trim();
    if (!/^https?:\/\//i.test(url)) {
      return { status: "error", score: 0, findings: [{ id: fid("url"), severity: "info", title: "Invalid URL", detail: "Provide a full URL.", remediation: "Re-enter the policy URL." }], inputSummary: "bad url" };
    }
    let body = "";
    try {
      const r = await fetch(url, { signal: AbortSignal.timeout(15_000) });
      body = await r.text();
    } catch (e) {
      return { status: "error", score: 0, findings: [{ id: fid("fetch"), severity: "info", title: "Fetch failed", detail: e instanceof Error ? e.message : "unknown", remediation: "Confirm the URL is reachable." }], inputSummary: "fetch err" };
    }
    const text = body.replace(/<[^>]+>/g, " ").slice(0, 200_000);
    const findings: EngineFinding[] = [];
    let score = 0;
    let totalW = 0;
    for (const c of CLAUSES) {
      totalW += c.weight;
      if (c.re.test(text)) {
        score += c.weight;
      } else {
        findings.push({
          id: fid(c.id),
          severity: c.weight >= 15 ? "high" : c.weight >= 10 ? "medium" : "low",
          title: `Missing clause: ${c.label}`,
          detail: `Pattern for "${c.label}" not detected in the document.`,
          remediation: `Add a clearly-labeled ${c.label} section.`,
        });
      }
    }
    const pct = Math.round((score / totalW) * 100);
    return {
      status: pct >= 90 ? "pass" : pct >= 60 ? "warn" : "fail",
      score: pct,
      findings: findings.length
        ? findings
        : [{ id: fid("ok"), severity: "info", title: "All required clauses found", detail: `${CLAUSES.length}/${CLAUSES.length} clause patterns matched.`, remediation: "Have legal counsel review for jurisdiction specifics." }],
      inputSummary: `${url} (${text.length} chars)`,
    };
  },
};
