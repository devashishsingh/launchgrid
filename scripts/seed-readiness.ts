/**
 * BLOYI Readiness — seed test login + sample data.
 *
 * Run with: npm run seed:readiness
 *
 * Creates:
 *  - demo@bloyi.test  /  Bloyi!Demo2026  (TOTP enrolled, 8 backup codes)
 *  - Pre-fills sections 1-3 with mostly-pass submissions (~70-80% per section)
 *  - Runs headers-check engine against https://example.com (real)
 *  - Runs sastStub mock engine
 *
 * The script is idempotent: re-running it deletes the demo account first.
 */
import { hashPassword } from "../src/lib/readiness/auth";
import {
  generateBackupCodes,
  generateSecret,
  otpauthURI,
  qrAscii,
  totpAt,
} from "../src/lib/readiness/totp";
import {
  Store,
  newId,
  type ReadinessAccount,
  type ReadinessSubmission,
  type EngineRun,
} from "../src/lib/readiness/store";
import { SECTIONS } from "../src/lib/readiness/sections";
import { appendLedger } from "../src/lib/readiness/ledger";
import { recordSnapshot } from "../src/lib/readiness/scoring";
import { headersCheck } from "../src/lib/readiness/engines/headers-check";
import { allMocks } from "../src/lib/readiness/engines/mocks";

const EMAIL = "demo@bloyi.test";
const PASSWORD = "Bloyi!Demo2026";

async function main() {
  console.log("\n──── BLOYI readiness seed ────\n");

  // 1. reuse existing demo account if present, otherwise create fresh.
  //    Either way, drop any stale sessions so old browser cookies can't
  //    point at orphaned account ids.
  const existing = Store.accounts.byEmail(EMAIL);
  const allSessions = Store.sessions.all();
  if (existing) {
    Store.sessions.save(
      allSessions.filter((s) => s.accountId !== existing.id)
    );
  }

  // 2. create account
  const ph = hashPassword(PASSWORD);
  const secret = generateSecret(); // base32 string
  const backupCodes = generateBackupCodes(8);
  const acc: ReadinessAccount = {
    id: existing?.id ?? newId("acc"),
    email: EMAIL,
    fullName: "Demo Founder",
    companyName: "Acme Indie Labs",
    passwordHash: ph.hash,
    passwordSalt: ph.salt,
    passwordIter: ph.iter,
    totpSecret: secret,
    totpEnrolled: true,
    backupCodes: backupCodes.hashes,
    failedLogins: 0,
    lockedUntil: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  Store.accounts.upsert(acc);
  appendLedger({
    accountId: acc.id,
    stage: "auth",
    action: "seed:account-created",
    type: "auto",
    status: "ok",
  });

  // 3. pre-fill sections 1-3
  const fill = SECTIONS.slice(0, 3);
  let filled = 0;
  for (const sec of fill) {
    sec.items.forEach((item, idx) => {
      if (item.kind === "engine") return;
      // make most pass; one warn near the end so global remains under gold
      const status: ReadinessSubmission["status"] =
        idx === sec.items.length - 1 ? "warn" : "pass";
      const score = status === "pass" ? 100 : 60;
      const sub: ReadinessSubmission = {
        id: newId("sub"),
        accountId: acc.id,
        sectionId: sec.id,
        itemId: item.id,
        value:
          item.kind === "input"
            ? `Demo ${item.label}`
            : item.kind === "upload"
              ? `demo-${item.id}.pdf`
              : true,
        evidence: item.kind === "upload" ? `demo-${item.id}.pdf` : null,
        notes: null,
        acceptedRisk: false,
        acceptedRiskReason: null,
        status,
        score,
        updatedAt: new Date().toISOString(),
      };
      Store.submissions.upsert(sub);
      filled++;
    });
    appendLedger({
      accountId: acc.id,
      sectionId: sec.id,
      stage: sec.id,
      action: "seed:section-prefilled",
      type: "auto",
      status: "ok",
    });
  }
  console.log(`✓ Pre-filled ${filled} items across ${fill.length} sections.`);

  // 4. run headers-check (real) against example.com
  try {
    const res = await headersCheck.run({
      accountId: acc.id,
      sectionId: "appsec",
      itemId: "headers-check",
      input: { url: "https://example.com" },
    });
    const run: EngineRun = {
      id: newId("run"),
      accountId: acc.id,
      sectionId: "appsec",
      itemId: "headers-check",
      engineId: "headers-check",
      kind: "real",
      status: res.status,
      score: res.score,
      findings: res.findings,
      inputSummary: res.inputSummary,
      durationMs: 0,
      createdAt: new Date().toISOString(),
    };
    Store.engineRuns.append(run);
    appendLedger({
      accountId: acc.id,
      sectionId: "appsec",
      itemId: "headers-check",
      stage: "appsec",
      action: "engine:headers-check",
      type: "auto",
      status: res.status,
      scoreImpact: res.score,
      meta: { kind: "real", findings: res.findings.length },
    });
    console.log(
      `✓ headers-check on example.com — score ${res.score}, ${res.findings.length} findings.`
    );
  } catch (e) {
    console.log("! headers-check skipped:", e instanceof Error ? e.message : e);
  }

  // 5. run sastStub (mock) — needs section appsec / item sast-stub
  const sast = allMocks.find((m) => m.id === "sast-stub");
  if (sast) {
    const res = await sast.run({
      accountId: acc.id,
      sectionId: "appsec",
      itemId: "sast-stub",
      input: {},
    });
    const run: EngineRun = {
      id: newId("run"),
      accountId: acc.id,
      sectionId: "appsec",
      itemId: "sast-stub",
      engineId: "sast-stub",
      kind: "mock",
      status: res.status,
      score: res.score,
      findings: res.findings,
      inputSummary: res.inputSummary,
      durationMs: 0,
      createdAt: new Date().toISOString(),
    };
    Store.engineRuns.append(run);
    appendLedger({
      accountId: acc.id,
      sectionId: "appsec",
      itemId: "sast-stub",
      stage: "appsec",
      action: "engine:sast-stub",
      type: "auto",
      status: res.status,
      scoreImpact: res.score,
      meta: { kind: "mock", findings: res.findings.length },
    });
    console.log(
      `✓ sast-stub mock — score ${res.score}, ${res.findings.length} findings.`
    );
  }

  // 6. snapshot
  const snap = recordSnapshot(acc.id, "seed");
  console.log(
    `✓ Snapshot — global ${snap.globalScore}/1000 · tier ${snap.tier}.\n`
  );

  // 7. print credentials
  console.log("════════════════════════════════════════════════════════════");
  console.log("  BLOYI demo login");
  console.log("════════════════════════════════════════════════════════════");
  console.log(`  URL       : http://localhost:3000/readiness/login`);
  console.log(`  Email     : ${EMAIL}`);
  console.log(`  Password  : ${PASSWORD}`);
  console.log("");
  console.log("  TOTP secret (base32):");
  console.log(`    ${secret}`);
  console.log("");
  console.log("  otpauth URI:");
  const uri = otpauthURI({ secret, issuer: "BLOYI", accountName: EMAIL });
  console.log(`    ${uri}`);
  console.log("");
  console.log("  Current 6-digit code (good for 30s):");
  console.log(`    ${totpAt(secret, Date.now())}`);
  console.log("");
  console.log("  Backup codes (one-time use):");
  for (const c of backupCodes.plaintext) console.log(`    ${c}`);
  console.log("");
  console.log("  ASCII QR (scan with authenticator app):");
  console.log("");
  console.log(qrAscii(uri));
  console.log("════════════════════════════════════════════════════════════\n");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
