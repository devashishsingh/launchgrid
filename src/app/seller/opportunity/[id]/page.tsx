"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SellerShell from "@/components/procurement/SellerShell";

export default function OpportunityResponsePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    proposalSummary: "",
    estimatedPricing: "",
    estimatedTimeline: "",
    customizability: "",
    demoLink: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
    additionalNotes: "",
  });

  function update(key: string, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.proposalSummary) return;
    setSubmitting(true);

    try {
      // First get the opportunity to find rfpId and vendorSlug
      const oppRes = await fetch(`/api/procurement/opportunities?vendorSlug=formstudio`);
      const opps = await oppRes.json();
      const opp = opps.find((o: { id: string }) => o.id === id);
      if (!opp) return;

      await fetch("/api/procurement/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rfpId: opp.rfpId,
          vendorSlug: opp.vendorSlug,
          opportunityId: opp.id,
          ...form,
          documents: [],
        }),
      });

      router.push("/seller/responses");
    } catch {
      // silent
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />
      <SellerShell activeTab="opportunities">
        <main className="py-12 px-6">
          <div className="max-w-3xl mx-auto space-y-8">
            <div>
              <h1 className="text-2xl font-bold mb-2 heading-3d">
                Submit <span className="gradient-text">Response</span>
              </h1>
              <p className="text-muted text-sm">Respond to this RFP opportunity with your proposal details.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="card-elevated rounded-2xl p-8 gradient-border">
                <div className="relative z-10 space-y-5">
                  <h2 className="text-sm font-semibold text-accent">Proposal Details</h2>

                  <div>
                    <label className="block text-sm font-medium mb-2">Proposal Summary *</label>
                    <textarea
                      value={form.proposalSummary}
                      onChange={(e) => update("proposalSummary", e.target.value)}
                      placeholder="Describe how your product solves the buyer's requirements..."
                      rows={5}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50 transition-all resize-none"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Estimated Pricing</label>
                      <input
                        type="text"
                        value={form.estimatedPricing}
                        onChange={(e) => update("estimatedPricing", e.target.value)}
                        placeholder="e.g. ₹50,000/yr per 100 users"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Estimated Timeline</label>
                      <input
                        type="text"
                        value={form.estimatedTimeline}
                        onChange={(e) => update("estimatedTimeline", e.target.value)}
                        placeholder="e.g. 2-4 weeks for full deployment"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Customizability</label>
                    <input
                      type="text"
                      value={form.customizability}
                      onChange={(e) => update("customizability", e.target.value)}
                      placeholder="e.g. Fully customizable workflows, white-label available"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50 transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Demo Link</label>
                    <input
                      type="url"
                      value={form.demoLink}
                      onChange={(e) => update("demoLink", e.target.value)}
                      placeholder="https://demo.yourproduct.com"
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="card-elevated rounded-2xl p-8 gradient-border">
                <div className="relative z-10 space-y-5">
                  <h2 className="text-sm font-semibold text-accent">Contact Person</h2>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Name</label>
                      <input
                        type="text"
                        value={form.contactName}
                        onChange={(e) => update("contactName", e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        value={form.contactEmail}
                        onChange={(e) => update("contactEmail", e.target.value)}
                        placeholder="john@company.com"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone</label>
                      <input
                        type="text"
                        value={form.contactPhone}
                        onChange={(e) => update("contactPhone", e.target.value)}
                        placeholder="+91-9876543210"
                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Additional Notes</label>
                    <textarea
                      value={form.additionalNotes}
                      onChange={(e) => update("additionalNotes", e.target.value)}
                      rows={3}
                      placeholder="Anything else the buyer should know..."
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50 transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="text-center">
                <button
                  type="submit"
                  disabled={submitting || !form.proposalSummary}
                  className="btn-premium px-10 py-4 rounded-full text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "📤 Submit Response"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </SellerShell>
      <Footer />
    </>
  );
}
