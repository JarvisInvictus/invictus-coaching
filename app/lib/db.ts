import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";

const DB_DIR = "/tmp/data";
const DB_PATH = join(DB_DIR, "clients.json");

export interface WeekEntry {
  date: string;
  phase: string;
  bodyWeight: number | null;
  bwDiff: number | null;
  avgBW: number | null;
  restingHR: number | null;
  bloodPressure: string | null;
  steps: number | null;
  cardioMinutes: number | null;
  sessions: string | null;
  feed: string | null;
  testLevel: string | null;
  e2Level: string | null;
  ldl: string | null;
  hdl: string | null;
  pedDose: string | null;
  notes: string | null;
}

export interface Client {
  id: string;
  name: string;
  createdAt: string;
  currentPhase: string;
  latestBW: number | null;
  latestDate: string | null;
}

interface DB {
  clients: Client[];
  weeks: Record<string, WeekEntry[]>;
}

function ensureDB() {
  const dir = join(process.cwd(), "data");
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
  if (!existsSync(DB_PATH)) writeFileSync(DB_PATH, JSON.stringify({ clients: [], weeks: {} }));
}

function readDB(): DB {
  ensureDB();
  const raw = readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeDB(data: DB) {
  ensureDB();
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
}

const GARRY_WEEKS: WeekEntry[] = [
  { date: "2025-04-10", phase: "Acclimation Phase", bodyWeight: 77.3, bwDiff: null, avgBW: null, restingHR: null, bloodPressure: null, steps: 2300, cardioMinutes: null, sessions: "4x Training", feed: "2000", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { date: "2025-04-17", phase: "Acclimation Phase", bodyWeight: 77.3, bwDiff: 0, avgBW: null, restingHR: null, bloodPressure: null, steps: 2300, cardioMinutes: null, sessions: "4x Training", feed: "2000", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { date: "2025-04-24", phase: "Growth Phase", bodyWeight: 78.1, bwDiff: 0.8, avgBW: null, restingHR: null, bloodPressure: null, steps: 2300, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { date: "2025-05-08", phase: "Growth Phase", bodyWeight: 79.0, bwDiff: 0.9, avgBW: null, restingHR: null, bloodPressure: null, steps: 2561, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { date: "2025-05-15", phase: "Growth Phase", bodyWeight: 79.4, bwDiff: 0.4, avgBW: null, restingHR: 123, bloodPressure: "139/70", steps: 2715, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { date: "2025-05-22", phase: "Growth Phase", bodyWeight: 79.6, bwDiff: 0.2, avgBW: null, restingHR: 126.5, bloodPressure: null, steps: 2805, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { date: "2025-05-29", phase: "Growth Phase", bodyWeight: 80.0, bwDiff: 0.4, avgBW: null, restingHR: null, bloodPressure: null, steps: 3187, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { date: "2025-06-05", phase: "Growth Phase", bodyWeight: 80.5, bwDiff: 0.5, avgBW: null, restingHR: null, bloodPressure: null, steps: 3187, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { date: "2025-06-12", phase: "Growth Phase", bodyWeight: 81.0, bwDiff: 0.5, avgBW: null, restingHR: null, bloodPressure: null, steps: 3187, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { date: "2025-06-19", phase: "Growth Phase", bodyWeight: 82.9, bwDiff: 1.9, avgBW: null, restingHR: 92, bloodPressure: "122/68", steps: 5038, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { date: "2025-06-26", phase: "Growth Phase", bodyWeight: 82.9, bwDiff: 0, avgBW: null, restingHR: null, bloodPressure: null, steps: 7490, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { date: "2025-07-03", phase: "Maintenance Phase", bodyWeight: 82.9, bwDiff: 0, avgBW: null, restingHR: null, bloodPressure: null, steps: 7169, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { date: "2025-07-17", phase: "Growth Phase", bodyWeight: 81.1, bwDiff: -1.8, avgBW: null, restingHR: null, bloodPressure: null, steps: 5300, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: "Blood Redrawn" },
  { date: "2025-07-24", phase: "Growth Phase", bodyWeight: 82.3, bwDiff: 1.2, avgBW: null, restingHR: 58, bloodPressure: "127/73", steps: 5566, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: "96.3", e2Level: "38.4", ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { date: "2025-07-31", phase: "Growth Phase", bodyWeight: 83.1, bwDiff: 0.8, avgBW: null, restingHR: null, bloodPressure: null, steps: 6399, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { date: "2025-08-07", phase: "Growth Phase", bodyWeight: 83.5, bwDiff: 0.4, avgBW: null, restingHR: 60, bloodPressure: "122/68", steps: 7692, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { date: "2025-08-14", phase: "Growth Phase", bodyWeight: 83.4, bwDiff: -0.1, avgBW: null, restingHR: null, bloodPressure: null, steps: 7310, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { date: "2025-08-21", phase: "Growth Phase", bodyWeight: 83.7, bwDiff: 0.3, avgBW: null, restingHR: 65, bloodPressure: "125/73", steps: 5838, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { date: "2025-08-28", phase: "Growth Phase", bodyWeight: 83.9, bwDiff: 0.2, avgBW: null, restingHR: 96, bloodPressure: "117/80", steps: 6522, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { date: "2025-09-04", phase: "Deload", bodyWeight: 84.4, bwDiff: 0.5, avgBW: null, restingHR: null, bloodPressure: null, steps: 6186, cardioMinutes: null, sessions: "3x50% + 2xOff", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { date: "2025-09-11", phase: "Growth Phase", bodyWeight: 84.8, bwDiff: 0.4, avgBW: null, restingHR: null, bloodPressure: null, steps: 7497, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { date: "2025-09-18", phase: "Growth Phase", bodyWeight: 84.7, bwDiff: -0.1, avgBW: null, restingHR: null, bloodPressure: null, steps: 7549, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { date: "2025-09-25", phase: "Growth Phase", bodyWeight: 85.1, bwDiff: 0.4, avgBW: null, restingHR: 76, bloodPressure: "121/76", steps: 7640, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { date: "2025-10-02", phase: "Growth Phase", bodyWeight: 85.8, bwDiff: 0.7, avgBW: null, restingHR: null, bloodPressure: null, steps: 6381, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { date: "2025-10-09", phase: "Growth Phase", bodyWeight: 86.0, bwDiff: 0.2, avgBW: null, restingHR: 67, bloodPressure: "120/80", steps: 7747, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { date: "2025-10-16", phase: "Growth Phase", bodyWeight: 86.0, bwDiff: 0, avgBW: null, restingHR: null, bloodPressure: null, steps: 7482, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { date: "2025-10-23", phase: "Growth Phase", bodyWeight: 86.3, bwDiff: 0.3, avgBW: null, restingHR: 91, bloodPressure: "126/78", steps: 7462, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { date: "2025-10-30", phase: "Growth Phase", bodyWeight: 86.9, bwDiff: 0.6, avgBW: null, restingHR: null, bloodPressure: null, steps: 6668, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { date: "2025-11-06", phase: "Growth Phase", bodyWeight: 87.3, bwDiff: 0.4, avgBW: null, restingHR: null, bloodPressure: null, steps: 7800, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { date: "2025-11-13", phase: "Growth Phase", bodyWeight: 87.3, bwDiff: 0, avgBW: null, restingHR: null, bloodPressure: null, steps: 7323, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { date: "2025-11-20", phase: "Growth Phase", bodyWeight: 87.2, bwDiff: -0.1, avgBW: null, restingHR: null, bloodPressure: null, steps: 7507, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { date: "2025-11-27", phase: "Growth Phase", bodyWeight: 87.2, bwDiff: 0, avgBW: null, restingHR: 82, bloodPressure: "130/71", steps: 6673, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { date: "2025-12-04", phase: "Growth Phase", bodyWeight: 87.3, bwDiff: 0.1, avgBW: null, restingHR: null, bloodPressure: null, steps: 9332, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { date: "2025-12-11", phase: "Growth Phase", bodyWeight: 87.5, bwDiff: 0.2, avgBW: null, restingHR: null, bloodPressure: null, steps: 7659, cardioMinutes: null, sessions: "4x Training", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
  { date: "2025-12-18", phase: "Deload", bodyWeight: 87.6, bwDiff: 0.1, avgBW: null, restingHR: null, bloodPressure: null, steps: null, cardioMinutes: null, sessions: "3x50%", feed: "2500", testLevel: null, e2Level: null, ldl: null, hdl: null, pedDose: "350mg/wk", notes: null },
];

export function getAllClients(): Client[] {
  return readDB().clients;
}

export function getClient(id: string): (Client & { weeks: WeekEntry[] }) | null {
  const db = readDB();
  const client = db.clients.find((c) => c.id === id);
  if (!client) return null;
  return { ...client, weeks: db.weeks[id] || [] };
}

export function createClient(name: string): Client {
  const db = readDB();
  const client: Client = {
    id: crypto.randomUUID(),
    name,
    createdAt: new Date().toISOString(),
    currentPhase: "Acclimation Phase",
    latestBW: null,
    latestDate: null,
  };
  db.clients.push(client);
  db.weeks[client.id] = [];

  if (db.clients.length === 1 && name === "Garry Gill") {
    db.weeks[client.id] = GARRY_WEEKS;
    client.currentPhase = GARRY_WEEKS[GARRY_WEEKS.length - 1].phase;
    client.latestBW = GARRY_WEEKS[GARRY_WEEKS.length - 1].bodyWeight;
    client.latestDate = GARRY_WEEKS[GARRY_WEEKS.length - 1].date;
  }

  writeDB(db);
  return client;
}

export function deleteClient(id: string) {
  const db = readDB();
  db.clients = db.clients.filter((c) => c.id !== id);
  delete db.weeks[id];
  writeDB(db);
}

export function getWeeks(clientId: string): WeekEntry[] {
  return readDB().weeks[clientId] || [];
}

export function addWeek(clientId: string, week: WeekEntry): WeekEntry {
  const db = readDB();
  if (!db.weeks[clientId]) db.weeks[clientId] = [];
  db.weeks[clientId].push(week);
  const client = db.clients.find((c) => c.id === clientId);
  if (client) {
    client.currentPhase = week.phase;
    client.latestBW = week.bodyWeight;
    client.latestDate = week.date;
  }
  writeDB(db);
  return week;
}

export function updateWeek(clientId: string, date: string, updates: Partial<WeekEntry>): WeekEntry | null {
  const db = readDB();
  const weeks = db.weeks[clientId] || [];
  const idx = weeks.findIndex((w) => w.date === date);
  if (idx === -1) return null;
  weeks[idx] = { ...weeks[idx], ...updates };
  const client = db.clients.find((c) => c.id === clientId);
  if (client && weeks[idx].bodyWeight !== null) {
    client.currentPhase = weeks[idx].phase;
    client.latestBW = weeks[idx].bodyWeight;
    client.latestDate = weeks[idx].date;
  }
  writeDB(db);
  return weeks[idx];
}
