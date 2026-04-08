"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Client, WeekEntry } from "@/app/types";

const PHASE_COLORS: Record<string, string> = {
  "Growth Phase": "#0abab5",
  "Maintenance Phase": "#3b82f6",
  "Deload": "#f97316",
  "Acclimation Phase": "#a855f7",
};

function phaseColor(phase: string) {
  return PHASE_COLORS[phase] || "#0abab5";
}

function fmt(v: number | string | null, suffix = ""): string {
  if (v == null) return "—";
  return `${v}${suffix}`;
}

function fmtDiff(v: number | null): string {
  if (v == null) return "—";
  if (v > 0) return `+${v}`;
  return `${v}`;
}

const EMPTY_WEEK: WeekEntry = {
  date: "",
  phase: "Growth Phase",
  bodyWeight: null,
  bwDiff: null,
  avgBW: null,
  restingHR: null,
  bloodPressure: null,
  steps: null,
  cardioMinutes: null,
  sessions: null,
  feed: null,
  testLevel: null,
  e2Level: null,
  ldl: null,
  hdl: null,
  pedDose: null,
  notes: null,
};

export default function ClientPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editWeek, setEditWeek] = useState<WeekEntry | null>(null);
  const [form, setForm] = useState<WeekEntry>(EMPTY_WEEK);

  async function fetchClient() {
    const res = await fetch(`/api/clients/${id}`);
    if (!res.ok) { router.push("/"); return; }
    const data = await res.json();
    setClient(data);
    setLoading(false);
  }

  useEffect(() => { fetchClient(); }, [id]);

  function openEdit(w: WeekEntry) {
    setEditWeek(w);
    setForm({ ...w });
  }

  function closeEdit() {
    setEditWeek(null);
    setForm(EMPTY_WEEK);
  }

  async function handleAddWeek() {
    if (!form.date) return;
    await fetch(`/api/clients/${id}/weeks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setShowAdd(false);
    setForm(EMPTY_WEEK);
    fetchClient();
  }

  async function handleEditWeek() {
    if (!editWeek) return;
    await fetch(`/api/clients/${id}/weeks/${editWeek.date}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    closeEdit();
    fetchClient();
  }

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-8">
        <p style={{ color: "var(--text-muted)" }}>Loading...</p>
      </div>
    );
  }

  if (!client) return null;

  const weeks = [...(client.weeks || [])].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const pc = phaseColor(client.currentPhase);

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/" className="text-sm opacity-60 hover:opacity-100 transition-opacity">
          ← Clients
        </Link>
        <span className="opacity-30">/</span>
        <span className="text-sm" style={{ color: "var(--text-muted)" }}>{client.name}</span>
      </div>

      {/* Header */}
      <div
        className="rounded-xl p-6 mb-8"
        style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
      >
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2" style={{ color: "var(--text)" }}>
              {client.name}
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              <span
                className="text-sm px-3 py-1 rounded-full font-medium"
                style={{ background: `${pc}20`, color: pc }}
              >
                {client.currentPhase}
              </span>
              {client.latestBW != null && (
                <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                  BW: <strong style={{ color: "var(--text)" }}>{client.latestBW} kg</strong>
                </span>
              )}
              {client.latestDate && (
                <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                  as of {client.latestDate}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => { setShowAdd(true); setForm(EMPTY_WEEK); }}
            className="px-5 py-2 rounded-lg text-sm font-medium hover:opacity-85 transition-opacity"
            style={{ background: "var(--tiffany)", color: "#000" }}
          >
            + Add Week
          </button>
        </div>
      </div>

      {/* Phase Timeline */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold mb-4 uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
          Phase Timeline
        </h2>
        <div className="flex gap-2 overflow-x-auto pb-2 flex-wrap">
          {weeks.map((w) => {
            const color = phaseColor(w.phase);
            return (
              <div
                key={w.date}
                onClick={() => openEdit(w)}
                className="flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-opacity hover:opacity-80"
                style={{
                  background: `${color}20`,
                  color,
                  border: editWeek?.date === w.date ? `2px solid ${color}` : "1px solid transparent",
                }}
                title={`${w.date} — ${w.phase}`}
              >
                <div>{w.date.slice(5)}</div>
                <div style={{ fontSize: "0.65rem", opacity: 0.7 }}>{w.phase.split(" ")[0]}</div>
              </div>
            );
          })}
          {weeks.length === 0 && (
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>No weeks logged yet</p>
          )}
        </div>
      </div>

      {/* Add Week Form */}
      {showAdd && (
        <WeekForm
          title="Add Week"
          form={form}
          setForm={setForm}
          onSave={handleAddWeek}
          onCancel={() => { setShowAdd(false); setForm(EMPTY_WEEK); }}
        />
      )}

      {/* Edit Week Form */}
      {editWeek && (
        <WeekForm
          title={`Edit — ${editWeek.date}`}
          form={form}
          setForm={setForm}
          onSave={handleEditWeek}
          onCancel={closeEdit}
        />
      )}

      {/* Week Cards */}
      <div className="space-y-4">
        {weeks.map((w) => {
          const color = phaseColor(w.phase);
          return (
            <div
              key={w.date}
              className="rounded-xl overflow-hidden"
              style={{
                background: "var(--glass-bg)",
                border: `1px solid var(--glass-border)`,
              }}
            >
              <div
                className="px-5 py-3 flex items-center justify-between"
                style={{ borderBottom: `2px solid ${color}` }}
              >
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-sm">{w.date}</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded font-medium"
                    style={{ background: `${color}20`, color }}
                  >
                    {w.phase}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  {w.bodyWeight != null && (
                    <span className="text-sm font-medium" style={{ color: "var(--text)" }}>
                      {w.bodyWeight} kg
                    </span>
                  )}
                  {w.bwDiff != null && (
                    <span
                      className="text-xs font-medium"
                      style={{ color: w.bwDiff >= 0 ? "#4ade80" : "#f87171" }}
                    >
                      {fmtDiff(w.bwDiff)} kg
                    </span>
                  )}
                  <button
                    onClick={() => openEdit(w)}
                    className="text-xs px-3 py-1 rounded opacity-60 hover:opacity-100 transition-opacity"
                    style={{ background: "rgba(255,255,255,0.06)", color: "var(--text)" }}
                  >
                    Edit
                  </button>
                </div>
              </div>

              <div className="p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <Metric label="Body Weight" value={fmt(w.bodyWeight, " kg")} />
                <Metric label="BW Change" value={fmtDiff(w.bwDiff)} accent />
                <Metric label="Avg BW" value={fmt(w.avgBW, " kg")} />
                <Metric label="Resting HR" value={fmt(w.restingHR, " bpm")} />
                <Metric label="Blood Pressure" value={fmt(w.bloodPressure)} />
                <Metric label="Steps" value={fmt(w.steps)} />
                <Metric label="Cardio" value={fmt(w.cardioMinutes, " min")} />
                <Metric label="Sessions" value={fmt(w.sessions)} />
                <Metric label="Feed" value={fmt(w.feed, " kcal")} />
                <Metric label="Test Level" value={fmt(w.testLevel)} />
                <Metric label="E2 Level" value={fmt(w.e2Level)} />
                <Metric label="LDL" value={fmt(w.ldl)} />
                <Metric label="HDL" value={fmt(w.hdl)} />
                <Metric label="PED Dose" value={fmt(w.pedDose)} />
                {w.notes && (
                  <div className="col-span-full">
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
                      Notes
                    </p>
                    <p className="text-sm" style={{ color: "var(--text)" }}>{w.notes}</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Metric({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider mb-1" style={{ color: "var(--text-muted)" }}>
        {label}
      </p>
      <p className="text-sm font-medium" style={{ color: accent ? "#4ade80" : "var(--text)" }}>
        {value}
      </p>
    </div>
  );
}

function WeekForm({
  title,
  form,
  setForm,
  onSave,
  onCancel,
}: {
  title: string;
  form: WeekEntry;
  setForm: (f: WeekEntry) => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  function set(key: keyof WeekEntry, value: string | number | null) {
    setForm({ ...form, [key]: value === "" ? null : value });
  }

  return (
    <div
      className="rounded-xl p-6 mb-8"
      style={{ background: "var(--glass-bg)", border: "1px solid var(--glass-border)" }}
    >
      <h3 className="text-sm font-semibold mb-4" style={{ color: "var(--text)" }}>{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <Field label="Date" type="date" value={form.date} onChange={(v) => set("date", v)} />
        <Field label="Phase" value={form.phase} onChange={(v) => set("phase", v)} />
        <Field label="BW (kg)" type="number" value={form.bodyWeight ?? ""} onChange={(v) => set("bodyWeight", v)} />
        <Field label="BW Diff" type="number" value={form.bwDiff ?? ""} onChange={(v) => set("bwDiff", v)} />
        <Field label="Avg BW" type="number" value={form.avgBW ?? ""} onChange={(v) => set("avgBW", v)} />
        <Field label="RHR" type="number" value={form.restingHR ?? ""} onChange={(v) => set("restingHR", v)} />
        <Field label="BP" value={form.bloodPressure ?? ""} onChange={(v) => set("bloodPressure", v)} />
        <Field label="Steps" type="number" value={form.steps ?? ""} onChange={(v) => set("steps", v)} />
        <Field label="Cardio (min)" type="number" value={form.cardioMinutes ?? ""} onChange={(v) => set("cardioMinutes", v)} />
        <Field label="Sessions" value={form.sessions ?? ""} onChange={(v) => set("sessions", v)} />
        <Field label="Feed (kcal)" value={form.feed ?? ""} onChange={(v) => set("feed", v)} />
        <Field label="Test Level" value={form.testLevel ?? ""} onChange={(v) => set("testLevel", v)} />
        <Field label="E2 Level" value={form.e2Level ?? ""} onChange={(v) => set("e2Level", v)} />
        <Field label="LDL" value={form.ldl ?? ""} onChange={(v) => set("ldl", v)} />
        <Field label="HDL" value={form.hdl ?? ""} onChange={(v) => set("hdl", v)} />
        <Field label="PED Dose" value={form.pedDose ?? ""} onChange={(v) => set("pedDose", v)} />
        <div className="col-span-full">
          <Field label="Notes" value={form.notes ?? ""} onChange={(v) => set("notes", v)} />
        </div>
      </div>
      <div className="flex gap-3 mt-4">
        <button
          onClick={onSave}
          className="px-5 py-2 rounded-lg text-sm font-medium"
          style={{ background: "var(--tiffany)", color: "#000" }}
        >
          Save
        </button>
        <button
          onClick={onCancel}
          className="px-5 py-2 rounded-lg text-sm"
          style={{ background: "rgba(255,255,255,0.08)", color: "var(--text)" }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

function Field({
  label,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  type?: string;
  value: string | number | null;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider mb-1 block" style={{ color: "var(--text-muted)" }}>
        {label}
      </label>
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-1.5 rounded-lg outline-none text-sm"
        style={{
          background: "rgba(255,255,255,0.06)",
          border: "1px solid rgba(255,255,255,0.1)",
          color: "var(--text)",
        }}
      />
    </div>
  );
}
