import { NextRequest, NextResponse } from "next/server";
import { updateWeek } from "@/app/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string; date: string }> }) {
  try {
    const { id, date } = await params;
    const body = await req.json();
    const updated = updateWeek(id, date, body);
    if (!updated) return NextResponse.json({ error: "Week not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}