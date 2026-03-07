"use client";

import { brand } from "@/config/brand";

export interface ActivityLog {
  id: string;
  activity_type: string; // cycling | moto | gym
  value: number; // miles for cycling, hours for moto/gym
  date: string;
  source: string; // polar | garmin | manual
  hr_avg: number | null;
  hr_max: number | null;
  hr_zone_minutes: Record<string, number> | null; // { z1: 5, z2: 30, z3: 20, ... }
  notes: string | null;
}

interface BlockStatsProps {
  block: string;
  activities: ActivityLog[];
}

const BLOCK_TO_ACTIVITY: Record<string, string> = {
  cycling: "cycling",
  moto: "moto",
  gym: "gym",
};

const BENCHMARKS: Record<string, { value: number; unit: string; hrAvg: number }> = {
  cycling: {
    value: brand.benchmarks.dailyCyclingMiles,
    unit: "mi",
    hrAvg: brand.benchmarks.avgRideHR,
  },
  moto: {
    value: brand.benchmarks.dailyMotoHours,
    unit: "hrs",
    hrAvg: brand.benchmarks.avgMotoHR,
  },
  gym: {
    value: brand.benchmarks.dailyGymHours,
    unit: "hrs",
    hrAvg: brand.benchmarks.avgGymHR,
  },
};

const ZONE_COLORS: Record<string, string> = {
  z1: "#808080",
  z2: "#29F000",
  z3: "#FFD700",
  z4: "#FF6B00",
  z5: "#FF0000",
};

const ZONE_LABELS: Record<string, string> = {
  z1: "Recovery",
  z2: "Endurance",
  z3: "Tempo",
  z4: "Threshold",
  z5: "Redline",
};

export function BlockStats({ block, activities }: BlockStatsProps) {
  const activityType = BLOCK_TO_ACTIVITY[block];
  if (!activityType) return null;

  // Find matching activities for this block
  const matched = activities.filter((a) => a.activity_type === activityType);
  if (matched.length === 0) return null;

  // Aggregate if multiple sessions (e.g. two cycling rides in one day)
  const totalValue = matched.reduce((sum, a) => sum + a.value, 0);
  const avgHR = matched.filter((a) => a.hr_avg).length > 0
    ? Math.round(matched.reduce((sum, a) => sum + (a.hr_avg || 0), 0) / matched.filter((a) => a.hr_avg).length)
    : null;
  const maxHR = matched.reduce((max, a) => Math.max(max, a.hr_max || 0), 0) || null;
  const source = matched[0].source;

  // Merge zone minutes across all sessions
  const mergedZones: Record<string, number> = {};
  matched.forEach((a) => {
    if (a.hr_zone_minutes) {
      Object.entries(a.hr_zone_minutes).forEach(([zone, mins]) => {
        mergedZones[zone] = (mergedZones[zone] || 0) + mins;
      });
    }
  });
  const hasZones = Object.keys(mergedZones).length > 0;
  const totalZoneMinutes = Object.values(mergedZones).reduce((s, m) => s + m, 0);

  const benchmark = BENCHMARKS[activityType];
  const pct = benchmark ? Math.round((totalValue / benchmark.value) * 100) : null;
  const unit = activityType === "cycling" ? "mi" : "hrs";
  const displayValue = activityType === "cycling"
    ? totalValue.toFixed(1)
    : totalValue.toFixed(1);

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          <span className="text-[10px] font-bold text-primary tracking-[0.2em] uppercase">
            Synced from {source === "polar" ? "Polar" : source === "garmin" ? "Garmin" : source}
          </span>
        </div>
        <span className="text-[10px] text-muted">
          {matched.length > 1 ? `${matched.length} sessions` : "1 session"}
        </span>
      </div>

      {/* Main stats row */}
      <div className="grid grid-cols-3 gap-3 mb-3">
        {/* Actual value */}
        <div className="text-center">
          <p className="font-display text-2xl font-bold text-white">{displayValue}</p>
          <p className="text-[10px] text-muted tracking-wider uppercase">{unit}</p>
        </div>

        {/* Avg HR */}
        {avgHR && (
          <div className="text-center">
            <p className="font-display text-2xl font-bold text-white">{avgHR}</p>
            <p className="text-[10px] text-muted tracking-wider uppercase">Avg HR</p>
          </div>
        )}

        {/* Max HR */}
        {maxHR && (
          <div className="text-center">
            <p className="font-display text-2xl font-bold text-zone-redline">{maxHR}</p>
            <p className="text-[10px] text-muted tracking-wider uppercase">Max HR</p>
          </div>
        )}
      </div>

      {/* HR Zone breakdown */}
      {hasZones && totalZoneMinutes > 0 && (
        <div className="mb-3">
          <p className="text-[10px] text-muted tracking-wider uppercase mb-2">HR Zones</p>
          {/* Zone bar */}
          <div className="flex h-3 rounded-full overflow-hidden mb-2">
            {["z1", "z2", "z3", "z4", "z5"].map((zone) => {
              const mins = mergedZones[zone] || 0;
              const widthPct = (mins / totalZoneMinutes) * 100;
              if (widthPct < 1) return null;
              return (
                <div
                  key={zone}
                  className="transition-all"
                  style={{
                    width: `${widthPct}%`,
                    backgroundColor: ZONE_COLORS[zone],
                  }}
                  title={`${ZONE_LABELS[zone]}: ${mins}min`}
                />
              );
            })}
          </div>
          {/* Zone labels */}
          <div className="flex flex-wrap gap-x-3 gap-y-1">
            {["z1", "z2", "z3", "z4", "z5"].map((zone) => {
              const mins = mergedZones[zone] || 0;
              if (mins < 1) return null;
              return (
                <div key={zone} className="flex items-center gap-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: ZONE_COLORS[zone] }}
                  />
                  <span className="text-[10px] text-muted">
                    Z{zone.replace("z", "")} {mins}m
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* vs Haiden benchmark */}
      {benchmark && pct !== null && (
        <div className="border-t border-white/10 pt-3">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-muted tracking-wider uppercase">vs Haiden</span>
            <span className={`text-xs font-bold ${pct >= 100 ? "text-primary" : pct >= 80 ? "text-zone-tempo" : "text-zone-threshold"}`}>
              {pct}%
            </span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min(pct, 100)}%`,
                backgroundColor: pct >= 100 ? "#29F000" : pct >= 80 ? "#FFD700" : "#FF6B00",
              }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-[10px] text-muted">
              {displayValue} {unit}
            </span>
            <span className="text-[10px] text-primary">
              {benchmark.value} {benchmark.unit}
            </span>
          </div>
          {avgHR && (
            <div className="flex justify-between mt-0.5">
              <span className="text-[10px] text-muted">
                HR {avgHR} avg
              </span>
              <span className="text-[10px] text-primary">
                Haiden {benchmark.hrAvg} avg
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
