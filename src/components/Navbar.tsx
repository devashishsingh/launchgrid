"use client";

import Link from "next/link";
import { useState } from "react";
import Logo from "./Logo";

const navLinks = [
  { label: "Work", href: "/#how-it-works" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Creators", href: "/#audience" },
  { label: "About", href: "/#solution" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Fixed mix-blend nav: inverts over light backgrounds, stays white over dark */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 mix-blend-nav pointer-events-none"
        aria-label="Primary"
      >
        <div className="pointer-events-auto px-8 md:px-12 py-6 md:py-7 flex items-center justify-between">
          {/* Logo wordmark */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
            <Logo size={28} variant="mono" className="text-white" />
            <span className="font-display text-2xl tracking-[0.18em]">BLYOI</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-[11px] uppercase tracking-[0.22em] font-semibold hover:opacity-60 transition-opacity duration-500"
                style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Get in Touch CTA */}
          <Link
            href="/#contact"
            className="hidden md:inline-flex items-center gap-2 border border-white px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] font-semibold transition-all duration-500 hover:bg-white hover:text-black"
            style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
          >
            Get in Touch
          </Link>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 -mr-2"
            aria-label="Toggle menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {open ? (
                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth={1.5} d="M4 8h16M4 16h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu — full screen panel, normal blend */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40 bg-navy text-white px-8 pt-24 pb-10 flex flex-col">
          <div className="flex flex-col gap-6 mt-6">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="font-display text-5xl uppercase tracking-tight hover:text-sage transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Link
              href="/#contact"
              onClick={() => setOpen(false)}
              className="mt-6 inline-flex items-center self-start border border-white px-6 py-3 text-[11px] uppercase tracking-[0.22em] font-semibold hover:bg-white hover:text-navy transition-all duration-500"
            >
              Get in Touch
            </Link>
          </div>
          <div className="mt-auto eyebrow text-white/40">
            Build life like you own it.
          </div>
        </div>
      )}
    </>
  );
}
