import { NextRequest, NextResponse } from "next/server";
import {
  getRequirements,
  addRequirement,
  getRequirementById,
  updateRequirementStatus,
  addParsedRequirement,
  addBuyerUsage,
  addNotification,
} from "@/lib/procurement-db";
import { parseRequirement } from "@/lib/parsing-engine";

export async function GET(req: NextRequest) {
  const buyerId = req.nextUrl.searchParams.get("buyerId");
  const all = getRequirements();
  if (buyerId) return NextResponse.json(all.filter((r) => r.buyerId === buyerId));
  return NextResponse.json(all);
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const title = String(body.title || "").trim().slice(0, 300);
  const problemDescription = String(body.problemDescription || "").trim().slice(0, 5000);
  const buyerId = String(body.buyerId || "").trim();

  if (!title || !problemDescription || !buyerId) {
    return NextResponse.json({ error: "title, problemDescription, and buyerId are required." }, { status: 400 });
  }

  const requirement = addRequirement({
    buyerId,
    title,
    problemDescription,
    featureRequirements: String(body.featureRequirements || "").trim().slice(0, 3000),
    budgetRange: String(body.budgetRange || "").trim().slice(0, 200),
    deploymentPreference: String(body.deploymentPreference || "").trim().slice(0, 100),
    region: String(body.region || "").trim().slice(0, 100),
    urgency: ["low", "medium", "high", "critical"].includes(body.urgency) ? body.urgency : "medium",
    timeline: String(body.timeline || "").trim().slice(0, 200),
    complianceNeeds: String(body.complianceNeeds || "").trim().slice(0, 1000),
    supportExpectation: String(body.supportExpectation || "").trim().slice(0, 500),
    preferredVendorSize: String(body.preferredVendorSize || "").trim().slice(0, 100),
    attachments: Array.isArray(body.attachments) ? body.attachments.slice(0, 10) : [],
  });

  // Auto-parse
  updateRequirementStatus(requirement.id, "parsing");
  const parsedOutput = parseRequirement(requirement);
  const parsed = addParsedRequirement(parsedOutput);
  updateRequirementStatus(requirement.id, "parsed");

  // Track usage
  addBuyerUsage({
    buyerId,
    eventType: "requirement_submit",
    requirementId: requirement.id,
    isFree: true,
  });

  // Notify
  addNotification({
    recipientId: buyerId,
    recipientType: "buyer",
    type: "requirement_submitted",
    title: "Requirement Submitted",
    message: `Your requirement "${title}" has been submitted and parsed.`,
    referenceId: requirement.id,
  });

  addNotification({
    recipientId: "admin",
    recipientType: "admin",
    type: "requirement_submitted",
    title: "New Requirement",
    message: `New buyer requirement: "${title}"`,
    referenceId: requirement.id,
  });

  return NextResponse.json({ requirement, parsed }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, status } = body;

  if (!id || !status) {
    return NextResponse.json({ error: "id and status are required." }, { status: 400 });
  }

  const updated = updateRequirementStatus(id, status);
  if (!updated) return NextResponse.json({ error: "Requirement not found." }, { status: 404 });

  return NextResponse.json(updated);
}
