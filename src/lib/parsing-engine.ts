// =============================================================
// Requirement Parsing Engine — Rules-based (MVP)
// Transforms natural-language buyer input into structured output
// =============================================================

import type { ParsedRequirement, Requirement } from "./procurement-types";
import { categories } from "./marketplace-data";

// ---- Keyword → Category mapping ----

const CATEGORY_KEYWORDS: Record<string, string[]> = {
  "HR / Payroll": ["hr", "payroll", "attendance", "leave", "employee", "workforce", "onboarding", "talent", "recruitment", "hiring", "appraisal", "benefits", "compensation"],
  "Cybersecurity": ["security", "firewall", "threat", "siem", "vulnerability", "penetration", "antivirus", "endpoint", "soc", "incident response", "encryption", "zero trust"],
  "Legal Tech": ["legal", "contract", "clause", "nda", "litigation", "compliance doc", "law", "attorney", "regulatory"],
  "Compliance": ["compliance", "audit", "regulation", "gdpr", "hipaa", "sox", "iso", "pci", "data protection", "risk management"],
  "Workflow Automation": ["workflow", "automation", "automate", "rpa", "bpm", "process", "trigger", "zapier", "integration"],
  "AI Tools": ["ai", "artificial intelligence", "machine learning", "ml", "gpt", "nlp", "generative", "deep learning", "chatbot", "predictive"],
  "CRM / Sales": ["crm", "sales", "customer relationship", "pipeline", "lead management", "deal", "prospect", "outreach", "revenue"],
  "Finance / Accounting": ["finance", "accounting", "invoicing", "invoice", "bookkeeping", "tax", "billing", "expense", "budget", "erp", "ledger", "gst"],
  "Procurement": ["procurement", "sourcing", "vendor management", "purchase", "rfp", "rfq", "supplier", "buying", "tender"],
  "Operations": ["operations", "logistics", "supply chain", "inventory", "warehouse", "fleet", "asset management", "facility"],
  "Developer Tools": ["developer", "devops", "ci/cd", "testing", "deployment", "api", "sdk", "monitoring", "logging", "git", "code"],
  "Analytics": ["analytics", "dashboard", "bi", "business intelligence", "reporting", "data visualization", "metrics", "kpi"],
};

// ---- Business function tags ----

const TAG_KEYWORDS: Record<string, string[]> = {
  "payroll": ["payroll", "salary", "wages", "pay slip"],
  "attendance": ["attendance", "time tracking", "clock in", "clock out", "timesheet"],
  "approvals": ["approval", "approvals", "workflow approval", "authorize"],
  "mobile": ["mobile", "app", "ios", "android", "responsive"],
  "reporting": ["report", "reports", "reporting", "dashboard", "analytics"],
  "invoicing": ["invoice", "invoicing", "billing"],
  "crm": ["crm", "customer management", "contact management"],
  "automation": ["automate", "automation", "rpa", "trigger"],
  "api": ["api", "integration", "webhook", "rest", "graphql"],
  "collaboration": ["collaboration", "team", "workspace", "shared"],
  "document_management": ["document", "files", "storage", "dms"],
  "e-signature": ["e-sign", "signature", "docusign", "signing"],
  "project_management": ["project management", "kanban", "sprint", "agile", "tasks"],
  "communication": ["chat", "messaging", "video call", "email", "notifications"],
  "security": ["security", "encryption", "sso", "mfa", "2fa"],
  "compliance": ["compliance", "audit", "regulation", "gdpr"],
  "customizable": ["custom", "customizable", "configurable", "white label"],
  "scalable": ["scale", "scalable", "enterprise", "large team"],
  "cloud": ["cloud", "saas", "hosted"],
  "on-premise": ["on-premise", "on-prem", "self-hosted", "local"],
};

// ---- Region detection ----

const REGION_KEYWORDS: Record<string, string[]> = {
  "India": ["india", "indian", "mumbai", "delhi", "bangalore", "hyderabad", "pune", "chennai", "gst", "epf", "esi"],
  "Malaysia": ["malaysia", "malaysian", "kuala lumpur", "kl", "penang"],
  "Singapore": ["singapore", "sg"],
  "USA": ["usa", "us", "united states", "american", "california", "new york"],
  "UAE": ["uae", "dubai", "abu dhabi", "emirates"],
  "UK": ["uk", "united kingdom", "london", "british"],
  "Global": ["global", "worldwide", "international", "multi-region"],
};

// ---- Deployment detection ----

const DEPLOYMENT_KEYWORDS: Record<string, string[]> = {
  "SaaS": ["saas", "cloud", "hosted", "web-based", "browser"],
  "On-Premise": ["on-premise", "on-prem", "self-hosted", "local", "private cloud"],
  "Hybrid": ["hybrid", "both cloud and on-premise"],
};

