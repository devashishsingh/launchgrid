import { NextRequest, NextResponse } from "next/server";
import {
  getRFPs,
  addRFP,
  updateRFPStatus,
  getRequirementById,
  getParsedByRequirement,
  addVendorMatch,
  addOpportunity,
  addNotification,
  updateRequirementStatus,
} from "@/lib/procurement-db";
import { matchVendors } from "@/lib/match-engine";

export async function GET(req: NextRequest) {
  const buyerId = req.nextUrl.searchParams.get("buyerId");
  const all = getRFPs();
  if (buyerId) return NextResponse.json(all.filter((r) => r.buyerId === buyerId));
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const requirementId = String(body.requirementId || "").trim();
  const buyerId = String(body.buyerId || "").trim();

  if (!requirementId || !buyerId) {
    return NextResponse.json({ error: "requirementId and buyerId are required." }, { status: 400 });
  }

  const requirement = getRequirementById(requirementId);
  if (!requirement) {
    return NextResponse.json({ error: "Requirement not found." }, { status: 404 });
  }

  const rfp = addRFP({
    requirementId,
    buyerId,
    businessProblem: String(body.businessProblem || requirement.problemDescription).trim().slice(0, 5000),
    featureRequirements: String(body.featureRequirements || requirement.featureRequirements).trim().slice(0, 3000),
    budget: String(body.budget || requirement.budgetRange).trim().slice(0, 200),
    timeline: String(body.timeline || requirement.timeline).trim().slice(0, 200),
    integrationNeeds: String(body.integrationNeeds || "").trim().slice(0, 1000),
    supportExpectation: String(body.supportExpectation || requirement.supportExpectation).trim().slice(0, 500),
    complianceNeeds: String(body.complianceNeeds || requirement.complianceNeeds).trim().slice(0, 1000),
    preferredDeployment: String(body.preferredDeployment || requirement.deploymentPreference).trim().slice(0, 100),
    notes: String(body.notes || "").trim().slice(0, 2000),
    attachments: Array.isArray(body.attachments) ? body.attachments.slice(0, 10) : [],
    responseDeadline: String(body.responseDeadline || new Date(Date.now() + 14 * 86400000).toISOString()).trim(),
  });

  return NextResponse.json(rfp, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, status } = body;

  if (!id || !status) {
    return NextResponse.json({ error: "id and status are required." }, { status: 400 });
  }

  const rfp = updateRFPStatus(id, status);
  if (!rfp) return NextResponse.json({ error: "RFP not found." }, { status: 404 });

  // When RFP is issued, run match engine and create opportunities
  if (status === "issued") {
    const parsed = getParsedByRequirement(rfp.requirementId);
    if (parsed) {
      const matches = matchVendors(parsed, rfp.id);

      for (const match of matches) {
        const savedMatch = addVendorMatch(match);

        // Create seller opportunity
        addOpportunity({
          vendorSlug: match.vendorSlug,
          rfpId: rfp.id,
          requirementId: rfp.requirementId,
          matchId: savedMatch.id,
        });

        // Notify seller
        addNotification({
          recipientId: match.vendorSlug,
          recipientType: "seller",
          type: "rfp_issued",
          title: "New Opportunity",
          message: `You have a new RFP opportunity (match score: ${match.matchScore}%)`,
          referenceId: rfp.id,
        });
      }

      updateRequirementStatus(rfp.requirementId, "rfp_issued");

      // Notify buyer
      addNotification({
        recipientId: rfp.buyerId,
        recipientType: "buyer",
        type: "matches_ready",
        title: "Matches Ready",
        message: `${matches.length} vendors matched for your RFP.`,
        referenceId: rfp.id,
      });
    }
  }

  return NextResponse.json(rfp);
}
