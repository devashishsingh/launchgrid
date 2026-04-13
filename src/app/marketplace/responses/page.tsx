"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProcurementShell from "@/components/procurement/ProcurementShell";
import { products } from "@/lib/marketplace-data";

interface ResponseData {
  id: string;
  rfpId: string;
  vendorSlug: string;
  opportunityId: string;
  proposalSummary: string;
  estimatedPricing: string;
  estimatedTimeline: string;
  customizability: string;
  demoLink: string;
  documents: string[];
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  additionalNotes: string;
  submittedAt: string;
}

interface RFPData {
  id: string;
  requirementId: string;
  status: string;
  createdAt: string;
}

interface MatchData {
  id: string;
  vendorSlug: string;
  matchScore: number;
  matchReasons: string[];
}

export default function ResponsesPage() {
  const [rfps, setRfps] = useState<RFPData[]>([]);
  const [selectedRfp, setSelectedRfp] = useState<string | null>(null);
  const [responses, setResponses] = useState<ResponseData[]>([]);
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [loading, setLoading] = useState(true);
  const [shortlisting, setShortlisting] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/procurement/rfps?buyerId=demo-buyer-001");
        const data = await res.json();
        setRfps(data);
        if (data.length > 0) setSelectedRfp(data[0].id);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    if (!selectedRfp) return;
    async function loadResponses() {
      const [respRes, matchRes] = await Promise.all([
        fetch(`/api/procurement/responses?rfpId=${selectedRfp}`),
        fetch(`/api/procurement/matches?rfpId=${selectedRfp}`),
      ]);
      setResponses(await respRes.json());
      setMatches(await matchRes.json());
    }
    loadResponses();
  }, [selectedRfp]);

  function getProduct(slug: string) {
    return products.find((p) => p.slug === slug);
  }

  function getMatch(slug: string) {
    return matches.find((m) => m.vendorSlug === slug);
  }

  async function shortlist(resp: ResponseData) {
    setShortlisting(resp.id);
    try {
      await fetch("/api/procurement/responses", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "shortlist",
          buyerId: "demo-buyer-001",
          rfpId: resp.rfpId,
          vendorSlug: resp.vendorSlug,
          responseId: resp.id,
          notes: "",
        }),
      });
    } catch {
      // silent
    } finally {
      setShortlisting(null);
    }
  }

  // Show matched vendors even if no responses yet
  const vendorSlugs = matches.length > 0
    ? [...new Set([...matches.map((m) => m.vendorSlug), ...responses.map((r) => r.vendorSlug)])]
    : responses.map((r) => r.vendorSlug);

  return (
    <>
      <Navbar />
      <ProcurementShell activeTab="responses">
        <main className="py-12 px-6">
          <div className="max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 heading-3d">
                Response <span className="gradient-text">Center</span>
              </h1>
              <p className="text-muted">Review vendor responses, compare proposals, and build your shortlist.</p>
            </div>

            {/* RFP selector */}
            {rfps.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {rfps.map((rfp) => (
                  <button
                    key={rfp.id}
                    onClick={() => setSelectedRfp(rfp.id)}
                    className={`text-xs px-4 py-2 rounded-full border transition-all ${
                      selectedRfp === rfp.id
                        ? "bg-accent/15 text-accent border-accent/30 font-semibold"
                        : "bg-white/5 text-muted border-white/10 hover:border-white/20"
                    }`}
                  >
                    RFP #{rfp.id.slice(0, 8)}
                  </button>
                ))}
              </div>
            )}

            {loading ? (
              <div className="text-center py-20 text-muted animate-pulse">Loading...</div>
            ) : rfps.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-4xl mb-4">📋</div>
                <h3 className="text-lg font-semibold mb-2">No RFPs issued yet</h3>
                <p className="text-sm text-muted mb-6">Submit a requirement and issue an RFP to start receiving vendor responses.</p>
                <Link href="/marketplace/submit-requirement" className="btn-premium px-8 py-3 rounded-full text-sm font-semibold text-white">
                  Submit Requirement →
                </Link>
              </div>
            ) : (
              <>
                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <StatCard label="Matched Vendors" value={matches.length} color="text-accent" />
                  <StatCard label="Responses Received" value={responses.length} color="text-emerald-400" />
                  <StatCard label="Pending" value={Math.max(0, matches.length - responses.length)} color="text-amber-400" />
                  <StatCard label="Avg Match Score" value={matches.length > 0 ? `${Math.round(matches.reduce((s, m) => s + m.matchScore, 0) / matches.length)}%` : "—"} color="text-purple-400" />
                </div>

                {/* Vendor cards */}
                <div className="space-y-4">
                  {vendorSlugs.map((slug) => {
                    const product = getProduct(slug);
                    const match = getMatch(slug);
                    const resp = responses.find((r) => r.vendorSlug === slug);

                    return (
                      <div key={slug} className="card-3d border border-border rounded-2xl p-6">
                        <div className="flex flex-col lg:flex-row gap-6">
                          {/* Vendor info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-3">
                              <span className="text-2xl">{product?.logo || "📦"}</span>
                              <div>
                                <div className="flex items-center gap-2 flex-wrap">
                                  <h3 className="font-semibold">{product?.name || slug}</h3>
                                  {match && (
                                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                                      match.matchScore >= 70
                                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                        : "bg-accent/10 text-accent border border-accent/20"
                                    }`}>
                                      {match.matchScore}% match
                                    </span>
                                  )}
                                  {resp && (
                                    <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                      ✓ Response received
                                    </span>
                                  )}
                                  {!resp && match && (
                                    <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                      Awaiting response
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-muted">{product?.company} · {product?.country} · {product?.category}</p>
                              </div>
                            </div>

                            {/* Match reasons */}
                            {match && match.matchReasons.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mb-3">
                                {match.matchReasons.map((r, i) => (
                                  <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-muted border border-white/10">{r}</span>
                                ))}
                              </div>
                            )}

                            {/* Response details */}
                            {resp && (
                              <div className="space-y-3">
                                <p className="text-sm text-muted">{resp.proposalSummary}</p>
                                <div className="grid sm:grid-cols-3 gap-3">
                                  {resp.estimatedPricing && (
                                    <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                                      <p className="text-[10px] text-muted/60 uppercase tracking-wider">Pricing</p>
                                      <p className="text-xs font-medium mt-0.5">{resp.estimatedPricing}</p>
                                    </div>
                                  )}
                                  {resp.estimatedTimeline && (
                                    <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                                      <p className="text-[10px] text-muted/60 uppercase tracking-wider">Timeline</p>
                                      <p className="text-xs font-medium mt-0.5">{resp.estimatedTimeline}</p>
                                    </div>
                                  )}
                                  {resp.customizability && (
                                    <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
                                      <p className="text-[10px] text-muted/60 uppercase tracking-wider">Customization</p>
                                      <p className="text-xs font-medium mt-0.5">{resp.customizability}</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="flex flex-col gap-2 shrink-0 lg:w-40">
                            {product && (
                              <Link
                                href={`/marketplace/product/${product.slug}`}
                                className="text-xs text-center bg-white/5 text-muted hover:text-foreground border border-white/10 hover:border-white/20 px-4 py-2 rounded-lg transition-all"
                              >
                                View Product
                              </Link>
                            )}
                            {resp && (
                              <>
                                <button
                                  onClick={() => shortlist(resp)}
                                  disabled={shortlisting === resp.id}
                                  className="text-xs bg-accent/10 text-accent hover:bg-accent/20 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                                >
                                  {shortlisting === resp.id ? "Adding..." : "⭐ Shortlist"}
                                </button>
                                <Link
                                  href="/marketplace/compare"
                                  className="text-xs text-center bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 px-4 py-2 rounded-lg transition-colors"
                                >
                                  📊 Compare
                                </Link>
                                {resp.demoLink && (
                                  <a
                                    href={resp.demoLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-xs text-center bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-4 py-2 rounded-lg transition-colors"
                                  >
                                    🎬 View Demo
                                  </a>
                                )}
                              </>
                            )}
                          </div>
                        </div>

                        {/* Contact info (if response) */}
                        {resp && resp.contactName && (
                          <div className="mt-4 pt-4 border-t border-white/5 flex flex-wrap gap-4 text-xs text-muted">
                            <span>👤 {resp.contactName}</span>
                            {resp.contactEmail && <span>✉️ {resp.contactEmail}</span>}
                            {resp.contactPhone && <span>📞 {resp.contactPhone}</span>}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </main>
      </ProcurementShell>
      <Footer />
    </>
  );
}

function StatCard({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <div className="card-3d border border-border rounded-2xl p-4 text-center">
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
      <p className="text-xs text-muted mt-1">{label}</p>
    </div>
  );
}
