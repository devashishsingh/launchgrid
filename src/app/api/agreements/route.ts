import { NextRequest, NextResponse } from "next/server";
import { getAgreementsByCreator, signAgreement } from "@/lib/db";

export async function GET(req: NextRequest) {
  const creatorId = req.nextUrl.searchParams.get("creatorId");
  if (!creatorId) {
    return NextResponse.json({ error: "creatorId is required." }, { status: 400 });
  }
  return NextResponse.json(getAgreementsByCreator(creatorId));
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id } = body;

  if (!id) {
    return NextResponse.json({ error: "Agreement ID is required." }, { status: 400 });
  }

  const agreement = signAgreement(id);
  if (!agreement) {
    return NextResponse.json({ error: "Agreement not found." }, { status: 404 });
  }

  return NextResponse.json(agreement);
}
