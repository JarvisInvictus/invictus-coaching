import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/app/lib/redis";
import { WeekEntry } from "@/app/types";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string; date: string }> }) {
  try {
    const { id, date } = await params;
    const body: Partial<WeekEntry> = await req.json();

    const weeksRaw = await redis.zrange(`client:${id}:weeks`, 0, -1, { withScores: false });
    let found = false;
    for (const w of weeksRaw) {
      const parsed = JSON.parse(w as string) as WeekEntry;
      if (parsed.date === date) {
        const updated = { ...parsed, ...body };
        await redis.zrem(`client:${id}:weeks`, w);
        await redis.zadd(`client:${id}:weeks`, {
          score: new Date(date).getTime(),
          member: JSON.stringify(updated),
        });
        found = true;
        return NextResponse.json(updated);
      }
    }

    if (!found) {
      return NextResponse.json({ error: "Week not found" }, { status: 404 });
    }
    return NextResponse.json({ error: "Failed to update week" }, { status: 500 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to update week" }, { status: 500 });
  }
}
