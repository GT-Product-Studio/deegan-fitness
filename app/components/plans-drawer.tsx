"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, CheckCircle2, ChevronRight, Dumbbell, Menu, Zap } from "lucide-react";
import { createBrowserClient } from "@supabase/ssr";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { TRAINER_LABELS } from "@/config/brand";

type PlanWithProgress = {
  key: string;
  trainer: string;
  tier: string;
  started_at: string;
  totalDays: number;
  completedDays: number;
  isComplete: boolean;
  trainerName: string;
  currentDay: number;
};

export function PlansDrawer() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [show, setShow] = useState(false); // controls animation
  const [domReady, setDomReady] = useState(false);
  const [plans, setPlans] = useState<PlanWithProgress[]>([]);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [switching, setSwitching] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Mark DOM as ready for portals
  useEffect(() => { setDomReady(true); }, []);

  // Animate open/close
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => setShow(true));
      fetchPlans();
    } else {
      setShow(false);
    }
  }, [isOpen]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  async function fetchPlans() {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }

      const { data: profile } = await supabase
        .from("profiles")
        .select("trainer, tier, started_at, created_at")
        .eq("id", user.id)
        .single();

      const { data: userPlans } = await supabase
        .from("user_plans")
        .select("*")
        .eq("user_id", user.id)
        .order("purchased_at", { ascending: false });

      type RawPlan = { trainer: string; tier: string; started_at: string };
      const rawPlans: RawPlan[] = [...(userPlans || [])];

      if (profile?.trainer && profile?.tier) {
        setActiveKey(`${profile.trainer}-${profile.tier}`);
        const alreadyIn = rawPlans.some(
          (p) => p.trainer === profile.trainer && p.tier === profile.tier
        );
        if (!alreadyIn) {
          rawPlans.unshift({
            trainer: profile.trainer,
            tier: profile.tier,
            started_at: profile.started_at || profile.created_at || new Date().toISOString(),
          });
        }
      }

      if (!rawPlans.length) { setPlans([]); setLoading(false); return; }

      const { data: allWorkouts } = await supabase.from("workouts").select("id, trainer, tier");
      const { data: progress } = await supabase
        .from("progress").select("workout_id").eq("user_id", user.id);

      const completedIds = new Set((progress || []).map((p: { workout_id: string }) => p.workout_id));

      const enriched: PlanWithProgress[] = rawPlans.map((plan) => {
        const planWorkouts = (allWorkouts || []).filter(
          (w: { trainer: string; tier: string }) => w.trainer === plan.trainer && w.tier === plan.tier
        );
        const totalDays = plan.tier === "ab" ? 21 : parseInt(plan.tier) || 30;
        const completedDays = planWorkouts.filter((w: { id: string }) => completedIds.has(w.id)).length;
        const isComplete = totalDays > 0 && completedDays >= totalDays;
        const daysSince = Math.floor(
          (Date.now() - new Date(plan.started_at).getTime()) / (1000 * 60 * 60 * 24)
        );
        const currentDay = Math.min(Math.max(daysSince + 1, 1), totalDays);
        const trainerName = TRAINER_LABELS[plan.trainer] ?? plan.trainer;

        return {
          key: `${plan.trainer}-${plan.tier}`,
          trainer: plan.trainer,
          tier: plan.tier,
          started_at: plan.started_at,
          totalDays,
          completedDays,
          isComplete,
          trainerName,
          currentDay,
        };
      });

      setPlans(enriched);
    } catch (err) {
      console.error("PlansDrawer fetchPlans error:", err);
      setError("Couldn't load plans.");
    } finally {
      setLoading(false);
    }
  }

  async function switchPlan(plan: PlanWithProgress) {
    setSwitching(plan.key);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setSwitching(null); return; }
    await supabase.from("profiles").update({
      trainer: plan.trainer,
      tier: plan.tier,
      started_at: plan.started_at,
    }).eq("id", user.id);
    setActiveKey(plan.key);
    setSwitching(null);
    setIsOpen(false);
    router.push("/dashboard");
    router.refresh();
  }

  function close() { setIsOpen(false); }

  const tierLabel = (tier: string) =>
    tier === "ab" ? "21-Day AB Challenge" : `${tier}-Day Challenge`;

  return (
    <>
      {/* Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-9 h-9 flex items-center justify-center rounded-xl text-muted hover:text-foreground hover:bg-card-border/30 transition"
        aria-label="Your plans"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Full-screen modal — portalled to body so backdrop-filter on header can't trap it */}
      {isOpen && domReady && createPortal(
        <div className="fixed inset-0 z-[200] flex flex-col">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300"
            style={{ opacity: show ? 1 : 0 }}
            onClick={close}
          />

          {/* Sheet — slides up from bottom */}
          <div
            className="absolute bottom-0 left-0 right-0 flex flex-col rounded-t-3xl overflow-hidden transition-transform duration-400 ease-out"
            style={{
              background: "#0a0a0a",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              maxHeight: "90dvh",
              transform: show ? "translateY(0)" : "translateY(100%)",
            }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
              <div className="w-10 h-1 rounded-full" style={{ background: "rgba(255,255,255,0.2)" }} />
            </div>

            {/* Header */}
            <div
              className="flex items-center justify-between px-5 py-4 flex-shrink-0"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
            >
              <h2 className="font-bold text-sm uppercase tracking-[0.2em] text-white">
                Your Plans
              </h2>
              <button
                onClick={close}
                className="w-8 h-8 flex items-center justify-center rounded-full transition"
                style={{ background: "rgba(255,255,255,0.1)" }}
              >
                <X className="w-4 h-4 text-white/70" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">

              {loading && (
                <div className="space-y-3 pt-2">
                  {[1, 2].map((i) => (
                    <div key={i} className="h-28 rounded-2xl animate-pulse"
                      style={{ background: "rgba(255,255,255,0.05)" }} />
                  ))}
                </div>
              )}

              {!loading && error && (
                <p className="text-sm text-center text-red-400 py-8">{error}</p>
              )}

              {!loading && !error && plans.length === 0 && (
                <div className="text-center py-12">
                  <Dumbbell className="w-8 h-8 mx-auto mb-3 text-white/20" />
                  <p className="text-sm text-white/40">No plans yet.</p>
                  <p className="text-xs text-white/25 mt-1">Purchase a plan to get started.</p>
                </div>
              )}

              {!loading && !error && plans.map((plan) => {
                const pct = plan.totalDays > 0
                  ? Math.round((plan.completedDays / plan.totalDays) * 100) : 0;
                const isActive = plan.key === activeKey;
                const isSwitching = switching === plan.key;

                return (
                  <div
                    key={plan.key}
                    className="rounded-2xl p-4"
                    style={{
                      background: isActive
                        ? "rgba(201,168,76,0.08)"
                        : plan.isComplete
                        ? "rgba(34,197,94,0.06)"
                        : "rgba(255,255,255,0.05)",
                      border: isActive
                        ? "1px solid rgba(201,168,76,0.35)"
                        : plan.isComplete
                        ? "1px solid rgba(34,197,94,0.2)"
                        : "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {/* Row: name + badge */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-bold text-sm text-white">{plan.trainerName}</p>
                        <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                          {tierLabel(plan.tier)}
                        </p>
                      </div>
                      {isActive ? (
                        <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
                          style={{ background: "rgba(201,168,76,0.15)", color: "#c9a84c" }}>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#c9a84c] animate-pulse" />
                          Active
                        </span>
                      ) : plan.isComplete ? (
                        <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0" />
                      ) : (
                        <span className="text-xs font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>
                          Owned
                        </span>
                      )}
                    </div>

                    {/* Progress bar */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs mb-1.5" style={{ color: "rgba(255,255,255,0.35)" }}>
                        <span>{plan.completedDays} of {plan.totalDays} days</span>
                        <span>{pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${pct}%`,
                            background: isActive ? "#c9a84c" : plan.isComplete ? "#4ade80" : "#6b7280",
                          }}
                        />
                      </div>
                    </div>

                    {/* CTA */}
                    {isActive ? (
                      <Link
                        href={plan.isComplete ? "/dashboard/day/1" : `/dashboard/day/${plan.currentDay}`}
                        onClick={close}
                        className="flex items-center justify-center gap-1.5 w-full py-3 rounded-xl text-xs font-bold text-black"
                        style={{ background: "#c9a84c" }}
                      >
                        {plan.isComplete ? "Review Program" : `Continue · Day ${plan.currentDay}`}
                        <ChevronRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <button
                        onClick={() => switchPlan(plan)}
                        disabled={!!switching}
                        className="flex items-center justify-center gap-1.5 w-full py-3 rounded-xl text-xs font-semibold transition disabled:opacity-50"
                        style={{
                          color: plan.isComplete ? "#4ade80" : "rgba(255,255,255,0.7)",
                          background: plan.isComplete ? "rgba(34,197,94,0.1)" : "rgba(255,255,255,0.07)",
                          border: plan.isComplete
                            ? "1px solid rgba(34,197,94,0.2)"
                            : "1px solid rgba(255,255,255,0.12)",
                        }}
                      >
                        {isSwitching ? "Switching…" : (
                          <><Zap className="w-3 h-3" /> Switch to this plan</>
                        )}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Footer */}
            <div className="p-4 flex-shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <Link
                href="/#plans"
                onClick={close}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition"
                style={{
                  background: "rgba(201,168,76,0.1)",
                  border: "1px solid rgba(201,168,76,0.25)",
                  color: "#c9a84c",
                }}
              >
                <Dumbbell className="w-3.5 h-3.5" />
                Get Another Plan
              </Link>
            </div>
          </div>
        </div>
      , document.body)}
    </>
  );
}
