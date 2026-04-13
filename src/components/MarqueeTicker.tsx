export default function MarqueeTicker() {
  const items = [
    // Core SaaS & Business
    "SaaS Platforms",
    "Developer Tools",
    "AI Products",
    "Cybersecurity",
    "Workflow Automation",
    "Legal Tech",
    "HR & Payroll",
    "Finance Tools",
    "CRM Solutions",
    "Analytics",
    "Compliance",
    "Procurement",
    // Marketing & Sales
    "Email Marketing",
    "SEO Tools",
    "Social Media Management",
    "Ad Tech",
    "Landing Page Builders",
    "Sales Enablement",
    "Lead Generation",
    "Affiliate Platforms",
    "Marketing Automation",
    "Conversion Optimization",
    // Design & Creative
    "Design Systems",
    "UI Kits",
    "Video Editing",
    "3D & Motion Graphics",
    "Stock Assets",
    "Brand Management",
    "Prototyping Tools",
    // Engineering & DevOps
    "API Management",
    "CI/CD Pipelines",
    "Cloud Infrastructure",
    "Monitoring & Observability",
    "Database Tools",
    "Low-Code Platforms",
    "No-Code Builders",
    "Testing & QA",
    "Version Control",
    "Container Orchestration",
    // AI & Data
    "Machine Learning",
    "Data Engineering",
    "NLP & Chatbots",
    "Computer Vision",
    "AI Agents",
    "Data Visualization",
    "Business Intelligence",
    "Predictive Analytics",
    // Communication & Collaboration
    "Team Communication",
    "Video Conferencing",
    "Project Management",
    "Knowledge Bases",
    "Document Collaboration",
    "Whiteboarding",
    "Internal Wikis",
    // E-Commerce & Payments
    "E-Commerce Platforms",
    "Payment Gateways",
    "Subscription Billing",
    "Invoice Management",
    "Tax Automation",
    "Checkout Optimization",
    // Industry Verticals
    "EdTech",
    "HealthTech",
    "PropTech",
    "FinTech",
    "AgriTech",
    "CleanTech",
    "InsurTech",
    "LogiTech",
    "FoodTech",
    "GovTech",
    // Productivity & Operations
    "Scheduling & Booking",
    "Form Builders",
    "Survey Tools",
    "Digital Signatures",
    "File Management",
    "Inventory Management",
    "Supply Chain",
    "Customer Support",
    "Helpdesk Software",
    "IT Service Management",
    // Security & Privacy
    "Identity & Access",
    "Encryption Tools",
    "Fraud Detection",
    "Vulnerability Scanning",
    "SIEM Solutions",
    "DLP & Data Privacy",
    "Endpoint Security",
    // Emerging Categories
    "Web3 & Blockchain",
    "AR / VR Tools",
    "IoT Platforms",
    "Edge Computing",
    "Robotics Software",
    "Digital Twins",
    "Quantum Computing",
    "Voice & Speech AI",
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
