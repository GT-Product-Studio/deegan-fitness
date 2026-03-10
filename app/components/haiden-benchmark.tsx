import { brand } from "@/config/brand";

interface HaidenBenchmarkProps {
  workout: {
    haiden_distance_mi?: number | null;
    haiden_duration_min?: number | null;
    haiden_avg_hr?: number | null;
    haiden_max_hr?: number | null;
    haiden_calories?: number | null;
    week_day?: string | null;
  };
  compact?: boolean;
}

export function HaidenBenchmark({ workout, compact = false }: HaidenBenchmarkProps) {
  const { haiden_distance_mi, haiden_duration_min, haiden_avg_hr, haiden_max_hr, haiden_calories } = workout;

  // Don't render if no Haiden data
  if (!haiden_avg_hr && !haiden_calories && !haiden_duration_min) return null;

  // Build stat items — only include non-zero values
  const stats: { label: string; value: string; sub?: string; highlight?: boolean }[] = [];

  if (haiden_distance_mi && haiden_distance_mi > 0) {
    stats.push({ label: "Distance", value: `${haiden_distance_mi}`, sub: "miles" });
  }
  if (haiden_duration_min && haiden_duration_min > 0) {
    const h = Math.floor(haiden_duration_min / 60);
    const m = haiden_duration_min % 60;
    stats.push({ label: "Total Time", value: h > 0 ? `${h}h ${m}m` : `${m}m` });
  }
  if (haiden_avg_hr && haiden_avg_hr > 0) {
    stats.push({ label: "Avg HR", value: `${haiden_avg_hr}`, sub: "bpm", highlight: true });
  }
  if (haiden_calories && haiden_calories > 0) {
    stats.push({ label: "Calories", value: haiden_calories.toLocaleString() });
  }

  if (stats.length === 0) return null;

  if (compact) {
    return (
      <div className="flex items-center gap-3 bg-[#FF6B00]/10 border border-[#FF6B00]/20 rounded-lg px-3 py-2">
        <span className="text-xs font-bold text-[#FF6B00] tracking-wider uppercase">vs Haiden</span>
        {stats.map((s) => (
          <span key={s.label} className="text-xs text-white/70">
            <span className="font-bold text-white">{s.value}</span> {s.sub || s.label.toLowerCase()}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-[#FF6B00]/15 to-[#FF6B00]/5 border border-[#FF6B00]/25 rounded-2xl p-5 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#FF6B00]">
            Haiden&apos;s Benchmark
          </p>
          <p className="text-xs text-white/40 mt-0.5">Can you keep up?</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-white/30 uppercase tracking-wider">Max HR</p>
          <p className="text-lg font-bold text-red-500">210</p>
        </div>
      </div>

      <div className={`grid gap-3 ${stats.length <= 2 ? "grid-cols-2" : stats.length === 3 ? "grid-cols-3" : "grid-cols-2"}`}>
        {stats.map((stat) => (
          <div key={stat.label} className="bg-black/30 rounded-xl p-3 text-center">
            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">{stat.label}</p>
            <p className={`text-xl font-bold ${stat.highlight ? "text-[#FF6B00]" : "text-white"}`}>
              {stat.value}
            </p>
            {stat.sub && <p className="text-[10px] text-white/30">{stat.sub}</p>}
          </div>
        ))}
      </div>

      <p className="text-[10px] text-white/20 text-center mt-3 tracking-wider">
        Based on Haiden&apos;s real training data · Age 20 · Max HR 210 · Resting HR 42
      </p>
    </div>
  );
}
