/**
 * BLOYI Readiness — full 18-section checklist schema.
 * Encoded verbatim from the founder's brief. Items declare their
 * input kind and optional engine reference. Weights drive scoring.
 */

export type ItemKind = "attestation" | "input" | "upload" | "engine";
export type Tier = "basic" | "advanced" | "enterprise";

export interface ReadinessItem {
  id: string;
  label: string;
  helpText?: string;
  kind: ItemKind;
  weight: number; // relative weight inside the section
  engineRef?: string; // matches an engine adapter id
  tier?: Tier;
  evidenceRequired?: boolean;
}

export interface ReadinessSection {
  id: string;
  order: number;
  title: string;
  emoji: string;
  blurb: string;
  weight: number; // relative weight in global score
  items: ReadinessItem[];
}

const A = (id: string, label: string, helpText?: string, weight = 1, evidenceRequired = false): ReadinessItem => ({
  id, label, helpText, kind: "attestation", weight, evidenceRequired,
});
const I = (id: string, label: string, helpText?: string, weight = 1): ReadinessItem => ({
  id, label, helpText, kind: "input", weight,
});
const U = (id: string, label: string, helpText?: string, weight = 1): ReadinessItem => ({
  id, label, helpText, kind: "upload", weight,
});
const E = (id: string, label: string, engineRef: string, helpText?: string, weight = 2): ReadinessItem => ({
  id, label, helpText, kind: "engine", weight, engineRef,
});

