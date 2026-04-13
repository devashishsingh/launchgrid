import { NextRequest, NextResponse } from "next/server";
import {
  getResponsesByRFP,
  getResponsesByVendor,
  addRFPResponse,
  getShortlistByRFP,
  addToShortlist,
  removeFromShortlist,
  addNotification,
  updateOpportunityStatus,
  getOpportunitiesByVendor,
} from "@/lib/procurement-db";

export async function GET(req: NextRequest) {
  const rfpId = req.nextUrl.searchParams.get("rfpId");
  const vendorSlug = req.nextUrl.searchParams.get("vendorSlug");
  const type = req.nextUrl.searchParams.get("type");

  if (type === "shortlist" && rfpId) {
    return NextResponse.json(getShortlistByRFP(rfpId));
  }
  if (rfpId) return NextResponse.json(getResponsesByRFP(rfpId));
  if (vendorSlug) return NextResponse.json(getResponsesByVendor(vendorSlug));
  return NextResponse.json([]);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const rfpId = String(body.rfpId || "").trim();
  const vendorSlug = String(body.vendorSlug || "").trim();
  const opportunityId = String(body.opportunityId || "").trim();

  if (!rfpId || !vendorSlug || !opportunityId) {
    return NextResponse.json({ error: "rfpId, vendorSlug, and opportunityId are required." }, { status: 400 });
  }

  const response = addRFPResponse({
    rfpId,
    vendorSlug,
    opportunityId,
    proposalSummary: String(body.proposalSummary || "").trim().slice(0, 5000),
    estimatedPricing: String(body.estimatedPricing || "").trim().slice(0, 500),
    estimatedTimeline: String(body.estimatedTimeline || "").trim().slice(0, 300),
    customizability: String(body.customizability || "").trim().slice(0, 1000),
    demoLink: String(body.demoLink || "").trim().slice(0, 500),
    documents: Array.isArray(body.documents) ? body.documents.slice(0, 10) : [],
    contactName: String(body.contactName || "").trim().slice(0, 200),
    contactEmail: String(body.contactEmail || "").trim().slice(0, 200),
    contactPhone: String(body.contactPhone || "").trim().slice(0, 50),
    additionalNotes: String(body.additionalNotes || "").trim().slice(0, 2000),
  });

  // Notify buyer
  addNotification({
    recipientId: "buyer",
    recipientType: "buyer",
    type: "response_submitted",
    title: "Vendor Response Received",
    message: `A vendor has submitted a response to your RFP.`,
    referenceId: rfpId,
  });

  return NextResponse.json(response, { status: 201 });
}

// Shortlist management via PATCH
export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const action = String(body.action || "").trim();

  if (action === "shortlist") {
    const entry = addToShortlist({
      buyerId: String(body.buyerId || "").trim(),
      rfpId: String(body.rfpId || "").trim(),
      vendorSlug: String(body.vendorSlug || "").trim(),
      responseId: String(body.responseId || "").trim(),
      notes: String(body.notes || "").trim().slice(0, 1000),
    });

    // Notify vendor
    addNotification({
      recipientId: body.vendorSlug,
      recipientType: "seller",
      type: "shortlisted",
      title: "You've Been Shortlisted",
      message: "A buyer has added you to their shortlist.",
      referenceId: body.rfpId,
    });

    // Update opportunity
    const opportunities = getOpportunitiesByVendor(body.vendorSlug);
    const opp = opportunities.find((o) => o.rfpId === body.rfpId);
    if (opp) updateOpportunityStatus(opp.id, "shortlisted");

    return NextResponse.json(entry);
  }

  if (action === "remove_shortlist") {
    const removed = removeFromShortlist(String(body.id || "").trim());
    return NextResponse.json({ success: removed });
  }

  if (action === "update_opportunity") {
    const updated = updateOpportunityStatus(
      String(body.opportunityId || "").trim(),
      body.status
    );
    if (!updated) return NextResponse.json({ error: "Opportunity not found." }, { status: 404 });
    return NextResponse.json(updated);
  }

  return NextResponse.json({ error: "Invalid action." }, { status: 400 });
}