// ---- Compliance flags ----

const COMPLIANCE_KEYWORDS: Record<string, string[]> = {
  "GDPR": ["gdpr", "data protection", "eu privacy"],
  "HIPAA": ["hipaa", "health data", "medical compliance"],
  "SOC2": ["soc2", "soc 2", "security controls"],
  "ISO27001": ["iso 27001", "iso27001", "information security management"],
  "PCI-DSS": ["pci", "pci-dss", "payment card"],
  "SOX": ["sox", "sarbanes", "financial reporting"],
};

// ---- Main parser ----

function matchKeywords(text: string, keywordMap: Record<string, string[]>): string[] {
  const lower = text.toLowerCase();
  const matches: string[] = [];
  for (const [key, keywords] of Object.entries(keywordMap)) {
    for (const kw of keywords) {
      if (lower.includes(kw)) {
        matches.push(key);
        break;
      }
    }
  }
  return matches;
}

function detectPricingBand(budgetRange: string): string {
  const lower = budgetRange.toLowerCase();
  if (lower.includes("free") || lower.includes("$0") || lower.includes("no budget")) return "Free";
  if (lower.includes("low") || lower.includes("under") || lower.includes("<")) return "Budget";
  if (lower.includes("mid") || lower.includes("moderate")) return "Mid-range";
  if (lower.includes("enterprise") || lower.includes("high") || lower.includes("unlimited")) return "Enterprise";
  return "Flexible";
}

export function parseRequirement(req: Requirement): Omit<ParsedRequirement, "id" | "parsedAt"> {
  const fullText = `${req.title} ${req.problemDescription} ${req.featureRequirements} ${req.complianceNeeds} ${req.supportExpectation}`;

  const matchedCategories = matchKeywords(fullText, CATEGORY_KEYWORDS);
  const likelyCategory = matchedCategories[0] || "General";

  // Derive possible software types from category
  const softwareTypeMap: Record<string, string[]> = {
    "HR / Payroll": ["HRMS", "Payroll Platform", "Attendance System", "Talent Management"],
    "Cybersecurity": ["SIEM", "Endpoint Protection", "Vulnerability Scanner", "Identity Management"],
    "Legal Tech": ["Contract Management", "Legal Workflow", "E-Signature Platform"],
    "Compliance": ["GRC Platform", "Audit Management", "Compliance Tracker"],
    "Workflow Automation": ["BPM Platform", "Integration Hub", "RPA Tool"],
    "AI Tools": ["AI Platform", "ML Ops", "Chatbot Builder", "AI Analytics"],
    "CRM / Sales": ["CRM Platform", "Sales Automation", "Lead Management"],
    "Finance / Accounting": ["Accounting Software", "Invoicing Tool", "ERP System"],
    "Procurement": ["Procurement Platform", "Vendor Management", "Sourcing Tool"],
    "Operations": ["Operations Management", "Supply Chain Platform", "Inventory System"],
    "Developer Tools": ["CI/CD Platform", "Monitoring Tool", "API Gateway"],
    "Analytics": ["BI Platform", "Data Visualization", "Reporting Tool"],
  };
  const possibleSoftwareTypes = softwareTypeMap[likelyCategory] || ["Software Platform"];

  const businessFunctionTags = matchKeywords(fullText, TAG_KEYWORDS);
  const regions = matchKeywords(fullText, REGION_KEYWORDS);
  const deployments = matchKeywords(fullText, DEPLOYMENT_KEYWORDS);
  const complianceFlags = matchKeywords(`${fullText} ${req.complianceNeeds}`, COMPLIANCE_KEYWORDS);

  // Confidence: higher if more signals detected
  const signals = [
    matchedCategories.length > 0 ? 25 : 0,
    businessFunctionTags.length > 2 ? 25 : businessFunctionTags.length > 0 ? 15 : 0,
    regions.length > 0 ? 15 : 0,
    deployments.length > 0 ? 10 : 0,
    complianceFlags.length > 0 ? 10 : 0,
    req.budgetRange ? 10 : 0,
    req.urgency ? 5 : 0,
  ];
  const confidence = Math.min(100, signals.reduce((a, b) => a + b, 0));

  return {
    requirementId: req.id,
    likelyCategory,
    possibleSoftwareTypes,
    businessFunctionTags,
    supportNeeds: req.supportExpectation || "Standard",
    pricingBand: detectPricingBand(req.budgetRange),
    deploymentPreference: deployments[0] || req.deploymentPreference || "Any",
    region: regions[0] || req.region || "Global",
    urgency: req.urgency || "medium",
    complianceFlags,
    confidence,
  };
}
