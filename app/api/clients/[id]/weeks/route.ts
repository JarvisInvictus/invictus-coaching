import { NextRequest, NextResponse } from "next/server";
import { getWeeks, addWeek } from "@/app/lib/db";
import { WeekEntry } from "@/app/lib/db";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const weeks = getWeeks(id);
    return NextResponse.json(weeks);
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const week: WeekEntry = {
      date: body.date || new Date().toISOString().slice(0, 10),
      phase: body.phase || "Growth Phase",
      bodyWeight: body.bodyWeight ?? null,
      bwDiff: body.bwDiff ?? null,
      avgBW: body.avgBW ?? null,
      restingHR: body.restingHR ?? null,
      bloodPressure: body.bloodPressure ?? null,
      steps: body.steps ?? null,
      cardioMinutes: body.cardioMinutes ?? null,
      sessions: body.sessions ?? null,
      feed: body.feed ?? null,
      testLevel: body.testLevel ?? null,
      e2Level: body.e2Level ?? null,
      ldl: body.ldl ?? null,
      hdl: body.hdl ?? null,
      pedDose: body.pedDose ?? null,
      notes: body.notes ?? null,
    };
    const added = addWeek(id, week);
    return NextResponse.json(added, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 });
  }
}