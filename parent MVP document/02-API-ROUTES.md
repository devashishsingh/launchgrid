# Launchbox — API Routes Reference

> All routes are Next.js Route Handlers under `src/app/api/`
> Database: In-memory JSON files (`data/db.json` and `data/procurement.json`)
> No authentication middleware — all routes are open (auth not built yet)

---

## Creator Platform APIs

### `POST /api/leads` — Lead Capture
- **Methods:** GET, POST, PATCH
- **POST fields:** fullName, email, linkedIn, productName, productCategory, problemStatement, currentStage, existingUrl, expectedPrice, supportCommitment, termsAcknowledged, leadSource
- **Enums:**
  - `currentStage`: "prototype" | "mvp" | "live"
  - `leadSource`: "linkedin" | "instagram" | "facebook" | "youtube" | "website" | "referral" | "college" | "incubator"
  - `status`: "new" | "contacted" | "qualified" | "converted" | "rejected"
- **Behavior:** Auto-assigns status "new" on creation

### `/api/creators` — Creator Management
- **Methods:** GET, POST, PATCH
- **GET:** Optional `?id=` param to fetch single creator
- **POST fields:** leadId, fullName, email, linkedIn
- **PATCH actions:**
  - `action: "activate"` + `token` — Activate account (must be within 72hr token expiry)
  - `action: "suspend"` — Suspend creator + all their products
  - `action: "reinstate"` — Reinstate suspended creator
  - `action: "quality_score"` + `qualityScore` (0-100) — Update quality metric
- **On creation:** Auto-seeds 14 agreements + 13 workflow stages, generates activation token (UUID, 72hr expiry)

### `/api/products` — Product Management
- **Methods:** GET, POST, PATCH
- **POST fields:** userId, name, description
- **PATCH fields:** id, status
- **Status values:** "draft" | "active" | "paused" | "suspended"

### `/api/workflow` — 13-Stage Workflow Ledger
- **Methods:** GET, PATCH
- **GET:** `?creatorId=` (required) — returns all 13 stages for creator
- **PATCH:** `creatorId` + `stage` — marks stage as "completed" with timestamp
- **13 stages (in order):**
  1. lead_received (auto-completed on creation)
  2. founder_contacted
  3. discovery_completed
  4. payment_pending
  5. payment_received
  6. activation_sent
  7. account_active
  8. agreements_pending
  9. agreements_signed
  10. product_listed
  11. first_sale
  12. payout_pending
  13. payout_released

### `/api/agreements` — 14-Clause Agreement System
- **Methods:** GET, PATCH
- **GET:** `?creatorId=` (required) — returns all 14 agreements
- **PATCH:** `id` (agreement ID) — marks single clause as "signed" + signedAt timestamp
- **14 clauses:**
  1. authorization_to_sell — Creator authorizes Launchbox to list/sell under its umbrella
  2. ip_ownership — All IP remains with creator
  3. payout_terms — Platform fee structure, payout schedule
  4. refund_handling — Refund policy and financial responsibility
  5. support_responsibility — Creator handles first-line support
  6. bug_fix_responsibility — Creator fixes bugs within SLA
  7. operational_improvement — Ongoing improvement commitment
  8. design_ux_standards — Minimum design/usability standards
  9. response_sla — Support ticket response timeframes
  10. complaint_handling — Complaint process and escalation
  11. feedback_incorporation — Incorporate reasonable feedback
  12. termination_clause — Conditions for suspension/termination
  13. exit_clause — Creator may exit with proper notice, clean IP transfer
  14. graduation_clause — Transition off Launchbox when creator registers own entity
- **Status values:** "pending" | "signed"

### `/api/support` — Support Ticket System
- **Methods:** GET, POST, PATCH
- **GET:** Optional `?creatorId=` filter
- **POST fields:** productId, creatorId, type, priority, subject, description
- **Enums:**
  - `type`: "feedback" | "complaint" | "bug" | "feature_request"
  - `priority`: "low" | "medium" | "high" | "critical"
  - `status`: "open" | "in_progress" | "resolved" | "escalated" | "closed"
  - `escalationLevel`: "creator" | "founder" | "termination_review"
- **PATCH fields:** status, escalationLevel, creatorResponse, resolution (max 5000 chars)

### `/api/transactions` — Transaction Tracking
- **Methods:** GET, POST
- **POST fields:** productId, userId, amount
- **Auto-calculates:** platformFee (15% of amount), status "pending"

### `/api/users` — Legacy User Management
- **Methods:** GET, POST
- **POST fields:** name, email, idea
- **Auto-status:** "pending" → "approved" or "rejected"

---

## Procurement Marketplace APIs

### `/api/procurement/requirements` — Buyer Requirements
- **Methods:** GET, POST
- **POST fields:** buyerId (required), title (max 300), problemDescription (max 5000), featureRequirements, budgetRange, deploymentPreference, region, urgency, timeline, complianceNeeds, supportExpectation, preferredVendorSize, attachments
- **Urgency values:** "low" | "medium" | "high" | "critical"
- **Auto-processing on submit:**
  1. Status transitions: "submitted" → "parsing" → "parsed"
  2. Runs `parseRequirement()` engine
  3. Tracks buyer usage for monetization
  4. Sends notifications to buyer + admin
- **12 Requirement statuses:** draft → submitted → parsing → parsed → matching → matched → rfp_issued → responses_pending → responses_received → shortlisted → evaluation → closed

### `/api/procurement/rfps` — Request for Proposals
- **Methods:** GET, POST
- **POST fields:** requirementId, buyerId, businessProblem, featureRequirements, budget, timeline, integrationNeeds, supportExpectation, complianceNeeds, preferredDeployment, notes, attachments, responseDeadline
- **On status "issued":**
  1. Runs match engine against parsed requirement
  2. Creates VendorMatch records
  3. Creates SellerOpportunity for each matched vendor
  4. Sends notifications to sellers + buyer
- **7 RFP statuses:** draft → issued → vendor_responses_pending → responses_received → shortlisted → evaluation → closed

### `/api/procurement/matches` — Vendor Match Results
- **Methods:** GET
- **GET params:** `rfpId` or `requirementId` (at least one required)
- **Returns:** Array of VendorMatch with:
  - `matchScore` (0-100, weighted)
  - Breakdown: categoryFit, featureFit, geographyFit, supportFit, trustFit
  - `matchReasons[]` — explanations

### `/api/procurement/responses` — RFP Responses & Shortlisting
- **Methods:** GET, POST, PATCH
- **GET params:** `rfpId`, `vendorSlug`, or `type: "shortlist"`
- **POST (submit response):** rfpId, vendorSlug, opportunityId, proposalSummary, estimatedPricing, estimatedTimeline, customizability, demoLink, documents, contactName, contactEmail, contactPhone, additionalNotes
- **PATCH actions:**
  - `action: "shortlist"` — buyerId, rfpId, vendorSlug, responseId, notes → creates ShortlistEntry
  - `action: "remove_shortlist"` — id (shortlist ID)

### `/api/procurement/opportunities` — Seller Opportunities
- **Methods:** GET, PATCH
- **GET params:** `vendorSlug` (required)
- **PATCH:** `id` + `status`
- **9 Opportunity statuses:** new → viewed → interested → declined | response_submitted → shortlisted → evaluation_invited → won | lost
