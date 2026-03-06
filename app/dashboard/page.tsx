import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Flame, CheckCircle, Bike, Timer, Dumbbell } from "lucide-react";
import { ProgressRing } from "@/app/components/progress-ring";
import { LevelSelector } from "@/app/components/level-selector";
import { brand, LEVEL_LABELS } from "@/config/brand";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const trainingLevel = profile?.training_level ?? "rookie";
  const levelConfig = brand.levels[trainingLevel as keyof typeof brand.levels] ?? brand.levels.rookie;
  const firstName = profile?.full_name?.split(" ")[0] ?? null;

  const today = new Date();
  const dayOfWeek = today.getDay();
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const todaySchedule = brand.weekSchedule.find((d) => d.day === dayNames[dayOfWeek]) ?? brand.weekSchedule[0];

  const quote = brand.trainer.quotes[Math.floor(Math.random() * brand.trainer.quotes.length)];

  return (
    <div className="space-y-4 pb-6">

      {/* Greeting + Quote */}
      <div className="bg-card border border-white/10 rounded-2xl p-5">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <span className="text-lg">{levelConfig.emoji}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted font-medium">
              {firstName ? `Hey, ${firstName}` : "Hey"} &mdash; {LEVEL_LABELS[trainingLevel]} Level
            </p>
            <p className="text-sm text-muted mt-1 italic leading-relaxed line-clamp-2">
              &ldquo;{quote}&rdquo;
            </p>
          </div>
        </div>
      </div>

      {/* Level Selector */}
      <LevelSelector currentLevel={trainingLevel} userId={user.id} />

      {/* Today's Schedule */}
      <div className="bg-card border border-white/10 rounded-2xl overflow-hidden">
        <div className={`h-1 w-full ${
          todaySchedule.type === "training" ? "bg-primary" :
          todaySchedule.type === "race" ? "bg-zone-redline" :
          todaySchedule.type === "recovery" ? "bg-zone-recovery" : "bg-muted-dark"
        }`} />
        <div className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-primary font-bold tracking-widest uppercase">
                {todaySchedule.day} &mdash; {todaySchedule.label}
              </p>
              <p className="text-sm text-muted mt-1">{todaySchedule.description}</p>
            </div>
          </div>

          {todaySchedule.type === "training" && (
            <div className="grid grid-cols-3 gap-3 mt-4">
              <div className="bg-card-elevated border border-white/5 rounded-xl p-3 text-center">
                <Bike className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="font-display text-xl font-bold text-white">{levelConfig.cyclingMiles}mi</p>
                <p className="text-[10px] text-muted tracking-wider uppercase">Road Ride</p>
              </div>
              <div className="bg-card-elevated border border-white/5 rounded-xl p-3 text-center">
                <Timer className="w-5 h-5 text-zone-threshold mx-auto mb-1" />
                <p className="font-display text-xl font-bold text-white">{levelConfig.motoHours}hr</p>
                <p className="text-[10px] text-muted tracking-wider uppercase">Moto</p>
              </div>
              <div className="bg-card-elevated border border-white/5 rounded-xl p-3 text-center">
                <Dumbbell className="w-5 h-5 text-zone-tempo mx-auto mb-1" />
                <p className="font-display text-xl font-bold text-white">{levelConfig.gymHours}hr</p>
                <p className="text-[10px] text-muted tracking-wider uppercase">Gym</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* HR Zone Targets */}
      {todaySchedule.type === "training" && (
        <div className="bg-card border border-white/10 rounded-2xl p-5">
          <h3 className="font-bold text-sm uppercase tracking-wider text-muted mb-4">HR Zone Targets</h3>
          <div className="space-y-2.5">
            {[
              { activity: "Road Ride", zone: "Zone 2-3", color: "bg-zone-endurance" },
              { activity: "Moto Practice", zone: "Zone 3-5", color: "bg-zone-threshold" },
              { activity: "Gym Session", zone: "Zone 2-4", color: "bg-zone-tempo" },
            ].map(({ activity, zone, color }) => (
              <div key={activity} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${color}`} />
                  <span className="text-muted">{activity}</span>
                </div>
                <span className="text-white font-semibold text-xs tracking-wider uppercase">{zone}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Benchmark Sidebar */}
      <div className="bg-card border border-white/10 rounded-2xl p-5">
        <h3 className="font-bold text-sm uppercase tracking-wider text-muted mb-4">Your Week vs. Haiden&apos;s</h3>
        <div className="space-y-3">
          {[
            { label: "Cycling", yours: "---", haidens: `${brand.benchmarks.weeklyMiles} mi` },
            { label: "Moto", yours: "---", haidens: `${brand.benchmarks.dailyMotoHours * 3} hrs` },
            { label: "Gym", yours: "---", haidens: `${brand.benchmarks.dailyGymHours * 3} hrs` },
          ].map(({ label, yours, haidens }) => (
            <div key={label} className="flex items-center justify-between text-sm">
              <span className="text-muted">{label}</span>
              <div className="flex items-center gap-4">
                <span className="text-white/30 font-mono text-xs">{yours}</span>
                <span className="text-primary font-bold text-xs">{haidens}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-dark mt-4">Connect Garmin or Polar to track your stats</p>
      </div>

      {/* Weekly Overview */}
      <div className="bg-card border border-white/10 rounded-2xl p-5">
        <h3 className="font-bold text-sm uppercase tracking-wider text-muted mb-4">This Week</h3>
        <div className="grid grid-cols-7 gap-1.5">
          {brand.weekSchedule.map((day) => {
            const isToday = day.day === dayNames[dayOfWeek];
            return (
              <div
                key={day.day}
                className={`text-center py-2 rounded-lg text-xs ${
                  isToday
                    ? day.type === "training" ? "bg-primary/20 text-primary border border-primary/30" :
                      day.type === "race" ? "bg-zone-redline/20 text-zone-redline border border-zone-redline/30" :
                      "bg-white/10 text-white border border-white/20"
                    : "bg-card-elevated text-muted-dark"
                }`}
              >
                <p className="font-bold">{day.day.slice(0, 1)}</p>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
