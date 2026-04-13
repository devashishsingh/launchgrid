import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

/* ──────────────────────────────────────────
   TYPES
   ────────────────────────────────────────── */

export interface User {
  id: string;
  name: string;
  email: string;
  idea: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

export type LeadSource =
  | "linkedin"
  | "instagram"
  | "facebook"
  | "youtube"
  | "website"
  | "referral"
  | "college"
  | "incubator";

export type LeadStage = "prototype" | "mvp" | "live";

export interface Lead {
  id: string;
  fullName: string;
  email: string;
  linkedIn: string;
  productName: string;
  productCategory: string;
  problemStatement: string;
  currentStage: LeadStage;
  existingUrl: string;
  expectedPrice: string;
  supportCommitment: boolean;
  termsAcknowledged: boolean;
  leadSource: LeadSource;
  status: "new" | "contacted" | "qualified" | "converted" | "rejected";
  createdAt: string;
}

export type WorkflowStage =
  | "lead_received"
  | "founder_contacted"
  | "discovery_completed"
  | "payment_pending"
  | "payment_received"
  | "activation_sent"
  | "account_active"
  | "agreements_pending"
  | "agreements_signed"
  | "product_listed"
  | "first_sale"
  | "payout_pending"
  | "payout_released";

export interface WorkflowEntry {
  id: string;
  creatorId: string;
  stage: WorkflowStage;
  status: "pending" | "completed" | "skipped";
  actionRequired: string;
  nextStep: string;
  completedAt: string | null;
  createdAt: string;
}

export type AgreementClause =
  | "authorization_to_sell"
  | "ip_ownership"
  | "payout_terms"
  | "refund_handling"
  | "support_responsibility"
  | "bug_fix_responsibility"
  | "operational_improvement"
  | "design_ux_standards"
  | "response_sla"
  | "complaint_handling"
  | "feedback_incorporation"
  | "termination_clause"
  | "exit_clause"
  | "graduation_clause";

export interface Agreement {
  id: string;
  creatorId: string;
  clause: AgreementClause;
  title: string;
  description: string;
  status: "pending" | "signed";
  version: string;
  signedAt: string | null;
  createdAt: string;
}

export interface Creator {
  id: string;
  leadId: string;
  fullName: string;
  email: string;
  linkedIn: string;
  activationToken: string;
  activationExpiry: string;
  activated: boolean;
  suspended: boolean;
  qualityScore: number;
  createdAt: string;
}

export interface Product {
  id: string;
  userId: string;
  name: string;
  description: string;
  status: "draft" | "active" | "paused" | "suspended";
  createdAt: string;
}

export interface Transaction {
  id: string;
  productId: string;
  userId: string;
  amount: number;
  platformFee: number;
  status: "pending" | "completed" | "failed";
  createdAt: string;
}

export type TicketType = "feedback" | "complaint" | "bug" | "feature_request";
export type TicketPriority = "low" | "medium" | "high" | "critical";
export type EscalationLevel = "creator" | "founder" | "termination_review";

export interface SupportTicket {
  id: string;
  productId: string;
  creatorId: string;
  type: TicketType;
  priority: TicketPriority;
  subject: string;
  description: string;
  status: "open" | "in_progress" | "resolved" | "escalated" | "closed";
  escalationLevel: EscalationLevel;
  creatorResponse: string | null;
  resolution: string | null;
  resolvedAt: string | null;
  createdAt: string;
}

/* ──────────────────────────────────────────
   DB SETUP
   ────────────────────────────────────────── */

interface DB {
  users: User[];
  leads: Lead[];
  creators: Creator[];
  products: Product[];
  transactions: Transaction[];
  workflow: WorkflowEntry[];
  agreements: Agreement[];
  supportTickets: SupportTicket[];
}

const DATA_DIR = join(process.cwd(), "data");
const DB_PATH = join(DATA_DIR, "db.json");

function ensureDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

const DB_EMPTY: DB = {
  users: [],
  leads: [],
  creators: [],
  products: [],
  transactions: [],
  workflow: [],
  agreements: [],
  supportTickets: [],
};

function readDB(): DB {
  ensureDir();
  if (!existsSync(DB_PATH)) {
    writeFileSync(DB_PATH, JSON.stringify(DB_EMPTY, null, 2));
    return structuredClone(DB_EMPTY);
  }
  const raw = JSON.parse(readFileSync(DB_PATH, "utf-8"));
  return { ...DB_EMPTY, ...raw };
}

function writeDB(db: DB) {
  ensureDir();
  writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

/* ──────────────────────────────────────────
   USERS (legacy)
   ────────────────────────────────────────── */

export function getUsers(): User[] {
  return readDB().users;
}

export function addUser(user: Omit<User, "id" | "status" | "createdAt">): User {
  const db = readDB();
  const newUser: User = {
    ...user,
    id: crypto.randomUUID(),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  db.users.push(newUser);
  writeDB(db);
  return newUser;
}

export function updateUserStatus(id: string, status: User["status"]): User | null {
  const db = readDB();
  const user = db.users.find((u) => u.id === id);
  if (!user) return null;
  user.status = status;
  writeDB(db);
  return user;
}

/* ──────────────────────────────────────────
   LEADS
   ────────────────────────────────────────── */

export function getLeads(): Lead[] {
  return readDB().leads;
}

export function addLead(
  lead: Omit<Lead, "id" | "status" | "createdAt">
): Lead {
  const db = readDB();
  const newLead: Lead = {
    ...lead,
    id: crypto.randomUUID(),
    status: "new",
    createdAt: new Date().toISOString(),
  };
  db.leads.push(newLead);
  writeDB(db);
  return newLead;
}

export function updateLeadStatus(id: string, status: Lead["status"]): Lead | null {
  const db = readDB();
  const lead = db.leads.find((l) => l.id === id);
  if (!lead) return null;
  lead.status = status;
  writeDB(db);
  return lead;
}

/* ──────────────────────────────────────────
   CREATORS
   ────────────────────────────────────────── */

export function getCreators(): Creator[] {
  return readDB().creators;
}

export function getCreatorById(id: string): Creator | undefined {
  return readDB().creators.find((c) => c.id === id);
}

export function getCreatorByToken(token: string): Creator | undefined {
  return readDB().creators.find((c) => c.activationToken === token);
}

const AGREEMENT_CLAUSES: { clause: AgreementClause; title: string; description: string }[] = [
  { clause: "authorization_to_sell", title: "Authorization to Sell", description: "Creator authorizes Launchbox to list and sell the product under its company umbrella." },
  { clause: "ip_ownership", title: "IP Ownership Acknowledgment", description: "All intellectual property remains with the creator. Launchbox claims no ownership." },
  { clause: "payout_terms", title: "Payout Terms", description: "Platform fee structure, payout schedule, and payment method terms." },
  { clause: "refund_handling", title: "Refund Handling", description: "Refund policy, process, and financial responsibility allocation." },
  { clause: "support_responsibility", title: "Support Responsibility", description: "Creator is responsible for first-line customer support and issue resolution." },
  { clause: "bug_fix_responsibility", title: "Bug Fix Responsibility", description: "Creator must address reported bugs within agreed SLA timelines." },
  { clause: "operational_improvement", title: "Operational Improvement", description: "Creator commits to ongoing product improvement based on feedback and market needs." },
  { clause: "design_ux_standards", title: "Design & UX Standards", description: "Product must meet minimum design and usability standards set by Launchbox." },
  { clause: "response_sla", title: "Response SLA", description: "Creator must respond to support tickets within defined timeframes." },
  { clause: "complaint_handling", title: "Complaint Handling", description: "Process for handling customer complaints and escalation procedures." },
  { clause: "feedback_incorporation", title: "Feedback Incorporation", description: "Creator agrees to review and incorporate reasonable platform and customer feedback." },
  { clause: "termination_clause", title: "Termination Clause", description: "Conditions under which Launchbox may suspend or terminate the listing including repeated complaints, unresolved bugs, poor support, reputation damage, commitment violations, design standard failures, ignored feedback, missed support calls, or trust loss." },
  { clause: "exit_clause", title: "Exit Clause", description: "Creator may exit the platform at any time with proper notice. Assets and IP transfer cleanly." },
  { clause: "graduation_clause", title: "Graduation Clause", description: "When ready, creator registers their own entity and transitions off Launchbox with full support." },
];

export function createCreator(leadId: string, lead: { fullName: string; email: string; linkedIn: string }): Creator {
  const db = readDB();
  const creator: Creator = {
    id: crypto.randomUUID(),
    leadId,
    fullName: lead.fullName,
    email: lead.email,
    linkedIn: lead.linkedIn,
    activationToken: crypto.randomUUID(),
    activationExpiry: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
    activated: false,
    suspended: false,
    qualityScore: 100,
    createdAt: new Date().toISOString(),
  };
  db.creators.push(creator);

  // Seed agreements
  for (const ac of AGREEMENT_CLAUSES) {
    db.agreements.push({
      id: crypto.randomUUID(),
      creatorId: creator.id,
      clause: ac.clause,
      title: ac.title,
      description: ac.description,
      status: "pending",
      version: "1.0",
      signedAt: null,
      createdAt: new Date().toISOString(),
    });
  }

  // Seed workflow
  const stages: { stage: WorkflowStage; action: string; next: string }[] = [
    { stage: "lead_received", action: "Review application", next: "Contact founder" },
    { stage: "founder_contacted", action: "Schedule discovery call", next: "Complete discovery" },
    { stage: "discovery_completed", action: "Send commercial terms", next: "Await payment" },
    { stage: "payment_pending", action: "Confirm payment", next: "Send activation" },
    { stage: "payment_received", action: "Generate activation link", next: "Creator activates" },
    { stage: "activation_sent", action: "Creator clicks activation link", next: "Account goes live" },
    { stage: "account_active", action: "Review and sign agreements", next: "Sign all agreements" },
    { stage: "agreements_pending", action: "Sign remaining agreements", next: "All signed" },
    { stage: "agreements_signed", action: "List product", next: "Product goes live" },
    { stage: "product_listed", action: "Promote and sell", next: "First sale" },
    { stage: "first_sale", action: "Process payout", next: "Release payout" },
    { stage: "payout_pending", action: "Verify and release", next: "Payout released" },
    { stage: "payout_released", action: "Continue growing", next: "Scale up" },
  ];

  for (let i = 0; i < stages.length; i++) {
    db.workflow.push({
      id: crypto.randomUUID(),
      creatorId: creator.id,
      stage: stages[i].stage,
      status: i === 0 ? "completed" : "pending",
      actionRequired: stages[i].action,
      nextStep: stages[i].next,
      completedAt: i === 0 ? new Date().toISOString() : null,
      createdAt: new Date().toISOString(),
    });
  }

  writeDB(db);
  return creator;
}

export function activateCreator(token: string): Creator | null {
  const db = readDB();
  const creator = db.creators.find((c) => c.activationToken === token);
  if (!creator) return null;
  if (new Date(creator.activationExpiry) < new Date()) return null;
  creator.activated = true;
  writeDB(db);
  return creator;
}

export function suspendCreator(id: string): Creator | null {
  const db = readDB();
  const creator = db.creators.find((c) => c.id === id);
  if (!creator) return null;
  creator.suspended = true;
  // Suspend all their products
  db.products.filter((p) => p.userId === id).forEach((p) => { p.status = "suspended"; });
  writeDB(db);
  return creator;
}

export function reinstateCreator(id: string): Creator | null {
  const db = readDB();
  const creator = db.creators.find((c) => c.id === id);
  if (!creator) return null;
  creator.suspended = false;
  writeDB(db);
  return creator;
}

export function updateCreatorQualityScore(id: string, score: number): Creator | null {
  const db = readDB();
  const creator = db.creators.find((c) => c.id === id);
  if (!creator) return null;
  creator.qualityScore = Math.max(0, Math.min(100, score));
  writeDB(db);
  return creator;
}

/* ──────────────────────────────────────────
   PRODUCTS
   ────────────────────────────────────────── */

export function getProducts(): Product[] {
  return readDB().products;
}

export function addProduct(product: Omit<Product, "id" | "status" | "createdAt">): Product {
  const db = readDB();
  const newProduct: Product = {
    ...product,
    id: crypto.randomUUID(),
    status: "draft",
    createdAt: new Date().toISOString(),
  };
  db.products.push(newProduct);
  writeDB(db);
  return newProduct;
}

export function updateProductStatus(id: string, status: Product["status"]): Product | null {
  const db = readDB();
  const product = db.products.find((p) => p.id === id);
  if (!product) return null;
  product.status = status;
  writeDB(db);
  return product;
}

/* ──────────────────────────────────────────
   TRANSACTIONS
   ────────────────────────────────────────── */

export function getTransactions(): Transaction[] {
  return readDB().transactions;
}

export function addTransaction(
  tx: Omit<Transaction, "id" | "platformFee" | "status" | "createdAt">
): Transaction {
  const db = readDB();
  const newTx: Transaction = {
    ...tx,
    id: crypto.randomUUID(),
    platformFee: Math.round(tx.amount * 0.15 * 100) / 100,
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  db.transactions.push(newTx);
  writeDB(db);
  return newTx;
}

/* ──────────────────────────────────────────
   WORKFLOW LEDGER
   ────────────────────────────────────────── */

export function getWorkflowByCreator(creatorId: string): WorkflowEntry[] {
  return readDB().workflow.filter((w) => w.creatorId === creatorId);
}

export function advanceWorkflow(creatorId: string, stage: WorkflowStage): WorkflowEntry | null {
  const db = readDB();
  const entry = db.workflow.find((w) => w.creatorId === creatorId && w.stage === stage);
  if (!entry) return null;
  entry.status = "completed";
  entry.completedAt = new Date().toISOString();
  writeDB(db);
  return entry;
}

/* ──────────────────────────────────────────
   AGREEMENTS
   ────────────────────────────────────────── */

export function getAgreementsByCreator(creatorId: string): Agreement[] {
  return readDB().agreements.filter((a) => a.creatorId === creatorId);
}

export function signAgreement(id: string): Agreement | null {
  const db = readDB();
  const agreement = db.agreements.find((a) => a.id === id);
  if (!agreement) return null;
  agreement.status = "signed";
  agreement.signedAt = new Date().toISOString();
  writeDB(db);
  return agreement;
}

/* ──────────────────────────────────────────
   SUPPORT TICKETS
   ────────────────────────────────────────── */

export function getSupportTickets(): SupportTicket[] {
  return readDB().supportTickets;
}

export function getSupportTicketsByCreator(creatorId: string): SupportTicket[] {
  return readDB().supportTickets.filter((t) => t.creatorId === creatorId);
}

export function addSupportTicket(
  ticket: Omit<SupportTicket, "id" | "status" | "escalationLevel" | "creatorResponse" | "resolution" | "resolvedAt" | "createdAt">
): SupportTicket {
  const db = readDB();
  const newTicket: SupportTicket = {
    ...ticket,
    id: crypto.randomUUID(),
    status: "open",
    escalationLevel: "creator",
    creatorResponse: null,
    resolution: null,
    resolvedAt: null,
    createdAt: new Date().toISOString(),
  };
  db.supportTickets.push(newTicket);
  writeDB(db);
  return newTicket;
}

export function updateSupportTicket(
  id: string,
  updates: Partial<Pick<SupportTicket, "status" | "escalationLevel" | "creatorResponse" | "resolution">>
): SupportTicket | null {
  const db = readDB();
  const ticket = db.supportTickets.find((t) => t.id === id);
  if (!ticket) return null;
  Object.assign(ticket, updates);
  if (updates.status === "resolved" || updates.status === "closed") {
    ticket.resolvedAt = new Date().toISOString();
  }
  writeDB(db);
  return ticket;
}
