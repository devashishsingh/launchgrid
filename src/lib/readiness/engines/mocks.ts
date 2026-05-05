/**
 * Mock engines — deterministic per-account seeded results.
 * Each adapter emits realistic findings so demos look real.
 * "Connect real tool" is surfaced in the UI via kind = "mock".
 */
import { createHash } from "crypto";
import type { EngineAdapter, EngineResult } from "./types";
import { fid } from "./types";
import type { EngineFinding } from "../store";

function rng(seed: string) {
  let h = parseInt(createHash("sha256").update(seed).digest("hex").slice(0, 12), 16);
  return () => {
    h = (h * 9301 + 49297) % 233280;
    return h / 233280;
  };
}

function pick<T>(r: () => number, arr: T[]): T {
  return arr[Math.floor(r() * arr.length)];
}

function mockRun(
  id: string,
  label: string,
  description: string,
  scenario: { sev: EngineFinding["severity"]; title: string; detail: string; remediation: string }[],
  inputs?: { name: string; label: string; kind: "text" | "textarea" | "url"; placeholder?: string }[]
): EngineAdapter {
  return {
    id,
    label,
    kind: "mock",
    description,
    inputSchema: { fields: inputs ?? [] },
    async run(ctx): Promise<EngineResult> {
      const r = rng(`${ctx.accountId}:${id}`);
      const n = 6 + Math.floor(r() * 12);
      const findings: EngineFinding[] = [];
      for (let i = 0; i < n; i++) {
        const f = pick(r, scenario);
        findings.push({
          id: fid(id + i),
          severity: f.sev,
          title: f.title,
          detail: f.detail,
          remediation: f.remediation,
        });
      }
      const sevWeight: Record<EngineFinding["severity"], number> = {
        critical: 18, high: 9, medium: 4, low: 2, info: 0,
      };
      let score = 100 - findings.reduce((acc, f) => acc + sevWeight[f.severity], 0);
      score = Math.max(20, Math.min(95, score));
      return {
        status: score >= 80 ? "pass" : score >= 50 ? "warn" : "fail",
        score,
        findings,
        inputSummary: `mock:${id} n=${n}`,
      };
    },
  };
}

export const sastStub = mockRun(
  "sast-stub",
  "SAST (preview)",
  "Heuristic static-analysis preview. Connect a real SAST (Semgrep, CodeQL) for production.",
  [
    { sev: "high", title: "Possible SQL injection sink", detail: "Untrusted input concatenated into query string in `routes/users.ts`.", remediation: "Use parameterised queries / prepared statements." },
    { sev: "medium", title: "Use of weak crypto (MD5)", detail: "MD5 detected in `lib/hash.ts`.", remediation: "Replace with SHA-256 or argon2id for password hashing." },
    { sev: "medium", title: "Open redirect", detail: "`?next=` parameter passed unchecked to `res.redirect`.", remediation: "Validate against an allow-list of return URLs." },
    { sev: "low", title: "Console.log of user data", detail: "Logging may include PII.", remediation: "Use a structured logger with redaction." },
    { sev: "info", title: "TODO / FIXME found", detail: "12 TODO markers detected.", remediation: "Track in your issue tracker." },
  ],
  [{ name: "repoUrl", label: "Repo URL or zip filename", kind: "text" }]
);

export const dastStub = mockRun(
  "dast-stub",
  "DAST (preview)",
  "Dynamic-testing preview. Connect OWASP ZAP or Burp for production scans.",
  [
    { sev: "high", title: "Reflected XSS in /search", detail: "`q` parameter reflected without escaping.", remediation: "Output-encode and add a strict CSP." },
    { sev: "medium", title: "Cookie missing Secure flag", detail: "`session_id` cookie set without `Secure`.", remediation: "Set `Secure; HttpOnly; SameSite=Lax`." },
    { sev: "medium", title: "Verbose server banner", detail: "`Server: nginx/1.20.1` exposed.", remediation: "Strip server identifying headers." },
    { sev: "low", title: "Mixed content reference", detail: "HTTP image loaded from HTTPS page.", remediation: "Migrate all assets to HTTPS." },
  ],
  [{ name: "url", label: "Target URL", kind: "url" }]
);

