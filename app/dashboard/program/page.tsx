import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, CheckCircle } from "lucide-react";

const WEEK_LABELS = [
  "Foundation",
  "Build",
  "Intensity",
  "Peak & Taper",
  "Foundation",
];

const DAY_TYPE_STYLES: Record<string, string> = {
  training: "bg-primary/20 text-primary",
  race: "bg-zone-redline/20 text-zone-redline",
  recovery: "bg-white/10 text-muted",
  travel: "bg-white/10 text-muted",
};

export default async function ProgramPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Fetch user profile for training level
  const { data: profile } = await supabase
    .from("profiles")
    .select("training_level")
    .eq("id", user.id)
    .single();

  const trainingLevel = (profile?.training_level as "grom" | "amateur" | "pro") || "grom";

  // Fetch workouts for user's tier
  const { data: workouts } = await supabase
    .from("workouts")
    .select("id, day_number, title, day_type")
    .eq("level", trainingLevel)
    .order("day_number");

  // Fetch user's completed workouts
  const { data: progress } = await supabase
    .from("progress")
    .select("workout_id")
    .eq("user_id", user.id);

  const completedWorkoutIds = new Set(progress?.map((p) => p.workout_id) || []);

  // Current day number
  const todayDayNumber = Math.min(new Date().getDate(), 30);

  // Group by weeks (7 days each)
  const weeks: { label: string; days: typeof workouts }[] = [];
  for (let w = 0; w < 5; w++) {
    const start = w * 7 + 1;
    const end = Math.min(start + 6, 30);
    const weekDays = (workouts || []).filter(
      (d) => d.day_number >= start && d.day_number <= end
    );
    if (weekDays.length > 0) {
      weeks.push({ label: WEEK_LABELS[w], days: weekDays });
    }
  }

  return (
    <div className="space-y-6 pb-8">
      <div>
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-sm text-muted hover:text-white transition mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <h1 className="font-display text-2xl font-bold uppercase tracking-wider">
          30-Day Program
        </h1>
        <p className="text-sm text-muted mt-1">
          Your complete training schedule. Tap any day to view the workout.
        </p>
      </div>

      {weeks.map((week, weekIdx) => (
        <div key={weekIdx}>
          <div className="flex items-center gap-2 mb-3">
            <h2 className="font-display text-sm font-bold uppercase tracking-wider text-primary">
              Week {weekIdx + 1}
            </h2>
            <span className="text-xs text-muted">— {week.label}</span>
          </div>

          <div className="space-y-2">
            {week.days?.map((workout) => {
              const isCompleted = completedWorkoutIds.has(workout.id);
              const isCurrent = workout.day_number === todayDayNumber;
              const dayType = workout.day_type || "training";
              const typeStyle = DAY_TYPE_STYLES[dayType] || DAY_TYPE_STYLES.training;

              return (
                <Link
                  key={workout.id}
                  href={`/dashboard/day/${workout.day_number}`}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition hover:border-primary/30 ${
                    isCurrent
                      ? "bg-primary/5 border-primary/30"
                      : "bg-card border-white/10"
                  }`}
                >
                  {/* Day number */}
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 font-display font-bold text-sm ${
                    isCompleted
                      ? "bg-primary/20 text-primary"
                      : isCurrent
                      ? "bg-primary text-black"
                      : "bg-card-elevated text-muted"
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-5 h-5" />
                    ) : (
                      workout.day_number
                    )}
                  </div>

                  {/* Title */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${
                      isCompleted ? "text-white/60" : "text-white"
                    }`}>
                      {workout.title || `Day ${workout.day_number}`}
                    </p>
                    {isCurrent && (
                      <p className="text-[10px] text-primary font-bold tracking-wider uppercase">
                        Today
                      </p>
                    )}
                  </div>

                  {/* Day type badge */}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${typeStyle}`}>
                    {dayType}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
