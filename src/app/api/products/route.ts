import { NextRequest, NextResponse } from "next/server";
import { getProducts, addProduct, updateProductStatus } from "@/lib/db";

export async function GET() {
  return NextResponse.json(getProducts());
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const userId = String(body.userId || "").trim();
  const name = String(body.name || "").trim().slice(0, 200);
  const description = String(body.description || "").trim().slice(0, 2000);

  if (!userId || !name || !description) {
    return NextResponse.json(
      { error: "userId, name, and description are required." },
      { status: 400 }
    );
  }

  const product = addProduct({ userId, name, description });
  return NextResponse.json(product, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, status } = body;

  const validStatuses = ["draft", "active", "paused", "suspended"];
  if (!id || !validStatuses.includes(status)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const product = updateProductStatus(id, status);
  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  return NextResponse.json(product);
}
