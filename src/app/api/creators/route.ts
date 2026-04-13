import { NextRequest, NextResponse } from "next/server";
import {
  getCreators,
  getCreatorById,
  createCreator,
  activateCreator,
  suspendCreator,
  reinstateCreator,
  updateCreatorQualityScore,
} from "@/lib/db";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (id) {
    const creator = getCreatorById(id);
    if (!creator) return NextResponse.json({ error: "Creator not found." }, { status: 404 });
    return NextResponse.json(creator);
  }
  return NextResponse.json(getCreators());
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const leadId = String(body.leadId || "").trim();
  const fullName = String(body.fullName || "").trim().slice(0, 100);
  const email = String(body.email || "").trim().slice(0, 200);
  const linkedIn = String(body.linkedIn || "").trim().slice(0, 300);

  if (!leadId || !fullName || !email) {
    return NextResponse.json(
      { error: "leadId, fullName, and email are required." },
      { status: 400 }
    );
  }

  const creator = createCreator(leadId, { fullName, email, linkedIn });
  return NextResponse.json(creator, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, action, qualityScore } = body;

  if (!id) {
    return NextResponse.json({ error: "Creator ID required." }, { status: 400 });
  }

  if (action === "activate") {
    const token = String(body.token || "").trim();
    if (!token) return NextResponse.json({ error: "Token required." }, { status: 400 });
    const creator = activateCreator(token);
    if (!creator) return NextResponse.json({ error: "Invalid or expired token." }, { status: 400 });
    return NextResponse.json(creator);
  }

  if (action === "suspend") {
    const creator = suspendCreator(id);
    if (!creator) return NextResponse.json({ error: "Creator not found." }, { status: 404 });
    return NextResponse.json(creator);
  }

  if (action === "reinstate") {
    const creator = reinstateCreator(id);
    if (!creator) return NextResponse.json({ error: "Creator not found." }, { status: 404 });
    return NextResponse.json(creator);
  }

  if (action === "quality_score" && typeof qualityScore === "number") {
    const creator = updateCreatorQualityScore(id, qualityScore);
    if (!creator) return NextResponse.json({ error: "Creator not found." }, { status: 404 });
    return NextResponse.json(creator);
  }

  return NextResponse.json({ error: "Invalid action." }, { status: 400 });
}
