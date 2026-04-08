"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Client } from "./types";

const PHASE_COLORS: Record<string, string> = {
  "Growth Phase": "#0abab5",
  "Maintenance Phase": "#3b82f6",
  "Deload": "#f97316",
  "Acclimation Phase": "#a855f7",
};

export default function HomePage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [search, setSearch] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);

  async function fetchClients() {
    const res = await fetch("/api/clients");
    const data = await res.json();
    setClients(data);
    setLoading(false);
  }

  useEffect(() => {
    fetchClients();
  }, []);

  async function handleAdd() {
    if (!newName.trim()) return;
    await fetch("/api/clients", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });
    setNewName("");
    setShowAdd(false);
    fetchClients();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this client?")) return;
    await fetch(`/api/clients/${id}`, { method: "DELETE" });
    fetchClients();
  }

  const filtered = clients.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8 gap-4">
        <input
          type="text"
          placeholder="Search clients..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-4 py-2 rounded-lg outline-none text-sm flex-1 max-w-sm"
          style={{
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "var(--text)",
          }}
        />
        <button
          onClick={() => setShowAdd(true)}
          className="px-5 py-2 rounded-lg text-sm font-medium transition-opacity hover:opacity-85"
          style={{ background: "var(--tiffany)", color: "#000" }}
        >
          + Add Client
        </button>
      </div>

      {showAdd && (
        <div
          className="mb-8 p-6 rounded-xl"
          style={{
            background: "var(--glass-bg)",
            border: "1px solid var(--glass-border)",
          }}
        >
          <h3 className="text-sm font-medium mb-3" style={{ color: "var(--text)" }}>
            New Client
          </h3>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Client name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAdd()}
              className="px-4 py-2 rounded-lg outline-none text-sm flex-1"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "var(--text)",
              }}
              autoFocus
            />
            <button
              onClick={handleAdd}
              className="px-5 py-2 rounded-lg text-sm font-medium"
              style={{ background: "var(--tiffany)", color: "#000" }}
            >
              Create
            </button>
            <button
              onClick={() => { setShowAdd(false); setNewName(""); }}
              className="px-5 py-2 rounded-lg text-sm"
              style={{ background: "rgba(255,255,255,0.08)", color: "var(--text)" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p style={{ color: "var(--text-muted)" }}>Loading...</p>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <span style={{ fontSize: "3rem" }}>📋</span>
          <p style={{ color: "var(--text-muted)" }}>No clients yet</p>
          <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
            Add your first client to get started
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((client) => {
            const phaseColor = PHASE_COLORS[client.currentPhase] || "var(--tiffany)";
            return (
              <div
                key={client.id}
                className="p-5 rounded-xl transition-colors hover:border-opacity-40"
                style={{
                  background: "var(--glass-bg)",
                  border: "1px solid var(--glass-border)",
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <Link
                    href={`/client/${client.id}`}
                    className="text-base font-semibold hover:underline"
                    style={{ color: "var(--text)" }}
                  >
                    {client.name}
                  </Link>
                  <button
                    onClick={() => handleDelete(client.id)}
                    className="text-xs px-2 py-1 rounded opacity-50 hover:opacity-100 transition-opacity"
                    style={{ color: "#ef4444", background: "rgba(239,68,68,0.1)" }}
                  >
                    Delete
                  </button>
                </div>
                <div
                  className="inline-block text-xs px-2 py-1 rounded mb-3 font-medium"
                  style={{ background: `${phaseColor}20`, color: phaseColor }}
                >
                  {client.currentPhase}
                </div>
                <div className="space-y-1">
                  {client.latestBW != null && (
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                      BW: <span style={{ color: "var(--text)" }}>{client.latestBW} kg</span>
                    </p>
                  )}
                  {client.latestDate && (
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                      Last: <span style={{ color: "var(--text)" }}>{client.latestDate}</span>
                    </p>
                  )}
                </div>
                <Link
                  href={`/client/${client.id}`}
                  className="mt-4 block text-center py-2 rounded-lg text-sm transition-opacity hover:opacity-80"
                  style={{ background: "rgba(255,255,255,0.06)", color: "var(--text)" }}
                >
                  View Dashboard →
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
