# Launchbox — MVP Project Overview

> **Last updated:** April 13, 2026
> **Status:** MVP complete, pre-launch (demo deployment)
> **Repo:** https://github.com/devashishsingh/launchgrid
> **Branch:** main

---

## What Is Launchbox?

Launchbox (codebase name: `launchdock`) is a platform that lets independent software creators list, sell, and get paid for their products — all under Launchbox's company umbrella. Creators don't need company registration, GST, or legal setup. Launchbox handles billing, compliance, payouts, and trust. Creators just build and ship.

**Launching in India first.** Malaysia expansion planned later.

---

## What the MVP Includes

### 1. Landing Page (Conversion-Optimized)
- 20 strategically ordered sections
- Lead capture form (13 fields)
- Scroll animations, sticky CTA, marquee ticker
- Trust badges, problem/solution framing, social proof

### 2. Creator Platform
- **Lead Capture → Creator Onboarding → Activation** pipeline
- 14-clause digital agreement system (sign individually)
- 13-stage workflow ledger (lead_received → payout_released)
- Creator dashboard (4 tabs: Overview, Workflow, Agreements, Products)
- Token-based activation (72-hour expiry)
- Quality score tracking (0-100)

### 3. Admin Dashboard
- 8-tab command center: Leads, Creators, Users, Products, Transactions, Support, Marketplace, Procurement
- Full CRUD on all entities
- Support ticket escalation (creator → founder → termination_review)

### 4. B2B Procurement Marketplace
- Buyer submits a requirement → auto-parsed into structured data
- Match engine scores marketplace products against parsed requirements
- RFP workflow: draft → issued → responses → shortlisted → evaluation → closed
- 12 mock marketplace products with full verification records and trust scores

### 5. Seller Hub
- Sellers see matched RFP opportunities
- Submit proposals with pricing, timeline, demo links
- Track shortlist status, schedule demos

### 6. API Layer
- 15 API routes (all Next.js Route Handlers)
- In-memory JSON file database (no external DB yet)
- All routes functional and tested via build

---

## Revenue Model (LOCKED — Do Not Change)

| Tier | Transaction Value | Commission |
|------|-------------------|------------|
| Starter | < ₹50,000 | 15% |
| Growth | ₹50K – ₹2,00,000 | 10% |
| Scale | > ₹2,00,000 | 5% |

- **Platform Fee:** ₹2,499/mo or ₹22,491/yr (25% off annual)
- **Payout Cycle:** Creator's choice (weekly / biweekly / monthly)
- **Min Payout Threshold:** ₹500
- **Payment Provider:** Razorpay (single account + Razorpay Route for creator payouts)

---

## What's NOT Built Yet

1. **Payments** — Razorpay integration (subscriptions + Route payouts)
2. **Database** — Supabase migration (currently JSON file DB, resets on cold start)
3. **Authentication** — No auth middleware; no login/signup; all routes are open
4. **Email** — Resend integration (activation links, receipts, notifications)
5. **File Storage** — Signed agreement PDFs
6. **Analytics** — GA4
7. **Production Deploy** — Vercel (demo deployed, not production-ready)

---

## Key Decisions Made

- Solo founder project — minimalist, modular approach
- Next.js App Router (no Pages Router)
- All state is ephemeral (in-memory DB) until Supabase migration
- Trust/verification system is rules-based (not ML)
- Match engine is keyword-based (not AI) — works for MVP scale
- Parsing engine uses keyword maps for 12 categories, 20+ business tags, 6 regions, 6 compliance standards
