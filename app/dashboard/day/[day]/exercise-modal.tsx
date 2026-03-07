"use client";

import { useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { brand } from "@/config/brand";

interface Exercise {
  id: string;
  name: string;
  sets: number | null;
  reps: string | null;
  duration: string | null;
  notes: string | null;
  order_index: number;
  block: string | null;
  hr_zone: number | null;
}

interface ExerciseModalProps {
  exercises: Exercise[];
  currentIndex: number;
  trainer: string;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

const BLOCK_CONFIG: Record<string, { emoji: string; label: string; color: string }> = {
  cycling: { emoji: "🚴", label: "Road Ride", color: "#29F000" },
  moto: { emoji: "🏍️", label: "Moto Practice", color: "#FF6B00" },
  gym: { emoji: "🏋️", label: "Gym Session", color: "#FFD700" },
  recovery: { emoji: "🧘", label: "Recovery", color: "#808080" },
  race: { emoji: "🏁", label: "Race Day", color: "#FF0000" },
};

export function ExerciseModal({
  exercises,
  currentIndex,
  onClose,
  onPrev,
  onNext,
}: ExerciseModalProps) {
  const exercise = exercises[currentIndex];
  const total = exercises.length;

  const blockConfig = BLOCK_CONFIG[exercise.block || "gym"] || BLOCK_CONFIG.gym;
  const hrZone = exercise.hr_zone ? brand.hrZones.find((z) => z.zone === exercise.hr_zone) : null;

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && currentIndex < total - 1) onNext();
      if (e.key === "ArrowLeft" && currentIndex > 0) onPrev();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentIndex, total, onClose, onNext, onPrev]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const hasMetrics = exercise.sets || exercise.reps || exercise.duration;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black" style={{ height: "100dvh" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 pb-2 flex-shrink-0" style={{ paddingTop: "max(1rem, env(safe-area-inset-top))" }}>
        <div className="text-sm font-medium text-white/50">
          <span className="text-white font-bold">{currentIndex + 1}</span>
          <span className="text-white/40"> / {total}</span>
        </div>
        <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition" aria-label="Close">
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Progress bar */}
      <div className="h-0.5 bg-white/10 mx-4 rounded-full flex-shrink-0 mb-3">
        <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${((currentIndex + 1) / total) * 100}%` }} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto min-h-0 px-5 pt-4 pb-2">
        {/* Block + HR Zone labels */}
        <div className="flex items-center gap-2 mb-1">
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: `${blockConfig.color}20`, color: blockConfig.color }}
          >
            {blockConfig.emoji} {blockConfig.label}
          </span>
          {hrZone && (
            <span
              className="text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: `${hrZone.color}20`, color: hrZone.color }}
            >
              Zone {hrZone.zone} · {hrZone.name}
            </span>
          )}
        </div>

        <p className="text-xs font-bold text-primary uppercase tracking-widest mb-1 mt-2">{brand.trainer.name}</p>
        <h2 className="text-2xl font-bold text-white leading-tight mb-4">{exercise.name}</h2>

        {/* HR Zone indicator bar */}
        {hrZone && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <div className="h-1.5 w-full bg-white/5 rounded-full">
              <div
                className="h-full rounded-full transition-all"
                style={{ width: `${hrZone.maxPct}%`, backgroundColor: hrZone.color }}
              />
            </div>
            <p className="text-[10px] mt-1" style={{ color: hrZone.color }}>
              {hrZone.minPct}–{hrZone.maxPct}% max HR · {hrZone.description}
            </p>
          </div>
        )}

        {/* Metrics */}
        {hasMetrics && (
          <div className="flex gap-3 mb-4">
            {exercise.sets && (
              <div className="flex-1 rounded-2xl px-3 py-3 text-center" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Sets</p>
                <p className="text-3xl font-bold text-white">{exercise.sets}</p>
              </div>
            )}
            {exercise.reps && (
              <div className="flex-1 rounded-2xl px-3 py-3 text-center" style={{ background: "rgba(41,240,0,0.12)", border: "1px solid rgba(41,240,0,0.25)" }}>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Reps</p>
                <p className="text-3xl font-bold text-white">{exercise.reps}</p>
              </div>
            )}
            {exercise.duration && (
              <div className="flex-1 rounded-2xl px-3 py-3 text-center" style={{ background: "rgba(41,240,0,0.12)", border: "1px solid rgba(41,240,0,0.25)" }}>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Time</p>
                <p className="text-3xl font-bold text-white">{exercise.duration}</p>
              </div>
            )}
          </div>
        )}

        {/* Coach's Notes */}
        {exercise.notes && (
          <div className="rounded-xl p-4" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <p className="text-xs text-white/40 uppercase tracking-wider mb-1.5 font-semibold">Coach&apos;s Note</p>
            <p className="text-white/70 text-sm leading-relaxed">{exercise.notes}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-3 px-5 pt-3 flex-shrink-0" style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}>
        <button onClick={onPrev} disabled={currentIndex === 0} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-white disabled:opacity-30 disabled:cursor-not-allowed transition" style={{ border: "1px solid rgba(255,255,255,0.15)" }}>
          <ChevronLeft className="w-5 h-5" /> Prev
        </button>
        {currentIndex < total - 1 ? (
          <button onClick={onNext} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-black bg-primary hover:bg-primary-dark transition">
            Next <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <button onClick={onClose} className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-black bg-primary hover:bg-primary-dark transition">
            Done
          </button>
        )}
      </div>
    </div>
  );
}
