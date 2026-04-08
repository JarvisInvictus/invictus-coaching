import { NextRequest, NextResponse } from "next/server";
import { getAllClients, createClient } from "@/app/lib/db";

export async function GET() {
  try {
    return NextResponse.json(getAllClients());
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();
    if (!name) return NextResponse.json({ error: "Name required" }, { status: 400 });
    const client = createClient(name);
    return NextResponse.json(client, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}
