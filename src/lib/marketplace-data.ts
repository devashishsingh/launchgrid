// =============================================================
// Marketplace mock data — types & demo content
// =============================================================

// ---- Verification framework types ----

export type VerificationState =
  | "submitted"
  | "identity_verification"
  | "product_testing"
  | "legal_verification"
  | "security_check"
  | "support_readiness"
  | "verified"
  | "listed"
  | "suspended"
  | "delisted";

export interface OriginVerification {
  founderName: string;
  companyIdentity: string;
  verifiedEmail: boolean;
  linkedInProfile: string;
  website: string;
  supportEmail: string;
  businessLocation: string;
  companyRegistration?: string;
  ownershipDeclaration: boolean;
}

export interface ProductTesting {
  testedBy: string;
  testedOn: string;
  status: "pass" | "fail" | "partial";
  loginWorks: boolean;
  signupWorks: boolean;
  coreFeatureWorks: boolean;
  dashboardWorks: boolean;
  supportContactWorks: boolean;
  navigationWorks: boolean;
  mobileResponsive: boolean;
  noCriticalUIBreak: boolean;
  noDeadRoutes: boolean;
  issuesFound: string[];
  severity: "none" | "low" | "medium" | "high" | "critical";
  recheckRequired: boolean;
}

export interface LegalReadiness {
  termsAndConditions: boolean;
  privacyPolicy: boolean;
  refundPolicy: boolean;
  supportSLA: boolean;
  ownershipDeclaration: boolean;
  liabilityBoundaries: boolean;
  creatorAgreement: boolean;
}

export interface SecurityBasics {
  https: boolean;
  authProtection: boolean;
  sessionSecurity: boolean;
  noPublicSecrets: boolean;
  roleBasedAccess: boolean;
  secureFileAccess: boolean;
  tenantIsolation: boolean;
}

export interface SupportReadiness {
  supportOwner: string;
  supportEmail: string;
  issueResponseSLA: string;
  bugFixOwnership: boolean;
  maintenanceCommitment: boolean;
  escalationContact: string;
}

export interface VerificationRecord {
  state: VerificationState;
  origin: OriginVerification;
  testing: ProductTesting;
  legal: LegalReadiness;
  security: SecurityBasics;
  support: SupportReadiness;
  verifiedAt?: string;
  suspendedAt?: string;
  suspensionReason?: string;
}

export interface TrustScore {
  overall: number; // 0-10
  breakdown: {
    support: number;
    legalCompleteness: number;
    productTesting: number;
    securityBasics: number;
    responseSLA: number;
    reviews: number;
    complaintRatio: number;
  };
}

export type TrustBadge =
  | "launchdock_verified"
  | "tested"
  | "legal_ready"
  | "security_checked"
  | "support_ready"
  | "indie_founder";

export interface MarketplaceProduct {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  rating: number;
  reviewCount: number;
  supportScore: number;
  pricing: "Free" | "Freemium" | "Paid" | "Enterprise" | "Custom";
  priceRange?: string;
  deployment: "Cloud" | "On-Premise" | "Hybrid" | "SaaS";
  customizable: boolean;
  company: string;
  country: string;
  tags: string[];
  features: string[];
  logo: string; // emoji placeholder
  screenshots: string[];
  yearFounded?: number;
  // ---- Trust & Verification ----
  verification: VerificationRecord;
  trustScore: TrustScore;
  trustBadges: TrustBadge[];
  isIndie: boolean;
  whyVerified: {
    summary: string;
    idealUseCase: string;
    industriesFit: string[];
    customizationSupport: string;
  };
}

export interface MarketplaceCategory {
  slug: string;
  name: string;
  icon: string;
  description: string;
  productCount: number;
}

// ---- Categories ----
export const categories: MarketplaceCategory[] = [
  { slug: "hr-payroll", name: "HR / Payroll", icon: "👥", description: "Manage people, compensation, and workforce operations.", productCount: 34 },
  { slug: "cybersecurity", name: "Cybersecurity", icon: "🛡️", description: "Protect your organization from threats and breaches.", productCount: 28 },
  { slug: "legal-tech", name: "Legal Tech", icon: "⚖️", description: "Streamline contracts, compliance docs, and legal workflows.", productCount: 19 },
  { slug: "compliance", name: "Compliance", icon: "📋", description: "Stay audit-ready with automated compliance tracking.", productCount: 22 },
  { slug: "workflow-automation", name: "Workflow Automation", icon: "⚡", description: "Automate repetitive tasks and connect your stack.", productCount: 41 },
  { slug: "ai-tools", name: "AI Tools", icon: "🤖", description: "Leverage artificial intelligence across your workflows.", productCount: 53 },
  { slug: "crm-sales", name: "CRM / Sales", icon: "📈", description: "Close more deals with the right relationship tools.", productCount: 47 },
  { slug: "finance-accounting", name: "Finance / Accounting", icon: "💰", description: "Invoicing, bookkeeping, and financial management.", productCount: 31 },
  { slug: "procurement", name: "Procurement", icon: "🛒", description: "Sourcing, vendor management, and purchase workflows.", productCount: 16 },
  { slug: "operations", name: "Operations", icon: "🏭", description: "Optimize day-to-day business operations end to end.", productCount: 25 },
  { slug: "developer-tools", name: "Developer Tools", icon: "🔧", description: "Build, test, deploy, and monitor software faster.", productCount: 62 },
  { slug: "analytics", name: "Analytics", icon: "📊", description: "Turn raw data into actionable business intelligence.", productCount: 38 },
];

