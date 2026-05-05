"use client";

import { useState } from "react";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", idea: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setStatus("sent");
        setForm({ name: "", email: "", idea: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="contact" className="py-16 px-6">
      <div className="max-w-xl mx-auto">
        <div className="text-center mb-8">
          <span className="section-label mb-4">Get Started</span>
          <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
            Let&apos;s turn your code into <span className="gradient-text">revenue.</span>
          </h2>
          <p className="text-sm text-muted mt-2">Takes 2 minutes. No commitment. We respond within 24 hours.</p>
        </div>

        {status === "sent" ? (
          <div className="gradient-border rounded-2xl p-8 text-center">
            <div className="relative z-10">
              <div className="text-3xl mb-4">✓</div>
              <h3 className="text-lg font-semibold mb-2 gradient-text">Application received</h3>
              <p className="text-sm text-muted">
                We&apos;ll review your submission and get back to you soon.
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 glass rounded-2xl p-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium mb-2 text-muted"
              >
                Name
              </label>
              <input
                id="name"
                type="text"
                required
                maxLength={100}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full input-clean rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:outline-none"
                placeholder="Your name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2 text-muted"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                maxLength={200}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full input-clean rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:outline-none"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="idea"
                className="block text-sm font-medium mb-2 text-muted"
              >
                Product Idea
              </label>
              <textarea
                id="idea"
                required
                maxLength={2000}
                rows={4}
                value={form.idea}
                onChange={(e) => setForm({ ...form, idea: e.target.value })}
                className="w-full input-clean rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted/50 focus:outline-none resize-none"
                placeholder="Tell us about the software you've built or want to sell..."
              />
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full skeuo-btn disabled:opacity-50 text-white px-6 py-3.5 rounded-xl text-sm font-semibold"
            >
              {status === "sending" ? "Submitting..." : "Submit Application"}
            </button>

            {status === "error" && (
              <p className="text-red-400 text-sm text-center">
                Something went wrong. Please try again.
              </p>
            )}
          </form>
        )}
      </div>
    </section>
  );
}
