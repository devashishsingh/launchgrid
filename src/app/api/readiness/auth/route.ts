import { NextResponse } from "next/server";
import { READINESS_ENABLED } from "@/lib/readiness/flag";
import {
  Store,
  newId,
  type ReadinessAccount,
} from "@/lib/readiness/store";
import {
  hashPassword,
  verifyPassword,
  isLocked,
  recordFailedLogin,
  recordSuccessfulLogin,
  createSession,
  setSessionCookie,
  clearSessionCookie,
  getCurrentSession,
} from "@/lib/readiness/auth";
import { appendLedger } from "@/lib/readiness/ledger";

function gated() {
  if (!READINESS_ENABLED)
    return NextResponse.json({ error: "Readiness disabled" }, { status: 404 });
  return null;
}

export async function POST(req: Request) {
  const block = gated();
  if (block) return block;
  const body = (await req.json().catch(() => null)) as null | {
    action?: string;
    email?: string;
    password?: string;
    fullName?: string;
    companyName?: string;
  };
  if (!body || !body.action) return NextResponse.json({ error: "missing action" }, { status: 400 });

  if (body.action === "register") {
    const email = (body.email ?? "").trim().toLowerCase();
    const password = body.password ?? "";
    const fullName = (body.fullName ?? "").trim().slice(0, 120);
    const companyName = (body.companyName ?? "").trim().slice(0, 120);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return NextResponse.json({ error: "invalid email" }, { status: 400 });
    if (password.length < 10)
      return NextResponse.json({ error: "password must be ≥ 10 characters" }, { status: 400 });
    if (!fullName || !companyName)
      return NextResponse.json({ error: "fullName and companyName required" }, { status: 400 });
    if (Store.accounts.byEmail(email))
      return NextResponse.json({ error: "account already exists" }, { status: 409 });

    const { hash, salt, iter } = hashPassword(password);
    const acc: ReadinessAccount = {
      id: newId("acc"),
      email,
      fullName,
      companyName,
      passwordHash: hash,
      passwordSalt: salt,
      passwordIter: iter,
      totpSecret: null,
      totpEnrolled: false,
      backupCodes: [],
      failedLogins: 0,
      lockedUntil: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    Store.accounts.upsert(acc);
    const session = createSession(acc.id, req.headers.get("user-agent"), null);
    await setSessionCookie(session.id);
    appendLedger({
      accountId: acc.id,
      stage: "auth",
      action: "register",
      type: "manual",
      status: "ok",
      meta: { email },
    });
    return NextResponse.json({ ok: true, needsMfaEnrollment: true });
  }

  if (body.action === "login") {
    const email = (body.email ?? "").trim().toLowerCase();
    const password = body.password ?? "";
    const acc = Store.accounts.byEmail(email);
    if (!acc) return NextResponse.json({ error: "invalid credentials" }, { status: 401 });
    if (isLocked(acc))
      return NextResponse.json({ error: "account temporarily locked" }, { status: 423 });
    if (!verifyPassword(password, acc)) {
      recordFailedLogin(acc);
      appendLedger({
        accountId: acc.id,
        stage: "auth",
        action: "login_failed",
        type: "manual",
        status: "fail",
      });
      return NextResponse.json({ error: "invalid credentials" }, { status: 401 });
    }
    recordSuccessfulLogin(acc);
    const session = createSession(acc.id, req.headers.get("user-agent"), null);
    await setSessionCookie(session.id);
    appendLedger({
      accountId: acc.id,
      stage: "auth",
      action: "login_password_ok",
      type: "manual",
      status: "ok",
    });
    return NextResponse.json({
      ok: true,
      needsMfaEnrollment: !acc.totpEnrolled,
    });
  }

  if (body.action === "logout") {
    const s = await getCurrentSession();
    if (s) {
      Store.sessions.remove(s.id);
      appendLedger({
        accountId: s.accountId,
        stage: "auth",
        action: "logout",
        type: "manual",
        status: "ok",
      });
    }
    await clearSessionCookie();
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json({ error: "unknown action" }, { status: 400 });
}
