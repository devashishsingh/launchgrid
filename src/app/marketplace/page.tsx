"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/marketplace/ProductCard";
import MarketplaceFilters from "@/components/marketplace/MarketplaceFilters";
import FeedbackButton from "@/components/marketplace/FeedbackButton";
import {
  products,
  categories,
  discoveryPainPoints,
  marketplaceSteps,
  filterOptions,
} from "@/lib/marketplace-data";

// ===== SECTION 1 — HERO =====
function MarketplaceHero() {
  return (
    <section className="pt-28 pb-20 px-6 mesh-gradient relative overflow-hidden">
      {/* Floating orbs */}
      <div className="absolute top-20 left-[10%] w-72 h-72 bg-accent/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-[15%] w-56 h-56 bg-indigo-500/6 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10">
        <p className="text-xs uppercase tracking-[0.2em] text-accent mb-4 font-medium animate-fade-up">
          Launchbox Marketplace
        </p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-6 heading-3d animate-fade-up animate-delay-100">
          Discover hidden software gems
          <br />
          <span className="gradient-text">built by indie makers who outwork the giants.</span>
        </h1>
        <p className="text-muted text-lg max-w-2xl mx-auto mb-4 leading-relaxed animate-fade-up animate-delay-200">
          The best tools aren&apos;t always the loudest. We verify, test, and surface indie products you&apos;ve
          never heard of — genuine, focused software built by developers pouring every ounce of energy
          into solving <em>your</em> specific problem, often better than any big-name player.
        </p>
        <p className="text-sm text-accent/80 max-w-xl mx-auto mb-10 animate-fade-up animate-delay-200">
          Every product here is vetted for quality, reliability, and real-world fit — no pay-to-play rankings.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-14 animate-fade-up animate-delay-300">
          <a href="#explore" className="btn-premium px-7 py-3 rounded-full text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-shadow">
            Explore Marketplace
          </a>
          <Link href="/marketplace/vendors" className="px-7 py-3 rounded-full text-sm font-semibold border border-accent/30 text-accent hover:bg-accent/10 transition-colors">
            List Your Product
          </Link>
          <a href="#request-help" className="px-7 py-3 rounded-full text-sm font-semibold border border-white/10 text-muted hover:text-foreground hover:border-white/20 transition-colors">
            Request Help Finding Software
          </a>
        </div>

        {/* Mini preview tiles */}
        <div className="flex flex-wrap justify-center gap-3 animate-fade-up animate-delay-400">
          {products.slice(0, 5).map((p) => (
            <div key={p.slug} className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-card/80 border border-border text-xs backdrop-blur-sm">
              <span className="text-lg">{p.logo}</span>
              <span className="font-medium">{p.name}</span>
              <span className="text-yellow-400 font-semibold">★ {p.rating}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== SECTION 2 — WHY DISCOVERY IS BROKEN =====
function WhyBroken() {
  return (
    <section className="py-24 px-6 section-glow">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs uppercase tracking-[0.2em] text-accent mb-4 text-center font-medium">
          The Problem
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-5 leading-tight heading-3d">
          Why software discovery is <span className="gradient-text">broken</span>
        </h2>
        <p className="text-muted text-center text-lg max-w-xl mx-auto mb-14">
          Finding the right tool shouldn&apos;t feel like gambling with your budget and time.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 perspective-container">
          {discoveryPainPoints.map((pain, i) => (
            <div key={i} className="card-3d rounded-2xl p-5 tilt-3d">
              <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-xl mb-3 icon-well">
                {pain.icon}
              </div>
              <h3 className="font-semibold text-sm mb-1">{pain.title}</h3>
              <p className="text-xs text-muted leading-relaxed">{pain.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== SECTION 3 — SMART FILTERS (WOW SECTION) =====
function SmartFiltersPreview() {
  const quickFilters = [
    { label: "Top Rated", icon: "⭐" },
    { label: "Customizable", icon: "🔧" },
    { label: "Enterprise Ready", icon: "🏢" },
    { label: "Startup Friendly", icon: "🚀" },
    { label: "India Ready", icon: "🇮🇳" },
    { label: "Fast Support", icon: "⚡" },
    { label: "API Available", icon: "🔌" },
    { label: "Low Cost", icon: "💰" },
    { label: "Cloud", icon: "☁️" },
    { label: "On-Premise", icon: "🖥️" },
    { label: "Freemium", icon: "🎁" },
    { label: "Global", icon: "🌍" },
    { label: "Newest", icon: "✨" },
    { label: "Most Reviewed", icon: "💬" },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs uppercase tracking-[0.2em] text-accent mb-4 text-center font-medium">
          Smart Filters
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-5 leading-tight heading-3d">
          Find what <span className="gradient-text">actually fits</span>
        </h2>
        <p className="text-muted text-center text-lg max-w-xl mx-auto mb-12">
          Finally, search for the right-fit software — not just the most advertised.
        </p>

        <div className="card-elevated rounded-2xl p-8 gradient-border">
          <div className="relative z-10">
            {/* Search bar */}
            <div className="relative mb-6">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name, category, feature, or use case..."
                className="w-full pl-12 pr-4 py-3.5 text-sm bg-white/5 border border-white/10 rounded-xl text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent/50 transition-all"
              />
            </div>

            {/* Quick filter chips */}
            <div className="flex flex-wrap gap-2">
              {quickFilters.map((f) => (
                <button
                  key={f.label}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-full bg-white/5 border border-white/10 text-muted hover:text-accent hover:border-accent/30 hover:bg-accent/5 transition-all"
                >
                  <span>{f.icon}</span>
                  {f.label}
                </button>
              ))}
            </div>

            {/* Filter categories row */}
            <div className="mt-6 pt-6 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {["Category", "Pricing", "Support Quality", "Deployment"].map((label) => (
                <div key={label} className="text-center">
                  <p className="text-[10px] uppercase tracking-wider text-muted/60 mb-1.5">{label}</p>
                  <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-muted">
                    Any
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="text-center mt-6">
          <a href="#explore" className="text-sm text-accent hover:underline">
            Open full filters →
          </a>
        </p>
      </div>
    </section>
  );
}

// ===== SECTION 4 — FEATURED CATEGORIES =====
function FeaturedCategories() {
  return (
    <section className="py-24 px-6 section-glow">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs uppercase tracking-[0.2em] text-accent mb-4 text-center font-medium">
          Browse By Category
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-5 leading-tight heading-3d">
          Featured <span className="gradient-text">Categories</span>
        </h2>
        <p className="text-muted text-center text-lg max-w-lg mx-auto mb-14">
          Explore curated categories designed for serious software sourcing.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 perspective-container">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/marketplace/categories?cat=${cat.slug}`}
              className="card-3d rounded-2xl p-5 tilt-3d group text-center"
            >
              <div className="text-3xl mb-3">{cat.icon}</div>
              <h3 className="font-semibold text-sm mb-1 group-hover:text-accent transition-colors">
                {cat.name}
              </h3>
              <p className="text-[11px] text-muted leading-relaxed mb-2">{cat.description}</p>
              <span className="text-[10px] text-accent font-medium">{cat.productCount} products →</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== SECTION 5 — FEATURED SOFTWARE / TOP RATED =====
function FeaturedSoftware() {
  const [activeSort, setActiveSort] = useState("Top Rated");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ category: "", pricing: "", deployment: "", rating: "", support: "", tag: "" });

  const sorted = useMemo(() => {
    let list = [...products];

    // Apply filters
    if (filters.category) list = list.filter((p) => p.category === filters.category);
    if (filters.pricing) list = list.filter((p) => p.pricing === filters.pricing);
    if (filters.deployment) list = list.filter((p) => p.deployment === filters.deployment);
    if (filters.rating) {
      const minRating = parseFloat(filters.rating);
      list = list.filter((p) => p.rating >= minRating);
    }
    if (filters.support) {
      const minSupport = parseInt(filters.support);
      list = list.filter((p) => p.supportScore >= minSupport);
    }
    if (filters.tag) list = list.filter((p) => p.tags.includes(filters.tag));

    // Sort
    switch (activeSort) {
      case "Top Rated": list.sort((a, b) => b.rating - a.rating); break;
      case "Most Reviewed": list.sort((a, b) => b.reviewCount - a.reviewCount); break;
      case "Most Customizable": list.sort((a, b) => (b.customizable ? 1 : 0) - (a.customizable ? 1 : 0)); break;
      case "Low Cost": list.sort((a, b) => { const order = ["Free", "Freemium", "Paid", "Enterprise", "Custom"]; return order.indexOf(a.pricing) - order.indexOf(b.pricing); }); break;
      case "Newest": list.sort((a, b) => (b.yearFounded || 0) - (a.yearFounded || 0)); break;
      case "Global Presence": list.sort((a, b) => (b.tags.includes("Global") ? 1 : 0) - (a.tags.includes("Global") ? 1 : 0)); break;
    }

    return list;
  }, [activeSort, filters]);

  return (
    <section id="explore" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs uppercase tracking-[0.2em] text-accent mb-4 font-medium">
            Software Directory
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-5 leading-tight heading-3d">
            Explore <span className="gradient-text">Software</span>
          </h2>
        </div>

        {/* Sort tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {filterOptions.sort.map((s) => (
            <button
              key={s}
              onClick={() => setActiveSort(s)}
              className={`px-4 py-2 text-xs rounded-full border transition-all ${
                activeSort === s
                  ? "bg-accent/15 text-accent border-accent/30 font-semibold"
                  : "bg-white/5 text-muted border-white/10 hover:border-white/20 hover:text-foreground"
              }`}
            >
              {s}
            </button>
          ))}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="ml-auto px-4 py-2 text-xs rounded-full border border-white/10 text-muted hover:text-foreground hover:border-white/20 transition-all flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        <div className={`flex gap-6 ${showFilters ? "" : ""}`}>
          {/* Sidebar filters */}
          {showFilters && (
            <div className="hidden lg:block w-72 shrink-0">
              <MarketplaceFilters onFilterChange={setFilters} />
            </div>
          )}

          {/* Product grid */}
          <div className="flex-1">
            {sorted.length > 0 ? (
              <div className={`grid gap-5 perspective-container ${showFilters ? "sm:grid-cols-2 xl:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"}`}>
                {sorted.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-lg font-semibold mb-2">No products match your filters</h3>
                <p className="text-sm text-muted">Try adjusting your filters or browse all categories.</p>
              </div>
            )}
          </div>
        </div>

        {/* Mobile filter drawer trigger */}
        {showFilters && (
          <div className="lg:hidden mt-6">
            <MarketplaceFilters onFilterChange={setFilters} />
          </div>
        )}
      </div>
    </section>
  );
}

// ===== SECTION 6 — HOW MARKETPLACE WORKS =====
function HowMarketplaceWorks() {
  return (
    <section className="py-24 px-6 section-glow">
      <div className="max-w-4xl mx-auto">
        <p className="text-xs uppercase tracking-[0.2em] text-accent mb-4 text-center font-medium">
          How It Works
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-14 leading-tight heading-3d">
          From search to <span className="gradient-text">signed deal</span>
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 perspective-container">
          {marketplaceSteps.map((step, i) => (
            <div key={i} className="card-3d rounded-2xl p-6 tilt-3d text-center group">
              <div className="w-12 h-12 mx-auto rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center mb-4 icon-well">
                <span className="text-sm font-mono font-bold text-accent">{step.num}</span>
              </div>
              <h3 className="font-semibold text-sm mb-2 group-hover:text-accent transition-colors">{step.title}</h3>
              <p className="text-xs text-muted leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== SECTION 7 — FOR VENDORS / DEVELOPERS =====
function ForVendors() {
  const perks = [
    { icon: "�️", title: "Verified Trust Badge", desc: "Pass our 6-step verification (identity, testing, legal, security, support readiness) and earn a Launchbox Verified badge." },
    { icon: "📢", title: "Get Discovered", desc: "Put your product in front of decision-makers actively looking for verified solutions — no pay-to-play." },
    { icon: "⭐", title: "Build Credibility", desc: "Earn a trust score backed by real testing data, legal compliance, and verified support SLAs." },
    { icon: "🤝", title: "Close Deals", desc: "Connect directly with qualified buyers who trust Launchbox-verified products." },
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="card-elevated gradient-border rounded-3xl p-10 md:p-14 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[100px] pointer-events-none" />
          <div className="relative z-10">
            <p className="text-xs uppercase tracking-[0.2em] text-accent mb-4 font-medium">
              For Vendors &amp; Developers
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-5 leading-tight heading-3d">
              List your software.
              <br />
              <span className="gradient-text">Get discovered. Close deals.</span>
            </h2>
            <p className="text-muted text-lg max-w-xl mb-10 leading-relaxed">
              Join a trust-first marketplace. Every product goes through our 6-step verification
              pipeline — identity, testing, legal, security, and support readiness — before it
              earns a listing. No shortcuts, no pay-to-play.
            </p>

            <div className="grid sm:grid-cols-2 gap-5 mb-10 perspective-container">
              {perks.map((perk, i) => (
                <div key={i} className="flex gap-4 items-start p-4 rounded-xl bg-white/[0.02] border border-white/5 tilt-3d">
                  <span className="text-2xl shrink-0">{perk.icon}</span>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">{perk.title}</h3>
                    <p className="text-xs text-muted leading-relaxed">{perk.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <Link
              href="/marketplace/vendors"
              className="inline-block btn-premium px-8 py-3 rounded-full text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-shadow"
            >
              List Your Product →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===== SECTION 8 — REQUEST HELP =====
function RequestHelp() {
  return (
    <section id="request-help" className="py-24 px-6 section-glow">
      <div className="max-w-3xl mx-auto text-center">
        <div className="text-4xl mb-6">🧭</div>
        <h2 className="text-3xl sm:text-4xl font-bold mb-5 leading-tight heading-3d">
          Need help finding the <span className="gradient-text">right software?</span>
        </h2>
        <p className="text-muted text-lg max-w-lg mx-auto mb-10 leading-relaxed">
          Not sure what to choose? Our team can match you with the right products based on your
          specific requirements, budget, and industry.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="btn-premium px-8 py-3 rounded-full text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-shadow">
            Request Assisted Match
          </button>
          <button className="px-8 py-3 rounded-full text-sm font-semibold border border-white/10 text-muted hover:text-foreground hover:border-white/20 transition-colors">
            Suggest a Tool
          </button>
        </div>
      </div>
    </section>
  );
}

// ===== SECTION 9 — STATS BAR =====
function StatsBar() {
  const verifiedCount = products.filter((p) => p.verification.state === "listed").length;
  const indieCount = products.filter((p) => p.isIndie).length;
  const avgTrust = (products.reduce((s, p) => s + p.trustScore.overall, 0) / products.length).toFixed(1);

  const stats = [
    { value: `${products.length}`, label: "Verified Products" },
    { value: "12", label: "Categories" },
    { value: `${indieCount}`, label: "Indie-Built" },
    { value: avgTrust, label: "Avg Trust Score" },
  ];

  return (
    <section className="py-16 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 raised-3d rounded-2xl p-8 bg-card border border-border">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <p className="text-2xl sm:text-3xl font-bold gradient-text">{s.value}</p>
              <p className="text-xs text-muted mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===== MAIN PAGE =====
export default function MarketplacePage() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <MarketplaceHero />
        <StatsBar />
        <WhyBroken />
        <SmartFiltersPreview />
        <FeaturedCategories />
        <FeaturedSoftware />
        <HowMarketplaceWorks />
        <ForVendors />
        <RequestHelp />
      </main>
      <Footer />
      <FeedbackButton />
    </>
  );
}
