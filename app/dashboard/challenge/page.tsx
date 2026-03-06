import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Bike, Timer, Dumbbell } from "lucide-react";
import { Leaderboard } from "./leaderboard";
import { ChallengeActions } from "./challenge-actions";

export default async function ChallengePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  // Get active challenge
  const { data: challenge } = await supabase
    .from("challenges")
    .select("*")
    .eq("month", month)
    .eq("year", year)
    .eq("active", true)
    .single();

  if (!challenge) {
    return (
      <div className="space-y-4 pb-6">
        <div className="bg-card border border-white/10 rounded-2xl p-5 text-center py-12">
          <p className="text-3xl mb-3">🏁</p>
          <h2 className="font-display text-xl font-bold uppercase mb-2">
            No Active Challenge
          </h2>
          <p className="text-muted text-sm">
            Check back soon for the next monthly challenge.
          </p>
        </div>
      </div>
    );
  }

  // Days remaining
  const endsAt = new Date(challenge.ends_at);
  const daysRemaining = Math.max(
    0,
    Math.ceil((endsAt.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  );

  // Get leaderboard
  const { data: leaderboard } = await supabase
    .from("challenge_leaderboard")
    .select("*")
    .eq("challenge_id", challenge.id)
    .order("total_score", { ascending: false });

  const userStats = leaderboard?.find((row) => row.user_id === user.id);

  const cyclingMiles = Number(userStats?.total_cycling_miles ?? 0);
  const motoHours = Number(userStats?.total_moto_hours ?? 0);
  const gymHours = Number(userStats?.total_gym_hours ?? 0);
  const totalScore = Number(userStats?.total_score ?? 0);

  const benchmarkCycling = Number(challenge.benchmark_cycling_miles);
  const benchmarkMoto = Number(challenge.benchmark_moto_hours);
  const benchmarkGym = Number(challenge.benchmark_gym_hours);
  const benchmarkScore =
    benchmarkCycling + benchmarkMoto * 25 + benchmarkGym * 20;

  const cyclingPct = Math.min(100, (cyclingMiles / benchmarkCycling) * 100);
  const motoPct = Math.min(100, (motoHours / benchmarkMoto) * 100);
  const gymPct = Math.min(100, (gymHours / benchmarkGym) * 100);

  // Streak: count consecutive days with activity ending today
  const { data: activities } = await supabase
    .from("activity_logs")
    .select("date")
    .eq("user_id", user.id)
    .eq("challenge_id", challenge.id)
    .order("date", { ascending: false });

  let streak = 0;
  if (activities && activities.length > 0) {
    const uniqueDates = [...new Set(activities.map((a) => a.date))].sort(
      (a, b) => new Date(b).getTime() - new Date(a).getTime()
    );
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date(Date.now() - 86400000)
      .toISOString()
      .split("T")[0];

    // Streak counts if most recent activity is today or yesterday
    if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
      streak = 1;
      for (let i = 1; i < uniqueDates.length; i++) {
        const prev = new Date(uniqueDates[i - 1]);
        const curr = new Date(uniqueDates[i]);
        const diffDays = Math.round(
          (prev.getTime() - curr.getTime()) / (1000 * 60 * 60 * 24)
        );
        if (diffDays === 1) {
          streak++;
        } else {
          break;
        }
      }
    }
  }

  return (
    <div className="space-y-4 pb-6">
      {/* Challenge Header */}
      <div className="bg-card border border-white/10 rounded-2xl overflow-hidden">
        <div className="h-1 w-full bg-primary" />
        <div className="p-5">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] text-primary tracking-wider uppercase font-bold">
              Monthly Challenge
            </p>
            <p className="text-[10px] text-muted tracking-wider uppercase">
              {daysRemaining} day{daysRemaining !== 1 ? "s" : ""} left
            </p>
          </div>
          <h1 className="font-display text-2xl font-bold uppercase mb-1">
            {challenge.title}
          </h1>
          {challenge.description && (
            <p className="text-sm text-muted">{challenge.description}</p>
          )}

          {/* Score + Streak */}
          <div className="flex items-center gap-4 mt-4">
            <div className="bg-card-elevated border border-white/5 rounded-xl px-4 py-2.5 flex-1 text-center">
              <p className="font-display text-2xl font-bold text-primary">
                {totalScore.toLocaleString()}
              </p>
              <p className="text-[10px] text-muted tracking-wider uppercase">
                Your Score
              </p>
            </div>
            <div className="bg-card-elevated border border-white/5 rounded-xl px-4 py-2.5 flex-1 text-center">
              <p className="font-display text-2xl font-bold text-white">
                {streak}
              </p>
              <p className="text-[10px] text-muted tracking-wider uppercase">
                Day Streak 🔥
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress vs Benchmarks */}
      <div className="bg-card border border-white/10 rounded-2xl p-5">
        <h3 className="font-bold text-sm uppercase tracking-wider text-muted mb-4">
          Your Progress vs Haiden&apos;s Benchmarks
        </h3>
        <div className="space-y-4">
          {/* Cycling */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <Bike className="w-4 h-4 text-primary" />
                <span className="text-sm text-white font-semibold">
                  Cycling
                </span>
              </div>
              <span className="text-xs text-muted">
                {cyclingMiles.toFixed(0)} / {benchmarkCycling} mi
              </span>
            </div>
            <div className="h-3 bg-card-elevated rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-primary rounded-full transition-all duration-500"
                style={{ width: `${cyclingPct}%` }}
              />
            </div>
          </div>

          {/* Moto */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <Timer className="w-4 h-4 text-zone-threshold" />
                <span className="text-sm text-white font-semibold">Moto</span>
              </div>
              <span className="text-xs text-muted">
                {motoHours.toFixed(1)} / {benchmarkMoto} hr
              </span>
            </div>
            <div className="h-3 bg-card-elevated rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-zone-threshold rounded-full transition-all duration-500"
                style={{ width: `${motoPct}%` }}
              />
            </div>
          </div>

          {/* Gym */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-zone-tempo" />
                <span className="text-sm text-white font-semibold">Gym</span>
              </div>
              <span className="text-xs text-muted">
                {gymHours.toFixed(1)} / {benchmarkGym} hr
              </span>
            </div>
            <div className="h-3 bg-card-elevated rounded-full overflow-hidden border border-white/5">
              <div
                className="h-full bg-zone-tempo rounded-full transition-all duration-500"
                style={{ width: `${gymPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Log Activity Button + Modal (client component) */}
      <ChallengeActions challengeId={challenge.id} />

      {/* Leaderboard */}
      <Leaderboard
        entries={leaderboard ?? []}
        currentUserId={user.id}
        benchmarkScore={benchmarkScore}
      />
    </div>
  );
}
