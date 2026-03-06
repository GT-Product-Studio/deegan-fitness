"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface ActivityLoggerProps {
  challengeId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const ACTIVITY_TYPES = [
  { value: "cycling" as const, label: "Cycling", emoji: "🚴", unit: "miles" },
  { value: "moto" as const, label: "Moto", emoji: "🏍️", unit: "hours" },
  { value: "gym" as const, label: "Gym", emoji: "🏋️", unit: "hours" },
];

export function ActivityLogger({
  challengeId,
  onClose,
  onSuccess,
}: ActivityLoggerProps) {
  const [activityType, setActivityType] = useState<
    "cycling" | "moto" | "gym"
  >("cycling");
  const [value, setValue] = useState("");
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [hrAvg, setHrAvg] = useState("");
  const [hrMax, setHrMax] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const selectedType = ACTIVITY_TYPES.find((t) => t.value === activityType)!;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue <= 0) {
      setError("Enter a valid positive number");
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activity_type: activityType,
          value: numValue,
          date,
          challenge_id: challengeId,
          hr_avg: hrAvg ? parseInt(hrAvg) : undefined,
          hr_max: hrMax ? parseInt(hrMax) : undefined,
          notes: notes || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to log activity");
      }

      setSuccess(true);
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-card border border-white/10 rounded-t-2xl sm:rounded-2xl p-5 animate-in slide-in-from-bottom duration-300">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-display text-xl font-bold uppercase">
            Log Activity
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-white/10 hover:bg-card-elevated transition"
          >
            <X className="w-4 h-4 text-muted" />
          </button>
        </div>

        {success ? (
          <div className="text-center py-8">
            <p className="text-3xl mb-2">✅</p>
            <p className="text-primary font-display text-lg font-bold uppercase">
              Logged!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Activity Type */}
            <div className="grid grid-cols-3 gap-2">
              {ACTIVITY_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setActivityType(type.value)}
                  className={`py-3 rounded-xl text-center transition border ${
                    activityType === type.value
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "bg-card-elevated border-white/5 text-muted hover:border-white/10"
                  }`}
                >
                  <span className="text-xl block mb-1">{type.emoji}</span>
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {type.label}
                  </span>
                </button>
              ))}
            </div>

            {/* Value */}
            <div>
              <label className="text-[10px] text-muted tracking-wider uppercase block mb-1.5">
                {selectedType.label} ({selectedType.unit})
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder={`Enter ${selectedType.unit}`}
                required
                className="w-full bg-card-elevated border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-muted-dark focus:outline-none focus:border-primary/50 transition"
              />
            </div>

            {/* Date */}
            <div>
              <label className="text-[10px] text-muted tracking-wider uppercase block mb-1.5">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-card-elevated border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary/50 transition [color-scheme:dark]"
              />
            </div>

            {/* HR fields */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-muted tracking-wider uppercase block mb-1.5">
                  Avg HR (optional)
                </label>
                <input
                  type="number"
                  min="0"
                  max="250"
                  value={hrAvg}
                  onChange={(e) => setHrAvg(e.target.value)}
                  placeholder="bpm"
                  className="w-full bg-card-elevated border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-muted-dark focus:outline-none focus:border-primary/50 transition"
                />
              </div>
              <div>
                <label className="text-[10px] text-muted tracking-wider uppercase block mb-1.5">
                  Max HR (optional)
                </label>
                <input
                  type="number"
                  min="0"
                  max="250"
                  value={hrMax}
                  onChange={(e) => setHrMax(e.target.value)}
                  placeholder="bpm"
                  className="w-full bg-card-elevated border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-muted-dark focus:outline-none focus:border-primary/50 transition"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="text-[10px] text-muted tracking-wider uppercase block mb-1.5">
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={2}
                placeholder="How'd it go?"
                className="w-full bg-card-elevated border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-muted-dark focus:outline-none focus:border-primary/50 transition resize-none"
              />
            </div>

            {error && (
              <p className="text-zone-redline text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-black font-display font-bold uppercase tracking-wider py-3.5 rounded-xl hover:bg-primary-dark transition disabled:opacity-50"
            >
              {submitting ? "Logging..." : "Log Activity"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
