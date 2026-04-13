import { NextRequest, NextResponse } from "next/server";
import {
  getMatchesByRFP,
  getMatchesByRequirement,
} from "@/lib/procurement-db";

export async function GET(req: NextRequest) {
  const rfpId = req.nextUrl.searchParams.get("rfpId");
  const requirementId = req.nextUrl.searchParams.get("requirementId");

  if (rfpId) return NextResponse.json(getMatchesByRFP(rfpId));
  if (requirementId) return NextResponse.json(getMatchesByRequirement(requirementId));
  return NextResponse.json([]);
}
