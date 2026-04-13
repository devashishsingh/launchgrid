import { NextRequest, NextResponse } from "next/server";
import {
  getSupportTickets,
  getSupportTicketsByCreator,
  addSupportTicket,
  updateSupportTicket,
} from "@/lib/db";

const VALID_TYPES = ["feedback", "complaint", "bug", "feature_request"] as const;
const VALID_PRIORITIES = ["low", "medium", "high", "critical"] as const;

export async function GET(req: NextRequest) {
  const creatorId = req.nextUrl.searchParams.get("creatorId");
  if (creatorId) {
    return NextResponse.json(getSupportTicketsByCreator(creatorId));
  }
  return NextResponse.json(getSupportTickets());
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const productId = String(body.productId || "").trim();
  const creatorId = String(body.creatorId || "").trim();
  const type = String(body.type || "").trim();
  const priority = String(body.priority || "medium").trim();
  const subject = String(body.subject || "").trim().slice(0, 200);
  const description = String(body.description || "").trim().slice(0, 5000);

  if (!productId || !creatorId || !subject || !description) {
    return NextResponse.json(
      { error: "productId, creatorId, subject, and description are required." },
      { status: 400 }
    );
  }

  if (!VALID_TYPES.includes(type as typeof VALID_TYPES[number])) {
    return NextResponse.json({ error: "Invalid ticket type." }, { status: 400 });
  }

  if (!VALID_PRIORITIES.includes(priority as typeof VALID_PRIORITIES[number])) {
    return NextResponse.json({ error: "Invalid priority." }, { status: 400 });
  }

  const ticket = addSupportTicket({
    productId,
    creatorId,
    type: type as typeof VALID_TYPES[number],
    priority: priority as typeof VALID_PRIORITIES[number],
    subject,
    description,
  });

  return NextResponse.json(ticket, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, ...updates } = body;

  if (!id) {
    return NextResponse.json({ error: "Ticket ID is required." }, { status: 400 });
  }

  const validStatuses = ["open", "in_progress", "resolved", "escalated", "closed"];
  const validEscalation = ["creator", "founder", "termination_review"];

  const patchData: Record<string, string> = {};
  if (updates.status && validStatuses.includes(updates.status)) patchData.status = updates.status;
  if (updates.escalationLevel && validEscalation.includes(updates.escalationLevel)) patchData.escalationLevel = updates.escalationLevel;
  if (updates.creatorResponse) patchData.creatorResponse = String(updates.creatorResponse).slice(0, 5000);
  if (updates.resolution) patchData.resolution = String(updates.resolution).slice(0, 5000);

  const ticket = updateSupportTicket(id, patchData);
  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found." }, { status: 404 });
  }

  return NextResponse.json(ticket);
}