export const SECTIONS: ReadinessSection[] = [
  {
    id: "product-identity",
    order: 1,
    title: "Product Declaration & Accountability",
    emoji: "🥇",
    blurb: "Identify the product and the human accountable for it.",
    weight: 4,
    items: [
      I("name", "Product name, version, category"),
      I("use_case", "Clear use case & problem solved", "What does the product do? Who is it for?"),
      I("target_users", "Target users (B2B / B2C / internal tooling)"),
      I("creator_name", "Creator name + verified email"),
      I("portfolio_url", "Optional profile / portfolio URL"),
      A("legal_no_ip", "Declare: no IP infringement", "Mandatory legal declaration."),
      A("legal_no_malicious", "Declare: no malicious functionality"),
      A("legal_no_illegal", "Declare: no illegal usage"),
      A("legal_no_undisclosed_vulns", "Declare: no undisclosed critical vulnerabilities"),
      A("risk_breaches", "Risk disclosure: past breaches (with details + resolution)", undefined, 1, true),
      A("risk_legal", "Risk disclosure: past legal issues (with details + status)", undefined, 1, true),
    ],
  },
  {
    id: "product-readiness",
    order: 2,
    title: "Product Readiness & Delivery",
    emoji: "🥈",
    blurb: "Environments, testing, documentation, demos, observability, support.",
    weight: 6,
    items: [
      A("env_prod", "Production environment live"),
      A("env_staging", "Staging environment available"),
      A("env_dev", "Development environment exists"),
      A("cicd", "CI/CD pipeline in place"),
      A("vcs", "Version control used"),
      A("smoke", "Smoke tests completed"),
      A("unit", "Unit tests present"),
      A("integration", "Integration tests present"),
      A("load", "Load / performance testing done"),
      A("uat", "UAT completed"),
      A("regression", "Regression testing strategy defined"),
      U("user_manual", "User manual"),
      U("admin_manual", "Admin manual"),
      U("api_docs", "API documentation"),
      U("arch_diagram", "Architecture diagram"),
      U("changelog", "Release notes / changelog"),
      U("setup_guide", "Setup / deployment guide"),
      A("demo_available", "Demo available"),
      A("sandbox", "Sandbox environment"),
      A("poc", "POC instance available"),
      A("logging", "Logging enabled"),
      A("error_tracking", "Error tracking system"),
      A("monitoring", "Monitoring system"),
      A("perf_metrics", "Performance metrics tracked"),
      I("support_email", "Support email"),
      I("contact_info", "Contact information"),
      I("sla", "SLA defined (optional)"),
      A("issue_tracker", "Issue tracking system"),
    ],
  },
  {
    id: "architecture",
    order: 3,
    title: "Architecture & Scalability",
    emoji: "🥉",
    blurb: "Modular design, scalability, availability, integrations.",
    weight: 4,
    items: [
      A("modular", "Modular architecture"),
      A("svc_separation", "Clear separation of services"),
      A("api_first", "API-first design (if applicable)"),
      A("h_scale", "Horizontal scaling supported"),
      A("lb", "Load balancing implemented"),
      A("autoscale", "Auto-scaling configured"),
      A("stateless", "Stateless services (where applicable)"),
      A("multi_region", "Multi-region support (or planned)"),
      A("ha", "High availability design"),
      A("failover", "Failover strategy"),
      I("uptime_sla", "Uptime SLA target (e.g. 99.9%)"),
      A("rest_graphql", "REST / GraphQL APIs"),
      A("webhooks", "Webhooks support"),
      A("sdks", "SDKs (optional)"),
      A("crm_integration", "Integration capability with CRM"),
      A("erp_integration", "Integration capability with ERP"),
      A("iam_integration", "Integration capability with IAM"),
    ],
  },
  {
    id: "iam",
    order: 4,
    title: "Identity & Access Management",
    emoji: "🔐",
    blurb: "Roles, MFA, SSO, sessions, audit logs.",
    weight: 5,
    items: [
      A("rbac", "Role-Based Access Control (RBAC)"),
      A("admin_user_sep", "Admin vs user separation"),
      A("mfa_support", "MFA support"),
      A("sso", "SSO (SAML / OIDC) support"),
      A("scim", "SCIM provisioning (optional)", undefined, 1),
      A("session_timeout", "Session timeout policies"),
      A("password_policy", "Password policies enforced"),
      A("api_keys", "API key / token management"),
      A("audit_logs_iam", "Audit logs for access / activity"),
    ],
  },
  {
    id: "data-security",
    order: 5,
    title: "Data Security & Privacy",
    emoji: "🛡️",
    blurb: "Encryption, multi-tenancy, lifecycle, governance.",
    weight: 6,
    items: [
      E("tls", "Encryption in transit (TLS 1.2+)", "tls-check", "We will probe a public hostname for you."),
      A("at_rest", "Encryption at rest"),
      A("data_classification", "Data classification"),
      A("pii_handling", "PII handling defined"),
      A("data_minimization", "Data minimization"),
      A("tenant_isolation", "Tenant isolation"),
      A("logical_phys_sep", "Logical / physical separation"),
      A("no_cross_tenant", "No cross-tenant data leakage"),
      A("retention", "Data retention policy"),
      A("deletion", "Data deletion capability"),
      A("backup", "Backup strategy defined"),
      A("backup_encryption", "Backup encryption"),
      A("residency", "Data residency options"),
      A("gdpr", "GDPR readiness"),
      U("dpa", "Data Processing Agreement (DPA)"),
      A("ai_transparency", "AI / data usage transparency"),
    ],
  },
  {
    id: "appsec",
    order: 6,
    title: "Application Security",
    emoji: "🧪",
    blurb: "Secure SDLC, runtime, API and advanced web protections.",
    weight: 8,
    items: [
      A("secure_sdlc", "Secure SDLC followed"),
      A("code_review", "Code reviews mandatory"),
      E("sast", "Static code analysis (SAST)", "sast-stub", "We run a heuristic SAST pass.", 3),
      E("sca", "Dependency scanning (SCA)", "sca-npm-audit", "Paste your package.json + lock; we run npm audit.", 3),
      E("secrets", "Secrets detection", "secrets-regex", "Paste a code snippet; we hunt for keys and tokens.", 3),
      E("dast", "Dynamic testing (DAST)", "dast-stub"),
      A("vuln_scan", "Vulnerability scanning"),
      A("pentest", "Penetration testing", undefined, 1, true),
      A("owasp", "OWASP Top 10 protection"),
      A("api_authn", "Authentication enforced (API)"),
      A("api_authz", "Authorization checks"),
      A("rate_limit", "Rate limiting"),
      A("input_validation", "Input validation"),
      A("injection", "Injection prevention"),
      A("csrf", "CSRF protection"),
      A("xss", "XSS protection"),
      E("secure_headers", "Secure headers implemented", "headers-check", "We fetch a URL and audit its headers.", 2),
      A("file_upload", "File upload validation"),
    ],
  },
  {
    id: "infrastructure",
    order: 7,
    title: "Infrastructure Security",
    emoji: "☁️",
    blurb: "Cloud baseline, segmentation, secrets management.",
    weight: 4,
    items: [
      A("cloud_baseline", "Cloud provider security baseline"),
      A("misconfig_scan", "Misconfiguration scanning"),
      A("waf", "Firewall / WAF in place"),
      A("network_seg", "Network segmentation"),
      A("secrets_mgmt", "Secrets management system"),
      A("no_hardcoded", "No hardcoded credentials"),
    ],
  },
  {
    id: "incident",
    order: 8,
    title: "Incident Response & Monitoring",
    emoji: "🚨",
    blurb: "Plan, alerts, retention, forensics.",
    weight: 4,
    items: [
      A("ir_plan", "Incident response plan"),
      A("breach_notify", "Breach notification process"),
      A("siem", "Security monitoring (SIEM optional)"),
      A("alerting", "Alerting system"),
      I("log_retention", "Log retention policy (days)"),
      A("forensics", "Forensics capability"),
    ],
  },
  {
    id: "bcdr",
    order: 9,
    title: "Business Continuity & Disaster Recovery",
    emoji: "♻️",
    blurb: "Backups, DR, RTO/RPO, DR drills.",
    weight: 4,
    items: [
      I("backup_freq", "Backup frequency defined"),
      A("dr_plan", "Disaster recovery plan"),
      I("rto", "Recovery Time Objective (RTO)"),
      I("rpo", "Recovery Point Objective (RPO)"),
      A("dr_test", "DR testing conducted"),
    ],
  },
  {
    id: "compliance",
    order: 10,
    title: "Compliance & Certifications (Tiered)",
    emoji: "⚖️",
    blurb: "Basic → advanced → enterprise certifications.",
    weight: 5,
    items: [
      A("gdpr_basic", "GDPR readiness (basic)", undefined, 1),
      U("privacy_policy", "Privacy policy", "Upload or paste URL.", 1),
      E("privacy_lint", "Privacy policy lint", "privacy-policy-lint", "We crawl the URL for required clauses.", 2),
      A("soc2", "SOC 2 readiness", undefined, 2),
      A("iso27001", "ISO 27001 readiness", undefined, 2),
      A("hipaa", "HIPAA (if applicable)", undefined, 1),
      A("pci", "PCI DSS (if applicable)", undefined, 1),
    ],
  },
  {
    id: "legal",
    order: 11,
    title: "Legal & Contractual Readiness",
    emoji: "🧾",
    blurb: "ToS, privacy, liability, indemnity, audit rights.",
    weight: 4,
    items: [
      U("tos", "Terms of service"),
      U("privacy", "Privacy policy"),
      A("data_ownership", "Data ownership clarity"),
      A("liability", "Liability clauses"),
      A("indemnity", "Indemnity clauses"),
      A("subprocessors", "Subprocessor disclosure"),
      A("audit_right", "Right-to-audit clause"),
    ],
  },
  {
    id: "data-governance",
    order: 12,
    title: "Data Governance",
    emoji: "🧠",
    blurb: "What data, why, AI usage, training data, isolation.",
    weight: 4,
    items: [
      I("collected", "What data is collected"),
      I("why", "Why data is collected"),
      A("ai_disclosure", "AI usage disclosure"),
      A("customer_isolation", "Customer data isolation"),
      A("training_policy", "Training data policies"),
    ],
  },
  {
    id: "ops-maturity",
    order: 13,
    title: "Operational Maturity",
    emoji: "🧑‍💼",
    blurb: "Support, escalation, onboarding, training.",
    weight: 3,
    items: [
      I("sup_sla", "Support SLAs"),
      I("escalation", "Escalation matrix"),
      A("onboarding", "Customer onboarding process"),
      A("training", "Training resources"),
      A("internal_docs", "Internal documentation"),
    ],
  },
  {
    id: "performance",
    order: 14,
    title: "Performance & Quality",
    emoji: "🧪",
    blurb: "Benchmarks, latency, throughput, error rate.",
    weight: 3,
    items: [
      I("benchmarks", "Performance benchmarks"),
      I("latency", "Latency metrics (p95)"),
      A("throughput", "Throughput testing"),
      A("stress", "Stress testing"),
      A("error_rate", "Error rate tracking"),
    ],
  },
  {
    id: "customization",
    order: 15,
    title: "Customization & Flexibility",
    emoji: "🧩",
    blurb: "Workflows, white-label, feature toggles.",
    weight: 2,
    items: [
      A("workflows", "Configurable workflows"),
      A("whitelabel", "White-label support"),
      A("per_client", "Per-client customization"),
      A("toggles", "Feature toggles"),
    ],
  },
  {
    id: "audit",
    order: 16,
    title: "Audit & Transparency",
    emoji: "📊",
    blurb: "Logs, exportability, admin tracking, compliance reports.",
    weight: 4,
    items: [
      A("full_audit", "Full audit logs"),
      A("export_logs", "Exportable logs"),
      A("admin_track", "Admin activity tracking"),
      A("compliance_report", "Compliance reporting"),
    ],
  },
  {
    id: "continuous",
    order: 17,
    title: "Continuous Monitoring (Post-Certification)",
    emoji: "🔁",
    blurb: "Re-scans, patching, vuln re-checks, renewal tracking.",
    weight: 3,
    items: [
      A("rescans", "Scheduled re-scans"),
      A("patching", "Patch management"),
      A("vuln_recheck", "Vulnerability re-checks"),
      A("renewal", "Compliance renewal tracking"),
    ],
  },
  {
    id: "ledger-final",
    order: 18,
    title: "Ledger System (Your Unique Edge)",
    emoji: "📜",
    blurb: "Every action logged with timestamp, stage, action, type, status, score impact.",
    weight: 5,
    items: [
      E("ledger_integrity", "Verify ledger integrity (hash chain)", "ledger-integrity", "Walk the hash chain end-to-end.", 4),
      A("ledger_export", "Export ledger to CSV/JSON"),
      A("ledger_review", "Review my full activity log"),
    ],
  },
];

export function findSection(id: string): ReadinessSection | undefined {
  return SECTIONS.find((s) => s.id === id);
}

export function findItem(sectionId: string, itemId: string): ReadinessItem | undefined {
  return findSection(sectionId)?.items.find((i) => i.id === itemId);
}

export const TOTAL_ITEMS = SECTIONS.reduce((acc, s) => acc + s.items.length, 0);
