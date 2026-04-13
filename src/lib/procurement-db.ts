import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
import type {
  BuyerProfile,
  Requirement,
  ParsedRequirement,
  RFP,
  VendorMatch,
  SellerOpportunity,
  RFPResponse,
  ShortlistEntry,
  CompareSession,
  EvaluationInvite,
  Notification,
  BuyerSearchUsage,
} from "./procurement-types";

/* ──────────────────────────────────────────
   DB STRUCTURE
   ────────────────────────────────────────── */

interface ProcurementDB {
  buyers: BuyerProfile[];
  requirements: Requirement[];
  parsedRequirements: ParsedRequirement[];
  rfps: RFP[];
  vendorMatches: VendorMatch[];
  sellerOpportunities: SellerOpportunity[];
  rfpResponses: RFPResponse[];
  shortlists: ShortlistEntry[];
  compareSessions: CompareSession[];
  evaluationInvites: EvaluationInvite[];
  notifications: Notification[];
  buyerSearchUsage: BuyerSearchUsage[];
}

const DATA_DIR = join(process.cwd(), "data");
const DB_PATH = join(DATA_DIR, "procurement.json");

function ensureDir() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
}

const EMPTY: ProcurementDB = {
  buyers: [],
  requirements: [],
  parsedRequirements: [],
  rfps: [],
  vendorMatches: [],
  sellerOpportunities: [],
  rfpResponses: [],
  shortlists: [],
  compareSessions: [],
  evaluationInvites: [],
  notifications: [],
  buyerSearchUsage: [],
};

function read(): ProcurementDB {
  ensureDir();
  if (!existsSync(DB_PATH)) {
    writeFileSync(DB_PATH, JSON.stringify(EMPTY, null, 2));
    return structuredClone(EMPTY);
  }
  const raw = JSON.parse(readFileSync(DB_PATH, "utf-8"));
  return { ...EMPTY, ...raw };
}

