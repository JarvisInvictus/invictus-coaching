import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/app/lib/redis";
import { Client } from "@/app/types";

function flatToObj(flat: string[]): Record<string, string> {
  const obj: Record<string, string> = {};
  for (let i = 0; i < flat.length; i += 2) {
    obj[flat[i]] = flat[i + 1];
  }
  return obj;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await redis.hgetall(`client:${id}`) as unknown;
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const obj = Array.isArray(data) ? flatToObj(data as string[]) : (data as Record<string, string>);
    if (Object.keys(obj).length === 0) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    const weeksRaw = await redis.zrange(`client:${id}:weeks`, 0, -1) as string[];
    const weeks = weeksRaw.map((w) => JSON.parse(w));

    const client: Client = {
      ...(obj as Record<string, unknown>),
      weeks,
    } as Client;

    return NextResponse.json(client);
  } catch (e) {
    return NextResponse.json({ error: `Failed to fetch client: ${e}` }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { name, currentPhase, latestBW, latestDate } = body;

    const updates: Record<string, string> = {};
    if (name !== undefined) updates.name = String(name);
    if (currentPhase !== undefined) updates.currentPhase = String(currentPhase);
    if (latestBW !== undefined) updates.latestBW = String(latestBW);
    if (latestDate !== undefined) updates.latestDate = String(latestDate);

    if (Object.keys(updates).length > 0) {
      await redis.hset(`client:${id}`, updates);
    }

    const data = await redis.hgetall(`client:${id}`) as unknown;
    const obj = Array.isArray(data) ? flatToObj(data as string[]) : (data as Record<string, string>);
    return NextResponse.json(obj);
  } catch (e) {
    return NextResponse.json({ error: `Failed to update client: ${e}` }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await redis.del(`client:${id}`);
    await redis.del(`client:${id}:weeks`);
    const members = await redis.zrange("clients:index", 0, -1) as string[];
    const toRemove = members
      .map((m) => JSON.parse(m) as { id: string })
      .filter((m) => m.id === id);
    if (toRemove.length > 0) {
      await redis.zrem("clients:index", ...toRemove.map((m) => JSON.stringify(m)));
    }
    return NextResponse.json({ success: true });
  } catch (e) {
    return NextResponse.json({ error: `Failed to delete client: ${e}` }, { status: 500 });
  }
}
