"use client";

import { useState } from "react";
import Link from "next/link";

// ── Mock buyer session (MVP — no real auth) ──
export type MockRole = "public" | "buyer" | "seller" | "admin";

const DEMO_BUYER = {
  id: "demo-buyer-001",
  companyName: "Acme Corp",
  contactName: "Priya Sharma",
  email: "priya@acme.com",
  role: "buyer" as MockRole,
};

const DEMO_SELLER = {
  id: "demo-seller-001",
  vendorSlug: "formstudio",
  companyName: "FormStudio",
  contactName: "Vikram Patel",
  email: "vikram@formstudio.io",
  role: "seller" as MockRole,
};

export function useMockSession() {
  const [role, setRole] = useState<MockRole>("buyer");
  return {
    role,
    setRole,
    buyer: role === "buyer" ? DEMO_BUYER : null,
    seller: role === "seller" ? DEMO_SELLER : null,
    isAuthenticated: role !== "public",
  };
}

// ── Procurement Shell (wraps all procurement pages) ──

export default function ProcurementShell({
  children,
  activeTab,
}: {
  children: React.ReactNode;
  activeTab?: string;
}) {
  const { role } = useMockSession();

  const buyerTabs = [
    { key: "submit", label: "Submit Requirement", href: "/marketplace/submit-requirement" },
    { key: "responses", label: "Responses", href: "/marketplace/responses" },
    { key: "compare", label: "Compare", href: "/marketplace/compare" },
    { key: "shortlist", label: "Shortlist", href: "/marketplace/shortlist" },
  ];

  // Role gate — only buyers (and admins) can access procurement pages
  if (role !== "buyer" && role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card-3d border border-border rounded-2xl p-8 max-w-md text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-lg font-bold mb-2">Buyer Access Required</h2>
          <p className="text-sm text-muted mb-4">
            Procurement tools are available to verified buyers. Sign up for a buyer account to submit requirements and find matched vendors.
          </p>
          <Link href="/marketplace" className="text-sm text-accent hover:underline">
            ← Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Procurement navigation bar */}
      <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-hide">
            <Link
              href="/marketplace"
              className="text-xs px-3 py-1.5 rounded-lg text-muted hover:text-foreground transition-colors shrink-0"
            >
              ← Marketplace
            </Link>
            <div className="w-px h-4 bg-border mx-1" />
            <span className="text-xs px-2 py-1 bg-accent/10 text-accent rounded shrink-0">Buyer</span>
            <div className="w-px h-4 bg-border mx-1" />
            {buyerTabs.map((tab) => (
              <Link
                key={tab.key}
                href={tab.href}
                className={`text-xs px-3 py-1.5 rounded-lg transition-colors shrink-0 ${
                  activeTab === tab.key
                    ? "bg-accent/15 text-accent font-semibold border border-accent/30"
                    : "text-muted hover:text-foreground hover:bg-white/5"
                }`}
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
