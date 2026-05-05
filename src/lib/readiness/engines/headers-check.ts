/** Secure headers audit — fetches a URL and scores OWASP secure headers. */
import type { EngineAdapter, EngineResult } from "./types";
import { fid } from "./types";
import type { EngineFinding } from "../store";

const REQUIRED: Array<{ id: string; name: string; weight: number; sev: EngineFinding["severity"]; help: string }> = [
  { id: "csp", name: "content-security-policy", weight: 20, sev: "high", help: "Add a strict CSP to mitigate XSS." },
  { id: "hsts", name: "strict-transport-security", weight: 18, sev: "high", help: "Add HSTS with max-age ≥ 31536000." },
  { id: "xfo", name: "x-frame-options", weight: 12, sev: "medium", help: "Add X-Frame-Options: DENY (or use CSP frame-ancestors)." },
  { id: "xcto", name: "x-content-type-options", weight: 10, sev: "medium", help: "Add X-Content-Type-Options: nosniff." },
  { id: "ref", name: "referrer-policy", weight: 8, sev: "low", help: "Add Referrer-Policy: no-referrer or strict-origin." },
  { id: "perm", name: "permissions-policy", weight: 8, sev: "low", help: "Add a Permissions-Policy header." },
  { id: "coop", name: "cross-origin-opener-policy", weight: 6, sev: "low", help: "Set Cross-Origin-Opener-Policy: same-origin." },
];

export const headersCheck: EngineAdapter = {
  id: "headers-check",
  label: "Secure headers check",
  kind: "real",
  description: "We fetch the URL server-side and audit response headers against the OWASP Secure Headers rubric.",
  inputSchema: {
    fields: [
      { name: "url", label: "URL", kind: "url", placeholder: "https://app.example.com", required: true },
    ],
  },
  async run(ctx): Promise<EngineResult> {
    const url = String(ctx.input.url ?? "").trim();
    if (!/^https?:\/\//i.test(url)) {
      return {
        status: "error",
        score: 0,
        findings: [
          { id: fid("url"), severity: "info", title: "Invalid URL", detail: "Provide a full http(s):// URL.", remediation: "Try again with a full URL." },
        ],
        inputSummary: "bad url",
      };
    }
    let resp: Response;
    try {
      resp = await fetch(url, { redirect: "follow", method: "GET", signal: AbortSignal.timeout(15_000) });
    } catch (e) {
      return {
        status: "error",
        score: 0,
        findings: [
          {
            id: fid("fetch"),
            severity: "info",
            title: "Fetch failed",
            detail: e instanceof Error ? e.message : "unknown",
            remediation: "Confirm the URL is publicly reachable from the server.",
          },
        ],
        inputSummary: "fetch error",
      };
    }
    const findings: EngineFinding[] = [];
    let score = 0;
    let totalW = 0;
    for (const h of REQUIRED) {
      totalW += h.weight;
      const present = resp.headers.has(h.name);
      if (present) {
        score += h.weight;
      } else {
        findings.push({
          id: fid(h.id),
          severity: h.sev,
          title: `Missing ${h.name}`,
          detail: `Response did not include the ${h.name} header.`,
          remediation: h.help,
        });
      }
    }
    const pct = Math.round((score / totalW) * 100);
    const status: EngineResult["status"] = pct >= 90 ? "pass" : pct >= 60 ? "warn" : "fail";
    return {
      status,
      score: pct,
      findings: findings.length
        ? findings
        : [
            {
              id: fid("clean"),
              severity: "info",
              title: "All required headers present",
              detail: `${REQUIRED.length}/${REQUIRED.length} headers detected.`,
              remediation: "Keep monitoring; consider tightening CSP further.",
            },
          ],
      inputSummary: `${url} → status ${resp.status}`,
    };
  },
};
