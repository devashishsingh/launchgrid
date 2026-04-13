# Launchbox — Frontend Pages & Components

> All pages use Next.js App Router under `src/app/`
> Components in `src/components/`
> Styling: Tailwind CSS 4 (utility-first)

---

## Landing Page (`/`)

20 sections rendered in order:

| # | Component | Purpose |
|---|-----------|---------|
| 1 | `Navbar` | Fixed top nav, logo, links, search bar, mobile toggle |
| 2 | `Hero` | Main pitch + stats panel (₹0 upfront, 100% your IP, Day 1 launch) + 6 trust chips |
| 3 | `MarqueeTicker` | Scrolling marquee banner |
| 4 | `Problem` | 8-card grid: barriers to selling (no company, legal fear, no GST, etc.) |
| 5 | `Insight` | Market insight / context |
| 6 | `Solution` | 4-card grid: sign contracts, send invoices, accept payments, keep everything |
| 7 | `WhatWeProvide` | Platform feature set |
| 8 | `WhatWeAre` | "What we are" (YES) vs. "What we're not" (NO) |
| 9 | `HowItWorks` | 6-step timeline: Submit → Discovery → Sign → Activate → Launch → Earn |
| 10 | `Audience` | Target audience callout |
| 11 | `Emotional` | Founder story / mission hook |
| 12 | `ActivationHook` | Urgency/activation section |
| 13 | `Trust` | 3-card trust: 100% IP, transparent revenue, exit-ready |
| 14 | `TrustBadge` | Badge showcase (verified, tested, legal-ready, security-checked, support-ready, indie founder) |
| 15 | `AdminPower` | Admin dashboard teaser |
| 16 | `FinalCTA` | Final call-to-action |
| 17 | `LeadCaptureForm` | 13-field application form + success state |
| 18 | `ContactForm` | Email/contact inquiry |
| 19 | `Footer` | Links, copyright, social |
| 20 | `StickyCTA` | Persistent bottom sticky "Apply to Launch" button |

**Animations:** `ScrollReveal` component wraps 8+ sections for fade-in on scroll.

---

## Creator Pages

### `/creator` — Creator Dashboard
- Component: `CreatorDashboard.tsx`
- **4 tabs:**
  - **Overview** — Quality score, workflow progress, agreements signed count, products count
  - **Workflow** — Visual timeline of 13 stages with completed/pending badges
  - **Agreements** — List of 14 clauses with individual "Sign" buttons, X/14 counter
  - **Products** — Creator's products filtered by userId

### `/creator/onboard` — Activation Page
- Reads `?token=` from URL
- Validates activation token via PATCH `/api/creators` (action: "activate")
- On success: redirects to `/creator?id={creatorId}`
- On failure: shows error (expired/invalid token)

---

## Admin Pages

### `/admin` — Admin Dashboard
- Component: `AdminDashboard.tsx`
- **8 tabs:**

| Tab | Shows | Actions |
|-----|-------|---------|
| Leads | All lead submissions, filter by status | Contact, Qualify, Convert to Creator |
| Creators | All creators, status, quality score | Activate, Suspend, Reinstate, Update quality score |
| Users | Legacy user records | Approve, Reject |
| Products | All products, filter by status | Publish, Pause, Suspend |
| Transactions | Sales data, fees, status | View revenue overview |
| Support | All tickets, filter by type/priority/escalation | Update status, Resolve, Escalate |
| Marketplace | 12 mock products, verification states, trust scores | View details |
| Procurement | Requirements, RFPs, matches, responses | Monitor workflow |

---

## Marketplace Pages (Buyer-Facing)

### `/marketplace` — Marketplace Home
- Hero section + why discovery is broken (4-card pain points)
- Filter tab preview

### `/marketplace/software` — Software Directory
- All 12 marketplace products in filterable grid
- **Sort:** Top Rated, Most Reviewed, Most Customizable, Low Cost, Newest, Global
- **Filters:** Category, pricing, deployment, rating, support score, tags
- Uses: `ProductCard`, `MarketplaceFilters`

### `/marketplace/product/[slug]` — Product Detail Page
- Full product page: logo, name, company, country, tagline, description
- Features list, ratings, reviews
- Trust score badge + 7-metric breakdown (support, legal, testing, security, SLA, reviews, complaints)
- Verification state + trust badges
- "Why Verified" section (summary, ideal use case, industries, customization)

### `/marketplace/categories` — Category Browse
- 12 categories: HR/Payroll, Cybersecurity, Legal Tech, Compliance, Workflow Automation, AI Tools, CRM/Sales, Finance/Accounting, Procurement, Operations, Developer Tools, Analytics

### `/marketplace/developers` — Developer Directory
- Browse indie makers / product founders

### `/marketplace/vendors` — Vendor Directory
- Browse vendor organizations

### `/marketplace/compare` — Vendor Comparison
- Select up to 5 vendors for side-by-side comparison
- Shows: match scores (categoryFit, featureFit, geographyFit, supportFit, trustFit)
- Shows: response details (pricing, timeline, customizability)

### `/marketplace/shortlist` — Buyer Shortlist
- Saved vendors with notes
- Remove from shortlist

### `/marketplace/submit-requirement` — Submit Requirement
- Full form: title, problem description, budget, urgency, region, compliance, deployment, support expectations
- On submit: auto-parsed → shows parsed results + confidence score
- Triggers match engine

### `/marketplace/requirement/[id]` — Requirement Detail
- Original problem, parsed output, status, next steps

### `/marketplace/responses` — View Seller Responses
- All responses to buyer's RFPs (pricing, timeline, demo link, contact info)

### `/marketplace/rfp/[id]` — RFP Detail
- Full RFP spec, response deadline, matched/shortlisted vendors, status

---

## Seller Pages

### `/seller/opportunities` — Opportunity Feed
- Incoming RFPs matched to seller's product
- Shows: title, buyer problem, budget, timeline, status, match score + reasons
- Shell: `SellerShell.tsx`

### `/seller/responses` — My Responses
- Submitted proposals with status tracking
- Shows: RFP detail, seller's response (pricing, timeline, customizability, demo link)

### `/seller/shortlisted` — Shortlisted
- RFPs where seller is shortlisted
- Buyer feedback, next steps, interview status

### `/seller/demos` — Demo Coordination
- Scheduled demos: date, buyer contact, link, status
- Status: pending → accepted → declined → completed

### `/seller/opportunity/[id]` — Opportunity Detail
- Single opportunity deep-dive

---

## Shared Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `ProductCard` | `components/marketplace/` | Card preview: logo, name, tagline, rating, support score, trust score, badges |
| `TrustBadges` | `components/marketplace/` | Badge row (6 types: verified, tested, legal_ready, security_checked, support_ready, indie_founder) |
| `TrustScoreDisplay` | `components/marketplace/` | Trust score 0-10 badge + 7-metric breakdown |
| `MarketplaceFilters` | `components/marketplace/` | Filter panel: category, pricing, deployment, rating, support, tags |
| `FeedbackButton` | `components/marketplace/` | Feedback/issue reporting button |
| `NotificationBell` | `components/procurement/` | Notification center for buyers/sellers |
| `ProcurementShell` | `components/procurement/` | Nav wrapper for procurement flow |
| `SellerShell` | `components/procurement/` | Nav wrapper for seller pages |
| `ScrollReveal` | `components/` | Scroll animation wrapper (fade-in on scroll) |
| `Logo` | `components/` | Launchbox logo component |