// ---- Helper to build mock verification records ----
function makeVerification(overrides: Partial<{ state: VerificationState; testedBy: string; testedOn: string; testStatus: "pass" | "fail" | "partial"; issues: string[]; severity: "none" | "low" | "medium"; supportOwner: string; supportEmail: string; sla: string; escalation: string; founderName: string; website: string; location: string; registration?: string; }> = {}): VerificationRecord {
  return {
    state: overrides.state ?? "listed",
    origin: {
      founderName: overrides.founderName ?? "Verified Founder",
      companyIdentity: "Verified",
      verifiedEmail: true,
      linkedInProfile: "linkedin.com/in/verified",
      website: overrides.website ?? "https://example.com",
      supportEmail: overrides.supportEmail ?? "support@example.com",
      businessLocation: overrides.location ?? "India",
      companyRegistration: overrides.registration,
      ownershipDeclaration: true,
    },
    testing: {
      testedBy: overrides.testedBy ?? "Launchbox QA",
      testedOn: overrides.testedOn ?? "2026-03-15",
      status: overrides.testStatus ?? "pass",
      loginWorks: true,
      signupWorks: true,
      coreFeatureWorks: true,
      dashboardWorks: true,
      supportContactWorks: true,
      navigationWorks: true,
      mobileResponsive: true,
      noCriticalUIBreak: true,
      noDeadRoutes: true,
      issuesFound: overrides.issues ?? [],
      severity: overrides.severity ?? "none",
      recheckRequired: false,
    },
    legal: {
      termsAndConditions: true,
      privacyPolicy: true,
      refundPolicy: true,
      supportSLA: true,
      ownershipDeclaration: true,
      liabilityBoundaries: true,
      creatorAgreement: true,
    },
    security: {
      https: true,
      authProtection: true,
      sessionSecurity: true,
      noPublicSecrets: true,
      roleBasedAccess: true,
      secureFileAccess: true,
      tenantIsolation: true,
    },
    support: {
      supportOwner: overrides.supportOwner ?? "Support Team",
      supportEmail: overrides.supportEmail ?? "support@example.com",
      issueResponseSLA: overrides.sla ?? "< 4 hours",
      bugFixOwnership: true,
      maintenanceCommitment: true,
      escalationContact: overrides.escalation ?? "cto@example.com",
    },
    verifiedAt: "2026-03-20",
  };
}

function makeTrustScore(overall: number, breakdown: Partial<TrustScore["breakdown"]> = {}): TrustScore {
  return {
    overall,
    breakdown: {
      support: breakdown.support ?? 9.0,
      legalCompleteness: breakdown.legalCompleteness ?? 9.5,
      productTesting: breakdown.productTesting ?? 9.0,
      securityBasics: breakdown.securityBasics ?? 8.5,
      responseSLA: breakdown.responseSLA ?? 9.0,
      reviews: breakdown.reviews ?? 8.5,
      complaintRatio: breakdown.complaintRatio ?? 9.0,
    },
  };
}

