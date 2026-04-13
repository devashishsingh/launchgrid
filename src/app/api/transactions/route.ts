import { NextRequest, NextResponse } from "next/server";
import { getTransactions, addTransaction } from "@/lib/db";

export async function GET() {
  return NextResponse.json(getTransactions());
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const productId = String(body.productId || "").trim();
  const userId = String(body.userId || "").trim();
  const amount = Number(body.amount);

  if (!productId || !userId || !amount || amount <= 0) {
    return NextResponse.json(
      { error: "productId, userId, and a positive amount are required." },
      { status: 400 }
    );
  }

  const transaction = addTransaction({ productId, userId, amount });
  return NextResponse.json(transaction, { status: 201 });
}
