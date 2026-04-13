// =============================================================
// Procurement Workflow — Types
// =============================================================

// ---- Roles & Access ----

export type UserRole = "public" | "buyer" | "seller" | "admin";

export type BuyerVerificationStatus = "pending" | "verified" | "suspended";
export type SellerVerificationStatus = "pending" | "verified" | "suspended";

export interface BuyerProfile {
  id: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  industry: string;
  companySize: string;
  country: string;
  verificationStatus: BuyerVerificationStatus;
  plan: BuyerPlan;
  createdAt: string;
}

export type BuyerPlan = "free" | "pro" | "enterprise";

// ---- Catalog Visibility ----

export type CatalogVisibility = "public" | "startup_smb" | "enterprise_only" | "invite_only";

// ---- Requirements ----

export type RequirementStatus =
  | "draft"
  | "submitted"
  | "parsing"
  | "parsed"
  | "matching"
  | "matched"
  | "rfp_issued"
  | "responses_pending"
  | "responses_received"
  | "shortlisted"
  | "evaluation"
  | "closed";

export interface Requirement {
  id: string;
  buyerId: string;
  title: string;
  problemDescription: string;
  featureRequirements: string;
  budgetRange: string;
  deploymentPreference: string;
  region: string;
  urgency: "low" | "medium" | "high" | "critical";
  timeline: string;
  complianceNeeds: string;
  supportExpectation: string;
  preferredVendorSize: string;
  attachments: string[];
  status: RequirementStatus;
  createdAt: string;
  updatedAt: string;
}

// ---- Parsed Output ----

export interface ParsedRequirement {
  id: string;
  requirementId: string;
  likelyCategory: string;
  possibleSoftwareTypes: string[];
  businessFunctionTags: string[];
  supportNeeds: string;
  pricingBand: string;
  deploymentPreference: string;
  region: string;
  urgency: string;
  complianceFlags: string[];
  confidence: number; // 0-100
  parsedAt: string;
}

// ---- RFP ----

export type RFPStatus =
  | "draft"
  | "issued"
  | "vendor_responses_pending"
  | "responses_received"
  | "shortlisted"
  | "evaluation"
  | "closed";

export interface RFP {
  id: string;
  requirementId: string;
  buyerId: string;
  businessProblem: string;
  featureRequirements: string;
  budget: string;
  timeline: string;
  integrationNeeds: string;
  supportExpectation: string;
  complianceNeeds: string;
  preferredDeployment: string;
  notes: string;
  attachments: string[];
  responseDeadline: string;
  status: RFPStatus;
  createdAt: string;
  updatedAt: string;
}

// ---- Vendor Match ----

export interface VendorMatch {
  id: string;
  requirementId: string;
  rfpId: string;
  vendorSlug: string; // references marketplace product slug
  matchScore: number; // 0-100
  matchReasons: string[];
  categoryFit: number;
  featureFit: number;
  geographyFit: number;
  supportFit: number;
  trustFit: number;
  notified: boolean;
  notifiedAt: string | null;
  createdAt: string;
}

// ---- Seller Opportunity / Response ----

export type OpportunityStatus =
  | "new"
  | "viewed"
  | "interested"
  | "declined"
  | "response_submitted"
  | "shortlisted"
  | "evaluation_invited"
  | "won"
  | "lost";

export interface SellerOpportunity {
  id: string;
  vendorSlug: string;
  rfpId: string;
  requirementId: string;
  matchId: string;
  status: OpportunityStatus;
  createdAt: string;
  updatedAt: string;
}

export interface RFPResponse {
  id: string;
  rfpId: string;
  vendorSlug: string;
  opportunityId: string;
  proposalSummary: string;
  estimatedPricing: string;
  estimatedTimeline: string;
  customizability: string;
  demoLink: string;
  documents: string[];
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  additionalNotes: string;
  submittedAt: string;
}

// ---- Shortlist & Compare ----

export interface ShortlistEntry {
  id: string;
  buyerId: string;
  rfpId: string;
  vendorSlug: string;
  responseId: string;
  notes: string;
  addedAt: string;
}

export interface CompareSession {
  id: string;
  buyerId: string;
  rfpId: string;
  vendorSlugs: string[];
  createdAt: string;
}

export interface EvaluationInvite {
  id: string;
  buyerId: string;
  rfpId: string;
  vendorSlug: string;
  responseId: string;
  type: "demo" | "discussion" | "evaluation";
  message: string;
  scheduledFor: string;
  status: "pending" | "accepted" | "declined" | "completed";
  createdAt: string;
}

// ---- Notifications ----

export type NotificationType =
  | "requirement_submitted"
  | "requirement_parsed"
  | "matches_ready"
  | "rfp_issued"
  | "seller_interested"
  | "response_submitted"
  | "shortlisted"
  | "demo_invited"
  | "discussion_invited"
  | "response_deadline_reminder";

export interface Notification {
  id: string;
  recipientId: string;
  recipientType: "buyer" | "seller" | "admin";
  type: NotificationType;
  title: string;
  message: string;
  referenceId: string;
  read: boolean;
  createdAt: string;
}

// ---- Monetization ----

export interface BuyerSearchUsage {
  id: string;
  buyerId: string;
  eventType: "requirement_submit" | "ai_search" | "shortlist_report" | "response_view" | "demo_coordination";
  requirementId: string;
  isFree: boolean;
  createdAt: string;
}
