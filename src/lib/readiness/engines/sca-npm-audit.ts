/**
 * SCA — npm audit on a pasted package.json + package-lock.json.
 * We DO NOT run `npm install`. We write a temp folder with both files
 * and call `npm audit --json --omit=dev=false` in it. Safe because npm audit
 * only reads the lockfile.
 */
import { writeFileSync, mkdtempSync, rmSync, existsSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";
import { spawnSync } from "child_process";
import type { EngineAdapter, EngineResult } from "./types";
import { fid } from "./types";
import type { EngineFinding } from "../store";

export const scaNpmAudit: EngineAdapter = {
  id: "sca-npm-audit",
  label: "Dependency scan (npm audit)",
  kind: "real",
  description:
    "Paste your package.json and package-lock.json. We invoke npm audit (no install) and parse advisories.",
  inputSchema: {
    fields: [
      { name: "packageJson", label: "package.json", kind: "textarea", required: true },
      { name: "lockJson", label: "package-lock.json", kind: "textarea", required: true },
    ],
  },
  async run(ctx): Promise<EngineResult> {
    const pj = String(ctx.input.packageJson ?? "");
    const lj = String(ctx.input.lockJson ?? "");
    if (!pj.trim() || !lj.trim()) {
      return {
        status: "error",
        score: 0,
        findings: [
          {
            id: fid("missing"),
            severity: "info",
            title: "Missing input",
            detail: "Both package.json and package-lock.json are required.",
            remediation: "Paste both files and re-run.",
          },
        ],
        inputSummary: "missing input",
      };
    }
    try {
      JSON.parse(pj);
      JSON.parse(lj);
    } catch {
      return {
        status: "error",
        score: 0,
        findings: [
          {
            id: fid("invalid"),
            severity: "info",
            title: "Invalid JSON",
            detail: "One of the files is not valid JSON.",
            remediation: "Validate the JSON files and try again.",
          },
        ],
        inputSummary: "invalid JSON",
      };
    }

    const dir = mkdtempSync(join(tmpdir(), "bloyi-sca-"));
    try {
      writeFileSync(join(dir, "package.json"), pj, "utf8");
      writeFileSync(join(dir, "package-lock.json"), lj, "utf8");
      const proc = spawnSync(
        process.platform === "win32" ? "npm.cmd" : "npm",
        ["audit", "--json", "--package-lock-only"],
        { cwd: dir, encoding: "utf8", timeout: 45_000, shell: false }
      );
      const stdout = proc.stdout || "";
      let parsed: { vulnerabilities?: Record<string, { severity?: string; via?: unknown[]; effects?: unknown[] }>; metadata?: { vulnerabilities?: Record<string, number> } } | null = null;
      try {
        parsed = JSON.parse(stdout);
      } catch {
        parsed = null;
      }
      if (!parsed) {
        return {
          status: "error",
          score: 0,
          findings: [
            {
              id: fid("npm"),
              severity: "info",
              title: "npm audit unavailable",
              detail: (proc.stderr || "no output").slice(0, 800),
              remediation: "Ensure npm is installed and reachable on the server.",
            },
          ],
          inputSummary: "npm audit failed",
        };
      }
      const meta = parsed.metadata?.vulnerabilities ?? {};
      const counts = {
        critical: meta.critical ?? 0,
        high: meta.high ?? 0,
        moderate: meta.moderate ?? 0,
        low: meta.low ?? 0,
        info: meta.info ?? 0,
      };
      const findings: EngineFinding[] = [];
      const vulns = parsed.vulnerabilities ?? {};
      for (const [pkg, v] of Object.entries(vulns)) {
        const rawSev = (v.severity ?? "info") as string;
        const sev: EngineFinding["severity"] =
          rawSev === "moderate"
            ? "medium"
            : (["info", "low", "medium", "high", "critical"].includes(rawSev)
                ? (rawSev as EngineFinding["severity"])
                : "info");
        const via = Array.isArray(v.via)
          ? v.via.map((x) => (typeof x === "string" ? x : (x as { title?: string }).title ?? "")).filter(Boolean).join(", ")
          : "";
        findings.push({
          id: fid(pkg),
          severity: sev,
          title: `${pkg} — ${sev}`,
          detail: via || `Vulnerability flagged in dependency ${pkg}.`,
          remediation: "Run `npm audit fix` or upgrade the affected package.",
        });
      }
      const totalCritical = counts.critical;
      const totalHigh = counts.high;
      const totalMed = counts.moderate;
      const totalLow = counts.low;
      let score = 100;
      score -= totalCritical * 25;
      score -= totalHigh * 12;
      score -= totalMed * 5;
      score -= totalLow * 2;
      score = Math.max(0, Math.min(100, score));
      const status: EngineResult["status"] =
        totalCritical > 0 ? "fail" : totalHigh > 0 ? "warn" : "pass";
      return {
        status,
        score,
        findings: findings.length
          ? findings
          : [
              {
                id: fid("clean"),
                severity: "info",
                title: "No advisories found",
                detail: "npm audit reported zero vulnerabilities.",
                remediation: "Maintain regular `npm audit` runs in CI.",
              },
            ],
        inputSummary: `crit:${totalCritical} high:${totalHigh} med:${totalMed} low:${totalLow}`,
      };
    } finally {
      try {
        if (existsSync(dir)) rmSync(dir, { recursive: true, force: true });
      } catch {
        /* ignore */
      }
    }
  },
};
