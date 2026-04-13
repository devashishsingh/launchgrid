// =============================================================
// Match Engine — Rules-based vendor matching (MVP)
// Scores marketplace products against parsed requirements
// =============================================================

import type { ParsedRequirement, VendorMatch } from "./procurement-types";
import { products, type MarketplaceProduct } from "./marketplace-data";

interface MatchScores {
  categoryFit: number;
  featureFit: number;
  geographyFit: number;
  supportFit: number;
  trustFit: number;
  matchScore: number;
  matchReasons: string[];
}

function scoreCategoryFit(parsed: ParsedRequirement, product: MarketplaceProduct): { score: number; reason: string | null } {
  if (product.category === parsed.likelyCategory) return { score: 100, reason: `Category match: ${product.category}` };

  // Partial match via tags
  const catWords = parsed.likelyCategory.toLowerCase().split(/[\s/]+/);
  const productCatWords = product.category.toLowerCase().split(/[\s/]+/);
  const overlap = catWords.filter((w) => productCatWords.includes(w));
  if (overlap.length > 0) return { score: 60, reason: `Partial category match via: ${overlap.join(", ")}` };

  return { score: 0, reason: null };
}

function scoreFeatureFit(parsed: ParsedRequirement, product: MarketplaceProduct): { score: number; reason: string | null } {
  if (parsed.businessFunctionTags.length === 0) return { score: 50, reason: null };

  const productTextLower = `${product.name} ${product.tagline} ${product.description} ${product.features.join(" ")} ${product.tags.join(" ")}`.toLowerCase();
  let matchCount = 0;
  const matchedTags: string[] = [];

  for (const tag of parsed.businessFunctionTags) {
    const tagLower = tag.toLowerCase().replace(/_/g, " ");
    if (productTextLower.includes(tagLower)) {
      matchCount++;
      matchedTags.push(tag);
    }
  }

  const score = Math.round((matchCount / parsed.businessFunctionTags.length) * 100);
  const reason = matchedTags.length > 0 ? `Feature tags matched: ${matchedTags.join(", ")}` : null;
  return { score, reason };
}

function scoreGeographyFit(parsed: ParsedRequirement, product: MarketplaceProduct): { score: number; reason: string | null } {
  if (!parsed.region || parsed.region === "Global") return { score: 80, reason: null };

  const productCountryLower = product.country.toLowerCase();
  const regionLower = parsed.region.toLowerCase();

  if (productCountryLower.includes(regionLower) || regionLower.includes(productCountryLower)) {
    return { score: 100, reason: `Geography match: ${product.country}` };
  }

  // Check tags for region
  const hasGlobal = product.tags.some((t) => t.toLowerCase() === "global");
  if (hasGlobal) return { score: 70, reason: "Vendor operates globally" };

  return { score: 30, reason: null };
}

function scoreSupportFit(parsed: ParsedRequirement, product: MarketplaceProduct): { score: number; reason: string | null } {
  const supportScore = product.supportScore || 0;
  const trustSupport = product.trustScore?.breakdown?.support || 0;
  const combined = Math.max(supportScore / 10, trustSupport) * 10; // Normalize to 0-100
  const reason = combined >= 80 ? `Strong support: ${product.supportScore}/100, trust support: ${trustSupport}/10` : null;
  return { score: Math.round(combined), reason };
}

function scoreTrustFit(product: MarketplaceProduct): { score: number; reason: string | null } {
  const overall = product.trustScore?.overall || 0;
  const score = Math.round(overall * 10); // 0-100
  const isVerified = product.verification?.state === "listed";
  const reason = isVerified ? `Verified vendor, trust score: ${overall}/10` : null;
  return { score, reason };
}

// ---- Eligibility filter ----

function isEligible(product: MarketplaceProduct): boolean {
  // Must be listed (verified)
  if (product.verification?.state !== "listed") return false;
  // Must have trust score >= 7
  if ((product.trustScore?.overall || 0) < 7) return false;
  // Must have support score >= 60
  if ((product.supportScore || 0) < 60) return false;
  return true;
}

// ---- Main match function ----

export function matchVendors(
  parsed: ParsedRequirement,
  rfpId: string
): Omit<VendorMatch, "id" | "notified" | "notifiedAt" | "createdAt">[] {
  const results: Omit<VendorMatch, "id" | "notified" | "notifiedAt" | "createdAt">[] = [];

  for (const product of products) {
    if (!isEligible(product)) continue;

    const category = scoreCategoryFit(parsed, product);
    const feature = scoreFeatureFit(parsed, product);
    const geo = scoreGeographyFit(parsed, product);
    const support = scoreSupportFit(parsed, product);
    const trust = scoreTrustFit(product);

    // Weighted overall score
    const matchScore = Math.round(
      category.score * 0.30 +
      feature.score * 0.25 +
      geo.score * 0.15 +
      support.score * 0.15 +
      trust.score * 0.15
    );

    // Only include products with score >= 30
    if (matchScore < 30) continue;

    const matchReasons: string[] = [];
    if (category.reason) matchReasons.push(category.reason);
    if (feature.reason) matchReasons.push(feature.reason);
    if (geo.reason) matchReasons.push(geo.reason);
    if (support.reason) matchReasons.push(support.reason);
    if (trust.reason) matchReasons.push(trust.reason);

    results.push({
      requirementId: parsed.requirementId,
      rfpId,
      vendorSlug: product.slug,
      matchScore,
      matchReasons,
      categoryFit: category.score,
      featureFit: feature.score,
      geographyFit: geo.score,
      supportFit: support.score,
      trustFit: trust.score,
    });
  }

  // Sort by match score descending
  results.sort((a, b) => b.matchScore - a.matchScore);
  return results;
}
