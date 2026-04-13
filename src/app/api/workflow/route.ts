import { NextRequest, NextResponse } from "next/server";
import { getWorkflowByCreator, advanceWorkflow } from "@/lib/db";

export async function GET(req: NextRequest) {
  const creatorId = req.nextUrl.searchParams.get("creatorId");
  if (!creatorId) {
    return NextResponse.json({ error: "creatorId is required." }, { status: 400 });
  }
  return NextResponse.json(getWorkflowByCreator(creatorId));
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { creatorId, stage } = body;

  if (!creatorId || !stage) {
    return NextResponse.json({ error: "creatorId and stage are required." }, { status: 400 });
  }

  const entry = advanceWorkflow(creatorId, stage);
  if (!entry) {
    return NextResponse.json({ error: "Workflow entry not found." }, { status: 404 });
  }

  return NextResponse.json(entry);
}