// ---- Products ----
export const products: MarketplaceProduct[] = [
  {
    slug: "flowdesk-crm",
    name: "FlowDesk CRM",
    tagline: "Close deals 3x faster with AI-powered pipeline management",
    description: "FlowDesk CRM is a next-generation customer relationship management platform that uses AI to predict deal outcomes, automate follow-ups, and surface the best next actions for your sales team. Built for mid-market companies that need enterprise power without enterprise complexity.",
    category: "CRM / Sales",
    rating: 4.8,
    reviewCount: 342,
    supportScore: 96,
    pricing: "Paid",
    priceRange: "$29–$149/user/mo",
    deployment: "Cloud",
    customizable: true,
    company: "FlowDesk Inc.",
    country: "India",
    tags: ["Top Rated", "Customizable", "Fast Support", "India Ready", "API Available"],
    features: ["AI deal scoring", "Pipeline automation", "Email tracking", "Custom dashboards", "Slack integration", "REST API", "GDPR compliant", "SSO/SAML"],
    logo: "📈",
    screenshots: [],
    yearFounded: 2022,
    isIndie: true,
    trustBadges: ["launchdock_verified", "tested", "legal_ready", "security_checked", "support_ready", "indie_founder"],
    verification: makeVerification({ founderName: "Arjun Mehta", website: "https://flowdesk.io", location: "Bengaluru, India", registration: "CIN U72200KA2022", supportOwner: "Arjun Mehta", supportEmail: "support@flowdesk.io", sla: "< 2 hours", escalation: "arjun@flowdesk.io" }),
    trustScore: makeTrustScore(9.2, { support: 9.6, legalCompleteness: 9.5, productTesting: 9.4, securityBasics: 9.0, responseSLA: 9.5, reviews: 9.0, complaintRatio: 9.2 }),
    whyVerified: {
      summary: "FlowDesk was founded by a 2x SaaS founder with deep CRM domain expertise. We tested every core workflow — pipeline creation, deal scoring, email sequences — and all passed. Legal docs are complete, HTTPS enforced, and their support responds within 2 hours on average.",
      idealUseCase: "Mid-market sales teams (10-200 reps) needing AI-powered pipeline management without Salesforce complexity.",
      industriesFit: ["SaaS", "B2B Services", "Consulting", "Real Estate", "Financial Services"],
      customizationSupport: "Full custom fields, pipeline stages, dashboards. REST API for deep integrations.",
    },
  },
  {
    slug: "shieldwall-cyber",
    name: "ShieldWall",
    tagline: "Enterprise-grade endpoint protection, simplified",
    description: "ShieldWall provides real-time threat detection, automated incident response, and compliance reporting in a single dashboard. Trusted by 500+ organizations across Southeast Asia and India.",
    category: "Cybersecurity",
    rating: 4.9,
    reviewCount: 217,
    supportScore: 98,
    pricing: "Enterprise",
    priceRange: "Custom",
    deployment: "Hybrid",
    customizable: true,
    company: "ShieldWall Security",
    country: "India",
    tags: ["Top Rated", "Enterprise", "Fast Support", "India Ready", "Customizable"],
    features: ["Endpoint detection", "Automated response", "Compliance dashboard", "Threat intelligence", "SOC integration", "24/7 monitoring"],
    logo: "🛡️",
    screenshots: [],
    yearFounded: 2020,
    isIndie: false,
    trustBadges: ["launchdock_verified", "tested", "legal_ready", "security_checked", "support_ready"],
    verification: makeVerification({ founderName: "Vikram Rao", website: "https://shieldwall.io", location: "Hyderabad, India", registration: "CIN U74999TG2020", supportOwner: "SOC Team", supportEmail: "soc@shieldwall.io", sla: "< 30 minutes", escalation: "vikram@shieldwall.io" }),
    trustScore: makeTrustScore(9.6, { support: 9.8, legalCompleteness: 9.7, productTesting: 9.5, securityBasics: 9.9, responseSLA: 9.8, reviews: 9.3, complaintRatio: 9.5 }),
    whyVerified: {
      summary: "ShieldWall is backed by a team of ex-CERT security engineers. Their endpoint protection was tested against 50+ threat scenarios. 24/7 SOC monitoring verified. Legal and compliance documentation is enterprise-grade.",
      idealUseCase: "Organizations with 100+ endpoints needing real-time threat detection and automated incident response.",
      industriesFit: ["Banking & Finance", "Healthcare", "Government", "E-commerce", "Technology"],
      customizationSupport: "Custom detection rules, branded dashboards, dedicated SOC analyst for enterprise tier.",
    },
  },
  {
    slug: "paystream-hr",
    name: "PayStream HR",
    tagline: "Payroll, attendance, and compliance — one platform",
    description: "PayStream HR automates payroll processing, attendance tracking, leave management, and statutory compliance for Indian businesses. From startups to enterprises.",
    category: "HR / Payroll",
    rating: 4.6,
    reviewCount: 528,
    supportScore: 91,
    pricing: "Freemium",
    priceRange: "Free–$12/user/mo",
    deployment: "SaaS",
    customizable: false,
    company: "PayStream Technologies",
    country: "India",
    tags: ["Startup Friendly", "India Ready", "Fast Support"],
    features: ["Payroll automation", "Leave management", "Attendance tracking", "Tax computation", "Statutory compliance", "Employee self-service"],
    logo: "👥",
    screenshots: [],
    yearFounded: 2021,
    isIndie: true,
    trustBadges: ["launchdock_verified", "tested", "legal_ready", "security_checked", "support_ready", "indie_founder"],
    verification: makeVerification({ founderName: "Priya Sharma", website: "https://paystream.in", location: "Mumbai, India", registration: "CIN U72300MH2021", supportOwner: "Priya Sharma", supportEmail: "help@paystream.in", sla: "< 4 hours", escalation: "priya@paystream.in" }),
    trustScore: makeTrustScore(8.7, { support: 9.1, legalCompleteness: 9.0, productTesting: 8.8, securityBasics: 8.5, responseSLA: 8.8, reviews: 8.5, complaintRatio: 8.2 }),
    whyVerified: {
      summary: "PayStream was built by an HR-tech veteran who spent 8 years at a leading payroll company. Tested all payroll cycles, leave workflows, and statutory compliance modules. Clean legal docs. Handles India-specific tax regulations (PF, ESI, PT, TDS) natively.",
      idealUseCase: "Indian startups and SMBs (5-500 employees) needing payroll, attendance, and statutory compliance in one platform.",
      industriesFit: ["Startups", "IT Services", "Manufacturing", "Retail", "Professional Services"],
      customizationSupport: "Pre-built for Indian compliance. Custom leave policies and salary structures supported.",
    },
  },
  {
    slug: "auditly",
    name: "Auditly",
    tagline: "Continuous compliance monitoring for modern teams",
    description: "Auditly watches your infrastructure and processes 24/7, flags compliance gaps, and generates audit-ready reports automatically. SOC 2, ISO 27001, GDPR covered.",
    category: "Compliance",
    rating: 4.7,
    reviewCount: 189,
    supportScore: 93,
    pricing: "Paid",
    priceRange: "$99–$499/mo",
    deployment: "Cloud",
    customizable: true,
    company: "Auditly Cloud",
    country: "USA",
    tags: ["Top Rated", "Enterprise", "Global", "API Available"],
    features: ["Continuous monitoring", "Auto evidence collection", "SOC 2 automation", "ISO 27001 templates", "Vendor risk management", "Slack alerts"],
    logo: "📋",
    screenshots: [],
    yearFounded: 2021,
    isIndie: true,
    trustBadges: ["launchdock_verified", "tested", "legal_ready", "security_checked", "support_ready", "indie_founder"],
    verification: makeVerification({ founderName: "Sarah Chen", website: "https://auditly.io", location: "San Francisco, USA", supportOwner: "Sarah Chen", supportEmail: "support@auditly.io", sla: "< 3 hours", escalation: "sarah@auditly.io" }),
    trustScore: makeTrustScore(9.0, { support: 9.3, legalCompleteness: 9.5, productTesting: 9.0, securityBasics: 9.2, responseSLA: 9.0, reviews: 8.8, complaintRatio: 8.7 }),
    whyVerified: {
      summary: "Auditly was founded by a compliance engineer from a Big 4 firm. We validated SOC 2, ISO 27001, and GDPR workflows end-to-end. Auto-evidence collection tested against real compliance audits. Their documentation is thorough and their response time is consistently under 3 hours.",
      idealUseCase: "SaaS companies and tech startups preparing for SOC 2 / ISO 27001 certification or maintaining ongoing compliance.",
      industriesFit: ["SaaS", "FinTech", "HealthTech", "Cloud Infrastructure", "Enterprise Software"],
      customizationSupport: "Custom compliance frameworks, API for CI/CD integration, white-label audit reports.",
    },
  },
  {
    slug: "nexflow",
    name: "NexFlow",
    tagline: "Visual workflow builder for non-technical teams",
    description: "NexFlow lets ops, HR, and finance teams build powerful automated workflows with a drag-and-drop interface. No code required — connect 200+ apps in minutes.",
    category: "Workflow Automation",
    rating: 4.5,
    reviewCount: 673,
    supportScore: 88,
    pricing: "Freemium",
    priceRange: "Free–$79/mo",
    deployment: "SaaS",
    customizable: true,
    company: "NexFlow Labs",
    country: "India",
    tags: ["Startup Friendly", "Customizable", "India Ready", "API Available"],
    features: ["Drag-and-drop builder", "200+ integrations", "Conditional logic", "Approval chains", "Webhooks", "Templates library"],
    logo: "⚡",
    screenshots: [],
    yearFounded: 2023,
    isIndie: true,
    trustBadges: ["launchdock_verified", "tested", "legal_ready", "support_ready", "indie_founder"],
    verification: makeVerification({ founderName: "Rohit Kapoor", website: "https://nexflow.in", location: "Delhi, India", supportOwner: "Rohit Kapoor", supportEmail: "support@nexflow.in", sla: "< 6 hours", escalation: "rohit@nexflow.in", testStatus: "pass", issues: ["Minor delay on 200+ node workflows"], severity: "low" }),
    trustScore: makeTrustScore(8.4, { support: 8.8, legalCompleteness: 8.5, productTesting: 8.2, securityBasics: 7.8, responseSLA: 8.5, reviews: 8.5, complaintRatio: 8.5 }),
    whyVerified: {
      summary: "NexFlow is built by a solo indie developer with a passion for no-code automation. We tested 25+ workflow templates, API integrations, and approval chains. Minor performance issue noted on very large workflows but not production-blocking. Legal docs complete. Founder is highly responsive.",
      idealUseCase: "Non-technical teams in ops, HR, or finance that want to automate repetitive workflows without writing code.",
      industriesFit: ["Operations", "HR", "Finance", "Marketing", "Customer Success"],
      customizationSupport: "Custom workflow templates, webhook triggers, conditional branching, API access on paid tier.",
    },
  },
  {
    slug: "cogniparse-ai",
    name: "CogniParse AI",
    tagline: "Extract, classify, and understand any document with AI",
    description: "CogniParse uses cutting-edge LLMs and vision models to extract structured data from invoices, contracts, IDs, and any document type. 99.2% accuracy out of the box.",
    category: "AI Tools",
    rating: 4.8,
    reviewCount: 156,
    supportScore: 94,
    pricing: "Paid",
    priceRange: "$49–$299/mo",
    deployment: "Cloud",
    customizable: true,
    company: "CogniParse Inc.",
    country: "India",
    tags: ["Top Rated", "Customizable", "API Available", "Enterprise"],
    features: ["Document extraction", "Invoice parsing", "Contract analysis", "Custom model training", "REST API", "Batch processing"],
    logo: "🤖",
    screenshots: [],
    yearFounded: 2023,
    isIndie: true,
    trustBadges: ["launchdock_verified", "tested", "legal_ready", "security_checked", "support_ready", "indie_founder"],
    verification: makeVerification({ founderName: "Aditya Nair", website: "https://cogniparse.ai", location: "Bengaluru, India", registration: "CIN U72900KA2023", supportOwner: "Aditya Nair", supportEmail: "support@cogniparse.ai", sla: "< 2 hours", escalation: "aditya@cogniparse.ai" }),
    trustScore: makeTrustScore(9.1, { support: 9.4, legalCompleteness: 9.0, productTesting: 9.2, securityBasics: 9.0, responseSLA: 9.3, reviews: 8.8, complaintRatio: 9.0 }),
    whyVerified: {
      summary: "CogniParse is founded by an ex-Google ML engineer. We tested document extraction across 15 document types — invoices, contracts, IDs, receipts — and achieved 98.7% accuracy in our tests. API is well-documented and stable. Custom model training verified. Founder responds personally to critical issues.",
      idealUseCase: "Finance, legal, and ops teams processing high volumes of documents that need structured data extraction.",
      industriesFit: ["Finance", "Legal", "Insurance", "Healthcare", "Logistics"],
      customizationSupport: "Custom model training on your document types, API-first design, batch processing for high-volume use.",
    },
  },
  {
    slug: "ledgerbase",
    name: "LedgerBase",
    tagline: "Accounting software built for Indian SMBs",
    description: "LedgerBase handles GST invoicing, reconciliation, TDS management, and financial reports — all tuned for Indian accounting standards and regulations.",
    category: "Finance / Accounting",
    rating: 4.4,
    reviewCount: 891,
    supportScore: 86,
    pricing: "Freemium",
    priceRange: "Free–$39/mo",
    deployment: "SaaS",
    customizable: false,
    company: "LedgerBase Pvt. Ltd.",
    country: "India",
    tags: ["Startup Friendly", "India Ready", "Fast Support"],
    features: ["GST invoicing", "Bank reconciliation", "TDS management", "Profit & loss", "Balance sheet", "Multi-user access"],
    logo: "💰",
    screenshots: [],
    yearFounded: 2020,
    isIndie: true,
    trustBadges: ["launchdock_verified", "tested", "legal_ready", "support_ready", "indie_founder"],
    verification: makeVerification({ founderName: "Kavita Desai", website: "https://ledgerbase.in", location: "Pune, India", registration: "CIN U74100MH2020", supportOwner: "Kavita Desai", supportEmail: "support@ledgerbase.in", sla: "< 6 hours", escalation: "kavita@ledgerbase.in" }),
    trustScore: makeTrustScore(8.3, { support: 8.6, legalCompleteness: 8.5, productTesting: 8.5, securityBasics: 7.8, responseSLA: 8.0, reviews: 8.2, complaintRatio: 8.5 }),
    whyVerified: {
      summary: "LedgerBase is a bootstrapped product from a chartered accountant turned developer. GST filing, TDS computation, and reconciliation workflows all tested. The product is India-first — handles PF, ESI, and professional tax natively. Legal docs in place. Reliable for SMBs.",
      idealUseCase: "Indian SMBs and freelancers needing GST-compliant invoicing, tax management, and financial reporting.",
      industriesFit: ["Retail", "Professional Services", "Freelancers", "Small Manufacturing", "Trading"],
      customizationSupport: "Pre-configured for Indian accounting standards. Custom invoice templates and report formats.",
    },
  },
  {
    slug: "devpipe",
    name: "DevPipe",
    tagline: "CI/CD pipelines that just work — zero config",
    description: "DevPipe detects your stack, configures pipelines automatically, and deploys to any cloud. Supports monorepos, Docker, Kubernetes, serverless, and more.",
    category: "Developer Tools",
    rating: 4.7,
    reviewCount: 412,
    supportScore: 92,
    pricing: "Freemium",
    priceRange: "Free–$99/mo",
    deployment: "Cloud",
    customizable: true,
    company: "DevPipe.io",
    country: "USA",
    tags: ["Top Rated", "Customizable", "Global", "API Available", "Startup Friendly"],
    features: ["Auto-detection", "Docker support", "K8s deploy", "GitHub integration", "Parallel builds", "Build cache"],
    logo: "🔧",
    screenshots: [],
    yearFounded: 2022,
    isIndie: true,
    trustBadges: ["launchdock_verified", "tested", "legal_ready", "security_checked", "support_ready", "indie_founder"],
    verification: makeVerification({ founderName: "Jake Morrison", website: "https://devpipe.io", location: "Austin, USA", supportOwner: "Jake Morrison", supportEmail: "support@devpipe.io", sla: "< 3 hours", escalation: "jake@devpipe.io" }),
    trustScore: makeTrustScore(8.9, { support: 9.2, legalCompleteness: 9.0, productTesting: 9.0, securityBasics: 8.8, responseSLA: 9.0, reviews: 8.7, complaintRatio: 8.5 }),
    whyVerified: {
      summary: "DevPipe is built by an ex-CircleCI engineer. We tested auto-detection across 8 language stacks, monorepo support, Docker builds, and K8s deployments — all passed. The zero-config promise holds true for 90%+ of projects. Legal and security docs complete.",
      idealUseCase: "Engineering teams wanting zero-config CI/CD that auto-detects their stack and deploys to any cloud.",
      industriesFit: ["SaaS", "Open Source", "DevOps", "Cloud Native", "Startups"],
      customizationSupport: "Custom pipeline YAML, Docker and K8s config overrides, webhook callbacks, GitHub/GitLab/Bitbucket.",
    },
  },
  {
    slug: "procurex",
    name: "ProcureX",
    tagline: "Smart procurement platform for growing businesses",
    description: "ProcureX digitizes your procurement workflow — from purchase requests to vendor evaluation to PO tracking. Spend visibility and vendor scoring built in.",
    category: "Procurement",
    rating: 4.3,
    reviewCount: 98,
    supportScore: 85,
    pricing: "Paid",
    priceRange: "$59–$199/mo",
    deployment: "Cloud",
    customizable: true,
    company: "ProcureX Solutions",
    country: "India",
    tags: ["Customizable", "India Ready", "Enterprise"],
    features: ["Purchase requests", "Vendor scoring", "PO tracking", "Spend analytics", "Approval workflows", "Budget alerts"],
    logo: "🛒",
    screenshots: [],
    yearFounded: 2022,
    isIndie: true,
    trustBadges: ["launchdock_verified", "tested", "legal_ready", "support_ready", "indie_founder"],
    verification: makeVerification({ founderName: "Deepak Joshi", website: "https://procurex.in", location: "Chennai, India", supportOwner: "Deepak Joshi", supportEmail: "support@procurex.in", sla: "< 8 hours", escalation: "deepak@procurex.in" }),
    trustScore: makeTrustScore(8.1, { support: 8.5, legalCompleteness: 8.0, productTesting: 8.2, securityBasics: 7.5, responseSLA: 7.8, reviews: 8.0, complaintRatio: 8.5 }),
    whyVerified: {
      summary: "ProcureX is built by a supply-chain veteran who ran procurement for a Fortune 500. We tested the full P2P cycle — purchase requests, vendor evaluation, PO generation, and spend analytics. All core workflows pass. Support SLA is reasonable for the price point.",
      idealUseCase: "Growing businesses (50-500 employees) needing to digitize procurement from purchase requests to PO tracking.",
      industriesFit: ["Manufacturing", "Construction", "Retail", "Hospitality", "Education"],
      customizationSupport: "Custom approval workflows, vendor evaluation criteria, budget categories, and report templates.",
    },
  },
  {
    slug: "insightiq",
    name: "InsightIQ",
    tagline: "Business intelligence without the complexity",
    description: "InsightIQ connects to your databases, warehouses, and SaaS tools to deliver beautiful dashboards and AI-generated insights. No SQL required for end users.",
    category: "Analytics",
    rating: 4.6,
    reviewCount: 267,
    supportScore: 90,
    pricing: "Paid",
    priceRange: "$79–$349/mo",
    deployment: "Cloud",
    customizable: true,
    company: "InsightIQ Analytics",
    country: "India",
    tags: ["Top Rated", "Customizable", "India Ready", "API Available"],
    features: ["50+ connectors", "AI insights", "Custom dashboards", "Scheduled reports", "Embedded analytics", "Role-based access"],
    logo: "📊",
    screenshots: [],
    yearFounded: 2021,
    isIndie: true,
    trustBadges: ["launchdock_verified", "tested", "legal_ready", "security_checked", "support_ready", "indie_founder"],
    verification: makeVerification({ founderName: "Meera Krishnan", website: "https://insightiq.in", location: "Bengaluru, India", registration: "CIN U72200KA2021", supportOwner: "Meera Krishnan", supportEmail: "support@insightiq.in", sla: "< 4 hours", escalation: "meera@insightiq.in" }),
    trustScore: makeTrustScore(8.8, { support: 9.0, legalCompleteness: 9.0, productTesting: 8.8, securityBasics: 8.5, responseSLA: 8.8, reviews: 8.7, complaintRatio: 8.8 }),
    whyVerified: {
      summary: "InsightIQ is built by a data engineering team with experience at Flipkart and Amazon. We tested 12 data connectors, custom dashboard creation, scheduled reports, and embedded analytics. All core features work well. AI insights are genuinely useful — not just a gimmick.",
      idealUseCase: "Business teams and data analysts who need dashboards and insights without writing SQL or complex queries.",
      industriesFit: ["E-commerce", "SaaS", "Marketing", "Finance", "Operations"],
      customizationSupport: "Custom dashboards, 50+ data connectors, embedded analytics iframes, scheduled PDF reports.",
    },
  },
  {
    slug: "clauseai",
    name: "ClauseAI",
    tagline: "AI-powered contract review in seconds",
    description: "ClauseAI reads, summarizes, and flags risky clauses in contracts using AI. Reduce legal review time by 80% and never miss a non-standard term.",
    category: "Legal Tech",
    rating: 4.5,
    reviewCount: 134,
    supportScore: 89,
    pricing: "Paid",
    priceRange: "$69–$249/mo",
    deployment: "Cloud",
    customizable: false,
    company: "ClauseAI Legal",
    country: "USA",
    tags: ["Top Rated", "Global", "Enterprise", "API Available"],
    features: ["AI clause detection", "Risk scoring", "Contract summarization", "Template library", "Audit trail", "Collaboration"],
    logo: "⚖️",
    screenshots: [],
    yearFounded: 2023,
    isIndie: true,
    trustBadges: ["launchdock_verified", "tested", "legal_ready", "security_checked", "support_ready", "indie_founder"],
    verification: makeVerification({ founderName: "Emily Torres", website: "https://clauseai.com", location: "New York, USA", supportOwner: "Emily Torres", supportEmail: "support@clauseai.com", sla: "< 4 hours", escalation: "emily@clauseai.com" }),
    trustScore: makeTrustScore(8.6, { support: 8.9, legalCompleteness: 9.5, productTesting: 8.5, securityBasics: 8.8, responseSLA: 8.5, reviews: 8.0, complaintRatio: 8.2 }),
    whyVerified: {
      summary: "ClauseAI was built by a former corporate lawyer turned engineer. We tested contract review on 20+ contract types — NDAs, SaaS agreements, employment contracts — and the AI flagged risky clauses accurately. Legal documentation is excellent (unsurprisingly). Security and encryption standards are solid.",
      idealUseCase: "Legal teams and founders reviewing contracts who want to automate risk detection and clause analysis.",
      industriesFit: ["Legal", "SaaS", "Real Estate", "Finance", "Enterprise"],
      customizationSupport: "Custom clause libraries, risk thresholds, template management, and team collaboration.",
    },
  },
  {
    slug: "opsboard",
    name: "OpsBoard",
    tagline: "Operations command center for distributed teams",
    description: "OpsBoard gives operations leaders a real-time view of all processes, SLAs, tasks, and incidents. Built for companies running multi-location or remote operations.",
    category: "Operations",
    rating: 4.4,
    reviewCount: 176,
    supportScore: 87,
    pricing: "Paid",
    priceRange: "$49–$199/mo",
    deployment: "SaaS",
    customizable: true,
    company: "OpsBoard.co",
    country: "India",
    tags: ["Customizable", "India Ready", "Fast Support"],
    features: ["Real-time dashboard", "SLA tracking", "Task automation", "Incident management", "Multi-location", "API webhooks"],
    logo: "🏭",
    screenshots: [],
    yearFounded: 2022,
    isIndie: true,
    trustBadges: ["launchdock_verified", "tested", "legal_ready", "support_ready", "indie_founder"],
    verification: makeVerification({ founderName: "Sanjay Patel", website: "https://opsboard.co", location: "Ahmedabad, India", supportOwner: "Sanjay Patel", supportEmail: "support@opsboard.co", sla: "< 6 hours", escalation: "sanjay@opsboard.co" }),
    trustScore: makeTrustScore(8.2, { support: 8.7, legalCompleteness: 8.0, productTesting: 8.3, securityBasics: 7.5, responseSLA: 8.2, reviews: 8.0, complaintRatio: 8.5 }),
    whyVerified: {
      summary: "OpsBoard was built by an operations leader who managed teams across 12 cities. We tested SLA tracking, real-time dashboards, task automation, and multi-location views — all functional. The product shines for distributed teams. Legal docs complete. Founder is hands-on with support.",
      idealUseCase: "Operations managers running distributed or multi-location teams who need a single command center.",
      industriesFit: ["Logistics", "Retail Chains", "Hospitality", "Field Services", "Healthcare"],
      customizationSupport: "Custom SLA rules, task templates, location hierarchies, and API webhooks for external integrations.",
    },
  },
];

