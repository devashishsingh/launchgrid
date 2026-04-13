import { NextRequest, NextResponse } from "next/server";
import { getUsers, addUser, updateUserStatus } from "@/lib/db";

export async function GET() {
  return NextResponse.json(getUsers());
}

export async function POST(req: NextRequest) {
  const body = await req.json();

  const name = String(body.name || "").trim().slice(0, 100);
  const email = String(body.email || "").trim().slice(0, 200);
  const idea = String(body.idea || "").trim().slice(0, 2000);

  if (!name || !email || !idea) {
    return NextResponse.json(
      { error: "Name, email, and product idea are required." },
      { status: 400 }
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }

  const user = addUser({ name, email, idea });
  return NextResponse.json(user, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const body = await req.json();
  const { id, status } = body;

  if (!id || !["approved", "rejected"].includes(status)) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const user = updateUserStatus(id, status);
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  return NextResponse.json(user);
}
