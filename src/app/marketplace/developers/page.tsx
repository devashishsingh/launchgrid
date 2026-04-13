"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeedbackButton from "@/components/marketplace/FeedbackButton";
import { products } from "@/lib/marketplace-data";

// Extract unique developers/companies from products
const developers = Array.from(
  new Map(
    products.map((p) => [
      p.company,
      {
        name: p.company,
        country: p.country,
        productCount: products.filter((x) => x.company === p.company).length,
        avgRating: +(products.filter((x) => x.company === p.company).reduce((s, x) => s + x.rating, 0) / products.filter((x) => x.company === p.company).length).toFixed(1),
        avgSupport: Math.round(products.filter((x) => x.company === p.company).reduce((s, x) => s + x.supportScore, 0) / products.filter((x) => x.company === p.company).length),
        categories: [...new Set(products.filter((x) => x.company === p.company).map((x) => x.category))],
        logo: p.logo,
      },
    ])
  ).values()
);

export default function DevelopersPage() {
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        <section className="px-6 py-16">
          <div className="max-w-6xl mx-auto">
            <p className="text-xs uppercase tracking-[0.2em] text-accent mb-4 font-medium">Developers &amp; Companies</p>
            <h1 className="text-3xl sm:text-4xl font-bold mb-5 heading-3d">
              Meet the <span className="gradient-text">Builders</span>
            </h1>
            <p className="text-muted text-lg max-w-xl mb-14">
              Discover the companies and independent developers behind the products on Launchbox.
            </p>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 perspective-container">
              {developers.map((dev) => (
                <div key={dev.name} className="card-3d rounded-2xl p-6 tilt-3d group">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-2xl icon-well shrink-0">
                      {dev.logo}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-base group-hover:text-accent transition-colors truncate">{dev.name}</h3>
                      <p className="text-xs text-muted">{dev.country} · {dev.productCount} product{dev.productCount > 1 ? "s" : ""}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 mb-4 text-sm">
                    <span className="flex items-center gap-1 text-yellow-400">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      {dev.avgRating}
                    </span>
                    <span className="text-xs text-muted">Support: {dev.avgSupport}%</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {dev.categories.map((cat) => (
                      <span key={cat} className="px-2 py-0.5 text-[10px] rounded-full bg-white/5 border border-white/10 text-muted">{cat}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FeedbackButton />
    </>
  );
}
