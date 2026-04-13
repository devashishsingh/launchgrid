# Launchbox — Roadmap & Next Steps

---

## Current State (April 2026)

**MVP Status:** Feature-complete for demo/preview. Not production-ready.

### What Works
- ✅ Full landing page with lead capture (20 sections, conversion-optimized)
- ✅ Creator onboarding pipeline (lead → activation → agreements → product listing)
- ✅ 14-clause agreement system (individual signing)
- ✅ 13-stage workflow ledger (lead_received → payout_released)
- ✅ Admin dashboard (8 tabs: leads, creators, users, products, transactions, support, marketplace, procurement)
- ✅ B2B procurement marketplace (requirement → parsing → matching → RFP → responses → shortlist)
- ✅ Seller hub (opportunities, responses, shortlisted, demos)
- ✅ Match engine (5-dimensional scoring, keyword-based)
- ✅ Parsing engine (12 categories, 20+ tags, 6 regions, 6 compliance standards)
- ✅ 12 mock marketplace products with full verification records + trust scores
- ✅ 15 API routes (all functional)
- ✅ Build passes, deployed to Vercel

### What Doesn't Work (Yet)
- ❌ No persistent database (JSON files, resets on cold start)
- ❌ No authentication (all routes are open, no login/signup)
- ❌ No payments (no subscriptions, no sales processing, no payouts)
- ❌ No email (no activation emails, no receipts, no notifications)
- ❌ No file storage (no signed PDFs, no uploads)
- ❌ No analytics tracking

---

## Implementation Roadmap (Priority Order)

### Phase 1: Foundation (Must-Do Before Launch)

#### 1. Supabase Migration
- Replace JSON file DB with Supabase PostgreSQL
- Tables needed: users, leads, creators, products, transactions, workflow, agreements, support_tickets, buyers, requirements, parsed_requirements, rfps, vendor_matches, seller_opportunities, rfp_responses, shortlists, notifications
- Supabase Auth for login/signup (email + OAuth)
- Supabase Storage for file uploads
- **Waiting on:** Supabase project credentials

#### 2. Authentication
- Supabase Auth integration
- Protected routes: `/admin/*` (admin only), `/creator/*` (authenticated creator), `/seller/*` (authenticated seller)
- Role-based access: admin, creator, buyer, seller
- Session management via Supabase Auth helpers for Next.js

#### 3. Razorpay Payments
- **Platform fee subscriptions:** ₹2,499/mo or ₹22,491/yr
- **Product sales:** One-time payments through marketplace
- **Commission split:** Auto-calculated (15% / 10% / 5% tiers)
- **Creator payouts:** Razorpay Route (split payments to creator bank accounts)
- Single Razorpay account, single bank account
- **Waiting on:** Razorpay account + API keys

#### 4. Email Integration (Resend)
- Lead acknowledgment emails
- Creator activation links (replace the manual token system)
- Payout notifications
- RFP match notifications (to sellers)
- Shortlist notifications
- Support ticket updates
- **Waiting on:** Resend API key

### Phase 2: Polish (Pre-Launch)

#### 5. File Storage
- Supabase Storage for:
  - Signed agreement PDFs
  - Product screenshots/demos
  - RFP attachments
  - Creator profile images

#### 6. Analytics
- GA4 integration
- Track: page views, lead submissions, creator activations, marketplace searches, product views, RFP submissions

#### 7. Production Deploy
- Vercel production environment
- Custom domain
- Environment variables configured
- Error monitoring (Sentry or similar)

### Phase 3: Growth (Post-Launch)

- Real AI parsing (replace keyword engine with LLM-based)
- AI-powered matching (upgrade from rules-based)
- Creator rating/review system (real reviews, not mock)
- Buyer plans (free/pro/enterprise with feature gating)
- Advanced analytics dashboard
- Mobile responsiveness audit
- SEO optimization
- Malaysia expansion

---

## Credentials Needed Before Next Session

| Service | What's Needed | Status |
|---------|--------------|--------|
| Supabase | Project URL + anon key + service role key | ⏳ Waiting |
| Razorpay | Key ID + Key Secret | ⏳ Waiting |
| Resend | API key | ⏳ Waiting |
| Vercel | Connected (via GitHub) | ✅ Done |
| GitHub | Repo (devashishsingh/launchgrid) | ✅ Done |
| Domain | Custom domain for Vercel | ⏳ Waiting |
| Company registration | For Razorpay + legal | ⏳ In progress |
| Bank account | For Razorpay payouts | ⏳ In progress |

---

## Quick Reference for AI Assistants

If you're an AI assistant helping continue this project:

1. **Workspace:** `c:\Users\User\Documents\Launch pad\launchdock`
2. **Repo:** https://github.com/devashishsingh/launchgrid (branch: main)
3. **Framework:** Next.js 16 App Router, React 19, Tailwind CSS 4, TypeScript 5
4. **Database:** Currently JSON files in `data/` — migrating to Supabase
5. **No auth, no payments, no email** — all are on the roadmap
6. **Revenue model is LOCKED** — do not change pricing/commission structure
7. **Read this entire `parent MVP document/` folder** before making changes
8. **The codebase name is `launchdock` but the brand is `Launchbox`**
9. **India-first launch**, Malaysia expansion later
10. **Solo founder** — keep solutions minimalist and modular
