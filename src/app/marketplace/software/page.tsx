"use client";

import { useState, useMemo } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/marketplace/ProductCard";
import MarketplaceFilters from "@/components/marketplace/MarketplaceFilters";
import FeedbackButton from "@/components/marketplace/FeedbackButton";
import { products, filterOptions } from "@/lib/marketplace-data";

export default function SoftwarePage() {
  const [activeSort, setActiveSort] = useState("Top Rated");
  const [filters, setFilters] = useState({ category: "", pricing: "", deployment: "", rating: "", support: "", tag: "" });

  const sorted = useMemo(() => {
    let list = [...products];
    if (filters.category) list = list.filter((p) => p.category === filters.category);
    if (filters.pricing) list = list.filter((p) => p.pricing === filters.pricing);
    if (filters.deployment) list = list.filter((p) => p.deployment === filters.deployment);
    if (filters.rating) {
      const min = parseFloat(filters.rating);
      list = list.filter((p) => p.rating >= min);
    }
    if (filters.support) {
      const min = parseInt(filters.support);
      list = list.filter((p) => p.supportScore >= min);
    }
    if (filters.tag) list = list.filter((p) => p.tags.includes(filters.tag));

    switch (activeSort) {
      case "Top Rated": list.sort((a, b) => b.rating - a.rating); break;
      case "Most Reviewed": list.sort((a, b) => b.reviewCount - a.reviewCount); break;
      case "Most Customizable": list.sort((a, b) => (b.customizable ? 1 : 0) - (a.customizable ? 1 : 0)); break;
      case "Low Cost": list.sort((a, b) => { const o = ["Free", "Freemium", "Paid", "Enterprise", "Custom"]; return o.indexOf(a.pricing) - o.indexOf(b.pricing); }); break;
      case "Newest": list.sort((a, b) => (b.yearFounded || 0) - (a.yearFounded || 0)); break;
      case "Global Presence": list.sort((a, b) => (b.tags.includes("Global") ? 1 : 0) - (a.tags.includes("Global") ? 1 : 0)); break;
    }
    return list;
  }, [activeSort, filters]);

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        <section className="px-6 py-16">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs uppercase tracking-[0.2em] text-accent mb-4 font-medium">All Software</p>
            <h1 className="text-3xl sm:text-4xl font-bold mb-5 heading-3d">
              Software <span className="gradient-text">Directory</span>
            </h1>
            <p className="text-muted text-lg max-w-xl mb-10">
              Browse every listed product with full filtering and sorting.
            </p>

            {/* Sort tabs */}
            <div className="flex flex-wrap gap-2 mb-8">
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
            </div>

            <div className="flex gap-6">
              <div className="hidden lg:block w-72 shrink-0">
                <MarketplaceFilters onFilterChange={setFilters} />
              </div>
              <div className="flex-1">
                {sorted.length > 0 ? (
                  <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 perspective-container">
                    {sorted.map((product) => (
                      <ProductCard key={product.slug} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="text-4xl mb-4">🔍</div>
                    <h3 className="text-lg font-semibold mb-2">No products match your filters</h3>
                    <p className="text-sm text-muted">Try adjusting your filters.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile filters */}
            <div className="lg:hidden mt-6">
              <MarketplaceFilters onFilterChange={setFilters} />
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FeedbackButton />
    </>
  );
}
