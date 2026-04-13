"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SellerShell from "@/components/procurement/SellerShell";

interface ResponseData {
  id: string;
  rfpId: string;
  vendorSlug: string;
  proposalSummary: string;
  estimatedPricing: string;
  estimatedTimeline: string;
  customizability: string;
  demoLink: string;
  contactName: string;
  submittedAt: string;
}

export default function SellerResponsesPage() {
  const [responses, setResponses] = useState<ResponseData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/procurement/responses?vendorSlug=formstudio");
        setResponses(await res.json());
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <>
      <Navbar />
      <SellerShell activeTab="responses">
        <main className="py-12 px-6">
          <div className="max-w-5xl mx-auto space-y-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 heading-3d">
                My <span className="gradient-text">Responses</span>
              </h1>
              <p className="text-muted">Track all proposals you&apos;ve submitted to buyer RFPs.</p>
            </div>

            {loading ? (
              <div className="text-center py-20 text-muted animate-pulse">Loading...</div>
            ) : responses.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-4xl mb-4">📤</div>
                <h3 className="text-lg font-semibold mb-2">No responses submitted yet</h3>
                <p className="text-sm text-muted">When you respond to RFP opportunities, they&apos;ll appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {responses.map((resp) => (
                  <div key={resp.id} className="card-3d border border-border rounded-2xl p-6">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            ✓ Submitted
                          </span>
                          <span className="text-xs text-muted">
                            {new Date(resp.submittedAt).toLocaleDateString()}
                          </span>
                          <span className="text-xs text-muted">
                            · RFP #{resp.rfpId.slice(0, 8)}
                          </span>
                        </div>
                        <p className="text-sm mb-3">{resp.proposalSummary.slice(0, 200)}{resp.proposalSummary.length > 200 ? "..." : ""}</p>
                        <div className="flex flex-wrap gap-3 text-xs">
                          {resp.estimatedPricing && <span className="text-muted">💰 {resp.estimatedPricing}</span>}
                          {resp.estimatedTimeline && <span className="text-muted">📅 {resp.estimatedTimeline}</span>}
                          {resp.customizability && <span className="text-muted">🔧 {resp.customizability}</span>}
                          {resp.demoLink && (
                            <a href={resp.demoLink} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                              🎬 Demo ↗
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </main>
      </SellerShell>
      <Footer />
    </>
  );
}
