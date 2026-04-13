"use client";

import { useState } from "react";
import Logo from "./Logo";

const navLinks = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "For Creators", href: "/#audience" },
  { label: "About", href: "/#solution" },
  { label: "Contact", href: "/#contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{
      background: 'rgba(8,8,13,0.75)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
    }}>
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-14 flex items-center gap-6">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight shrink-0 mr-auto lift-hover">
          <Logo size={30} />
          <span><span className="gradient-text">Launch</span><span className="text-foreground">box</span></span>
        </a>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Search bar — desktop */}
        <div className={`hidden md:flex items-center relative ml-6 transition-all duration-300 ${searchFocused ? "w-64" : "w-48"}`}>
          <svg className="absolute left-3 w-4 h-4 text-muted pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search..."
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="w-full pl-9 pr-3 py-1.5 text-sm input-clean rounded-full text-foreground placeholder:text-muted/50 focus:outline-none"
          />
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-foreground p-2 -mr-2"
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {open ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-[#1E1E2A]/60 bg-[#050507]/95 backdrop-blur-2xl">
          <div className="px-6 py-4 flex flex-col gap-4">
            {/* Mobile search */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-9 pr-3 py-2 text-sm bg-white/5 border border-white/10 rounded-full text-foreground placeholder:text-muted/50 focus:outline-none focus:border-accent/50 transition-all"
              />
            </div>
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-sm text-muted hover:text-foreground transition-colors py-2"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
