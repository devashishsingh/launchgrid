/** Secrets regex/entropy scanner over a pasted snippet (≤ 200KB). */
import type { EngineAdapter, EngineResult } from "./types";
import { fid } from "./types";
import type { EngineFinding } from "../store";

const PATTERNS: Array<{ id: string; re: RegExp; sev: EngineFinding["severity"]; title: string }> = [
  { id: "aws_access", re: /\bAKIA[0-9A-Z]{16}\b/g, sev: "critical", title: "AWS access key" },
  { id: "aws_secret", re: /\b(?:[A-Za-z0-9/+=]{40})\b/g, sev: "high", title: "Possible AWS secret access key" },
  { id: "github_pat", re: /\bghp_[A-Za-z0-9]{36}\b/g, sev: "critical", title: "GitHub personal access token" },
  { id: "github_oauth", re: /\bgho_[A-Za-z0-9]{36}\b/g, sev: "critical", title: "GitHub OAuth token" },
  { id: "slack", re: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/g, sev: "high", title: "Slack token" },
  { id: "google_api", re: /\bAIza[0-9A-Za-z_\-]{35}\b/g, sev: "high", title: "Google API key" },
  { id: "stripe_live", re: /\bsk_live_[0-9a-zA-Z]{24,}\b/g, sev: "critical", title: "Stripe live secret" },
  { id: "openai", re: /\bsk-[A-Za-z0-9]{20,}\b/g, sev: "high", title: "OpenAI-style secret key" },
  { id: "rsa_block", re: /-----BEGIN (?:RSA |EC |OPENSSH |DSA |PGP )?PRIVATE KEY-----/g, sev: "critical", title: "Private key block" },
  { id: "jwt", re: /\beyJ[A-Za-z0-9_\-]{10,}\.[A-Za-z0-9_\-]{10,}\.[A-Za-z0-9_\-]{10,}\b/g, sev: "medium", title: "JWT" },
];

export const secretsRegex: EngineAdapter = {
  id: "secrets-regex",
  label: "Secrets detection",
  kind: "real",
  description: "Paste up to ~200KB of code. We scan for high-confidence secret patterns.",
  inputSchema: {
    fields: [
      { name: "snippet", label: "Code / config snippet", kind: "textarea", required: true },
    ],
  },
  async run(ctx): Promise<EngineResult> {
    const text = String(ctx.input.snippet ?? "");
    if (!text) {
      return {
        status: "error",
        score: 0,
        findings: [],
        inputSummary: "empty",
      };
    }
    const truncated = text.slice(0, 200_000);
    const findings: EngineFinding[] = [];
    for (const p of PATTERNS) {
      const matches = truncated.match(p.re);
      if (!matches) continue;
      const unique = Array.from(new Set(matches)).slice(0, 5);
      for (const m of unique) {
        findings.push({
          id: fid(p.id),
          severity: p.sev,
          title: p.title,
          detail: `Matched pattern: \`${m.slice(0, 8)}…\`. Found ${matches.length} occurrence(s).`,
          remediation: "Rotate the credential immediately, purge from git history, and load from a secrets manager.",
        });
      }
    }
    const score = findings.length === 0 ? 100 : Math.max(0, 100 - findings.length * 20);
    const status: EngineResult["status"] = findings.some((f) => f.severity === "critical")
      ? "fail"
      : findings.length > 0
        ? "warn"
        : "pass";
    return {
      status,
      score,
      findings: findings.length
        ? findings
        : [
            {
              id: fid("clean"),
              severity: "info",
              title: "No secrets detected",
              detail: "Snippet did not match any known secret patterns.",
              remediation: "Continue using a secrets manager and pre-commit hooks (gitleaks, trufflehog).",
            },
          ],
      inputSummary: `${findings.length} hits over ${truncated.length} chars`,
    };
  },
};
