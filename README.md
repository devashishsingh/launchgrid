<div align="center">

# 🚀 Launchbox

### *Your launchpad to sell software — before you even have a company.*

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

<br />

**Launchbox** lets independent software creators list, sell, and get paid for their products — all under our company umbrella. No company registration needed. No legal headaches. Just build, ship, earn.

[🌐 Live Demo](#) · [📖 How It Works](#how-it-works) · [🏗️ Architecture](#architecture)

---

</div>

## ✨ Why Launchbox?

> You built something amazing. But selling software in India means GST registration, company formation, compliance nightmares, and months of waiting. **What if you didn't have to?**

Launchbox is the umbrella platform where creators sell their software products through our legal entity. We handle billing, compliance, payouts, and trust — you handle building great software.

<div align="center">

| 🧑‍💻 **For Creators** | 🏢 **For Buyers** | ⚡ **For Everyone** |
|:---:|:---:|:---:|
| Sell without a company | Verified, trusted marketplace | Transparent pricing |
| Automated payouts | Smart procurement matching | Real-time dashboards |
| Full analytics | RFP → Response workflow | Support & escalation |

</div>

---

## 🎯 Features

### 🛒 Procurement Marketplace
- **Smart Matching Engine** — AI-powered matching between buyer requirements and seller products
- **RFP Workflow** — Full request-for-proposal lifecycle (submit → match → respond → shortlist → decide)
- **Category Browsing** — Software, developers, vendors with advanced filters
- **Product Comparison** — Side-by-side feature comparison for shortlisted products
- **Trust Scores** — Transparent reputation system for every listing

### 👨‍💻 Creator Portal
- **Onboarding Flow** — Guided setup: profile → product → agreement → go live
- **Creator Dashboard** — Revenue tracking, product management, payout history
- **14-Clause Agreement** — Digital agreement system protecting both parties

### 🏪 Seller Hub
- **Opportunity Feed** — Browse open procurement requirements matching your products
- **Response Management** — Craft and track RFP responses
- **Demo Scheduling** — Manage demo requests from interested buyers
- **Shortlist Tracking** — Know when you're shortlisted in real-time

### 🔧 Admin Dashboard
- **6-Tab Command Center** — Leads, Creators, Users, Products, Transactions, Support
- **13-Stage Workflow Ledger** — Track every creator from signup to first sale
- **Support Escalation** — Tiered ticket system with priority routing

### 🚀 Landing Page
- **Conversion-Optimized** — 15+ strategically ordered sections
- **Lead Capture** — Smart forms with progressive profiling
- **Social Proof** — Trust badges, testimonials, marquee ticker

---

<a id="how-it-works"></a>
## 🔄 How It Works

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Creator    │     │  Launchbox  │     │ Marketplace  │     │    Buyer    │
│  Signs Up   │────▶│  Onboards   │────▶│   Lists It   │────▶│   Finds &   │
│  + Uploads  │     │  + Agreement│     │  + Trust Score│     │   Buys It   │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                                                    │
                    ┌─────────────┐     ┌─────────────┐            │
                    │   Creator   │◀────│  Launchbox   │◀───────────┘
                    │  Gets Paid  │     │  Splits &    │
                    │  (Payout)   │     │  Routes Pay  │
                    └─────────────┘     └─────────────┘
```

---

<a id="architecture"></a>
## 🏗️ Architecture

```
src/
├── app/
│   ├── page.tsx                    # Landing page (15+ sections)
│   ├── admin/                      # Admin dashboard (6 tabs)
│   ├── creator/                    # Creator portal + onboarding
│   ├── marketplace/                # Buyer-facing marketplace
│   │   ├── categories/             # Browse by category
│   │   ├── compare/                # Product comparison
│   │   ├── product/[slug]/         # Product detail pages
│   │   ├── rfp/[id]/               # RFP detail view
│   │   ├── submit-requirement/     # Post a procurement need
│   │   └── ...                     # Shortlist, responses, vendors
│   ├── seller/                     # Seller hub
│   │   ├── opportunities/          # Browse matching opportunities
│   │   ├── responses/              # Manage RFP responses
│   │   ├── demos/                  # Demo request management
│   │   └── shortlisted/            # Track shortlist status
│   └── api/                        # 15 API routes
│       ├── leads/                  # Lead capture & management
│       ├── creators/               # Creator CRUD
│       ├── products/               # Product catalog + PATCH
│       ├── procurement/            # Matching, RFPs, responses
│       ├── workflow/               # 13-stage workflow ledger
│       ├── agreements/             # Digital agreement system
│       └── support/                # Support & escalation
├── components/                     # 25+ reusable components
└── lib/                            # DB, matching engine, parsers
```

---

## 💰 Platform Economics

| Tier | Transaction Value | Commission |
|:-----|:-----------------|:-----------|
| 🥉 Starter | < ₹50,000 | 15% |
| 🥈 Growth | ₹50K – ₹2L | 10% |
| 🥇 Scale | > ₹2,00,000 | 5% |

**Platform Fee:** ₹2,499/mo or ₹22,491/yr (save 25%)

---

## ⚡ Quick Start

```bash
# Clone the repo
git clone https://github.com/devashishsingh/launchgrid.git
cd launchgrid

# Install dependencies
npm install

# Run development server
npm run dev
```

Open **http://localhost:3000** and explore.

---

## 🛠️ Tech Stack

| Layer | Technology |
|:------|:-----------|
| **Framework** | Next.js 16 (App Router) |
| **UI** | React 19 + Tailwind CSS 4 |
| **Language** | TypeScript 5 |
| **API** | Next.js Route Handlers (15 endpoints) |
| **Fonts** | Geist (via `next/font`) |

---

## 🗺️ Roadmap

- [x] Landing page with lead capture
- [x] Creator dashboard + onboarding
- [x] Admin dashboard (6 tabs)
- [x] Procurement marketplace + matching engine
- [x] Seller hub (opportunities, responses, demos)
- [x] 15 API routes
- [ ] Razorpay payments (subscriptions + Route payouts)
- [ ] Supabase migration (DB + Auth + Storage)
- [ ] Email notifications (Resend)
- [ ] Analytics (GA4)
- [ ] Production deploy

---

<div align="center">

**Built with ☕ and conviction in Bangalore, India.**

*Because great software shouldn't wait for paperwork.*

<br />

[![GitHub](https://img.shields.io/badge/GitHub-devashishsingh-181717?style=flat-square&logo=github)](https://github.com/devashishsingh)

</div>

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
