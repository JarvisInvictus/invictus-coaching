import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/app/lib/redis";
import { WeekEntry } from "@/app/types";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const weeksRaw = await redis.zrange(`client:${id}:weeks`, 0, -1, { withScores: false });
    const weeks = weeksRaw.map((w) => JSON.parse(w as string));
    return NextResponse.json(weeks);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch weeks" }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body: WeekEntry = await req.json();

    await redis.zadd(`client:${id}:weeks`, {
      score: new Date(body.date).getTime(),
      member: JSON.stringify(body),
    });

    await redis.hset(`client:${id}`, {
      currentPhase: body.phase,
      latestBW: body.bodyWeight,
      latestDate: body.date,
    } as Record<string, unknown>);

    const indexMembers = await redis.zrange("clients:index", 0, -1);
    for (const m of indexMembers) {
      const parsed = JSON.parse(m as string) as { id: string };
      if (parsed.id === id) {
        await redis.zrem("clients:index", m);
        await redis.zadd("clients:index", {
          score: Date.now(),
          member: JSON.stringify({ id, name: (parsed as { name?: string }).name || "", currentPhase: body.phase, latestBW: body.bodyWeight, latestDate: body.date }),
        });
        break;
      }
    }

    return NextResponse.json(body, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to add week" }, { status: 500 });
  }
}
