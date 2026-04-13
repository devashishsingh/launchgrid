"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProcurementShell from "@/components/procurement/ProcurementShell";

interface RequirementData {
  id: string;
  title: string;
  problemDescription: string;
  featureRequirements: string;
  budgetRange: string;
  deploymentPreference: string;
  region: string;
  urgency: string;
  timeline: string;
  complianceNeeds: string;
  supportExpectation: string;
  status: string;
  createdAt: string;
}

interface ParsedData {
  likelyCategory: string;
  possibleSoftwareTypes: string[];
  businessFunctionTags: string[];
  pricingBand: string;
  deploymentPreference: string;
  region: string;
  urgency: string;
  complianceFlags: string[];
  confidence: number;
}

interface MatchData {
  id: string;
  vendorSlug: string;
  matchScore: number;
  matchReasons: string[];
  categoryFit: number;
  featureFit: number;
  geographyFit: number;
  supportFit: number;
  trustFit: number;
}

export default function RequirementDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [requirement, setRequirement] = useState<RequirementData | null>(null);
  const [parsed, setParsed] = useState<ParsedData | null>(null);
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [issuingRFP, setIssuingRFP] = useState(false);
  const [rfpId, setRfpId] = useState<string | null>(null);
  const [showRFPForm, setShowRFPForm] = useState(false);
  const [rfpNotes, setRfpNotes] = useState("");
  const [rfpIntegration, setRfpIntegration] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const [reqRes, matchRes] = await Promise.all([
          fetch(`/api/procurement/requirements?buyerId=demo-buyer-001`),
          fetch(`/api/procurement/matches?requirementId=${id}`),
        ]);
        const reqs = await reqRes.json();
        const req = reqs.find((r: RequirementData) => r.id === id);
        setRequirement(req || null);

        // Load parsed data from requirement
        if (req) {
          const parsedRes = await fetch(`/api/procurement/requirements?buyerId=demo-buyer-001`);
          const allReqs = await parsedRes.json();
          // The parsed data was returned during submission — for now re-parse is not needed
          // We'll display what we have from the requirement itself
        }

        const m = await matchRes.json();
        setMatches(m);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function issueRFP() {
    if (!requirement) return;
    setIssuingRFP(true);
    try {
      // Create RFP
      const createRes = await fetch("/api/procurement/rfps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requirementId: requirement.id,
          buyerId: "demo-buyer-001",
          integrationNeeds: rfpIntegration,
          notes: rfpNotes,
          responseDeadline: new Date(Date.now() + 14 * 86400000).toISOString(),
        }),
      });
      const rfp = await createRes.json();

      // Issue it (triggers match engine + vendor notifications)
      await fetch("/api/procurement/rfps", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: rfp.id, status: "issued" }),
      });

      setRfpId(rfp.id);

      // Reload matches
      const matchRes = await fetch(`/api/procurement/matches?rfpId=${rfp.id}`);
      setMatches(await matchRes.json());
    } catch {
      // silent
    } finally {
      setIssuingRFP(false);
      setShowRFPForm(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <ProcurementShell>
          <div className="flex items-center justify-center min-h-[60vh]">
            <div className="animate-pulse text-muted">Loading requirement...</div>
          </div>
        </ProcurementShell>
        <Footer />
      </>
    );
  }

  if (!requirement) {
    return (
      <>
        <Navbar />
        <ProcurementShell>
          <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <div className="text-4xl">📋</div>
            <h2 className="text-xl font-semibold">Requirement not found</h2>
            <Link href="/marketplace/submit-requirement" className="text-sm text-accent hover:underline">
              Submit a new requirement →
            </Link>
          </div>
        </ProcurementShell>
        <Footer />
      </>
    );
  }

  const statusColors: Record<string, string> = {
    submitted: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    parsing: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    parsed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    matched: "bg-accent/10 text-accent border-accent/20",
    rfp_issued: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    responses_received: "bg-teal-500/10 text-teal-400 border-teal-500/20",
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
                <span className={`text-[10px] px-2.5 py-1 rounded-full border font-medium uppercase tracking-wider ${statusColors[requirement.status] || statusColors.submitted}`}>
                  {requirement.status.replace(/_/g, " ")}
                </span>
                <span className="text-xs text-muted">
                  Submitted {new Date(requirement.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">{requirement.title}</h1>
              <p className="text-muted">{requirement.problemDescription}</p>
            </div>

            {/* Details grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {requirement.budgetRange && <DetailCard icon="💰" label="Budget" value={requirement.budgetRange} />}
              {requirement.deploymentPreference && <DetailCard icon="☁️" label="Deployment" value={requirement.deploymentPreference} />}
              {requirement.region && <DetailCard icon="🌍" label="Region" value={requirement.region} />}
              {requirement.urgency && <DetailCard icon="⏱️" label="Urgency" value={requirement.urgency} />}
              {requirement.timeline && <DetailCard icon="📅" label="Timeline" value={requirement.timeline} />}
              {requirement.complianceNeeds && <DetailCard icon="🔒" label="Compliance" value={requirement.complianceNeeds} />}
              {requirement.supportExpectation && <DetailCard icon="🎧" label="Support" value={requirement.supportExpectation} />}
            </div>

            {requirement.featureRequirements && (
              <div className="card-3d border border-border rounded-2xl p-6">
                <h3 className="text-sm font-semibold mb-2">Feature Requirements</h3>
                <p className="text-sm text-muted whitespace-pre-wrap">{requirement.featureRequirements}</p>
              </div>
            )}

            {/* MATCHES */}
            {matches.length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <span className="text-accent">🎯</span>
                  Matched Vendors ({matches.length})
                </h2>
                <div className="grid gap-3">
                  {matches.map((m) => (
                    <div key={m.id} className="card-3d border border-border rounded-2xl p-5">
                      <div className="flex items-center justify-between gap-4 flex-wrap">
                        <div>
                          <h3 className="font-semibold text-sm">{m.vendorSlug}</h3>
                          <div className="flex flex-wrap gap-2 mt-1.5">
                            {m.matchReasons.slice(0, 3).map((r, i) => (
                              <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-muted border border-white/10">{r}</span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className={`text-2xl font-bold ${m.matchScore >= 70 ? "text-emerald-400" : m.matchScore >= 50 ? "text-accent" : "text-amber-400"}`}>
                            {m.matchScore}%
                          </div>
                          <p className="text-[10px] text-muted">match score</p>
                        </div>
                      </div>
                      {/* Score breakdown */}
                      <div className="mt-3 pt-3 border-t border-white/5 grid grid-cols-5 gap-2 text-center">
                        <MiniScore label="Category" value={m.categoryFit} />
                        <MiniScore label="Feature" value={m.featureFit} />
                        <MiniScore label="Geography" value={m.geographyFit} />
                        <MiniScore label="Support" value={m.supportFit} />
                        <MiniScore label="Trust" value={m.trustFit} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* RFP Actions */}
            {!rfpId && (
              <div className="card-elevated rounded-2xl p-8 gradient-border">
                <div className="relative z-10">
                  <h2 className="text-lg font-semibold mb-2">Ready to issue an RFP?</h2>
                  <p className="text-sm text-muted mb-6">
                    Convert this requirement into a structured RFP. Only matched and eligible vendors 
                    will receive your request — no spam, no noise.
                  </p>

                  {!showRFPForm ? (
                    <button
                      onClick={() => setShowRFPForm(true)}
                      className="btn-premium px-8 py-3 rounded-full text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all"
                    >
                      📄 Issue RFP
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Integration Needs (optional)</label>
                        <input
                          type="text"
                          value={rfpIntegration}
                          onChange={(e) => setRfpIntegration(e.target.value)}
                          placeholder="e.g. Must integrate with Slack, SAP, or Tally"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Additional Notes (optional)</label>
                        <textarea
                          value={rfpNotes}
                          onChange={(e) => setRfpNotes(e.target.value)}
                          rows={3}
                          placeholder="Anything else vendors should know..."
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50 transition-all resize-none"
                        />
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={issueRFP}
                          disabled={issuingRFP}
                          className="btn-premium px-8 py-3 rounded-full text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                        >
                          {issuingRFP ? "Issuing RFP & matching vendors..." : "🚀 Issue RFP Now"}
                        </button>
                        <button
                          onClick={() => setShowRFPForm(false)}
                          className="px-6 py-3 rounded-full text-sm border border-white/10 text-muted hover:text-foreground transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {rfpId && (
              <div className="card-elevated rounded-2xl p-8 text-center">
                <div className="text-4xl mb-3">🚀</div>
                <h2 className="text-xl font-bold mb-2">RFP Issued Successfully</h2>
                <p className="text-muted text-sm mb-6">
                  {matches.length} vendors have been notified. Responses will appear in your dashboard.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link
                    href="/marketplace/responses"
                    className="btn-premium px-8 py-3 rounded-full text-sm font-semibold text-white"
                  >
                    View Response Center →
                  </Link>
                  <Link
                    href={`/marketplace/rfp/${rfpId}`}
                    className="px-8 py-3 rounded-full text-sm font-semibold border border-accent/30 text-accent hover:bg-accent/10 transition-colors"
                  >
                    View RFP Details
                  </Link>
                </div>
              </div>
            )}
          </div>
        </main>
      </ProcurementShell>
      <Footer />
    </>
  );
}

function DetailCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl bg-card border border-border">
      <span className="text-lg">{icon}</span>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted/60 mb-0.5">{label}</p>
        <p className="text-sm font-medium capitalize">{value}</p>
      </div>
    </div>
  );
}

function MiniScore({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <p className={`text-sm font-bold ${value >= 70 ? "text-emerald-400" : value >= 50 ? "text-accent" : "text-amber-400"}`}>{value}</p>
      <p className="text-[9px] text-muted">{label}</p>
    </div>
  );
}
