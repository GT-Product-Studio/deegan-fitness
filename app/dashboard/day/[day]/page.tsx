import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { MarkCompleteButton } from "./mark-complete-button";
import { ExerciseList } from "./exercise-list";

export default async function DayPage({
  params,
}: {
  params: Promise<{ day: string }>;
}) {
  const { day: dayParam } = await params;
  const dayNumber = parseInt(dayParam);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const trainingLevel = (profile?.training_level as "grom" | "amateur" | "pro") || "grom";

  // Fetch workout for this day + training level
  const { data: workout } = await supabase
    .from("workouts")
    .select("*")
    .eq("day_number", dayNumber)
    .eq("level", trainingLevel)
    .single();

  if (!workout) {
    return (
      <div className="text-center py-12">
        <p className="text-muted mb-4">No workout found for Day {dayNumber}.</p>
        <Link href="/dashboard" className="text-primary hover:underline">
          Back to Dashboard
        </Link>
      </div>
    );
  }

  // Fetch exercises
  const { data: exercises } = await supabase
    .from("exercises")
    .select("*")
    .eq("workout_id", workout.id)
    .order("order_index");

  // Check if already completed
  const { data: progressEntry } = await supabase
    .from("progress")
    .select("id")
    .eq("user_id", user.id)
    .eq("workout_id", workout.id)
    .single();

  const isCompleted = !!progressEntry;

  // Fetch synced activity logs for this day's date
  // Map day_number to a date relative to the user's program start
  const startedAt = profile?.started_at ? new Date(profile.started_at) : new Date();
  const dayDate = new Date(startedAt);
  dayDate.setDate(dayDate.getDate() + dayNumber - 1);
  const dateStr = dayDate.toISOString().split("T")[0];

  const { data: activityLogs } = await supabase
    .from("activity_logs")
    .select("id, activity_type, value, date, source, hr_avg, hr_max, hr_zone_minutes, notes")
    .eq("user_id", user.id)
    .eq("date", dateStr);

  const hasPrev = dayNumber > 1;
  const hasNext = dayNumber < 30;

  return (
    <div className="space-y-6 pb-24">
      <div>
        <div className="flex items-center justify-between mb-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-sm text-muted hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
          <div className="flex items-center gap-2">
            {hasPrev ? (
              <Link
                href={`/dashboard/day/${dayNumber - 1}`}
                className="flex items-center gap-1 text-sm text-muted hover:text-primary border border-white/10 hover:border-primary/30 rounded-lg px-3 py-1.5 transition"
              >
                <ChevronLeft className="w-4 h-4" />
                Day {dayNumber - 1}
              </Link>
            ) : (
              <span className="flex items-center gap-1 text-sm text-muted/30 border border-white/5 rounded-lg px-3 py-1.5 cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" />
                Prev
              </span>
            )}
            {hasNext ? (
              <Link
                href={`/dashboard/day/${dayNumber + 1}`}
                className="flex items-center gap-1 text-sm text-muted hover:text-primary border border-white/10 hover:border-primary/30 rounded-lg px-3 py-1.5 transition"
              >
                Day {dayNumber + 1}
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <span className="flex items-center gap-1 text-sm text-muted/30 border border-white/5 rounded-lg px-3 py-1.5 cursor-not-allowed">
                Next
                <ChevronRight className="w-4 h-4" />
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-primary uppercase tracking-wider">
            Day {dayNumber}
          </span>
          {isCompleted && (
            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
              Completed
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold text-white">{workout.title}</h1>
        {workout.description && (
          <p className="text-sm text-muted mt-1">{workout.description}</p>
        )}
      </div>

      <ExerciseList
        exercises={exercises || []}
        trainer="deegan"
        activityLogs={activityLogs || []}
        workoutId={workout.id}
        dayNumber={dayNumber}
      />

      {/* Bottom day navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        {hasPrev ? (
          <Link
            href={`/dashboard/day/${dayNumber - 1}`}
            className="flex items-center gap-1.5 text-sm text-muted hover:text-primary transition"
          >
            <ChevronLeft className="w-4 h-4" />
            Day {dayNumber - 1}
          </Link>
        ) : (
          <span />
        )}
        {hasNext ? (
          <Link
            href={`/dashboard/day/${dayNumber + 1}`}
            className="flex items-center gap-1.5 text-sm text-muted hover:text-primary transition"
          >
            Day {dayNumber + 1}
            <ChevronRight className="w-4 h-4" />
          </Link>
        ) : (
          <span />
        )}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-white/10 p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] md:hidden">
        <div className="max-w-lg mx-auto">
          <MarkCompleteButton
            workoutId={workout.id}
            isCompleted={isCompleted}
            dayNumber={dayNumber}
          />
        </div>
      </div>

      <div className="hidden md:block">
        <MarkCompleteButton
          workoutId={workout.id}
          isCompleted={isCompleted}
          dayNumber={dayNumber}
        />
      </div>
    </div>
  );
}
