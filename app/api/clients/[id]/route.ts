import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/app/lib/redis";
import { Client } from "@/app/types";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await redis.hgetall(`client:${id}`);
    if (!data || Object.keys(data).length === 0) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const weeksRaw = await redis.zrange(`client:${id}:weeks`, 0, -1, { withScores: false });
    const weeks = weeksRaw.map((w) => JSON.parse(w as string));

    const client: Client = { ...(data as Record<string, unknown>), weeks } as Client;
    return NextResponse.json(client);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch client" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, currentPhase, latestBW, latestDate } = body;

    const updates: Record<string, unknown> = {};
    if (name !== undefined) updates.name = name;
    if (currentPhase !== undefined) updates.currentPhase = currentPhase;
    if (latestBW !== undefined) updates.latestBW = latestBW;
    if (latestDate !== undefined) updates.latestDate = latestDate;

    if (Object.keys(updates).length > 0) {
      await redis.hset(`client:${id}`, updates);
    }

    const data = await redis.hgetall(`client:${id}`);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: "Failed to update client" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await redis.del(`client:${id}`);
    await redis.del(`client:${id}:weeks`);
    await redis.zrem("clients:index", ...(await redis.zrange("clients:index", 0, -1)).filter((m) => (JSON.parse(m as string) as { id: string }).id === id));
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: "Failed to delete client" }, { status: 500 });
  }
}
