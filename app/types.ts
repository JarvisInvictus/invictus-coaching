export interface WeekEntry {
  date: string; // YYYY-MM-DD
  phase: string; // e.g. "Growth Phase", "Maintenance Phase", "Deload"
  bodyWeight: number | null;
  bwDiff: number | null; // change from previous week
  avgBW: number | null;
  restingHR: number | null;
  bloodPressure: string | null; // e.g. "120/80"
  steps: number | null;
  cardioMinutes: number | null;
  sessions: string | null; // e.g. "4 x Training"
  feed: string | null; // notes
  testLevel: string | null;
  e2Level: string | null;
  ldl: string | null;
  hdl: string | null;
  pedDose: string | null; // e.g. "350mg/week"
  notes: string | null;
}

export interface Client {
  id: string;
  name: string;
  createdAt: string;
  currentPhase: string;
  latestBW: number | null;
  latestDate: string | null;
  weeks: WeekEntry[];
}
