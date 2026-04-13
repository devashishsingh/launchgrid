"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeedbackButton from "@/components/marketplace/FeedbackButton";
import { TrustBadgeGrid } from "@/components/marketplace/TrustBadges";
import { TrustScoreBadge, TrustScoreBreakdown } from "@/components/marketplace/TrustScoreDisplay";
import { products } from "@/lib/marketplace-data";

function StarRating({ rating, size = "md" }: { rating: number; size?: "sm" | "md" }) {
  const s = size === "sm" ? "w-3.5 h-3.5" : "w-5 h-5";
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg key={star} className={`${s} ${star <= Math.round(rating) ? "text-yellow-400" : "text-white/10"}`} fill="currentColor" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function Badge({ children, variant = "default" }: { children: React.ReactNode; variant?: "default" | "accent" | "green" | "amber" }) {
  const colors = {
    default: "bg-white/5 text-muted border-white/10",
    accent: "bg-accent/10 text-accent border-accent/20",
    green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };
  return (
    <span className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full border ${colors[variant]}`}>
      {children}
    </span>
  );
}

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const product = products.find((p) => p.slug === slug);

  if (!product) {
    return (
      <>
        <Navbar />
        <main className="flex-1 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-5xl mb-6">🔍</div>
            <h1 className="text-2xl font-bold mb-3">Product not found</h1>
            <p className="text-muted mb-6">The product you&apos;re looking for doesn&apos;t exist or has been removed.</p>
            <Link href="/marketplace" className="text-accent hover:underline text-sm">← Back to Marketplace</Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const supportVariant = product.supportScore >= 90 ? "green" : product.supportScore >= 80 ? "amber" : "default";

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        {/* Breadcrumb */}
        <div className="max-w-6xl mx-auto px-6 pt-8 pb-4">
          <nav className="flex items-center gap-2 text-xs text-muted">
            <Link href="/marketplace" className="hover:text-foreground transition-colors">Marketplace</Link>
            <span>/</span>
            <Link href={`/marketplace/categories?cat=${product.category.toLowerCase().replace(/[\s\/]+/g, "-")}`} className="hover:text-foreground transition-colors">{product.category}</Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </nav>
        </div>

        {/* Product Header */}
        <section className="px-6 pb-12">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-10">
              {/* Main info */}
              <div className="flex-1">
                <div className="flex items-start gap-5 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-3xl icon-well shrink-0">
                    {product.logo}
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h1 className="text-3xl font-bold heading-3d">{product.name}</h1>
                      <TrustScoreBadge score={product.trustScore} size="sm" />
                    </div>
                    <p className="text-muted text-sm">{product.company} · {product.country}{product.isIndie ? " · 🚀 Indie Founder" : ""}</p>
                  </div>
                </div>

                <p className="text-lg text-foreground/90 mb-6 leading-relaxed">{product.tagline}</p>

                <div className="flex flex-wrap items-center gap-3 mb-6">
                  <StarRating rating={product.rating} />
                  <span className="text-sm font-semibold">{product.rating}</span>
                  <span className="text-xs text-muted">({product.reviewCount} reviews)</span>
                  <Badge variant={supportVariant}>Support Score {product.supportScore}%</Badge>
                </div>

                <div className="flex flex-wrap gap-2 mb-8">
                  <Badge variant="accent">{product.pricing}{product.priceRange ? ` · ${product.priceRange}` : ""}</Badge>
                  <Badge>{product.deployment}</Badge>
                  {product.customizable && <Badge variant="green">Customizable</Badge>}
                  {product.tags.map((tag) => (
                    <Badge key={tag}>{tag}</Badge>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-wrap gap-3 mb-10">
                  <button className="btn-premium px-7 py-3 rounded-full text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-shadow">
                    Contact Vendor
                  </button>
                  <button className="px-7 py-3 rounded-full text-sm font-semibold border border-accent/30 text-accent hover:bg-accent/10 transition-colors">
                    + Shortlist
                  </button>
                  <button className="px-7 py-3 rounded-full text-sm font-semibold border border-white/10 text-muted hover:text-foreground hover:border-white/20 transition-colors">
                    Request Demo
                  </button>
                </div>
              </div>

              {/* Sidebar — Trust Score + Quick Info */}
              <div className="lg:w-80 shrink-0 space-y-6">
                {/* Trust Score Breakdown */}
                <TrustScoreBreakdown score={product.trustScore} />

                {/* Quick Info */}
                <div className="card-3d rounded-2xl p-6 space-y-5">
                  <h3 className="font-bold text-sm">Quick Info</h3>
                  <div className="space-y-3">
                    <InfoRow label="Category" value={product.category} />
                    <InfoRow label="Pricing" value={`${product.pricing}${product.priceRange ? ` (${product.priceRange})` : ""}`} />
                    <InfoRow label="Deployment" value={product.deployment} />
                    <InfoRow label="Customizable" value={product.customizable ? "Yes" : "No"} />
                    <InfoRow label="Company" value={product.company} />
                    <InfoRow label="Country" value={product.country} />
                    {product.yearFounded && <InfoRow label="Founded" value={String(product.yearFounded)} />}
                    <InfoRow label="Support Score" value={`${product.supportScore}%`} />
                    <InfoRow label="Verification" value={product.verification.state === "listed" ? "✅ Verified & Listed" : product.verification.state} />
                    <InfoRow label="Verified On" value={product.verification.verifiedAt ?? "—"} />
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="card-3d rounded-2xl p-6">
                  <h3 className="font-bold text-sm mb-4">Trust Badges</h3>
                  <TrustBadgeGrid badges={product.trustBadges} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Description */}
        <section className="px-6 pb-12 section-glow">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold mb-4 heading-3d">About {product.name}</h2>
            <p className="text-muted leading-relaxed max-w-3xl">{product.description}</p>
          </div>
        </section>

        {/* Why We Verified This Product */}
        <section className="px-6 pb-12">
          <div className="max-w-6xl mx-auto">
            <div className="card-elevated gradient-border rounded-2xl p-8 md:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-accent/5 rounded-full blur-[80px] pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">🔍</span>
                  <h2 className="text-xl font-bold heading-3d">Why we verified this product</h2>
                </div>
                <p className="text-muted leading-relaxed mb-6">{product.whyVerified.summary}</p>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-accent mb-2 font-medium">Verified Founder</h4>
                    <p className="text-sm">{product.verification.origin.founderName}</p>
                    <p className="text-xs text-muted mt-1">{product.verification.origin.businessLocation}</p>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-accent mb-2 font-medium">Ideal Use Case</h4>
                    <p className="text-sm text-muted">{product.whyVerified.idealUseCase}</p>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-accent mb-2 font-medium">Industries Fit</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {product.whyVerified.industriesFit.map((ind) => (
                        <span key={ind} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-muted">{ind}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs uppercase tracking-wider text-accent mb-2 font-medium">Customization Support</h4>
                    <p className="text-sm text-muted">{product.whyVerified.customizationSupport}</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-white/5">
                  <div className="flex flex-wrap gap-4 text-xs text-muted/60">
                    <span>Tested by: {product.verification.testing.testedBy}</span>
                    <span>Tested on: {product.verification.testing.testedOn}</span>
                    <span>Test result: <span className={product.verification.testing.status === "pass" ? "text-emerald-400" : "text-amber-400"}>{product.verification.testing.status.toUpperCase()}</span></span>
                    <span>Support SLA: {product.verification.support.issueResponseSLA}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Screenshots placeholder */}
        <section className="px-6 pb-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold mb-6 heading-3d">Screenshots &amp; Demo</h2>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="aspect-video rounded-xl bg-card border border-border flex items-center justify-center text-muted text-sm">
                  <div className="text-center">
                    <div className="text-2xl mb-2">🖼️</div>
                    <p>Screenshot {i}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="px-6 pb-12 section-glow">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold mb-6 heading-3d">Features</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 perspective-container">
              {product.features.map((feature) => (
                <div key={feature} className="flex items-center gap-3 p-4 card-3d rounded-xl tilt-3d">
                  <svg className="w-4 h-4 text-accent shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Support & Verification */}
        <section className="px-6 pb-12">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold mb-6 heading-3d">Support &amp; Readiness</h2>
            <div className="grid sm:grid-cols-2 gap-6 max-w-3xl">
              <div className="card-3d rounded-2xl p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-3xl">🎧</div>
                  <div>
                    <p className="text-2xl font-bold">{product.supportScore}%</p>
                    <p className="text-xs text-muted">Support Score</p>
                  </div>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden mb-3">
                  <div className="h-full rounded-full bg-gradient-to-r from-accent to-indigo-500 transition-all" style={{ width: `${product.supportScore}%` }} />
                </div>
                <div className="space-y-2 text-xs text-muted">
                  <div className="flex justify-between"><span>Support Owner</span><span className="text-foreground">{product.verification.support.supportOwner}</span></div>
                  <div className="flex justify-between"><span>Response SLA</span><span className="text-foreground">{product.verification.support.issueResponseSLA}</span></div>
                  <div className="flex justify-between"><span>Bug Fix Ownership</span><span className="text-emerald-400">{product.verification.support.bugFixOwnership ? "Yes" : "No"}</span></div>
                  <div className="flex justify-between"><span>Maintenance</span><span className="text-emerald-400">{product.verification.support.maintenanceCommitment ? "Committed" : "Not confirmed"}</span></div>
                </div>
              </div>

              <div className="card-3d rounded-2xl p-6">
                <h3 className="font-bold text-sm mb-4">Verification Checklist</h3>
                <div className="space-y-2">
                  {[
                    { label: "Identity Verified", pass: product.verification.origin.ownershipDeclaration },
                    { label: "Product Tested", pass: product.verification.testing.status === "pass" },
                    { label: "Legal Docs Complete", pass: product.verification.legal.termsAndConditions && product.verification.legal.privacyPolicy },
                    { label: "HTTPS Enforced", pass: product.verification.security.https },
                    { label: "Auth Protection", pass: product.verification.security.authProtection },
                    { label: "Session Security", pass: product.verification.security.sessionSecurity },
                    { label: "Support SLA Defined", pass: product.verification.legal.supportSLA },
                    { label: "Refund Policy", pass: product.verification.legal.refundPolicy },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2 text-xs">
                      <span className={item.pass ? "text-emerald-400" : "text-red-400"}>{item.pass ? "✓" : "✗"}</span>
                      <span className="text-muted">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ratings / Reviews */}
        <section className="px-6 pb-12 section-glow">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-xl font-bold mb-6 heading-3d">Ratings &amp; Reviews</h2>
            <div className="card-3d rounded-2xl p-8 text-center max-w-md">
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className="text-4xl font-bold">{product.rating}</span>
                <div>
                  <StarRating rating={product.rating} size="md" />
                  <p className="text-xs text-muted mt-1">{product.reviewCount} verified reviews</p>
                </div>
              </div>
              <p className="text-sm text-muted">All reviews are verified by Launchbox. Detailed review system coming soon.</p>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="px-6 pb-20">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4 heading-3d">Interested in {product.name}?</h2>
            <p className="text-muted mb-8">Every product here has been verified, tested, and reviewed for business readiness.</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="btn-premium px-8 py-3 rounded-full text-sm font-semibold text-white shadow-lg">
                Contact Vendor
              </button>
              <button className="px-8 py-3 rounded-full text-sm font-semibold border border-accent/30 text-accent hover:bg-accent/10 transition-colors">
                + Shortlist
              </button>
              <Link href="/marketplace" className="px-8 py-3 rounded-full text-sm font-semibold border border-white/10 text-muted hover:text-foreground hover:border-white/20 transition-colors">
                ← Back to Marketplace
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <FeedbackButton />
    </>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-muted">{label}</span>
      <span className="font-medium text-right max-w-[60%] truncate">{value}</span>
    </div>
  );
}
