"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SellerShell from "@/components/procurement/SellerShell";

interface ShortlistData {
  id: string;
  rfpId: string;
  vendorSlug: string;
  matchScore: number;
  shortlistedAt: string;
}

export default function SellerShortlistedPage() {
  const [items, setItems] = useState<ShortlistData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/procurement/responses?type=shortlist&vendorSlug=formstudio");
        setItems(await res.json());
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
      <SellerShell activeTab="shortlisted">
        <main className="py-12 px-6">
          <div className="max-w-5xl mx-auto space-y-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 heading-3d">
                <span className="gradient-text">Shortlisted</span> Status
              </h1>
              <p className="text-muted">
                See which of your proposals have been shortlisted by buyers.
              </p>
            </div>

            {loading ? (
              <div className="text-center py-20 text-muted animate-pulse">Loading...</div>
            ) : items.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-4xl mb-4">⭐</div>
                <h3 className="text-lg font-semibold mb-2">No shortlist entries yet</h3>
                <p className="text-sm text-muted">
                  When buyers shortlist your proposals, you&apos;ll see them here.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {items.map((item) => (
                  <div key={item.id} className="card-3d border border-border rounded-2xl p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-yellow-400 animate-pulse" />
                      <span className="text-sm font-semibold text-yellow-400">Shortlisted</span>
                    </div>
                    <p className="text-xs text-muted mb-2">RFP #{item.rfpId.slice(0, 8)}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">
                        Match Score:{" "}
                        <span className="font-bold text-accent">{item.matchScore}%</span>
                      </span>
                      <span className="text-xs text-muted">
                        {new Date(item.shortlistedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="mt-3 text-xs text-muted">
                      Buyer is evaluating shortlisted vendors. You may receive a demo or discussion invite soon.
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