function write(db: ProcurementDB) {
  ensureDir();
  writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

/* ──────────────────────────────────────────
   BUYERS
   ────────────────────────────────────────── */

export function getBuyers() { return read().buyers; }

export function getBuyerById(id: string) {
  return read().buyers.find((b) => b.id === id);
}

export function addBuyer(buyer: Omit<BuyerProfile, "id" | "verificationStatus" | "plan" | "createdAt">): BuyerProfile {
  const db = read();
  const newBuyer: BuyerProfile = {
    ...buyer,
    id: crypto.randomUUID(),
    verificationStatus: "pending",
    plan: "free",
    createdAt: new Date().toISOString(),
  };
  db.buyers.push(newBuyer);
  write(db);
  return newBuyer;
}

export function updateBuyer(id: string, updates: Partial<BuyerProfile>): BuyerProfile | null {
  const db = read();
  const buyer = db.buyers.find((b) => b.id === id);
  if (!buyer) return null;
  Object.assign(buyer, updates);
  write(db);
  return buyer;
}

/* ──────────────────────────────────────────
   REQUIREMENTS
   ────────────────────────────────────────── */

export function getRequirements() { return read().requirements; }

export function getRequirementById(id: string) {
  return read().requirements.find((r) => r.id === id);
}

export function getRequirementsByBuyer(buyerId: string) {
  return read().requirements.filter((r) => r.buyerId === buyerId);
}

export function addRequirement(req: Omit<Requirement, "id" | "status" | "createdAt" | "updatedAt">): Requirement {
  const db = read();
  const now = new Date().toISOString();
  const newReq: Requirement = {
    ...req,
    id: crypto.randomUUID(),
    status: "submitted",
    createdAt: now,
    updatedAt: now,
  };
  db.requirements.push(newReq);
  write(db);
  return newReq;
}

export function updateRequirementStatus(id: string, status: Requirement["status"]): Requirement | null {
  const db = read();
  const req = db.requirements.find((r) => r.id === id);
  if (!req) return null;
  req.status = status;
  req.updatedAt = new Date().toISOString();
  write(db);
  return req;
}

/* ──────────────────────────────────────────
   PARSED REQUIREMENTS
   ────────────────────────────────────────── */

export function getParsedByRequirement(requirementId: string) {
  return read().parsedRequirements.find((p) => p.requirementId === requirementId);
}

export function addParsedRequirement(parsed: Omit<ParsedRequirement, "id" | "parsedAt">): ParsedRequirement {
  const db = read();
  const p: ParsedRequirement = {
    ...parsed,
    id: crypto.randomUUID(),
    parsedAt: new Date().toISOString(),
  };
  db.parsedRequirements.push(p);
  write(db);
  return p;
}

/* ──────────────────────────────────────────
   RFPs
   ────────────────────────────────────────── */

export function getRFPs() { return read().rfps; }

export function getRFPById(id: string) {
  return read().rfps.find((r) => r.id === id);
}

export function getRFPsByBuyer(buyerId: string) {
  return read().rfps.filter((r) => r.buyerId === buyerId);
}

export function addRFP(rfp: Omit<RFP, "id" | "status" | "createdAt" | "updatedAt">): RFP {
  const db = read();
  const now = new Date().toISOString();
  const newRFP: RFP = {
    ...rfp,
    id: crypto.randomUUID(),
    status: "draft",
    createdAt: now,
    updatedAt: now,
  };
  db.rfps.push(newRFP);
  write(db);
  return newRFP;
}

export function updateRFPStatus(id: string, status: RFP["status"]): RFP | null {
  const db = read();
  const rfp = db.rfps.find((r) => r.id === id);
  if (!rfp) return null;
  rfp.status = status;
  rfp.updatedAt = new Date().toISOString();
  write(db);
  return rfp;
}

/* ──────────────────────────────────────────
   VENDOR MATCHES
   ────────────────────────────────────────── */

export function getMatchesByRFP(rfpId: string) {
  return read().vendorMatches.filter((m) => m.rfpId === rfpId);
}

export function getMatchesByRequirement(requirementId: string) {
  return read().vendorMatches.filter((m) => m.requirementId === requirementId);
}

export function addVendorMatch(match: Omit<VendorMatch, "id" | "notified" | "notifiedAt" | "createdAt">): VendorMatch {
  const db = read();
  const m: VendorMatch = {
    ...match,
    id: crypto.randomUUID(),
    notified: false,
    notifiedAt: null,
    createdAt: new Date().toISOString(),
  };
  db.vendorMatches.push(m);
  write(db);
  return m;
}

export function markMatchNotified(id: string): VendorMatch | null {
  const db = read();
  const m = db.vendorMatches.find((v) => v.id === id);
  if (!m) return null;
  m.notified = true;
  m.notifiedAt = new Date().toISOString();
  write(db);
  return m;
}

/* ──────────────────────────────────────────
   SELLER OPPORTUNITIES
   ────────────────────────────────────────── */

export function getOpportunitiesByVendor(vendorSlug: string) {
  return read().sellerOpportunities.filter((o) => o.vendorSlug === vendorSlug);
}

export function addOpportunity(opp: Omit<SellerOpportunity, "id" | "status" | "createdAt" | "updatedAt">): SellerOpportunity {
  const db = read();
  const now = new Date().toISOString();
  const o: SellerOpportunity = {
    ...opp,
    id: crypto.randomUUID(),
    status: "new",
    createdAt: now,
    updatedAt: now,
  };
  db.sellerOpportunities.push(o);
  write(db);
  return o;
}

export function updateOpportunityStatus(id: string, status: SellerOpportunity["status"]): SellerOpportunity | null {
  const db = read();
  const opp = db.sellerOpportunities.find((o) => o.id === id);
  if (!opp) return null;
  opp.status = status;
  opp.updatedAt = new Date().toISOString();
  write(db);
  return opp;
}

/* ──────────────────────────────────────────
   RFP RESPONSES
   ────────────────────────────────────────── */

export function getResponsesByRFP(rfpId: string) {
  return read().rfpResponses.filter((r) => r.rfpId === rfpId);
}

export function getResponsesByVendor(vendorSlug: string) {
  return read().rfpResponses.filter((r) => r.vendorSlug === vendorSlug);
}

export function getResponseById(id: string) {
  return read().rfpResponses.find((r) => r.id === id);
}

export function addRFPResponse(resp: Omit<RFPResponse, "id" | "submittedAt">): RFPResponse {
  const db = read();
  const r: RFPResponse = {
    ...resp,
    id: crypto.randomUUID(),
    submittedAt: new Date().toISOString(),
  };
  db.rfpResponses.push(r);

  // Update opportunity status
  const opp = db.sellerOpportunities.find((o) => o.id === resp.opportunityId);
  if (opp) {
    opp.status = "response_submitted";
    opp.updatedAt = new Date().toISOString();
  }

  write(db);
  return r;
}

/* ──────────────────────────────────────────
   SHORTLISTS
   ────────────────────────────────────────── */

export function getShortlistByBuyer(buyerId: string) {
  return read().shortlists.filter((s) => s.buyerId === buyerId);
}

export function getShortlistByRFP(rfpId: string) {
  return read().shortlists.filter((s) => s.rfpId === rfpId);
}

export function addToShortlist(entry: Omit<ShortlistEntry, "id" | "addedAt">): ShortlistEntry {
  const db = read();
  const s: ShortlistEntry = {
    ...entry,
    id: crypto.randomUUID(),
    addedAt: new Date().toISOString(),
  };
  db.shortlists.push(s);
  write(db);
  return s;
}

export function removeFromShortlist(id: string): boolean {
  const db = read();
  const idx = db.shortlists.findIndex((s) => s.id === id);
  if (idx === -1) return false;
  db.shortlists.splice(idx, 1);
  write(db);
  return true;
}

/* ──────────────────────────────────────────
   COMPARE SESSIONS
   ────────────────────────────────────────── */

export function addCompareSession(session: Omit<CompareSession, "id" | "createdAt">): CompareSession {
  const db = read();
  const c: CompareSession = {
    ...session,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  db.compareSessions.push(c);
  write(db);
  return c;
}

/* ──────────────────────────────────────────
   EVALUATION INVITES
   ────────────────────────────────────────── */

export function getEvaluationsByBuyer(buyerId: string) {
  return read().evaluationInvites.filter((e) => e.buyerId === buyerId);
}

export function addEvaluationInvite(invite: Omit<EvaluationInvite, "id" | "status" | "createdAt">): EvaluationInvite {
  const db = read();
  const e: EvaluationInvite = {
    ...invite,
    id: crypto.randomUUID(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  db.evaluationInvites.push(e);
  write(db);
  return e;
}

/* ──────────────────────────────────────────
   NOTIFICATIONS
   ────────────────────────────────────────── */

export function getNotifications(recipientId: string) {
  return read().notifications.filter((n) => n.recipientId === recipientId);
}

export function getAllNotifications() {
  return read().notifications;
}

export function addNotification(notif: Omit<Notification, "id" | "read" | "createdAt">): Notification {
  const db = read();
  const n: Notification = {
    ...notif,
    id: crypto.randomUUID(),
    read: false,
    createdAt: new Date().toISOString(),
  };
  db.notifications.push(n);
  write(db);
  return n;
}

export function markNotificationRead(id: string): boolean {
  const db = read();
  const n = db.notifications.find((x) => x.id === id);
  if (!n) return false;
  n.read = true;
  write(db);
  return true;
}

/* ──────────────────────────────────────────
   BUYER SEARCH USAGE / MONETIZATION
   ────────────────────────────────────────── */

export function getBuyerUsage(buyerId: string) {
  return read().buyerSearchUsage.filter((u) => u.buyerId === buyerId);
}

export function addBuyerUsage(usage: Omit<BuyerSearchUsage, "id" | "createdAt">): BuyerSearchUsage {
  const db = read();
  const u: BuyerSearchUsage = {
    ...usage,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  db.buyerSearchUsage.push(u);
  write(db);
  return u;
}
