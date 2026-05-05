"use client";

import { useState } from "react";
import Link from "next/link";

type SellerRole = "public" | "seller" | "admin";

export default function SellerShell({
  children,
  activeTab,
}: {
  children: React.ReactNode;
  activeTab?: string;
}) {
  // Mock seller session — default to seller for demo
  const [role] = useState<SellerRole>("seller");

  const tabs = [
    { key: "opportunities", label: "Opportunities", href: "/seller/opportunities" },
    { key: "responses", label: "My Responses", href: "/seller/responses" },
    { key: "shortlisted", label: "Shortlisted", href: "/seller/shortlisted" },
    { key: "demos", label: "Demos", href: "/seller/demos" },
  ];

  if (role !== "seller" && role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card-3d border border-border rounded-2xl p-8 max-w-md text-center">
          <div className="text-4xl mb-4">🔒</div>
          <h2 className="text-lg font-bold mb-2">Seller Access Required</h2>
          <p className="text-sm text-muted mb-4">
            The seller portal is available to verified marketplace vendors.
            List your product on LaunchBox to access RFP opportunities.
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
            <span className="text-xs px-3 py-1.5 text-amber-400 font-medium shrink-0">Seller Portal</span>
            <div className="w-px h-4 bg-border mx-1" />
            {tabs.map((tab) => (
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
