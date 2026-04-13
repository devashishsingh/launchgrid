"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProcurementShell from "@/components/procurement/ProcurementShell";

type Urgency = "low" | "medium" | "high" | "critical";

interface FormData {
  title: string;
  problemDescription: string;
  featureRequirements: string;
  budgetRange: string;
  deploymentPreference: string;
  region: string;
  urgency: Urgency;
  timeline: string;
  complianceNeeds: string;
  supportExpectation: string;
  preferredVendorSize: string;
}

const INITIAL: FormData = {
  title: "",
  problemDescription: "",
  featureRequirements: "",
  budgetRange: "",
  deploymentPreference: "",
  region: "",
  urgency: "medium",
  timeline: "",
  complianceNeeds: "",
  supportExpectation: "",
  preferredVendorSize: "",
};

interface ParsedResult {
  likelyCategory: string;
  possibleSoftwareTypes: string[];
  businessFunctionTags: string[];
  supportNeeds: string;
  pricingBand: string;
  deploymentPreference: string;
  region: string;
  urgency: string;
  complianceFlags: string[];
  confidence: number;
}

export default function SubmitRequirementPage() {
  const [form, setForm] = useState<FormData>(INITIAL);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [parsed, setParsed] = useState<ParsedResult | null>(null);
  const [requirementId, setRequirementId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function update(key: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title || !form.problemDescription) {
      setError("Title and problem description are required.");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/procurement/requirements", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          buyerId: "demo-buyer-001",
          attachments: [],
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong.");
        return;
      }

      const data = await res.json();
      setRequirementId(data.requirement.id);
      setParsed(data.parsed);
      setSubmitted(true);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />
      <ProcurementShell activeTab="submit">
        <main className="py-16 px-6">
          <div className="max-w-4xl mx-auto">
            {!submitted ? (
              <>
                {/* Header */}
                <div className="text-center mb-12">
                  <p className="text-xs uppercase tracking-[0.2em] text-accent mb-3 font-medium">
                    AI-Assisted Procurement
                  </p>
                  <h1 className="text-3xl sm:text-4xl font-bold mb-4 heading-3d">
                    Tell us what you need.
                    <br />
                    <span className="gradient-text">We&apos;ll find the best fit.</span>
                  </h1>
                  <p className="text-muted text-lg max-w-xl mx-auto">
                    Describe your business problem in plain language. Our engine parses your
                    requirement, surfaces the best-fit vendors, and lets you issue a structured RFP.
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Core requirement */}
                  <div className="card-elevated rounded-2xl p-8 gradient-border">
                    <div className="relative z-10 space-y-6">
                      <h2 className="text-lg font-semibold flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-sm text-accent font-bold">1</span>
                        Your Requirement
                      </h2>

                      <div>
                        <label className="block text-sm font-medium mb-2">Requirement Title *</label>
                        <input
                          type="text"
                          value={form.title}
                          onChange={(e) => update("title", e.target.value)}
                          placeholder="e.g. HRMS with payroll and attendance for India operations"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50 transition-all"
                          maxLength={300}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Describe Your Problem *</label>
                        <textarea
                          value={form.problemDescription}
                          onChange={(e) => update("problemDescription", e.target.value)}
                          placeholder="Tell us what you're trying to solve, the challenges you face, what tools you've considered, and any constraints..."
                          rows={6}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50 transition-all resize-none"
                          maxLength={5000}
                        />
                        <p className="text-xs text-muted/50 mt-1">{form.problemDescription.length}/5000 characters</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Feature Requirements (Optional)</label>
                        <textarea
                          value={form.featureRequirements}
                          onChange={(e) => update("featureRequirements", e.target.value)}
                          placeholder="List specific features you need: mobile app, API access, SSO, multi-language support..."
                          rows={3}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50 transition-all resize-none"
                          maxLength={3000}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Preferences */}
                  <div className="card-elevated rounded-2xl p-8 gradient-border">
                    <div className="relative z-10 space-y-6">
                      <h2 className="text-lg font-semibold flex items-center gap-2">
                        <span className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-sm text-accent font-bold">2</span>
                        Preferences &amp; Constraints
                      </h2>

                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-medium mb-2">Budget Range</label>
                          <select
                            value={form.budgetRange}
                            onChange={(e) => update("budgetRange", e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-accent/50 transition-all"
                          >
                            <option value="">Select budget range</option>
                            <option value="Free / No budget">Free / No budget</option>
                            <option value="Under ₹50,000/yr">Under ₹50,000/yr</option>
                            <option value="₹50,000 – ₹2,00,000/yr">₹50,000 – ₹2,00,000/yr</option>
                            <option value="₹2,00,000 – ₹10,00,000/yr">₹2,00,000 – ₹10,00,000/yr</option>
                            <option value="₹10,00,000+/yr (Enterprise)">₹10,00,000+/yr (Enterprise)</option>
                            <option value="Flexible / To be decided">Flexible / To be decided</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Preferred Deployment</label>
                          <select
                            value={form.deploymentPreference}
                            onChange={(e) => update("deploymentPreference", e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-accent/50 transition-all"
                          >
                            <option value="">Any</option>
                            <option value="SaaS / Cloud">SaaS / Cloud</option>
                            <option value="On-Premise">On-Premise</option>
                            <option value="Hybrid">Hybrid</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Geography / Support Region</label>
                          <select
                            value={form.region}
                            onChange={(e) => update("region", e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-accent/50 transition-all"
                          >
                            <option value="">Any region</option>
                            <option value="India">India</option>
                            <option value="USA">USA</option>
                            <option value="UK">UK</option>
                            <option value="UAE">UAE</option>
                            <option value="Singapore">Singapore</option>
                            <option value="Malaysia">Malaysia</option>
                            <option value="Global">Global</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Urgency</label>
                          <div className="flex gap-2">
                            {(["low", "medium", "high", "critical"] as const).map((u) => (
                              <button
                                key={u}
                                type="button"
                                onClick={() => update("urgency", u)}
                                className={`flex-1 py-2.5 rounded-lg text-xs font-medium border transition-all capitalize ${
                                  form.urgency === u
                                    ? u === "critical"
                                      ? "bg-red-500/15 text-red-400 border-red-500/30"
                                      : u === "high"
                                        ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
                                        : "bg-accent/15 text-accent border-accent/30"
                                    : "bg-white/5 text-muted border-white/10 hover:border-white/20"
                                }`}
                              >
                                {u}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Timeline</label>
                          <input
                            type="text"
                            value={form.timeline}
                            onChange={(e) => update("timeline", e.target.value)}
                            placeholder="e.g. Need it live within 3 months"
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50 transition-all"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-2">Preferred Vendor Size</label>
                          <select
                            value={form.preferredVendorSize}
                            onChange={(e) => update("preferredVendorSize", e.target.value)}
                            className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm focus:outline-none focus:border-accent/50 transition-all"
                          >
                            <option value="">No preference</option>
                            <option value="indie">Indie / solo founder</option>
                            <option value="startup">Startup (2-50 people)</option>
                            <option value="mid">Mid-size (50-500)</option>
                            <option value="enterprise">Large enterprise (500+)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Compliance / Security Needs</label>
                        <input
                          type="text"
                          value={form.complianceNeeds}
                          onChange={(e) => update("complianceNeeds", e.target.value)}
                          placeholder="e.g. GDPR, SOC2, ISO 27001, HIPAA..."
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-2">Support Expectation</label>
                        <input
                          type="text"
                          value={form.supportExpectation}
                          onChange={(e) => update("supportExpectation", e.target.value)}
                          placeholder="e.g. 24/7 live chat, dedicated account manager, email within 4 hours"
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm placeholder:text-muted/50 focus:outline-none focus:border-accent/50 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  {error && (
                    <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                      {error}
                    </div>
                  )}

                  <div className="text-center">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-premium px-10 py-4 rounded-full text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all disabled:opacity-50"
                    >
                      {submitting ? "Analyzing your requirement..." : "🔍 Find Best Matches"}
                    </button>
                    <p className="text-xs text-muted/50 mt-3">
                      Free to submit. Our AI engine will parse and match your requirement instantly.
                    </p>
                  </div>
                </form>
              </>
            ) : (
              /* ── SUCCESS: Parsed Result ── */
              <div className="space-y-10">
                <div className="text-center">
                  <div className="text-5xl mb-4">✅</div>
                  <h1 className="text-3xl font-bold mb-3 heading-3d">
                    Requirement <span className="gradient-text">Analyzed</span>
                  </h1>
                  <p className="text-muted text-lg">
                    We&apos;ve parsed your requirement. Here&apos;s what we found.
                  </p>
                </div>

                {/* Parsed output card */}
                {parsed && (
                  <div className="card-elevated rounded-2xl p-8 gradient-border">
                    <div className="relative z-10 space-y-6">
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-lg font-semibold">AI Parse Result</h2>
                        <span className={`text-xs px-3 py-1 rounded-full border font-medium ${
                          parsed.confidence >= 70
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            : parsed.confidence >= 40
                              ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                              : "bg-red-500/10 text-red-400 border-red-500/20"
                        }`}>
                          {parsed.confidence}% confidence
                        </span>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-5">
                        <ParsedField label="Likely Category" value={parsed.likelyCategory} icon="📂" />
                        <ParsedField label="Region" value={parsed.region} icon="🌍" />
                        <ParsedField label="Deployment" value={parsed.deploymentPreference} icon="☁️" />
                        <ParsedField label="Pricing Band" value={parsed.pricingBand} icon="💰" />
                        <ParsedField label="Urgency" value={parsed.urgency} icon="⏱️" />
                        <ParsedField label="Support Needs" value={parsed.supportNeeds} icon="🎧" />
                      </div>

                      {parsed.possibleSoftwareTypes.length > 0 && (
                        <div>
                          <p className="text-xs text-muted uppercase tracking-wider mb-2 font-medium">Possible Software Types</p>
                          <div className="flex flex-wrap gap-2">
                            {parsed.possibleSoftwareTypes.map((t) => (
                              <span key={t} className="text-xs px-3 py-1.5 rounded-full bg-accent/10 text-accent border border-accent/20">{t}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {parsed.businessFunctionTags.length > 0 && (
                        <div>
                          <p className="text-xs text-muted uppercase tracking-wider mb-2 font-medium">Business Function Tags</p>
                          <div className="flex flex-wrap gap-2">
                            {parsed.businessFunctionTags.map((t) => (
                              <span key={t} className="text-xs px-3 py-1.5 rounded-full bg-white/5 text-muted border border-white/10">{t}</span>
                            ))}
                          </div>
                        </div>
                      )}

                      {parsed.complianceFlags.length > 0 && (
                        <div>
                          <p className="text-xs text-muted uppercase tracking-wider mb-2 font-medium">Compliance Flags</p>
                          <div className="flex flex-wrap gap-2">
                            {parsed.complianceFlags.map((f) => (
                              <span key={f} className="text-xs px-3 py-1.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20">{f}</span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Next steps */}
                <div className="flex flex-wrap justify-center gap-4">
                  <a
                    href={`/marketplace/requirement/${requirementId}`}
                    className="btn-premium px-8 py-3 rounded-full text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all"
                  >
                    View Full Requirement →
                  </a>
                  <button
                    onClick={() => { setSubmitted(false); setForm(INITIAL); setParsed(null); }}
                    className="px-8 py-3 rounded-full text-sm font-semibold border border-white/10 text-muted hover:text-foreground hover:border-white/20 transition-colors"
                  >
                    Submit Another
                  </button>
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

function ParsedField({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
      <span className="text-lg">{icon}</span>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-muted/60 mb-0.5">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
