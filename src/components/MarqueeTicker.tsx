export default function MarqueeTicker() {
  // What Blyoi actually delivers — trust signals, capabilities, and outcomes
  // that map 1:1 to the platform's value proposition.
  const items = [
    // Trust mark & certification
    "Blyoi Verified",
    "Certified Enterprise-Ready",
    "Blyoi Certified Pro",
    "Verifiable Certificate",
    "Embeddable Trust Badge",
    "Annual Re-certification",

    // Legal & contracting
    "Registered Indian Entity",
    "Contracts Signed Under Blyoi",
    "MSA · NDA · SOW Ready",
    "Procurement-Grade Paperwork",
    "DPDP Act Compliant",
    "GST-Compliant Invoicing",

    // Assessment domains
    "Source Code Review",
    "OWASP Top 10 Audit",
    "Dependency CVE Scan",
    "Authentication Hardening",
    "Data Privacy Assessment",
    "Performance Benchmarks",
    "SLA & Support Audit",
    "Open-Source Licensing Check",

    // Marketplace & buyer access
    "Curated Buyer Marketplace",
    "NLP-Powered Discovery",
    "RFP Management Suite",
    "Shortlisting & Scoring",
    "Contract Lifecycle Tools",
    "Enterprise Procurement Channel",

    // Creator economics & dashboard
    "Real-Time Earnings Tracker",
    "Transparent Payout Ledger",
    "Subscription & Commission Engine",
    "Tax Withholding Handled",
    "Audit-Ready Reconciliation",
    "Creator Command Center",

    // Ownership & exit
    "100% IP Retention",
    "Plain-English Agreement",
    "Built-In Dual Exit Path",
    "Happy-Exit Revenue Milestone",
    "Take-Your-Company-Public Path",
    "Walk-Away Anytime",

    // Manifesto
    "Independent. Incorporated. Indistinguishable.",
    "Ship Software · Skip Incorporation",
    "Built in India · For the World",
    "For Founders Without a Founder Title",
  ];

  // Double items for seamless infinite scroll
  const doubled = [...items, ...items];

  return (
    <div className="overflow-hidden py-4 border-y border-white/[0.05]" style={{
      background: 'rgba(255,255,255,0.01)',
    }}>
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={i} className="flex items-center gap-3 px-6 whitespace-nowrap">
            <span className="w-1.5 h-1.5 rounded-full bg-accent/60" />
            <span className="text-sm font-medium text-muted/70">{item}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
