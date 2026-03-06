import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { Flame, CheckCircle } from "lucide-react";
import { ProgressRing } from "@/app/components/progress-ring";
import { TrainerHero } from "@/app/components/trainer-hero";
import { WorkoutCalendar } from "@/app/components/workout-calendar";
import { VipSection } from "@/app/components/vip-section";
import { ProgramSelector, type AccessibleProgram } from "@/app/components/program-selector";
import { brand, TRAINER_LABELS, getProgramConfig } from "@/config/brand";

// All programs available in the platform
const ALL_PROGRAMS: AccessibleProgram[] = [
  { trainer: "trainerA", tier: "30", label: `${brand.trainers.trainerA.name} — 30-Day Challenge`, shortLabel: `${brand.trainers.trainerA.firstName} 30-Day` },
  { trainer: "trainerB", tier: "30", label: `${brand.trainers.trainerB.name} — 30-Day Challenge`, shortLabel: `${brand.trainers.trainerB.firstName} 30-Day` },
  { trainer: "couples",  tier: "ab", label: `${brand.programs["couples-ab"].name} (21 Days)`,     shortLabel: "Couples AB" },
];

function getProgramLabel(trainer: string, tier: string) {
  return ALL_PROGRAMS.find((p) => p.trainer === trainer && p.tier === tier) ?? null;
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ trainer?: string; tier?: string }>;
}) {
  const params = await searchParams;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const db = createAdminClient();

  const [profileRes, subRes, plansRes] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).single(),
    db.from("subscriptions").select("plan_type, status, current_period_end")
      .eq("user_id", user.id).eq("status", "active")
      .order("plan_type", { ascending: false }).maybeSingle(),
    db.from("user_plans").select("trainer, tier, started_at").eq("user_id", user.id),
  ]);

  const profile = profileRes.data;
  const activeSub = subRes.data;
  const userPlans = plansRes.data ?? [];
  const isVip = activeSub?.plan_type === "vip";
  const hasSub = !!activeSub;

  // Build list of programs this user can access
  let accessiblePrograms: AccessibleProgram[];

  if (hasSub) {
    // Monthly / VIP subscribers get all programs
    accessiblePrograms = ALL_PROGRAMS;
  } else if (userPlans.length > 0) {
    // One-time purchasers: only what they bought
    accessiblePrograms = userPlans
      .map((p) => getProgramLabel(p.trainer, p.tier))
      .filter(Boolean) as AccessibleProgram[];
  } else {
    redirect("/programs");
  }

  if (accessiblePrograms.length === 0) redirect("/programs");

  // Which program is selected? URL param → first available
  const validTrainer = accessiblePrograms.find(
    (p) => p.trainer === params.trainer && p.tier === params.tier
  );
  const selected = validTrainer ?? accessiblePrograms[0];
  const { trainer, tier } = selected;

  // Start date for the selected program
  const planRecord = userPlans.find((p) => p.trainer === trainer && p.tier === tier);
  const startedAt = planRecord?.started_at
    ? new Date(planRecord.started_at)
    : profile?.started_at
    ? new Date(profile.started_at)
    : new Date();

  const totalDays = tier === "ab" ? 21 : parseInt(tier);
  const daysSinceStart = Math.floor((Date.now() - startedAt.getTime()) / (1000 * 60 * 60 * 24));
  const currentDay = Math.min(Math.max(daysSinceStart + 1, 1), totalDays);

  // Workouts for selected program
  const { data: workoutsRaw } = await supabase
    .from("workouts")
    .select("id, day_number, title, description")
    .eq("trainer", trainer)
    .eq("tier", tier)
    .order("day_number");

  const workouts = workoutsRaw ?? [];

  // Progress for this user
  const { data: progressRaw } = await supabase
    .from("progress")
    .select("workout_id")
    .eq("user_id", user.id);

  const completedWorkoutIds = new Set((progressRaw ?? []).map((p) => p.workout_id));

  // First 3 exercises per workout
  const workoutIds = workouts.map((w) => w.id);
  const { data: exercisesRaw } = workoutIds.length
    ? await supabase
        .from("exercises")
        .select("workout_id, name, order_index")
        .in("workout_id", workoutIds)
        .order("order_index")
    : { data: [] };

  const exercisesByWorkout: Record<string, string[]> = {};
  for (const ex of exercisesRaw ?? []) {
    if (!exercisesByWorkout[ex.workout_id]) exercisesByWorkout[ex.workout_id] = [];
    if (exercisesByWorkout[ex.workout_id].length < 3) {
      exercisesByWorkout[ex.workout_id].push(ex.name);
    }
  }

  // Stats
  const daysCompleted = completedWorkoutIds.size;
  const percentComplete = Math.round((daysCompleted / totalDays) * 100);

  // Streak
  let streak = 0;
  const sortedDesc = [...workouts].sort((a, b) => b.day_number - a.day_number);
  for (const w of sortedDesc) {
    if (w.day_number <= currentDay && completedWorkoutIds.has(w.id)) streak++;
    else if (w.day_number < currentDay) break;
  }

  const programCfg = getProgramConfig(trainer, tier);
  const trainerLabel = TRAINER_LABELS[trainer] ?? "Your Trainer";
  const programLabel =
    trainer === "couples"
      ? (programCfg?.name ?? "Couples AB Challenge")
      : `${trainerLabel} — ${programCfg?.name ?? "Challenge"}`;

  return (
    <div className="space-y-4 pb-6">
      {/* Program selector tabs — shown if user has multiple programs */}
      {accessiblePrograms.length > 1 && (
        <ProgramSelector
          programs={accessiblePrograms}
          activeTrainer={trainer}
          activeTier={tier}
        />
      )}

      {/* Trainer Hero */}
      <TrainerHero
        trainer={trainer}
        dayNumber={currentDay}
        tier={tier}
        firstName={profile?.full_name}
      />

      {/* VIP Member section */}
      {isVip && (
        <VipSection
          trainerASessionDate={process.env.VIP_TRAINER_A_NEXT_SESSION ?? null}
          trainerBSessionDate={process.env.VIP_TRAINER_B_NEXT_SESSION ?? null}
          discordInviteUrl={process.env.NEXT_PUBLIC_DISCORD_INVITE_URL ?? null}
        />
      )}

      {/* Progress + Stats */}
      <div className="bg-card border border-card-border rounded-2xl p-5">
        <div className="flex items-center gap-6">
          <div className="flex-shrink-0">
            <ProgressRing
              percent={percentComplete}
              size={120}
              strokeWidth={9}
              label={`${daysCompleted}/${totalDays}`}
              sublabel="days done"
            />
          </div>
          <div className="flex-1 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gold/10 flex items-center justify-center flex-shrink-0">
                <Flame className="w-4 h-4 text-gold" />
              </div>
              <div>
                <p className="text-xl font-bold leading-none">{streak}</p>
                <p className="text-xs text-muted mt-0.5">Day streak</p>
              </div>
            </div>
            <div className="h-px bg-card-border" />
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <p className="text-xl font-bold leading-none">{totalDays - daysCompleted}</p>
                <p className="text-xs text-muted mt-0.5">Days remaining</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Workout calendar */}
      <WorkoutCalendar
        workouts={workouts}
        completedWorkoutIds={[...completedWorkoutIds]}
        exercisesByWorkout={exercisesByWorkout}
        currentDay={currentDay}
        totalDays={totalDays}
      />

      {/* Program info */}
      <div className="bg-card border border-card-border rounded-2xl p-5">
        <h3 className="font-bold mb-3 text-sm uppercase tracking-wider text-muted">Your Program</h3>
        <div className="space-y-2.5">
          {(
            [
              { label: "Program", value: programLabel },
              { label: "Started", value: startedAt.toLocaleDateString() },
              { label: "Progress", value: `${daysCompleted} of ${totalDays} days` },
              hasSub ? { label: "Plan", value: isVip ? `${brand.shortName} ${brand.subscriptions.vip.displayName} 👑` : brand.subscriptions.monthly.displayName } : null,
            ] as ({ label: string; value: string } | null)[]
          )
            .filter((x): x is { label: string; value: string } => x !== null)
            .map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center text-sm">
                <span className="text-muted">{label}</span>
                <span className="font-semibold">{value}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
