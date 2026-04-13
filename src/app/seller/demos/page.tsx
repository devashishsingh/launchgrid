"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SellerShell from "@/components/procurement/SellerShell";

interface DemoRequest {
  id: string;
  rfpId: string;
  buyerCompany: string;
  requestedAt: string;
  status: string;
}

export default function SellerDemosPage() {
  const [demos, setDemos] = useState<DemoRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/procurement/opportunities?vendorSlug=formstudio&type=demos");
        const data = await res.json();
        const demoItems = Array.isArray(data)
          ? data.filter(
              (o: { status: string }) =>
                o.status === "demo_requested" || o.status === "evaluation_invited"
            )
          : [];
        setDemos(
          demoItems.map(
            (o: { id: string; rfpId: string; buyerId?: string; notifiedAt?: string; status: string }) => ({
              id: o.id,
              rfpId: o.rfpId,
              buyerCompany: o.buyerId || "N/A",
              requestedAt: o.notifiedAt || new Date().toISOString(),
              status: o.status,
            })
          )
        );
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const statusColor: Record<string, string> = {
    demo_requested: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    evaluation_invited: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  };

  return (
    <>
      <Navbar />
      <SellerShell activeTab="demos">
        <main className="py-12 px-6">
          <div className="max-w-5xl mx-auto space-y-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 heading-3d">
                Demo <span className="gradient-text">Requests</span>
              </h1>
              <p className="text-muted">
                Manage demo and evaluation requests from shortlisting buyers.
              </p>
            </div>

            {loading ? (
              <div className="text-center py-20 text-muted animate-pulse">Loading...</div>
            ) : demos.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-4xl mb-4">🎬</div>
                <h3 className="text-lg font-semibold mb-2">No demo requests yet</h3>
                <p className="text-sm text-muted">
                  When buyers request demos after shortlisting, they&apos;ll appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {demos.map((d) => (
                  <div key={d.id} className="card-3d border border-border rounded-2xl p-6">
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`text-xs px-2 py-0.5 rounded border ${
                              statusColor[d.status] || "bg-gray-500/10 text-gray-400 border-gray-500/20"
                            }`}
                          >
                            {d.status === "demo_requested" ? "🎬 Demo Requested" : "📋 Evaluation Invited"}
                          </span>
                          <span className="text-xs text-muted">
                            {new Date(d.requestedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm mb-2">RFP #{d.rfpId.slice(0, 8)}</p>
                        <p className="text-xs text-muted">Buyer: {d.buyerCompany}</p>
                      </div>
                      <button className="text-xs px-3 py-1.5 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 transition-colors border border-accent/20">
                        Schedule Demo
                      </button>
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
