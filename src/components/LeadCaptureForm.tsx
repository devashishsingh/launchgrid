"use client";

import { useState } from "react";

const CATEGORIES = [
  "SaaS", "Developer Tool", "AI / ML", "Automation",
  "Productivity", "Finance", "Education", "Health",
  "E-commerce", "Other",
];

const STAGES = [
  { value: "prototype", label: "Prototype" },
  { value: "mvp", label: "MVP" },
  { value: "live", label: "Live Product" },
];

const LEAD_SOURCES = [
  { value: "linkedin", label: "LinkedIn" },
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "youtube", label: "YouTube" },
  { value: "website", label: "Website" },
  { value: "referral", label: "Referral" },
  { value: "college", label: "College / Incubator" },
  { value: "incubator", label: "Incubator / Accelerator" },
];

const initial = {
  fullName: "",
  email: "",
  linkedIn: "",
  productName: "",
  productCategory: "",
  problemStatement: "",
  currentStage: "",
  existingUrl: "",
  expectedPrice: "",
  supportCommitment: false,
  termsAcknowledged: false,
  leadSource: "",
};

export default function LeadCaptureForm() {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  function set(key: string, value: string | boolean) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("sent");
        setForm(initial);
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  const inputClass =
    "w-full input-clean rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:outline-none";

  return (
    <section id="lead-capture" className="py-16 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <span className="section-label mb-4">Apply to Launch</span>
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
            Let&apos;s turn your code into <span className="gradient-text">revenue.</span>
          </h2>
          <p className="text-sm text-muted mt-2">Takes 3 minutes. No commitment. We respond within 24 hours.</p>
        </div>

        {status === "sent" ? (
          <div className="gradient-border rounded-2xl p-10 text-center">
            <div className="relative z-10">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-2 gradient-text">Application received!</h3>
              <p className="text-sm text-muted max-w-sm mx-auto">
                We&apos;ll review your submission and schedule a discovery call within 24 hours.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 glass rounded-2xl p-6">
            {/* Row 1: Name + Email */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="lc-name" className="block text-sm font-medium mb-2 text-muted">
                  Full Name *
                </label>
                <input
                  id="lc-name"
                  type="text"
                  required
                  maxLength={100}
                  value={form.fullName}
                  onChange={(e) => set("fullName", e.target.value)}
                  className={inputClass}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label htmlFor="lc-email" className="block text-sm font-medium mb-2 text-muted">
                  Email *
                </label>
                <input
                  id="lc-email"
                  type="email"
                  required
                  maxLength={200}
                  value={form.email}
                  onChange={(e) => set("email", e.target.value)}
                  className={inputClass}
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Row 2: LinkedIn + Product Name */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="lc-linkedin" className="block text-sm font-medium mb-2 text-muted">
                  LinkedIn Profile
                </label>
                <input
                  id="lc-linkedin"
                  type="url"
                  maxLength={300}
                  value={form.linkedIn}
                  onChange={(e) => set("linkedIn", e.target.value)}
                  className={inputClass}
                  placeholder="https://linkedin.com/in/..."
                />
              </div>
              <div>
                <label htmlFor="lc-product" className="block text-sm font-medium mb-2 text-muted">
                  Product Name *
                </label>
                <input
                  id="lc-product"
                  type="text"
                  required
                  maxLength={200}
                  value={form.productName}
                  onChange={(e) => set("productName", e.target.value)}
                  className={inputClass}
                  placeholder="Your product name"
                />
              </div>
            </div>

            {/* Row 3: Category + Stage */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="lc-category" className="block text-sm font-medium mb-2 text-muted">
                  Product Category
                </label>
                <select
                  id="lc-category"
                  value={form.productCategory}
                  onChange={(e) => set("productCategory", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="lc-stage" className="block text-sm font-medium mb-2 text-muted">
                  Current Stage *
                </label>
                <select
                  id="lc-stage"
                  required
                  value={form.currentStage}
                  onChange={(e) => set("currentStage", e.target.value)}
                  className={inputClass}
                >
                  <option value="">Select stage</option>
                  {STAGES.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Problem Statement */}
            <div>
              <label htmlFor="lc-problem" className="block text-sm font-medium mb-2 text-muted">
                What problem does your product solve? *
              </label>
              <textarea
                id="lc-problem"
                required
                maxLength={2000}
                rows={3}
                value={form.problemStatement}
                onChange={(e) => set("problemStatement", e.target.value)}
                className={inputClass}
                placeholder="Describe the problem your software solves..."
              />
            </div>

            {/* Row 4: URL + Price */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="lc-url" className="block text-sm font-medium mb-2 text-muted">
                  Website / GitHub URL
                </label>
                <input
                  id="lc-url"
                  type="url"
                  maxLength={500}
                  value={form.existingUrl}
                  onChange={(e) => set("existingUrl", e.target.value)}
                  className={inputClass}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label htmlFor="lc-price" className="block text-sm font-medium mb-2 text-muted">
                  Expected Price Point
                </label>
                <input
                  id="lc-price"
                  type="text"
                  maxLength={100}
                  value={form.expectedPrice}
                  onChange={(e) => set("expectedPrice", e.target.value)}
                  className={inputClass}
                  placeholder="e.g. $29/mo, $199 one-time"
                />
              </div>
            </div>

            {/* Lead Source */}
            <div>
              <label htmlFor="lc-source" className="block text-sm font-medium mb-2 text-muted">
                How did you find us? *
              </label>
              <select
                id="lc-source"
                required
                value={form.leadSource}
                onChange={(e) => set("leadSource", e.target.value)}
                className={inputClass}
              >
                <option value="">Select source</option>
                {LEAD_SOURCES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3 pt-2">
              <label className="flex items-start gap-3 cursor-pointer group py-2">
                <input
                  type="checkbox"
                  checked={form.supportCommitment}
                  onChange={(e) => set("supportCommitment", e.target.checked)}
                  className="mt-0.5 w-5 h-5 min-w-5 rounded border-border bg-card text-accent focus:ring-accent/20"
                />
                <span className="text-sm text-muted group-hover:text-foreground transition-colors">
                  I commit to providing customer support and maintaining my product
                </span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer group py-2">
                <input
                  type="checkbox"
                  required
                  checked={form.termsAcknowledged}
                  onChange={(e) => set("termsAcknowledged", e.target.checked)}
                  className="mt-0.5 w-5 h-5 min-w-5 rounded border-border bg-card text-accent focus:ring-accent/20"
                />
                <span className="text-sm text-muted group-hover:text-foreground transition-colors">
                  I acknowledge the Launchbox creator terms and agreement requirements *
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full skeuo-btn disabled:opacity-60 text-white py-4 rounded-xl text-base font-semibold transition-all"
            >
              {status === "sending" ? "Submitting..." : "Apply to Launchbox"}
            </button>

            {status === "error" && (
              <p className="text-sm text-red-400 text-center">
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
