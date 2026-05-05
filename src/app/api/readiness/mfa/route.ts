import { NextResponse } from "next/server";
import { READINESS_ENABLED } from "@/lib/readiness/flag";
import { Store } from "@/lib/readiness/store";
import {
  generateSecret,
  otpauthURI,
  qrSVG,
  verifyTOTP,
  generateBackupCodes,
  consumeBackupCode,
} from "@/lib/readiness/totp";
import { getCurrentSession } from "@/lib/readiness/auth";
import { appendLedger } from "@/lib/readiness/ledger";

function gated() {
  if (!READINESS_ENABLED)
    return NextResponse.json({ error: "Readiness disabled" }, { status: 404 });
  return null;
}

export async function GET() {
  const block = gated();
  if (block) return block;
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: "no session" }, { status: 401 });
  const acc = Store.accounts.byId(session.accountId);
  if (!acc) return NextResponse.json({ error: "no account" }, { status: 401 });
  return NextResponse.json({
    enrolled: acc.totpEnrolled,
    mfaPassed: session.mfaPassed,
    email: acc.email,
  });
}

export async function POST(req: Request) {
  const block = gated();
  if (block) return block;
  const body = (await req.json().catch(() => null)) as null | {
    action?: "begin-enroll" | "confirm-enroll" | "verify" | "use-backup";
    code?: string;
    backupCode?: string;
  };
  if (!body || !body.action)
    return NextResponse.json({ error: "missing action" }, { status: 400 });
  const session = await getCurrentSession();
  if (!session) return NextResponse.json({ error: "no session" }, { status: 401 });
  const acc = Store.accounts.byId(session.accountId);
  if (!acc) return NextResponse.json({ error: "no account" }, { status: 401 });

  if (body.action === "begin-enroll") {
    if (acc.totpEnrolled)
      return NextResponse.json({ error: "already enrolled" }, { status: 400 });
    const secret = generateSecret();
    acc.totpSecret = secret;
    acc.updatedAt = new Date().toISOString();
    Store.accounts.upsert(acc);
    const uri = otpauthURI({
      secret,
      issuer: "BLOYI",
      accountName: acc.email,
    });
    const svg = qrSVG(uri);
    return NextResponse.json({ secret, otpauthUri: uri, qrSvg: svg });
  }

  if (body.action === "confirm-enroll") {
    if (!acc.totpSecret)
      return NextResponse.json({ error: "no pending enrolment" }, { status: 400 });
    if (!verifyTOTP(acc.totpSecret, body.code ?? ""))
      return NextResponse.json({ error: "invalid code" }, { status: 401 });
    const { plaintext, hashes } = generateBackupCodes(8);
    acc.totpEnrolled = true;
    acc.backupCodes = hashes;
    acc.updatedAt = new Date().toISOString();
    Store.accounts.upsert(acc);
    session.mfaPassed = true;
    Store.sessions.upsert(session);
    appendLedger({
      accountId: acc.id,
      stage: "auth",
      action: "mfa_enrolled",
      type: "manual",
      status: "ok",
    });
    return NextResponse.json({ ok: true, backupCodes: plaintext });
  }

  if (body.action === "verify") {
    if (!acc.totpEnrolled || !acc.totpSecret)
      return NextResponse.json({ error: "MFA not enrolled" }, { status: 400 });
    if (!verifyTOTP(acc.totpSecret, body.code ?? "")) {
      appendLedger({
        accountId: acc.id,
        stage: "auth",
        action: "mfa_failed",
        type: "manual",
        status: "fail",
      });
      return NextResponse.json({ error: "invalid code" }, { status: 401 });
    }
    session.mfaPassed = true;
    Store.sessions.upsert(session);
    appendLedger({
      accountId: acc.id,
      stage: "auth",
      action: "mfa_passed",
      type: "manual",
      status: "ok",
    });
    return NextResponse.json({ ok: true });
  }

  if (body.action === "use-backup") {
    if (!acc.totpEnrolled)
      return NextResponse.json({ error: "MFA not enrolled" }, { status: 400 });
    const r = consumeBackupCode(acc.backupCodes, body.backupCode ?? "");
    if (!r.ok) {
      appendLedger({
        accountId: acc.id,
        stage: "auth",
        action: "backup_code_failed",
        type: "manual",
        status: "fail",
      });
      return NextResponse.json({ error: "invalid backup code" }, { status: 401 });
    }
    acc.backupCodes = r.remaining;
    acc.updatedAt = new Date().toISOString();
    Store.accounts.upsert(acc);
    session.mfaPassed = true;
    Store.sessions.upsert(session);
    appendLedger({
      accountId: acc.id,
      stage: "auth",
      action: "backup_code_used",
      type: "manual",
      status: "ok",
      meta: { remaining: r.remaining.length },
    });
    return NextResponse.json({ ok: true, remaining: r.remaining.length });
  }

  return NextResponse.json({ error: "unknown action" }, { status: 400 });
}
