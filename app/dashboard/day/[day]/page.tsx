import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
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

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const trainer = profile?.trainer || "trainerA";
  const tier = profile?.tier || "30";

  // Fetch workout for this day
  const { data: workout } = await supabase
    .from("workouts")
    .select("*")
    .eq("trainer", trainer)
    .eq("tier", tier)
    .eq("day_number", dayNumber)
    .single();

  if (!workout) {
    return (
      <div className="text-center py-12">
        <p className="text-muted mb-4">No workout found for Day {dayNumber}.</p>
        <Link href="/dashboard" className="text-gold hover:underline">
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

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div>
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-bold text-gold uppercase tracking-wider">
            Day {dayNumber}
          </span>
          {isCompleted && (
            <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full">
              Completed
            </span>
          )}
        </div>
        <h1 className="text-2xl font-bold">{workout.title}</h1>
        {workout.description && (
          <p className="text-sm text-muted mt-1">{workout.description}</p>
        )}
      </div>

      {/* Exercise list — tap any card to open video + details */}
      <ExerciseList
        exercises={exercises || []}
        trainer={trainer}
      />

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-md border-t border-card-border p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] md:hidden">
        <div className="max-w-lg mx-auto">
          <MarkCompleteButton
            workoutId={workout.id}
            isCompleted={isCompleted}
            dayNumber={dayNumber}
          />
        </div>
      </div>

      {/* Desktop button */}
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
