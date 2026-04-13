import { NextRequest, NextResponse } from "next/server";
import { getLeads, addLead, updateLeadStatus } from "@/lib/db";

const VALID_SOURCES = [
  "linkedin", "instagram", "facebook", "youtube",
  "website", "referral", "college", "incubator",
] as const;

const VALID_STAGES = ["prototype", "mvp", "live"] as const;

export async function GET() {
  return NextResponse.json(getLeads());
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const fullName = String(body.fullName || "").trim().slice(0, 100);
  const email = String(body.email || "").trim().slice(0, 200);
  const linkedIn = String(body.linkedIn || "").trim().slice(0, 300);
  const productName = String(body.productName || "").trim().slice(0, 200);
  const productCategory = String(body.productCategory || "").trim().slice(0, 100);
  const problemStatement = String(body.problemStatement || "").trim().slice(0, 2000);
  const currentStage = String(body.currentStage || "").trim();
  const existingUrl = String(body.existingUrl || "").trim().slice(0, 500);
  const expectedPrice = String(body.expectedPrice || "").trim().slice(0, 100);
  const supportCommitment = Boolean(body.supportCommitment);
  const termsAcknowledged = Boolean(body.termsAcknowledged);
  const leadSource = String(body.leadSource || "").trim();

  if (!fullName || !email || !productName || !problemStatement) {
    return NextResponse.json(
      { error: "Full name, email, product name, and problem statement are required." },
      { status: 400 }
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }

  if (!termsAcknowledged) {
    return NextResponse.json({ error: "You must acknowledge the terms." }, { status: 400 });
  }

  if (!VALID_STAGES.includes(currentStage as typeof VALID_STAGES[number])) {
    return NextResponse.json({ error: "Invalid current stage." }, { status: 400 });
  }

  if (!VALID_SOURCES.includes(leadSource as typeof VALID_SOURCES[number])) {
    return NextResponse.json({ error: "Invalid lead source." }, { status: 400 });
  }

  const lead = addLead({
    fullName,
    email,
    linkedIn,
    productName,
    productCategory,
    problemStatement,
    currentStage: currentStage as typeof VALID_STAGES[number],
    existingUrl,
    expectedPrice,
    supportCommitment,
    termsAcknowledged,
    leadSource: leadSource as typeof VALID_SOURCES[number],
  });

  return NextResponse.json(lead, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, status } = body;

  const validStatuses = ["new", "contacted", "qualified", "converted", "rejected"];
  if (!id || !validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const lead = updateLeadStatus(id, status);
  if (!lead) {
    return NextResponse.json({ error: "Lead not found." }, { status: 404 });
  }

  return NextResponse.json(lead);
}