export const pentestStub = mockRun(
  "pen-test-stub",
  "Pen-test (preview)",
  "Synthesised pen-test report. Engage an accredited firm for production.",
  [
    { sev: "critical", title: "IDOR on /api/files/{id}", detail: "Direct object reference allows access across tenants.", remediation: "Enforce tenant scoping and resource ownership checks." },
    { sev: "high", title: "Privilege escalation via role JSON", detail: "Client can submit `role: \"admin\"` and it is honoured.", remediation: "Never trust client-supplied roles; assign server-side." },
    { sev: "medium", title: "Race condition in coupon redemption", detail: "Coupon can be applied twice via parallel requests.", remediation: "Use atomic DB constraints or distributed locks." },
  ]
);

export const siemStub = mockRun(
  "siem-stub",
  "SIEM readiness (preview)",
  "Synthesised SIEM/log-coverage assessment.",
  [
    { sev: "medium", title: "Login events not centralised", detail: "Auth logs not forwarded to central log store.", remediation: "Ship to ELK/Datadog/Splunk." },
    { sev: "low", title: "Log retention < 90 days", detail: "Current retention is 30 days.", remediation: "Increase retention to ≥ 90 days for compliance." },
  ]
);

export const drTestStub = mockRun(
  "dr-test-stub",
  "DR drill (preview)",
  "Synthesised disaster-recovery drill report.",
  [
    { sev: "high", title: "RTO not met (target 1h, actual 3h12m)", detail: "Most-recent drill exceeded RTO.", remediation: "Pre-warm replicas and automate restoration." },
    { sev: "medium", title: "Backup integrity unverified", detail: "Last backup checksum verification ran 47 days ago.", remediation: "Schedule weekly checksum + restore-to-staging tests." },
  ]
);

export const soc2Stub = mockRun(
  "soc2-readiness-stub",
  "SOC 2 readiness (preview)",
  "Heuristic SOC 2 trust-service criteria gap analysis.",
  [
    { sev: "high", title: "Change management process undocumented", detail: "No written change-management policy on file.", remediation: "Document and circulate change-management policy; enforce PR reviews." },
    { sev: "medium", title: "Vendor risk reviews missing", detail: "No annual vendor review on record.", remediation: "Maintain a vendor inventory with annual reviews." },
  ]
);

export const iso27001Stub = mockRun(
  "iso27001-stub",
  "ISO 27001 readiness (preview)",
  "Heuristic ISO 27001 Annex A control gap analysis.",
  [
    { sev: "high", title: "Asset inventory incomplete", detail: "Information asset register has gaps.", remediation: "Maintain a current information-asset register (A.5.9)." },
    { sev: "medium", title: "Cryptographic policy missing", detail: "No documented crypto policy.", remediation: "Author a cryptographic-controls policy (A.8.24)." },
  ]
);

export const tenantIsolationStub = mockRun(
  "multi-tenant-isolation-stub",
  "Multi-tenant isolation (preview)",
  "Heuristic check for tenant-scoping defects.",
  [
    { sev: "critical", title: "Cross-tenant query observed in `reports`", detail: "Query path missing `tenant_id` filter.", remediation: "Enforce tenant scoping at the data-access layer." },
    { sev: "medium", title: "Shared cache keys without tenant prefix", detail: "Redis keys shared across tenants in /api/usage.", remediation: "Prefix cache keys with tenant id." },
  ]
);

export const loadTestStub = mockRun(
  "load-test-stub",
  "Load test (preview)",
  "Synthesised k6/Locust-style load test summary.",
  [
    { sev: "medium", title: "p95 latency 2.4s at 200 RPS", detail: "Target was ≤ 1s.", remediation: "Add caching / connection pooling; profile slow endpoints." },
    { sev: "low", title: "Error rate 0.7%", detail: "Mostly 503 responses from a single pod.", remediation: "Investigate pod health checks and HPA thresholds." },
  ]
);

export const allMocks: EngineAdapter[] = [
  sastStub, dastStub, pentestStub, siemStub, drTestStub,
  soc2Stub, iso27001Stub, tenantIsolationStub, loadTestStub,
];
