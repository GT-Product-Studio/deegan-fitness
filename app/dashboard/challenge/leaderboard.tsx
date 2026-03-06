"use client";

interface LeaderboardEntry {
  user_id: string;
  full_name: string | null;
  avatar_url: string | null;
  total_cycling_miles: number;
  total_moto_hours: number;
  total_gym_hours: number;
  total_score: number;
  active_days: number;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId: string;
  benchmarkScore: number;
}

const RANK_STYLES: Record<number, string> = {
  1: "text-zone-tempo",
  2: "text-muted",
  3: "text-zone-threshold",
};

export function Leaderboard({
  entries,
  currentUserId,
  benchmarkScore,
}: LeaderboardProps) {
  if (entries.length === 0) {
    return (
      <div className="bg-card border border-white/10 rounded-2xl p-5">
        <h3 className="font-display text-xl font-bold uppercase mb-4">
          Leaderboard
        </h3>
        <div className="text-center py-8">
          <p className="text-3xl mb-3">🏁</p>
          <p className="text-muted text-sm">
            No entries yet. Log your first activity to get on the board!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-white/10 rounded-2xl p-5">
      <h3 className="font-display text-xl font-bold uppercase mb-4">
        Leaderboard
      </h3>

      {/* Benchmark reference */}
      <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-xl px-4 py-2.5 mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm">🏆</span>
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            Haiden&apos;s Benchmark
          </span>
        </div>
        <span className="font-display text-sm font-bold text-primary">
          {benchmarkScore.toLocaleString()} pts
        </span>
      </div>

      <div className="space-y-2">
        {entries.map((entry, i) => {
          const rank = i + 1;
          const isUser = entry.user_id === currentUserId;

          return (
            <div
              key={entry.user_id}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 transition ${
                isUser
                  ? "bg-primary/10 border border-primary/20"
                  : "bg-card-elevated border border-white/5"
              }`}
            >
              {/* Rank */}
              <span
                className={`font-display text-lg font-bold w-7 text-center ${
                  RANK_STYLES[rank] ?? "text-muted-dark"
                }`}
              >
                {rank}
              </span>

              {/* Name */}
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-semibold truncate ${
                    isUser ? "text-primary" : "text-white"
                  }`}
                >
                  {isUser ? "You" : entry.full_name ?? "Anonymous"}
                </p>
                <p className="text-[10px] text-muted tracking-wider">
                  {entry.active_days} day{entry.active_days !== 1 ? "s" : ""}{" "}
                  active
                </p>
              </div>

              {/* Breakdown */}
              <div className="hidden sm:flex items-center gap-3 text-[10px] text-muted tracking-wider">
                <span>{Number(entry.total_cycling_miles).toFixed(0)}mi</span>
                <span>{Number(entry.total_moto_hours).toFixed(1)}hr</span>
                <span>{Number(entry.total_gym_hours).toFixed(1)}hr</span>
              </div>

              {/* Score */}
              <span
                className={`font-display text-sm font-bold ${
                  isUser ? "text-primary" : "text-white"
                }`}
              >
                {Number(entry.total_score).toLocaleString()}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
