"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProcurementShell from "@/components/procurement/ProcurementShell";
import { products, type MarketplaceProduct } from "@/lib/marketplace-data";

interface MatchData {
  vendorSlug: string;
  matchScore: number;
  categoryFit: number;
  featureFit: number;
  geographyFit: number;
  supportFit: number;
  trustFit: number;
}

interface ResponseData {
  vendorSlug: string;
  estimatedPricing: string;
  estimatedTimeline: string;
  customizability: string;
  demoLink: string;
}

export default function ComparePage() {
  const [rfpId, setRfpId] = useState<string | null>(null);
  const [matches, setMatches] = useState<MatchData[]>([]);
  const [responses, setResponses] = useState<ResponseData[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const rfpRes = await fetch("/api/procurement/rfps?buyerId=demo-buyer-001");
        const rfps = await rfpRes.json();
        if (rfps.length > 0) {
          const id = rfps[0].id;
          setRfpId(id);
          const [matchRes, respRes] = await Promise.all([
            fetch(`/api/procurement/matches?rfpId=${id}`),
            fetch(`/api/procurement/responses?rfpId=${id}`),
          ]);
          const m = await matchRes.json();
          setMatches(m);
          setResponses(await respRes.json());
          setSelected(m.slice(0, 4).map((x: MatchData) => x.vendorSlug));
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function getProduct(slug: string): MarketplaceProduct | undefined {
    return products.find((p) => p.slug === slug);
  }

  function toggle(slug: string) {
    setSelected((prev) =>
      prev.includes(slug)
        ? prev.filter((s) => s !== slug)
        : prev.length < 5
          ? [...prev, slug]
          : prev
    );
  }

  const compareVendors = selected.map((slug) => {
    const product = getProduct(slug);
    const match = matches.find((m) => m.vendorSlug === slug);
    const resp = responses.find((r) => r.vendorSlug === slug);
    return { slug, product, match, resp };
  }).filter((v) => v.product);

  return (
    <>
      <Navbar />
      <ProcurementShell activeTab="compare">
        <main className="py-12 px-6">
          <div className="max-w-7xl mx-auto space-y-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 heading-3d">
                Compare <span className="gradient-text">Vendors</span>
              </h1>
              <p className="text-muted">Side-by-side comparison of matched vendors. Select up to 5.</p>
            </div>

            {loading ? (
              <div className="text-center py-20 text-muted animate-pulse">Loading...</div>
            ) : matches.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-4xl mb-4">📊</div>
                <h3 className="text-lg font-semibold mb-2">No vendors to compare</h3>
                <p className="text-sm text-muted mb-6">Issue an RFP first to get matched vendors.</p>
                <Link href="/marketplace/submit-requirement" className="btn-premium px-8 py-3 rounded-full text-sm font-semibold text-white">
                  Submit Requirement →
                </Link>
              </div>
            ) : (
              <>
                {/* Vendor selector */}
                <div className="flex flex-wrap gap-2">
                  {matches.map((m) => {
                    const product = getProduct(m.vendorSlug);
                    return (
                      <button
                        key={m.vendorSlug}
                        onClick={() => toggle(m.vendorSlug)}
                        className={`text-xs px-3 py-2 rounded-lg border transition-all flex items-center gap-2 ${
                          selected.includes(m.vendorSlug)
                            ? "bg-accent/15 text-accent border-accent/30 font-semibold"
                            : "bg-white/5 text-muted border-white/10 hover:border-white/20"
                        }`}
                      >
                        <span>{product?.logo}</span>
                        {product?.name || m.vendorSlug}
                        <span className="text-[10px] opacity-60">{m.matchScore}%</span>
                      </button>
                    );
                  })}
                </div>

                {/* Comparison table */}
                {compareVendors.length > 0 && (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 text-xs text-muted uppercase tracking-wider font-medium w-40">Criteria</th>
                          {compareVendors.map((v) => (
                            <th key={v.slug} className="text-center py-3 px-4 min-w-[180px]">
                              <div className="flex flex-col items-center gap-1">
                                <span className="text-xl">{v.product?.logo}</span>
                                <span className="font-semibold text-sm">{v.product?.name}</span>
                                <span className="text-[10px] text-muted">{v.product?.company}</span>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <CompareRow label="Match Score" vendors={compareVendors} render={(v) => (
                          <span className={`text-lg font-bold ${(v.match?.matchScore || 0) >= 70 ? "text-emerald-400" : "text-accent"}`}>
                            {v.match?.matchScore || "—"}%
                          </span>
                        )} />
                        <CompareRow label="Category" vendors={compareVendors} render={(v) => v.product?.category || "—"} />
                        <CompareRow label="Pricing" vendors={compareVendors} render={(v) => v.resp?.estimatedPricing || v.product?.pricing || "—"} />
                        <CompareRow label="Deployment" vendors={compareVendors} render={(v) => v.product?.deployment || "—"} />
                        <CompareRow label="Trust Score" vendors={compareVendors} render={(v) => (
                          <span className="font-bold text-accent">{v.product?.trustScore.overall.toFixed(1)}/10</span>
                        )} />
                        <CompareRow label="Support Score" vendors={compareVendors} render={(v) => `${v.product?.supportScore || "—"}/100`} />
                        <CompareRow label="Rating" vendors={compareVendors} render={(v) => (
                          <span>★ {v.product?.rating} <span className="text-muted">({v.product?.reviewCount})</span></span>
                        )} />
                        <CompareRow label="Customizable" vendors={compareVendors} render={(v) => v.product?.customizable ? "✅ Yes" : "❌ No"} />
                        <CompareRow label="Country" vendors={compareVendors} render={(v) => v.product?.country || "—"} />
                        <CompareRow label="Category Fit" vendors={compareVendors} render={(v) => <FitBar value={v.match?.categoryFit || 0} />} />
                        <CompareRow label="Feature Fit" vendors={compareVendors} render={(v) => <FitBar value={v.match?.featureFit || 0} />} />
                        <CompareRow label="Geo Fit" vendors={compareVendors} render={(v) => <FitBar value={v.match?.geographyFit || 0} />} />
                        <CompareRow label="Support Fit" vendors={compareVendors} render={(v) => <FitBar value={v.match?.supportFit || 0} />} />
                        <CompareRow label="Trust Fit" vendors={compareVendors} render={(v) => <FitBar value={v.match?.trustFit || 0} />} />
                        {compareVendors.some((v) => v.resp) && (
                          <>
                            <CompareRow label="Timeline" vendors={compareVendors} render={(v) => v.resp?.estimatedTimeline || "—"} />
                            <CompareRow label="Customizability" vendors={compareVendors} render={(v) => v.resp?.customizability || "—"} />
                            <CompareRow label="Demo" vendors={compareVendors} render={(v) =>
                              v.resp?.demoLink
                                ? <a href={v.resp.demoLink} target="_blank" rel="noopener noreferrer" className="text-accent hover:underline text-xs">View Demo ↗</a>
                                : "—"
                            } />
                          </>
                        )}
                        <tr className="border-t border-border">
                          <td className="py-3 px-4 text-xs text-muted font-medium">Actions</td>
                          {compareVendors.map((v) => (
                            <td key={v.slug} className="text-center py-3 px-4">
                              <div className="flex flex-col gap-1.5">
                                <Link
                                  href={`/marketplace/product/${v.slug}`}
                                  className="text-[10px] px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 text-muted hover:text-foreground transition-colors"
                                >
                                  View Profile
                                </Link>
                                <button className="text-[10px] px-3 py-1.5 rounded bg-accent/10 text-accent hover:bg-accent/20 transition-colors">
                                  ⭐ Shortlist
                                </button>
                              </div>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </ProcurementShell>
      <Footer />
    </>
  );
}

interface VendorInfo {
  slug: string;
  product?: MarketplaceProduct;
  match?: MatchData;
  resp?: ResponseData;
}

function CompareRow({ label, vendors, render }: { label: string; vendors: VendorInfo[]; render: (v: VendorInfo) => React.ReactNode }) {
  return (
    <tr className="border-b border-white/5 hover:bg-white/[0.01]">
      <td className="py-3 px-4 text-xs text-muted font-medium">{label}</td>
      {vendors.map((v) => (
        <td key={v.slug} className="text-center py-3 px-4 text-xs">{render(v)}</td>
      ))}
    </tr>
  );
}

function FitBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-2 justify-center">
      <div className="w-16 h-1.5 bg-white/10 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${value >= 70 ? "bg-emerald-400" : value >= 50 ? "bg-accent" : "bg-amber-400"}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="text-[10px] text-muted">{value}</span>
    </div>
  );
}
