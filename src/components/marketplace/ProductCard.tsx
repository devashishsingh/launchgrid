"use client";

import Link from "next/link";
import type { MarketplaceProduct } from "@/lib/marketplace-data";
import { TrustBadgeRow } from "./TrustBadges";
import { TrustScoreBadge } from "./TrustScoreDisplay";

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-3.5 h-3.5 ${star <= Math.round(rating) ? "text-yellow-400" : "text-white/10"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="text-xs text-muted ml-1">{rating}</span>
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
    <span className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium rounded-full border ${colors[variant]}`}>
      {children}
    </span>
  );
}

export default function ProductCard({ product }: { product: MarketplaceProduct }) {
  const supportVariant = product.supportScore >= 90 ? "green" : product.supportScore >= 80 ? "amber" : "default";

  return (
    <div className="card-3d rounded-2xl p-6 tilt-3d group flex flex-col glow-border-hover">
      {/* Header */}
      <div className="flex items-start gap-4 mb-3">
        <div className="w-12 h-12 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-2xl shrink-0 icon-well">
          {product.logo}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-base group-hover:text-accent transition-colors truncate">
            {product.name}
          </h3>
          <p className="text-xs text-muted truncate">{product.company} · {product.country}</p>
        </div>
        <TrustScoreBadge score={product.trustScore} size="sm" />
      </div>

      {/* Tagline */}
      <p className="text-sm text-muted leading-relaxed mb-3 line-clamp-2 flex-1">
        {product.tagline}
      </p>

      {/* Trust badges row */}
      <div className="mb-3">
        <TrustBadgeRow badges={product.trustBadges} max={3} />
      </div>

      {/* Rating + Support */}
      <div className="flex items-center gap-3 mb-3">
        <StarRating rating={product.rating} />
        <span className="text-[10px] text-muted">({product.reviewCount})</span>
        <Badge variant={supportVariant}>Support {product.supportScore}%</Badge>
      </div>

      {/* Tags row */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        <Badge variant="accent">{product.pricing}</Badge>
        <Badge>{product.deployment}</Badge>
        {product.customizable && <Badge variant="green">Customizable</Badge>}
        {product.isIndie && <Badge variant="amber">Indie Built</Badge>}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        <Link
          href={`/marketplace/product/${product.slug}`}
          className="flex-1 text-center py-2 text-xs font-semibold rounded-lg bg-accent/10 text-accent border border-accent/20 hover:bg-accent/20 transition-colors"
        >
          View Details
        </Link>
        <button className="px-3 py-2 text-xs rounded-lg bg-white/5 border border-white/10 text-muted hover:text-foreground hover:border-white/20 transition-colors">
          + Shortlist
        </button>
      </div>
    </div>
  );
}
