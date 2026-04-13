"use client";

import { Suspense, useState, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/marketplace/ProductCard";
import FeedbackButton from "@/components/marketplace/FeedbackButton";
import { categories, products } from "@/lib/marketplace-data";

function CategoriesContent() {
  const searchParams = useSearchParams();
  const activeCat = searchParams.get("cat") || "";
  const [selected, setSelected] = useState(activeCat);

  const filtered = useMemo(() => {
    if (!selected) return products;
    const cat = categories.find((c) => c.slug === selected);
    if (!cat) return products;
    return products.filter((p) => p.category === cat.name);
  }, [selected]);

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        <section className="px-6 py-16">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs uppercase tracking-[0.2em] text-accent mb-4 font-medium">Browse By Category</p>
            <h1 className="text-3xl sm:text-4xl font-bold mb-5 heading-3d">
              Software <span className="gradient-text">Categories</span>
            </h1>
            <p className="text-muted text-lg max-w-xl mb-12">
              Click a category to filter products, or browse all listings below.
            </p>

            {/* Category chips */}
            <div className="flex flex-wrap gap-2 mb-12">
              <button
                onClick={() => setSelected("")}
                className={`px-4 py-2 text-xs rounded-full border transition-all ${
                  !selected
                    ? "bg-accent/15 text-accent border-accent/30 font-semibold"
                    : "bg-white/5 text-muted border-white/10 hover:border-white/20 hover:text-foreground"
                }`}
              >
                All ({products.length})
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.slug}
                  onClick={() => setSelected(cat.slug === selected ? "" : cat.slug)}
                  className={`flex items-center gap-1.5 px-4 py-2 text-xs rounded-full border transition-all ${
                    selected === cat.slug
                      ? "bg-accent/15 text-accent border-accent/30 font-semibold"
                      : "bg-white/5 text-muted border-white/10 hover:border-white/20 hover:text-foreground"
                  }`}
                >
                  <span>{cat.icon}</span>
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Products grid */}
            {filtered.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 perspective-container">
                {filtered.map((product) => (
                  <ProductCard key={product.slug} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-4xl mb-4">📂</div>
                <h3 className="text-lg font-semibold mb-2">No products in this category yet</h3>
                <p className="text-sm text-muted mb-4">Products are being added daily.</p>
                <Link href="/marketplace/vendors" className="text-accent text-sm hover:underline">
                  List your product in this category →
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <FeedbackButton />
    </>
  );
}

export default function CategoriesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted text-sm">Loading categories...</p>
      </div>
    }>
      <CategoriesContent />
    </Suspense>
  );
}
