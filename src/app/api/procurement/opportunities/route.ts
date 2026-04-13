import { NextRequest, NextResponse } from "next/server";
import {
  getOpportunitiesByVendor,
  updateOpportunityStatus,
} from "@/lib/procurement-db";

export async function GET(req: NextRequest) {
  const vendorSlug = req.nextUrl.searchParams.get("vendorSlug");
  if (!vendorSlug) return NextResponse.json({ error: "vendorSlug required." }, { status: 400 });
  return NextResponse.json(getOpportunitiesByVendor(vendorSlug));
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const id = String(body.id || "").trim();
  const status = body.status;

  if (!id || !status) {
    return NextResponse.json({ error: "id and status required." }, { status: 400 });
  }

  const updated = updateOpportunityStatus(id, status);
  if (!updated) return NextResponse.json({ error: "Opportunity not found." }, { status: 404 });
  return NextResponse.json(updated);
}
