import { NextRequest, NextResponse } from "next/server";
import { redis } from "@/app/lib/redis";
import { Client, WeekEntry } from "@/app/types";

const GARRY_GILL_WEEKS: Omit<WeekEntry, "date">[] = [
  { phase: "Acclimation Phase", bodyWeight: 77.3, bwDiff: null, avgBW: null, restingHR: null, bloodPressure: null, steps: 2300, cardioMinutes: null, sessions: "4x Training", feed: "2000", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { phase: "Acclimation Phase", bodyWeight: 77.3, bwDiff: 0, avgBW: null, restingHR: null, bloodPressure: null, steps: 2300, cardioMinutes: null, sessions: "4x Training", feed: "2000", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { phase: "Growth Phase", bodyWeight: 78.1, bwDiff: 0.8, avgBW: null, restingHR: null, bloodPressure: null, steps: 2300, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { phase: "Growth Phase", bodyWeight: 79.0, bwDiff: 0.9, avgBW: null, restingHR: null, bloodPressure: null, steps: 2561, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { phase: "Growth Phase", bodyWeight: 79.4, bwDiff: 0.4, avgBW: null, restingHR: 123, bloodPressure: "139/70", steps: 2715, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { phase: "Growth Phase", bodyWeight: 79.6, bwDiff: 0.2, avgBW: null, restingHR: 126.5, bloodPressure: null, steps: 2805, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { phase: "Growth Phase", bodyWeight: 80.0, bwDiff: 0.4, avgBW: null, restingHR: null, bloodPressure: null, steps: 3187, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { phase: "Growth Phase", bodyWeight: 80.5, bwDiff: 0.5, avgBW: null, restingHR: null, bloodPressure: null, steps: 3187, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { phase: "Growth Phase", bodyWeight: 81.0, bwDiff: 0.5, avgBW: null, restingHR: null, bloodPressure: null, steps: 3187, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { phase: "Growth Phase", bodyWeight: 82.9, bwDiff: 1.9, avgBW: null, restingHR: 92, bloodPressure: "122/68", steps: 5038, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { phase: "Growth Phase", bodyWeight: 82.9, bwDiff: 0, avgBW: null, restingHR: null, bloodPressure: null, steps: 7490, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { phase: "Maintenance Phase", bodyWeight: 82.9, bwDiff: 0, avgBW: null, restingHR: null, bloodPressure: null, steps: 7169, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { phase: "Growth Phase", bodyWeight: 81.1, bwDiff: -1.8, avgBW: null, restingHR: null, bloodPressure: null, steps: 5300, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: "Blood Redrawn" },
  { phase: "Growth Phase", bodyWeight: 82.3, bwDiff: 1.2, avgBW: null, restingHR: 58, bloodPressure: "127/73", steps: 5566, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: "96.3", e2Level: "38.4", ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { phase: "Growth Phase", bodyWeight: 83.1, bwDiff: 0.8, avgBW: null, restingHR: null, bloodPressure: null, steps: 6399, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { phase: "Growth Phase", bodyWeight: 83.5, bwDiff: 0.4, avgBW: null, restingHR: 60, bloodPressure: "122/68", steps: 7692, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { phase: "Growth Phase", bodyWeight: 83.4, bwDiff: -0.1, avgBW: null, restingHR: null, bloodPressure: null, steps: 7310, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { phase: "Growth Phase", bodyWeight: 83.7, bwDiff: 0.3, avgBW: null, restingHR: 65, bloodPressure: "125/73", steps: 5838, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { phase: "Growth Phase", bodyWeight: 83.9, bwDiff: 0.2, avgBW: null, restingHR: 96, bloodPressure: "117/80", steps: 6522, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { phase: "Deload", bodyWeight: 84.4, bwDiff: 0.5, avgBW: null, restingHR: null, bloodPressure: null, steps: 6186, cardioMinutes: null, sessions: "3x50% + 2xOff", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { phase: "Growth Phase", bodyWeight: 84.8, bwDiff: 0.4, avgBW: null, restingHR: null, bloodPressure: null, steps: 7497, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { phase: "Growth Phase", bodyWeight: 84.7, bwDiff: -0.1, avgBW: null, restingHR: null, bloodPressure: null, steps: 7549, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { phase: "Growth Phase", bodyWeight: 85.1, bwDiff: 0.4, avgBW: null, restingHR: 76, bloodPressure: "121/76", steps: 7640, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { phase: "Growth Phase", bodyWeight: 85.8, bwDiff: 0.7, avgBW: null, restingHR: null, bloodPressure: null, steps: 6381, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { phase: "Growth Phase", bodyWeight: 86.0, bwDiff: 0.2, avgBW: null, restingHR: 67, bloodPressure: "120/80", steps: 7747, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { phase: "Growth Phase", bodyWeight: 86.0, bwDiff: 0, avgBW: null, restingHR: null, bloodPressure: null, steps: 7482, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { phase: "Growth Phase", bodyWeight: 86.3, bwDiff: 0.3, avgBW: null, restingHR: 91, bloodPressure: "126/78", steps: 7462, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { phase: "Growth Phase", bodyWeight: 86.9, bwDiff: 0.6, avgBW: null, restingHR: null, bloodPressure: null, steps: 6668, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { phase: "Growth Phase", bodyWeight: 87.3, bwDiff: 0.4, avgBW: null, restingHR: null, bloodPressure: null, steps: 7800, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { phase: "Growth Phase", bodyWeight: 87.3, bwDiff: 0, avgBW: null, restingHR: null, bloodPressure: null, steps: 7323, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { phase: "Growth Phase", bodyWeight: 87.2, bwDiff: -0.1, avgBW: null, restingHR: null, bloodPressure: null, steps: 7507, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { phase: "Growth Phase", bodyWeight: 87.2, bwDiff: 0, avgBW: null, restingHR: 82, bloodPressure: "130/71", steps: 6673, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { phase: "Growth Phase", bodyWeight: 87.3, bwDiff: 0.1, avgBW: null, restingHR: null, bloodPressure: null, steps: 9332, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { phase: "Growth Phase", bodyWeight: 87.5, bwDiff: 0.2, avgBW: null, restingHR: null, bloodPressure: null, steps: 7659, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { phase: "Deload", bodyWeight: 87.6, bwDiff: 0.1, avgBW: null, restingHR: null, bloodPressure: null, steps: null, cardioMinutes: null, sessions: "3x50%", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
];

const GARRY_DATES = [
  "2025-04-10","2025-04-17","2025-04-24","2025-05-08","2025-05-15",
  "2025-05-22","2025-05-29","2025-06-05","2025-06-12","2025-06-19",
  "2025-06-26","2025-07-03","2025-07-17","2025-07-24","2025-07-31",
  "2025-08-07","2025-08-14","2025-08-21","2025-08-28","2025-09-04",
  "2025-09-11","2025-09-18","2025-09-25","2025-10-02","2025-10-09",
  "2025-10-16","2025-10-23","2025-10-30","2025-11-06","2025-11-13",
  "2025-11-20","2025-11-27","2025-12-04","2025-12-11","2025-12-18",
];

export async function GET() {
  try {
    const members = await redis.zrange("clients:index", 0, -1, { withScores: false });
    const clients = members.map((m) => JSON.parse(m as string));
    return NextResponse.json(clients);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name } = body;

    const members = await redis.zrange("clients:index", 0, -1);
    const isFirst = members.length === 0;

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    const client: Client = {
      id,
      name,
      createdAt,
      currentPhase: "Acclimation Phase",
      latestBW: null,
      latestDate: null,
      weeks: [],
    };

    await redis.hset(`client:${id}`, client as unknown as Record<string, unknown>);
    await redis.zadd("clients:index", { score: Date.now(), member: JSON.stringify({ id, name, currentPhase: client.currentPhase, latestBW: null, latestDate: null }) });

    if (isFirst && name === "Garry Gill") {
      for (let i = 0; i < GARRY_DATES.length; i++) {
        const week: WeekEntry = { date: GARRY_DATES[i], ...GARRY_GILL_WEEKS[i] };
        await redis.zadd(`client:${id}:weeks`, { score: new Date(GARRY_DATES[i]).getTime(), member: JSON.stringify(week) });
      }
      const lastWeek = GARRY_GILL_WEEKS[GARRY_GILL_WEEKS.length - 1];
      const lastDate = GARRY_DATES[GARRY_DATES.length - 1];
      await redis.hset(`client:${id}`, {
        currentPhase: lastWeek.phase,
        latestBW: lastWeek.bodyWeight,
        latestDate: lastDate,
      } as Record<string, unknown>);
      await redis.zadd("clients:index", {
        score: Date.now(),
        member: JSON.stringify({ id, name, currentPhase: lastWeek.phase, latestBW: lastWeek.bodyWeight, latestDate: lastDate }),
      });
    }

    return NextResponse.json(client, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed to create client" }, { status: 500 });
  }
}
