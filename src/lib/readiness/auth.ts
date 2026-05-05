/**
 * BLOYI Readiness — local auth: PBKDF2 password hashing, HMAC-signed
 * session cookies, CSRF tokens, lockout. Zero external dependencies.
 */
import {
  pbkdf2Sync,
  randomBytes,
  createHmac,
  timingSafeEqual,
} from "crypto";
import { cookies } from "next/headers";
import { Store, newId, type ReadinessAccount, type ReadinessSession } from "./store";

const PBKDF2_ITER = 310_000;
const PBKDF2_KEYLEN = 32;
const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12h
const IDLE_TTL_MS = 30 * 60 * 1000; // 30min
const COOKIE_NAME = "bloyi_session";
const LOCKOUT_THRESHOLD = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

function getSecret(): string {
  return (
    process.env.READINESS_SECRET ||
    "bloyi-dev-secret-change-in-prod-9f2e1c7b8a4d6e5f"
  );
}

export function hashPassword(password: string): {
  hash: string;
  salt: string;
  iter: number;
} {
  const salt = randomBytes(16).toString("base64");
  const hash = pbkdf2Sync(password, salt, PBKDF2_ITER, PBKDF2_KEYLEN, "sha256")
    .toString("base64");
  return { hash, salt, iter: PBKDF2_ITER };
}

export function verifyPassword(
  password: string,
  acc: ReadinessAccount
): boolean {
  const test = pbkdf2Sync(
    password,
    acc.passwordSalt,
    acc.passwordIter,
    PBKDF2_KEYLEN,
    "sha256"
  );
  const stored = Buffer.from(acc.passwordHash, "base64");
  if (test.length !== stored.length) return false;
  return timingSafeEqual(test, stored);
}

function sign(value: string): string {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

export function makeSignedCookie(sessionId: string): string {
  return `${sessionId}.${sign(sessionId)}`;
}

export function parseSignedCookie(raw: string | undefined): string | null {
  if (!raw) return null;
  const dot = raw.lastIndexOf(".");
  if (dot < 0) return null;
  const id = raw.slice(0, dot);
  const sig = raw.slice(dot + 1);
  if (sign(id) !== sig) return null;
  return id;
}

/* ──────────── Sessions ──────────── */

export function createSession(accountId: string, ua: string | null, ipHint: string | null): ReadinessSession {
  const now = Date.now();
  const session: ReadinessSession = {
    id: newId("sess"),
    accountId,
    mfaPassed: false,
    csrfToken: randomBytes(24).toString("base64url"),
    createdAt: new Date(now).toISOString(),
    expiresAt: new Date(now + SESSION_TTL_MS).toISOString(),
    lastSeenAt: new Date(now).toISOString(),
    ipHint,
    ua,
  };
  Store.sessions.upsert(session);
  return session;
}

export function getSessionFromCookieValue(cookieValue: string | undefined): ReadinessSession | null {
  const id = parseSignedCookie(cookieValue);
  if (!id) return null;
  const s = Store.sessions.byId(id);
  if (!s) return null;
  const now = Date.now();
  if (new Date(s.expiresAt).getTime() < now) {
    Store.sessions.remove(s.id);
    return null;
  }
  if (now - new Date(s.lastSeenAt).getTime() > IDLE_TTL_MS) {
    Store.sessions.remove(s.id);
    return null;
  }
  s.lastSeenAt = new Date(now).toISOString();
  Store.sessions.upsert(s);
  return s;
}

export async function getCurrentSession(): Promise<ReadinessSession | null> {
  const jar = await cookies();
  const raw = jar.get(COOKIE_NAME)?.value;
  const s = getSessionFromCookieValue(raw);
  if (!s) return null;
  // self-heal: drop sessions whose account was deleted (e.g. after seed/purge)
  if (!Store.accounts.byId(s.accountId)) {
    Store.sessions.remove(s.id);
    return null;
  }
  return s;
}

export async function getCurrentAccount(): Promise<{
  session: ReadinessSession;
  account: ReadinessAccount;
} | null> {
  const session = await getCurrentSession();
  if (!session || !session.mfaPassed) return null;
  const account = Store.accounts.byId(session.accountId);
  if (!account) return null;
  return { session, account };
}

export async function setSessionCookie(sessionId: string) {
  const jar = await cookies();
  jar.set(COOKIE_NAME, makeSignedCookie(sessionId), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  });
}

export async function clearSessionCookie() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

/* ──────────── Lockout ──────────── */

export function isLocked(acc: ReadinessAccount): boolean {
  if (!acc.lockedUntil) return false;
  return new Date(acc.lockedUntil).getTime() > Date.now();
}

export function recordFailedLogin(acc: ReadinessAccount): ReadinessAccount {
  const next = { ...acc, failedLogins: acc.failedLogins + 1 };
  if (next.failedLogins >= LOCKOUT_THRESHOLD) {
    next.lockedUntil = new Date(Date.now() + LOCKOUT_MS).toISOString();
    next.failedLogins = 0;
  }
  next.updatedAt = new Date().toISOString();
  Store.accounts.upsert(next);
  return next;
}

export function recordSuccessfulLogin(acc: ReadinessAccount): ReadinessAccount {
  const next = {
    ...acc,
    failedLogins: 0,
    lockedUntil: null,
    updatedAt: new Date().toISOString(),
  };
  Store.accounts.upsert(next);
  return next;
}

export const COOKIE = COOKIE_NAME;
