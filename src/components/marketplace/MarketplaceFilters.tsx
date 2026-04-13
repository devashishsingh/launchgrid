"use client";

import { useState } from "react";
import { filterOptions } from "@/lib/marketplace-data";

interface Filters {
  category: string;
  pricing: string;
  deployment: string;
  rating: string;
  support: string;
  tag: string;
}

export default function MarketplaceFilters({
  onFilterChange,
}: {
  onFilterChange: (filters: Filters) => void;
}) {
  const [filters, setFilters] = useState<Filters>({
    category: "",
    pricing: "",
    deployment: "",
    rating: "",
    support: "",
    tag: "",
  });

  const update = (key: keyof Filters, value: string) => {
    const next = { ...filters, [key]: filters[key] === value ? "" : value };
    setFilters(next);
    onFilterChange(next);
  };

  const activeCount = Object.values(filters).filter(Boolean).length;

  const clearAll = () => {
    const empty: Filters = { category: "", pricing: "", deployment: "", rating: "", support: "", tag: "" };
    setFilters(empty);
    onFilterChange(empty);
  };

  return (
    <div className="card-3d rounded-2xl p-6 space-y-5 sticky top-20">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm flex items-center gap-2">
          <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
          {activeCount > 0 && (
            <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-accent text-white">{activeCount}</span>
          )}
        </h3>
        {activeCount > 0 && (
          <button onClick={clearAll} className="text-xs text-accent hover:underline">Clear all</button>
        )}
      </div>

      {/* Category */}
      <FilterGroup label="Category">
        {filterOptions.categories.map((c) => (
          <FilterChip key={c} active={filters.category === c} onClick={() => update("category", c)}>{c}</FilterChip>
        ))}
      </FilterGroup>

      {/* Pricing */}
      <FilterGroup label="Pricing">
        {filterOptions.pricing.map((p) => (
          <FilterChip key={p} active={filters.pricing === p} onClick={() => update("pricing", p)}>{p}</FilterChip>
        ))}
      </FilterGroup>

      {/* Deployment */}
      <FilterGroup label="Deployment">
        {filterOptions.deployment.map((d) => (
          <FilterChip key={d} active={filters.deployment === d} onClick={() => update("deployment", d)}>{d}</FilterChip>
        ))}
      </FilterGroup>

      {/* Rating */}
      <FilterGroup label="Rating">
        {filterOptions.rating.map((r) => (
          <FilterChip key={r} active={filters.rating === r} onClick={() => update("rating", r)}>{r}</FilterChip>
        ))}
      </FilterGroup>

      {/* Support Quality */}
      <FilterGroup label="Support Quality">
        {filterOptions.supportQuality.map((s) => (
          <FilterChip key={s} active={filters.support === s} onClick={() => update("support", s)}>{s}</FilterChip>
        ))}
      </FilterGroup>

      {/* Tags */}
      <FilterGroup label="Tags">
        {filterOptions.tags.map((t) => (
          <FilterChip key={t} active={filters.tag === t} onClick={() => update("tag", t)}>{t}</FilterChip>
        ))}
      </FilterGroup>
    </div>
  );
}

function FilterGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs text-muted uppercase tracking-wider mb-2">{label}</p>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function FilterChip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-2.5 py-1 text-[11px] rounded-full border transition-all ${
        active
          ? "bg-accent/15 text-accent border-accent/30 font-medium"
          : "bg-white/5 text-muted border-white/10 hover:border-white/20 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