// ---- Filter options ----
export const filterOptions = {
  categories: categories.map((c) => c.name),
  pricing: ["Free", "Freemium", "Paid", "Enterprise", "Custom"],
  deployment: ["Cloud", "On-Premise", "Hybrid", "SaaS"],
  supportQuality: ["90+", "80+", "70+"],
  rating: ["4.5+", "4.0+", "3.5+"],
  tags: [
    "Top Rated", "Customizable", "Fast Support", "India Ready",
    "Global", "API Available", "Enterprise", "Startup Friendly",
  ],
  country: ["India", "USA", "UK", "Singapore", "Global"],
  sort: [
    "Top Rated", "Most Reviewed", "Most Customizable",
    "Low Cost", "Newest", "Global Presence",
  ],
};

// ---- Pain points for "Why Discovery Is Broken" ----
export const discoveryPainPoints = [
  { icon: "🔍", title: "Too many tools on Google", desc: "Hundreds of options, no way to know which actually fits your workflow." },
  { icon: "🗣️", title: "Friend-based recommendations", desc: "People recommend what they know — not what fits your business." },
  { icon: "❌", title: "Feature mismatch", desc: "You buy for 3 features and discover 2 are missing after onboarding." },
  { icon: "💸", title: "Expensive customization", desc: "Out-of-the-box rarely fits. Customization costs more than the license." },
  { icon: "🔄", title: "You change for the tool", desc: "Instead of the tool fitting your process, you bend your process to the tool." },
  { icon: "🎧", title: "Unclear support quality", desc: "You only discover support is bad after you're locked in." },
  { icon: "⚖️", title: "Hard to compare properly", desc: "Features, pricing, and deployment are never in the same format." },
  { icon: "🕐", title: "Months of evaluation", desc: "By the time you decide, your requirements have already changed." },
];

// ---- How Marketplace Works steps ----
export const marketplaceSteps = [
  { num: "01", title: "Explore software by filters", desc: "Search by category, pricing, support quality, deployment, and more." },
  { num: "02", title: "Compare based on fit", desc: "Side-by-side comparison on features, ratings, support, and customization." },
  { num: "03", title: "Connect with the product owner", desc: "Reach out directly to the vendor or developer through the platform." },
  { num: "04", title: "Close faster with the right fit", desc: "Make confident decisions backed by real data and community ratings." },
];

// ---- Issue types for feedback modal ----
export const feedbackIssueTypes = [
  "Suggestion",
  "Bug / Problem",
  "Missing Category",
  "Missing Software",
  "Wrong Information",
  "Improvement Idea",
];
