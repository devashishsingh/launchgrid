"use client";

import { useState } from "react";
import { feedbackIssueTypes } from "@/lib/marketplace-data";

export default function FeedbackButton() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    issueType: feedbackIssueTypes[0],
    description: "",
    page: "",
  });

  const handleOpen = () => {
    setForm((f) => ({ ...f, page: typeof window !== "undefined" ? window.location.pathname : "" }));
    setOpen(true);
    setSubmitted(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setOpen(false), 2000);
  };

  return (
    <>
      {/* Floating button */}
      <button
        onClick={handleOpen}
        className="fixed bottom-24 right-6 z-40 flex items-center gap-2 px-4 py-2.5 rounded-full bg-card border border-border hover:border-accent/40 text-sm text-muted hover:text-foreground transition-all shadow-lg hover:shadow-xl group"
      >
        <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span className="hidden sm:inline">Suggest / Report</span>
      </button>

      {/* Modal overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-lg bg-[#0C0C10] border border-border rounded-2xl p-8 shadow-2xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-muted hover:text-foreground transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {submitted ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">✅</div>
                <h3 className="text-xl font-bold mb-2">Thank you!</h3>
                <p className="text-muted text-sm">Your feedback helps us improve the marketplace.</p>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-1">Help Improve Marketplace</h3>
                <p className="text-sm text-muted mb-6">Suggest a feature, report a problem, or let us know what&apos;s missing.</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-muted block mb-1.5">Name</label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-accent/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted block mb-1.5">Email</label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-accent/50 transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-muted block mb-1.5">Company <span className="text-muted/50">(optional)</span></label>
                      <input
                        type="text"
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-accent/50 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted block mb-1.5">Issue Type</label>
                      <select
                        value={form.issueType}
                        onChange={(e) => setForm({ ...form, issueType: e.target.value })}
                        className="w-full px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-accent/50 transition-all"
                      >
                        {feedbackIssueTypes.map((t) => (
                          <option key={t} value={t} className="bg-[#0C0C10]">{t}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-muted block mb-1.5">Description</label>
                    <textarea
                      required
                      rows={4}
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      placeholder="Tell us what you'd like to see, or what went wrong..."
                      className="w-full px-3 py-2 text-sm bg-white/5 border border-white/10 rounded-lg text-foreground placeholder:text-muted/40 focus:outline-none focus:border-accent/50 transition-all resize-none"
                    />
                  </div>

                  {form.page && (
                    <p className="text-xs text-muted/50">Page: {form.page}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg text-sm font-semibold text-white btn-premium transition-all hover:opacity-90"
                  >
                    Submit Feedback
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
