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

  if (compact) {
    return (
      <div className="flex items-center gap-3 bg-[#FF6B00]/10 border border-[#FF6B00]/20 rounded-lg px-3 py-2">
        <span className="text-xs font-bold text-[#FF6B00] tracking-wider uppercase">vs Haiden</span>
        {haiden_avg_hr && (
          <span className="text-xs text-white/70">
            <span className="font-bold text-white">{haiden_avg_hr}</span> avg bpm
          </span>
        )}
        {haiden_calories && (
          <span className="text-xs text-white/70">
            <span className="font-bold text-white">{haiden_calories.toLocaleString()}</span> cal
          </span>
        )}
        {haiden_duration_min && (
          <span className="text-xs text-white/70">
            <span className="font-bold text-white">{Math.floor(haiden_duration_min / 60)}h {haiden_duration_min % 60}m</span>
          </span>
        )}
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

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {haiden_distance_mi && (
          <div className="bg-black/30 rounded-xl p-3 text-center">
            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Distance</p>
            <p className="text-xl font-bold text-white">{haiden_distance_mi}</p>
            <p className="text-[10px] text-white/30">miles</p>
          </div>
        )}
        {haiden_duration_min && (
          <div className="bg-black/30 rounded-xl p-3 text-center">
            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Total Time</p>
            <p className="text-xl font-bold text-white">
              {Math.floor(haiden_duration_min / 60)}h {haiden_duration_min % 60}m
            </p>
          </div>
        )}
        {haiden_avg_hr && (
          <div className="bg-black/30 rounded-xl p-3 text-center">
            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Avg HR</p>
            <p className="text-xl font-bold text-[#FF6B00]">{haiden_avg_hr}</p>
            <p className="text-[10px] text-white/30">bpm</p>
          </div>
        )}
        {haiden_calories && (
          <div className="bg-black/30 rounded-xl p-3 text-center">
            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-1">Calories</p>
            <p className="text-xl font-bold text-white">{haiden_calories.toLocaleString()}</p>
          </div>
        )}
      </div>

      <p className="text-[10px] text-white/20 text-center mt-3 tracking-wider">
        Based on Haiden&apos;s real training data · Age 20 · Max HR 210 · Resting HR 42
      </p>
    </div>
  );
}
