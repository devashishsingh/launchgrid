# Launchbox — Tech Stack, Architecture & Data Models

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Next.js (App Router) | 16.2.2 |
| UI Library | React | 19.2.4 |
| Styling | Tailwind CSS | 4.x |
| Language | TypeScript | 5.x |
| API | Next.js Route Handlers | Built-in |
| Fonts | Geist (via next/font) | — |
| Linting | ESLint + eslint-config-next | 9.x |
| PostCSS | postcss + @tailwindcss/postcss | — |
| Database | JSON files (in-memory) | Temporary |
| Deployment | Vercel | — |

**No external dependencies beyond core Next.js stack.** No ORMs, no auth libraries, no payment SDKs yet.

---

## Project Structure

```
src/
├── app/
│   ├── globals.css               # Tailwind imports + custom styles
│   ├── layout.tsx                # Root layout (Geist font, metadata)
│   ├── page.tsx                  # Landing page (20 sections)
│   ├── admin/
│   │   ├── page.tsx              # Admin entry
│   │   └── AdminDashboard.tsx    # 8-tab admin interface
│   ├── creator/
│   │   ├── page.tsx              # Creator entry
│   │   ├── CreatorDashboard.tsx  # 4-tab creator interface
│   │   └── onboard/page.tsx      # Token activation page
│   ├── marketplace/
│   │   ├── page.tsx              # Marketplace home
│   │   ├── software/             # Product directory
│   │   ├── product/[slug]/       # Product detail (dynamic)
│   │   ├── categories/           # Category browser
│   │   ├── developers/           # Developer directory
│   │   ├── vendors/              # Vendor directory
│   │   ├── compare/              # Side-by-side comparison
│   │   ├── shortlist/            # Buyer's saved list
│   │   ├── submit-requirement/   # Buyer: post a need
│   │   ├── requirement/[id]/     # Requirement detail (dynamic)
│   │   ├── responses/            # View seller responses
│   │   └── rfp/[id]/             # RFP detail (dynamic)
│   ├── seller/
│   │   ├── opportunities/        # Incoming RFP matches
│   │   ├── opportunity/[id]/     # Single opportunity (dynamic)
│   │   ├── responses/            # Submitted proposals
│   │   ├── shortlisted/          # Shortlisted RFPs
│   │   └── demos/                # Demo scheduling
│   └── api/                      # 15 Route Handlers
│       ├── leads/route.ts
│       ├── creators/route.ts
│       ├── products/route.ts
│       ├── workflow/route.ts
│       ├── agreements/route.ts
│       ├── support/route.ts
│       ├── transactions/route.ts
│       ├── users/route.ts
│       └── procurement/
│           ├── requirements/route.ts
│           ├── rfps/route.ts
│           ├── matches/route.ts
│           ├── responses/route.ts
│           └── opportunities/route.ts
├── components/
│   ├── (20 landing page components)
│   ├── marketplace/
│   │   ├── ProductCard.tsx
│   │   ├── TrustBadges.tsx
│   │   ├── TrustScoreDisplay.tsx
│   │   ├── MarketplaceFilters.tsx
│   │   └── FeedbackButton.tsx
│   └── procurement/
│       ├── NotificationBell.tsx
│       ├── ProcurementShell.tsx
│       └── SellerShell.tsx
└── lib/
    ├── db.ts                     # Creator platform database
    ├── procurement-db.ts         # Procurement database
    ├── procurement-types.ts      # TypeScript types for procurement
    ├── marketplace-data.ts       # Mock product data + types
    ├── match-engine.ts           # Vendor matching algorithm
    └── parsing-engine.ts         # Requirement parsing (rules-based)
```

---

## Database Layer

### Storage Method
- JSON files written to `data/db.json` and `data/procurement.json`
- `readDB()` / `writeDB()` functions for creator platform
- `read()` / `write()` functions for procurement
- Creates `data/` directory if missing
- Full file rewrite on each write (no partial updates)
- **Data resets on Vercel cold starts** (ephemeral filesystem)

### Creator Platform Collections (`db.ts`)

```
users[]         — Legacy user records (name, email, idea, status)
leads[]         — Lead capture submissions (13 fields + status)
creators[]      — Creator accounts (name, email, linkedIn, activationToken, activated, qualityScore)
products[]      — Creator products (name, description, status, userId)
transactions[]  — Sales records (productId, userId, amount, platformFee, status)
workflow[]      — 13-stage workflow entries (creatorId, stage, status, completedAt)
agreements[]    — 14-clause agreements (creatorId, clauseId, title, description, status, signedAt)
supportTickets[] — Support tickets (subject, type, priority, status, escalationLevel, resolution)
```

### Procurement Collections (`procurement-db.ts`)

