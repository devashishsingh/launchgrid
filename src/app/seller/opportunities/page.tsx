"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SellerShell from "@/components/procurement/SellerShell";

interface Opportunity {
  id: string;
  vendorSlug: string;
  rfpId: string;
  requirementId: string;
  matchId: string;
  status: string;
  createdAt: string;
}

interface RFPData {
  id: string;
  businessProblem: string;
  featureRequirements: string;
  budget: string;
  timeline: string;
  supportExpectation: string;
  complianceNeeds: string;
  preferredDeployment: string;
  responseDeadline: string;
  status: string;
}

export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [rfps, setRfps] = useState<Record<string, RFPData>>({});
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/procurement/opportunities?vendorSlug=formstudio");
        const opps = await res.json();
        setOpportunities(opps);

        // Load RFP details
        const rfpMap: Record<string, RFPData> = {};
        const rfpIds = [...new Set(opps.map((o: Opportunity) => o.rfpId))];
        if (rfpIds.length > 0) {
          const rfpRes = await fetch("/api/procurement/rfps");
          const allRfps = await rfpRes.json();
          for (const rfp of allRfps) {
            rfpMap[rfp.id] = rfp;
          }
        }
        setRfps(rfpMap);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function updateStatus(id: string, status: string) {
    await fetch("/api/procurement/opportunities", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    setOpportunities((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
  }

  const statusColors: Record<string, string> = {
    new: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    viewed: "bg-white/10 text-muted border-white/10",
    interested: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    declined: "bg-red-500/10 text-red-400 border-red-500/20",
    response_submitted: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    shortlisted: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    evaluation_invited: "bg-accent/10 text-accent border-accent/20",
    won: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    lost: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <>
      <Navbar />
      <SellerShell activeTab="opportunities">
        <main className="py-12 px-6">
          <div className="max-w-5xl mx-auto space-y-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 heading-3d">
                Your <span className="gradient-text">Opportunities</span>
              </h1>
              <p className="text-muted">RFPs matched to your product. Only relevant requests reach you.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="card-3d border border-border rounded-2xl p-4 text-center">
                <p className="text-2xl font-bold text-accent">{opportunities.length}</p>
                <p className="text-xs text-muted mt-1">Total</p>
              </div>
              <div className="card-3d border border-border rounded-2xl p-4 text-center">
                <p className="text-2xl font-bold text-blue-400">{opportunities.filter((o) => o.status === "new").length}</p>
                <p className="text-xs text-muted mt-1">New</p>
              </div>
              <div className="card-3d border border-border rounded-2xl p-4 text-center">
                <p className="text-2xl font-bold text-emerald-400">{opportunities.filter((o) => o.status === "interested" || o.status === "response_submitted").length}</p>
                <p className="text-xs text-muted mt-1">Active</p>
              </div>
              <div className="card-3d border border-border rounded-2xl p-4 text-center">
                <p className="text-2xl font-bold text-amber-400">{opportunities.filter((o) => o.status === "shortlisted").length}</p>
                <p className="text-xs text-muted mt-1">Shortlisted</p>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-20 text-muted animate-pulse">Loading...</div>
            ) : opportunities.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-4xl mb-4">📥</div>
                <h3 className="text-lg font-semibold mb-2">No opportunities yet</h3>
                <p className="text-sm text-muted">When buyers issue RFPs that match your product, they&apos;ll appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {opportunities.map((opp) => {
                  const rfp = rfps[opp.rfpId];
                  const isExpanded = expandedId === opp.id;

                  return (
                    <div key={opp.id} className="card-3d border border-border rounded-2xl p-6">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium uppercase tracking-wider ${statusColors[opp.status] || ""}`}>
                              {opp.status.replace(/_/g, " ")}
                            </span>
                            <span className="text-xs text-muted">
                              Received {new Date(opp.createdAt).toLocaleDateString()}
                            </span>
                            {rfp && (
                              <span className="text-xs text-muted">
                                · Deadline: {new Date(rfp.responseDeadline).toLocaleDateString()}
                              </span>
                            )}
                          </div>

                          {rfp && (
                            <>
                              <p className="text-sm mb-2">{rfp.businessProblem.slice(0, 200)}{rfp.businessProblem.length > 200 ? "..." : ""}</p>
                              <div className="flex flex-wrap gap-2 text-[10px]">
                                {rfp.budget && <span className="px-2 py-0.5 rounded bg-white/5 text-muted border border-white/10">💰 {rfp.budget}</span>}
                                {rfp.timeline && <span className="px-2 py-0.5 rounded bg-white/5 text-muted border border-white/10">📅 {rfp.timeline}</span>}
                                {rfp.preferredDeployment && <span className="px-2 py-0.5 rounded bg-white/5 text-muted border border-white/10">☁️ {rfp.preferredDeployment}</span>}
                              </div>
                            </>
                          )}
                        </div>

                        <div className="flex gap-2 shrink-0 flex-wrap">
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : opp.id)}
                            className="text-xs bg-white/5 hover:bg-white/10 text-muted hover:text-foreground border border-white/10 px-4 py-2 rounded-lg transition-all"
                          >
                            {isExpanded ? "Close" : "View Details"}
                          </button>
                          {opp.status === "new" && (
                            <>
                              <button
                                onClick={() => updateStatus(opp.id, "interested")}
                                className="text-xs bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-4 py-2 rounded-lg transition-colors"
                              >
                                ✋ Show Interest
                              </button>
                              <button
                                onClick={() => updateStatus(opp.id, "declined")}
                                className="text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 px-4 py-2 rounded-lg transition-colors"
                              >
                                Decline
                              </button>
                            </>
                          )}
                          {(opp.status === "interested" || opp.status === "viewed") && (
                            <Link
                              href={`/seller/opportunity/${opp.id}`}
                              className="text-xs bg-accent/10 text-accent hover:bg-accent/20 px-4 py-2 rounded-lg transition-colors"
                            >
                              📝 Submit Response
                            </Link>
                          )}
                        </div>
                      </div>

                      {/* Expanded RFP details */}
                      {isExpanded && rfp && (
                        <div className="mt-6 pt-6 border-t border-border space-y-4">
                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                              <h4 className="text-xs text-accent font-medium mb-2">Business Problem</h4>
                              <p className="text-sm text-muted whitespace-pre-wrap">{rfp.businessProblem}</p>
                            </div>
                            {rfp.featureRequirements && (
                              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                <h4 className="text-xs text-accent font-medium mb-2">Feature Requirements</h4>
                                <p className="text-sm text-muted whitespace-pre-wrap">{rfp.featureRequirements}</p>
                              </div>
                            )}
                          </div>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {rfp.budget && <MiniCard label="Budget" value={rfp.budget} />}
                            {rfp.timeline && <MiniCard label="Timeline" value={rfp.timeline} />}
                            {rfp.supportExpectation && <MiniCard label="Support" value={rfp.supportExpectation} />}
                            {rfp.complianceNeeds && <MiniCard label="Compliance" value={rfp.complianceNeeds} />}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </SellerShell>
      <Footer />
    </>
  );
}

function MiniCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-3 rounded-lg bg-white/[0.02] border border-white/5">
      <p className="text-[10px] text-muted/60 uppercase tracking-wider">{label}</p>
      <p className="text-xs font-medium mt-0.5">{value}</p>
    </div>
  );
}
