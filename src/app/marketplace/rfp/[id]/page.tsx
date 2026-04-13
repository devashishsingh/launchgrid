"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProcurementShell from "@/components/procurement/ProcurementShell";

interface RFPData {
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
  responseDeadline: string;
  status: string;
  createdAt: string;
}

interface MatchData {
  id: string;
  vendorSlug: string;
  matchScore: number;
  matchReasons: string[];
  notified: boolean;
}

export default function RFPDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [rfp, setRfp] = useState<RFPData | null>(null);
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [rfpRes, matchRes] = await Promise.all([
          fetch(`/api/procurement/rfps?buyerId=demo-buyer-001`),
          fetch(`/api/procurement/matches?rfpId=${id}`),
        ]);
        const rfps = await rfpRes.json();
        setRfp(rfps.find((r: RFPData) => r.id === id) || null);
        setMatches(await matchRes.json());
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <ProcurementShell>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-pulse text-muted">Loading RFP...</div>
          </div>
        </ProcurementShell>
        <Footer />
      </>
    );
  }

  if (!rfp) {
    return (
      <>
        <Navbar />
        <ProcurementShell>
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="text-4xl">📄</div>
            <h2 className="text-xl font-semibold">RFP not found</h2>
          </div>
        </ProcurementShell>
        <Footer />
      </>
    );
  }

  const statusColors: Record<string, string> = {
    draft: "bg-white/10 text-muted border-white/10",
    issued: "bg-accent/10 text-accent border-accent/20",
    vendor_responses_pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    responses_received: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    shortlisted: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    closed: "bg-white/10 text-muted border-white/10",
  };

  return (
    <>
      <Navbar />
      <ProcurementShell>
        <main className="py-12 px-6">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-center gap-3 mb-3 flex-wrap">
                <span className={`text-[10px] px-2.5 py-1 rounded-full border font-medium uppercase tracking-wider ${statusColors[rfp.status] || ""}`}>
                  {rfp.status.replace(/_/g, " ")}
                </span>
                <span className="text-xs text-muted">
                  Created {new Date(rfp.createdAt).toLocaleDateString()}
                </span>
                <span className="text-xs text-muted">
                  · Deadline: {new Date(rfp.responseDeadline).toLocaleDateString()}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">RFP Details</h1>
            </div>

            {/* RFP Content */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="card-3d border border-border rounded-2xl p-6">
                  <h3 className="text-sm font-semibold text-accent mb-3">Business Problem</h3>
                  <p className="text-sm text-muted whitespace-pre-wrap">{rfp.businessProblem}</p>
                </div>

                {rfp.featureRequirements && (
                  <div className="card-3d border border-border rounded-2xl p-6">
                    <h3 className="text-sm font-semibold text-accent mb-3">Feature Requirements</h3>
                    <p className="text-sm text-muted whitespace-pre-wrap">{rfp.featureRequirements}</p>
                  </div>
                )}

                {rfp.integrationNeeds && (
                  <div className="card-3d border border-border rounded-2xl p-6">
                    <h3 className="text-sm font-semibold text-accent mb-3">Integration Needs</h3>
                    <p className="text-sm text-muted">{rfp.integrationNeeds}</p>
                  </div>
                )}

                {rfp.notes && (
                  <div className="card-3d border border-border rounded-2xl p-6">
                    <h3 className="text-sm font-semibold text-accent mb-3">Additional Notes</h3>
                    <p className="text-sm text-muted whitespace-pre-wrap">{rfp.notes}</p>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="card-3d border border-border rounded-2xl p-5 space-y-3">
                  <h3 className="text-xs uppercase tracking-wider text-muted font-medium">Quick Info</h3>
                  {rfp.budget && <InfoRow label="Budget" value={rfp.budget} />}
                  {rfp.timeline && <InfoRow label="Timeline" value={rfp.timeline} />}
                  {rfp.preferredDeployment && <InfoRow label="Deployment" value={rfp.preferredDeployment} />}
                  {rfp.supportExpectation && <InfoRow label="Support" value={rfp.supportExpectation} />}
                  {rfp.complianceNeeds && <InfoRow label="Compliance" value={rfp.complianceNeeds} />}
                </div>

                <div className="card-3d border border-border rounded-2xl p-5">
                  <h3 className="text-xs uppercase tracking-wider text-muted font-medium mb-3">
                    Matched Vendors ({matches.length})
                  </h3>
                  {matches.length > 0 ? (
                    <div className="space-y-2">
                      {matches.map((m) => (
                        <div key={m.id} className="flex items-center justify-between py-1.5">
                          <span className="text-sm">{m.vendorSlug}</span>
                          <span className={`text-xs font-bold ${m.matchScore >= 70 ? "text-emerald-400" : "text-accent"}`}>
                            {m.matchScore}%
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted">No matches yet.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/marketplace/responses"
                className="btn-premium px-8 py-3 rounded-full text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all"
              >
                View Responses →
              </Link>
              <Link
                href={`/marketplace/requirement/${rfp.requirementId}`}
                className="px-8 py-3 rounded-full text-sm border border-white/10 text-muted hover:text-foreground transition-colors"
              >
                Back to Requirement
              </Link>
            </div>
          </div>
        </main>
      </ProcurementShell>
      <Footer />
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2 text-sm">
      <span className="text-muted">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}
