/**
 * BLOYI Readiness — isolated JSON store.
 * Each collection lives in its own file under data/readiness/* so it can be
 * purged independently without touching the existing creator/procurement DB.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import { randomBytes } from "crypto";

const DATA_DIR = join(process.cwd(), "data", "readiness");

function ensureDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

function fp(name: string) {
  return join(DATA_DIR, `${name}.json`);
}

function readCollection<T>(name: string): T[] {
  ensureDir();
  const path = fp(name);
  if (!existsSync(path)) return [];
  try {
    const raw = readFileSync(path, "utf8");
    return JSON.parse(raw) as T[];
  } catch {
    return [];
  }
}

function writeCollection<T>(name: string, rows: T[]): void {
  ensureDir();
  writeFileSync(fp(name), JSON.stringify(rows, null, 2), "utf8");
}

export function newId(prefix: string): string {
  return `${prefix}_${randomBytes(8).toString("hex")}`;
}

/* ──────────── Types ──────────── */

export interface ReadinessAccount {
  id: string;
  email: string;
  fullName: string;
  companyName: string;
  passwordHash: string; // pbkdf2 sha256 base64
  passwordSalt: string; // base64
  passwordIter: number;
  totpSecret: string | null; // base32
  totpEnrolled: boolean;
  backupCodes: string[]; // sha256 hex hashes of unused codes
  failedLogins: number;
  lockedUntil: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReadinessSession {
  id: string; // session id (cookie value uses signed form)
  accountId: string;
  mfaPassed: boolean;
  csrfToken: string;
  createdAt: string;
  expiresAt: string;
  lastSeenAt: string;
  ipHint: string | null;
  ua: string | null;
}

export interface ReadinessSubmission {
  id: string;
  accountId: string;
  sectionId: string;
  itemId: string;
  value: unknown; // boolean | string | object
  evidence: string | null; // free text or filename
  notes: string | null;
  acceptedRisk: boolean;
  acceptedRiskReason: string | null;
  status: "pass" | "warn" | "fail" | "pending";
  score: number; // 0..100
  updatedAt: string;
}

export interface EngineRun {
  id: string;
  accountId: string;
  sectionId: string;
  itemId: string;
  engineId: string;
  kind: "real" | "mock";
  status: "pass" | "warn" | "fail" | "error";
  score: number; // 0..100
  findings: EngineFinding[];
  inputSummary: string;
  durationMs: number;
  createdAt: string;
}

export interface EngineFinding {
  id: string;
  severity: "info" | "low" | "medium" | "high" | "critical";
  title: string;
  detail: string;
  remediation: string;
}

export interface LedgerEntry {
  id: string;
  index: number;
  timestamp: string;
  accountId: string;
  sectionId: string | null;
  itemId: string | null;
  stage: string;
  action: string;
  type: "manual" | "auto";
  status: string;
  scoreImpact: number;
  prevHash: string;
  hash: string;
  meta?: Record<string, unknown>;
}

export interface ScoreSnapshot {
  id: string;
  accountId: string;
  sectionScores: Record<string, number>; // 0..100 per section
  globalScore: number; // 0..1000
  tier: "none" | "bronze" | "silver" | "gold" | "platinum";
  unlockedSections: string[];
  createdAt: string;
}

/* ──────────── Generic accessors ──────────── */

export const Store = {
  accounts: {
    all: () => readCollection<ReadinessAccount>("accounts"),
    save: (rows: ReadinessAccount[]) => writeCollection("accounts", rows),
    byEmail: (email: string) =>
      readCollection<ReadinessAccount>("accounts").find(
        (a) => a.email.toLowerCase() === email.toLowerCase()
      ),
    byId: (id: string) =>
      readCollection<ReadinessAccount>("accounts").find((a) => a.id === id),
    upsert: (acc: ReadinessAccount) => {
      const rows = readCollection<ReadinessAccount>("accounts");
      const i = rows.findIndex((r) => r.id === acc.id);
      if (i >= 0) rows[i] = acc;
      else rows.push(acc);
      writeCollection("accounts", rows);
    },
  },
  sessions: {
    all: () => readCollection<ReadinessSession>("sessions"),
    save: (rows: ReadinessSession[]) => writeCollection("sessions", rows),
    byId: (id: string) =>
      readCollection<ReadinessSession>("sessions").find((s) => s.id === id),
    upsert: (s: ReadinessSession) => {
      const rows = readCollection<ReadinessSession>("sessions");
      const i = rows.findIndex((r) => r.id === s.id);
      if (i >= 0) rows[i] = s;
      else rows.push(s);
      writeCollection("sessions", rows);
    },
    remove: (id: string) => {
      const rows = readCollection<ReadinessSession>("sessions").filter(
        (s) => s.id !== id
      );
      writeCollection("sessions", rows);
    },
  },
  submissions: {
    all: () => readCollection<ReadinessSubmission>("submissions"),
    forAccount: (accountId: string) =>
      readCollection<ReadinessSubmission>("submissions").filter(
        (s) => s.accountId === accountId
      ),
    upsert: (sub: ReadinessSubmission) => {
      const rows = readCollection<ReadinessSubmission>("submissions");
      const i = rows.findIndex(
        (r) =>
          r.accountId === sub.accountId &&
          r.sectionId === sub.sectionId &&
          r.itemId === sub.itemId
      );
      if (i >= 0) rows[i] = sub;
      else rows.push(sub);
      writeCollection("submissions", rows);
    },
  },
  engineRuns: {
    all: () => readCollection<EngineRun>("engine-runs"),
    forAccount: (accountId: string) =>
      readCollection<EngineRun>("engine-runs").filter(
        (r) => r.accountId === accountId
      ),
    append: (run: EngineRun) => {
      const rows = readCollection<EngineRun>("engine-runs");
      rows.push(run);
      writeCollection("engine-runs", rows);
    },
  },
  ledger: {
    all: () => readCollection<LedgerEntry>("ledger"),
    forAccount: (accountId: string) =>
      readCollection<LedgerEntry>("ledger").filter(
        (e) => e.accountId === accountId
      ),
    append: (entry: LedgerEntry) => {
      const rows = readCollection<LedgerEntry>("ledger");
      rows.push(entry);
      writeCollection("ledger", rows);
    },
  },
  scores: {
    forAccount: (accountId: string) =>
      readCollection<ScoreSnapshot>("scores").filter(
        (s) => s.accountId === accountId
      ),
    latest: (accountId: string): ScoreSnapshot | null => {
      const rows = readCollection<ScoreSnapshot>("scores").filter(
        (s) => s.accountId === accountId
      );
      return rows.length ? rows[rows.length - 1] : null;
    },
    append: (snap: ScoreSnapshot) => {
      const rows = readCollection<ScoreSnapshot>("scores");
      rows.push(snap);
      writeCollection("scores", rows);
    },
  },
};