```
buyers[]             — Buyer profiles (company, contact, plan, verification)
requirements[]       — Submitted problems (title, problem, budget, urgency, region, etc.)
parsedRequirements[] — Parsed output (category, tags, compliance, confidence, pricingBand)
rfps[]               — Formal RFPs (requirement → structured proposal request)
vendorMatches[]      — Match results (vendorSlug, matchScore, 5 breakdown scores, reasons)
sellerOpportunities[] — Opportunities pushed to sellers (status lifecycle)
rfpResponses[]       — Seller proposals (pricing, timeline, customizability, demo link)
shortlists[]         — Buyer's shortlisted vendors (with notes)
compareSessions[]    — Side-by-side comparison sessions
evaluationInvites[]  — Demo/discussion invitations
notifications[]      — In-app notifications (10 types)
buyerSearchUsage[]   — Usage tracking for monetization
```

---

## Match Engine (`match-engine.ts`)

### Algorithm
1. **Eligibility Filter:** Product must be "listed", trustScore ≥ 7.0, supportScore ≥ 60
2. **5 Scoring Dimensions** (each scored 0-100):
   - **categoryFit** (30% weight) — Exact category match = 100, partial word overlap = 60
   - **featureFit** (25% weight) — Match buyer's businessFunctionTags against product features
   - **geographyFit** (15% weight) — Same country = 100, global = 80
   - **supportFit** (15% weight) — Product's supportScore normalized
   - **trustFit** (15% weight) — Product's trustScore × 10
3. **Overall Score:** Weighted average
4. **Minimum Threshold:** Only matches scoring ≥ 30 are included
5. **Sort:** Descending by matchScore

### Input/Output
- **Input:** ParsedRequirement (from parsing engine)
- **Source data:** 12 mock marketplace products (from marketplace-data.ts)
- **Output:** Sorted array of VendorMatch objects

---

## Parsing Engine (`parsing-engine.ts`)

### Rules-Based Keyword Parsing (Not AI)
- Scans requirement text against keyword maps
- **12 categories:** HR/Payroll, Cybersecurity, Legal Tech, Compliance, Workflow Automation, AI Tools, CRM/Sales, Finance/Accounting, Procurement, Operations, Developer Tools, Analytics
- **20+ business function tags:** payroll, reporting, invoicing, compliance, onboarding, etc.
- **6 regions:** India, Malaysia, Singapore, USA, UAE, UK, Global
- **3 deployment types:** SaaS, On-Premise, Hybrid
- **6 compliance standards:** GDPR, HIPAA, PCI-DSS, SOX, ISO27001, SOC2

### Output
- `likelyCategory` — Best-matched category
- `possibleSoftwareTypes[]` — e.g., ["HRMS", "Payroll Platform"]
- `businessFunctionTags[]` — Extracted tags
- `supportNeeds` — From requirement.supportExpectation
- `pricingBand` — "Free" | "Budget" | "Mid-range" | "Enterprise" | "Flexible"
- `deploymentPreference` — SaaS | On-Premise | Hybrid
- `region` — Detected region
- `urgency` — Inherited from requirement
- `complianceFlags[]` — Detected compliance needs
- `confidence` — 0-100 score based on signal strength

---

## Marketplace Mock Data (`marketplace-data.ts`)

### 12 Demo Products
1. FlowDesk CRM (India, ⭐4.8, CRM/Sales)
2. ShieldWall (India, ⭐4.9, Cybersecurity)
3. PayStream HR (India, ⭐4.6, HR/Payroll)
4. Auditly (USA, ⭐4.7, Compliance)
5. NexFlow (India, ⭐4.5, Workflow Automation)
6. CogniParse AI (India, ⭐4.8, AI Tools)
7. LedgerBase (India, ⭐4.4, Finance/Accounting)
8. DevPipe (USA, ⭐4.7, Developer Tools)
9. ProcureX + others...

### Verification System (8 stages)
`submitted → identity_verification → product_testing → legal_verification → security_check → support_readiness → verified → listed`

### Trust Score (0-10, 7 metrics)
support, legalCompleteness, productTesting, securityBasics, responseSLA, reviews, complaintRatio

### 6 Trust Badges
launchdock_verified, tested, legal_ready, security_checked, support_ready, indie_founder

---

## Data Flow Summary

### Creator Pipeline
```
Landing Page → Lead (POST /api/leads)
    → Admin converts → Creator (POST /api/creators)
    → 14 Agreements seeded + 13 Workflow stages seeded
    → Activation link emailed → Creator activates (PATCH /api/creators)
    → Sign agreements one-by-one (PATCH /api/agreements)
    → List product (POST /api/products)
    → Workflow advances through 13 stages
    → Sales → Transactions (POST /api/transactions)
    → Support tickets (POST /api/support)
```

### Procurement Pipeline
```
Buyer submits requirement (POST /api/procurement/requirements)
    → Auto-parsed (parseRequirement engine)
    → Buyer issues RFP (POST /api/procurement/rfps)
    → Match engine runs → VendorMatches created
    → Sellers notified → SellerOpportunities created
    → Seller submits response (POST /api/procurement/responses)
    → Buyer shortlists (PATCH /api/procurement/responses, action: shortlist)
    → Buyer compares → Invites for demo
    → Final selection (won/lost)
```
