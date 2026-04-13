"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProcurementShell from "@/components/procurement/ProcurementShell";
import { products } from "@/lib/marketplace-data";

interface ShortlistData {
  id: string;
  buyerId: string;
  rfpId: string;
  vendorSlug: string;
  responseId: string;
  notes: string;
  addedAt: string;
}

export default function ShortlistPage() {
  const [shortlist, setShortlist] = useState<ShortlistData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const rfpRes = await fetch("/api/procurement/rfps?buyerId=demo-buyer-001");
        const rfps = await rfpRes.json();
        if (rfps.length > 0) {
          const res = await fetch(`/api/procurement/responses?rfpId=${rfps[0].id}&type=shortlist`);
          setShortlist(await res.json());
        }
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  async function removeItem(id: string) {
    await fetch("/api/procurement/responses", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "remove_shortlist", id }),
    });
    setShortlist((prev) => prev.filter((s) => s.id !== id));
  }

  function getProduct(slug: string) {
    return products.find((p) => p.slug === slug);
  }

  return (
    <>
      <Navbar />
      <ProcurementShell activeTab="shortlist">
        <main className="py-12 px-6">
          <div className="max-w-5xl mx-auto space-y-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 heading-3d">
                Your <span className="gradient-text">Shortlist</span>
              </h1>
              <p className="text-muted">Vendors you&apos;ve shortlisted for further evaluation.</p>
            </div>

            {loading ? (
              <div className="text-center py-20 text-muted animate-pulse">Loading...</div>
            ) : shortlist.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-4xl mb-4">⭐</div>
                <h3 className="text-lg font-semibold mb-2">No vendors shortlisted yet</h3>
                <p className="text-sm text-muted mb-6">
                  Review vendor responses and add your favorites to the shortlist.
                </p>
                <Link href="/marketplace/responses" className="btn-premium px-8 py-3 rounded-full text-sm font-semibold text-white">
                  View Responses →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {shortlist.map((item) => {
                  const product = getProduct(item.vendorSlug);
                  return (
                    <div key={item.id} className="card-3d border border-border rounded-2xl p-6">
                      <div className="flex items-center gap-4">
                        <span className="text-3xl">{product?.logo || "📦"}</span>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold">{product?.name || item.vendorSlug}</h3>
                          <p className="text-xs text-muted">{product?.company} · {product?.country} · {product?.category}</p>
                          {product && (
                            <div className="flex items-center gap-3 mt-2 text-xs">
                              <span className="text-accent font-medium">🛡️ {product.trustScore.overall.toFixed(1)}/10</span>
                              <span className="text-muted">★ {product.rating} ({product.reviewCount} reviews)</span>
                              <span className="text-muted">Support: {product.supportScore}/100</span>
                            </div>
                          )}
                        </div>
                        <div className="flex gap-2 shrink-0 flex-wrap">
                          {product && (
                            <Link
                              href={`/marketplace/product/${product.slug}`}
                              className="text-xs bg-white/5 hover:bg-white/10 text-muted hover:text-foreground border border-white/10 px-4 py-2 rounded-lg transition-all"
                            >
                              View Profile
                            </Link>
                          )}
                          <button className="text-xs bg-accent/10 text-accent hover:bg-accent/20 px-4 py-2 rounded-lg transition-colors">
                            💬 Invite Discussion
                          </button>
                          <button className="text-xs bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 px-4 py-2 rounded-lg transition-colors">
                            🎬 Request Demo
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-xs bg-red-500/10 text-red-400 hover:bg-red-500/20 px-4 py-2 rounded-lg transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      {item.notes && (
                        <p className="text-xs text-muted mt-3 pt-3 border-t border-white/5">{item.notes}</p>
                      )}
                      <p className="text-[10px] text-muted/50 mt-2">
                        Added {new Date(item.addedAt).toLocaleDateString()}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </main>
      </ProcurementShell>
      <Footer />
    </>
  );
}
