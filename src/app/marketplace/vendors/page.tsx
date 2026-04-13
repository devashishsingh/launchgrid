"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeedbackButton from "@/components/marketplace/FeedbackButton";

export default function VendorsPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    productName: "",
    companyName: "",
    email: "",
    category: "",
    website: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const perks = [
    { icon: "📢", title: "Get Discovered", desc: "Your product appears in front of active buyers filtering by category, deployment, and fit." },
    { icon: "⭐", title: "Build Trust", desc: "Earn verified ratings, support scores, and community reviews that attract serious buyers." },
    { icon: "📊", title: "Analytics Dashboard", desc: "Track views, shortlists, inquiries, and conversion metrics in real-time." },
    { icon: "🤝", title: "Direct Buyer Connections", desc: "Qualified leads reach out to you directly — no middlemen, no commissions on first contact." },
    { icon: "🏷️", title: "Rich Product Profiles", desc: "Showcase features, screenshots, pricing, support quality, and deployment options." },
    { icon: "🌍", title: "Global Reach", desc: "Reach buyers in India, Southeast Asia, and emerging markets looking for the right fit." },
  ];

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        {/* Hero */}
        <section className="px-6 py-20 mesh-gradient relative overflow-hidden">
          <div className="absolute top-10 left-[10%] w-60 h-60 bg-accent/8 rounded-full blur-[100px] pointer-events-none" />
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <p className="text-xs uppercase tracking-[0.2em] text-accent mb-4 font-medium">For Vendors &amp; Developers</p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6 heading-3d">
              List your software.
              <br />
              <span className="gradient-text">Attract the right buyers.</span>
            </h1>
            <p className="text-muted text-lg max-w-2xl mx-auto leading-relaxed">
              Join a marketplace built for serious B2B software sourcing. Every product gets
              a rich profile, verified reviews, and direct buyer connections.
            </p>
          </div>
        </section>

        {/* Perks */}
        <section className="px-6 py-20">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-2xl font-bold mb-10 text-center heading-3d">
              Why list on <span className="gradient-text">Launchbox Marketplace</span>
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 perspective-container">
              {perks.map((perk, i) => (
                <div key={i} className="card-3d rounded-2xl p-6 tilt-3d">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-xl mb-3 icon-well">
                    {perk.icon}
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{perk.title}</h3>
                  <p className="text-xs text-muted leading-relaxed">{perk.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Listing form */}
        <section className="px-6 py-20 section-glow">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-2 text-center heading-3d">
              Submit Your <span className="gradient-text">Product</span>
            </h2>
            <p className="text-muted text-center text-sm mb-10">
              Fill in the basics. Our team will review and set up your rich product profile.
            </p>

            {submitted ? (
              <div className="card-elevated gradient-border rounded-2xl p-10 text-center">
                <div className="relative z-10">
                  <div className="text-4xl mb-4">🎉</div>
                  <h3 className="text-xl font-bold mb-2">Submission received!</h3>
                  <p className="text-muted text-sm">We&apos;ll review your product and get back to you within 48 hours.</p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="card-3d rounded-2xl p-8 space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted block mb-1.5">Product Name *</label>
                    <input
                      type="text"
                      required
                      value={form.productName}
                      onChange={(e) => setForm({ ...form, productName: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm bg-white/5 border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-accent/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted block mb-1.5">Company Name *</label>
                    <input
                      type="text"
                      required
                      value={form.companyName}
                      onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm bg-white/5 border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-accent/50 transition-all"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted block mb-1.5">Email *</label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm bg-white/5 border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-accent/50 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted block mb-1.5">Category *</label>
                    <select
                      required
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm bg-white/5 border border-white/10 rounded-lg text-foreground focus:outline-none focus:border-accent/50 transition-all"
                    >
                      <option value="" className="bg-[#0C0C10]">Select category</option>
                      {["HR / Payroll", "Cybersecurity", "Legal Tech", "Compliance", "Workflow Automation", "AI Tools", "CRM / Sales", "Finance / Accounting", "Procurement", "Operations", "Developer Tools", "Analytics", "Other"].map((c) => (
                        <option key={c} value={c} className="bg-[#0C0C10]">{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted block mb-1.5">Website</label>
                  <input
                    type="url"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                    placeholder="https://"
                    className="w-full px-3 py-2.5 text-sm bg-white/5 border border-white/10 rounded-lg text-foreground placeholder:text-muted/40 focus:outline-none focus:border-accent/50 transition-all"
                  />
                </div>

                <div>
                  <label className="text-xs text-muted block mb-1.5">Product Description *</label>
                  <textarea
                    required
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    placeholder="What does your product do and who is it for?"
                    className="w-full px-3 py-2.5 text-sm bg-white/5 border border-white/10 rounded-lg text-foreground placeholder:text-muted/40 focus:outline-none focus:border-accent/50 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-lg text-sm font-semibold text-white btn-premium hover:opacity-90 transition-all"
                >
                  Submit for Review →
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <FeedbackButton />
    </>
  );
}
