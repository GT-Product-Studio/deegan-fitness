"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Flame, Dumbbell, ChevronRight, ChevronLeft } from "lucide-react";

interface Workout {
  id: string;
  day_number: number;
  title: string;
  description: string | null;
}

interface WorkoutCalendarProps {
  workouts: Workout[];
  completedWorkoutIds: string[];
  exercisesByWorkout: Record<string, string[]>;
  currentDay: number;
  totalDays: number;
}

export function WorkoutCalendar({
  workouts,
  completedWorkoutIds,
  exercisesByWorkout,
  currentDay,
  totalDays,
}: WorkoutCalendarProps) {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState(currentDay);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const stripRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<Record<number, HTMLButtonElement | null>>({});
  const completedSet = new Set(completedWorkoutIds);

  function updateArrows() {
    const strip = stripRef.current;
    if (!strip) return;
    setCanScrollLeft(strip.scrollLeft > 4);
    setCanScrollRight(strip.scrollLeft < strip.scrollWidth - strip.clientWidth - 4);
  }

  // Scroll the selected pill into view (centred)
  function scrollToPill(day: number) {
    const strip = stripRef.current;
    const pill = pillRefs.current[day];
    if (strip && pill) {
      const pillCenter = pill.offsetLeft + pill.offsetWidth / 2;
      strip.scrollTo({ left: pillCenter - strip.offsetWidth / 2, behavior: "smooth" });
    }
    setTimeout(updateArrows, 350);
  }

  // Shift-scroll / trackpad horizontal on desktop
  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // already horizontal
      if (e.deltaY !== 0) {
        e.preventDefault();
        strip.scrollBy({ left: e.deltaY * 2, behavior: "smooth" });
        setTimeout(updateArrows, 350);
      }
    };
    strip.addEventListener("wheel", onWheel, { passive: false });
    strip.addEventListener("scroll", updateArrows, { passive: true });
    return () => {
      strip.removeEventListener("wheel", onWheel);
      strip.removeEventListener("scroll", updateArrows);
    };
  }, []);

  // On mount, centre today
  useEffect(() => {
    scrollToPill(currentDay);
    setTimeout(updateArrows, 400);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleDaySelect(day: number) {
    setSelectedDay(day);
    scrollToPill(day);
  }

  const selectedWorkout = workouts.find((w) => w.day_number === selectedDay);
  const isCompleted = selectedWorkout ? completedSet.has(selectedWorkout.id) : false;
  const isToday = selectedDay === currentDay;
  const isFutureDay = selectedDay > currentDay;
  const exercises = selectedWorkout ? (exercisesByWorkout[selectedWorkout.id] ?? []) : [];

  // Label for the pill badge
  function pillLabel(day: number) {
    const w = workouts.find((w) => w.day_number === day);
    if (!w) return null;
    if (completedSet.has(w.id)) return "done";
    if (day === currentDay) return "today";
    if (day > currentDay) return "future";
    return "past";
  }

  function scrollByPage(dir: 1 | -1) {
    const strip = stripRef.current;
    if (!strip) return;
    strip.scrollBy({ left: dir * (strip.clientWidth * 0.7), behavior: "smooth" });
    setTimeout(updateArrows, 350);
  }

  return (
    <div className="space-y-3">
      {/* ── Day strip ── */}
      <div className="relative -mx-4">
        {/* Left arrow */}
        <button
          onClick={() => scrollByPage(-1)}
          aria-label="Scroll left"
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-full flex items-center justify-center
            bg-gradient-to-r from-background via-background/80 to-transparent
            transition-opacity duration-200 ${canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <ChevronLeft className="w-5 h-5 text-muted" />
        </button>

        {/* Right arrow */}
        <button
          onClick={() => scrollByPage(1)}
          aria-label="Scroll right"
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-full flex items-center justify-center
            bg-gradient-to-l from-background via-background/80 to-transparent
            transition-opacity duration-200 ${canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        >
          <ChevronRight className="w-5 h-5 text-muted" />
        </button>

      <div
        ref={stripRef}
        className="flex gap-2 overflow-x-auto hide-scrollbar py-1 px-4"
      >
        {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => {
          const status = pillLabel(day);
          const isSelected = day === selectedDay;

          return (
            <button
              key={day}
              ref={(el) => { pillRefs.current[day] = el; }}
              onClick={() => handleDaySelect(day)}
              className={[
                "flex-shrink-0 w-14 h-16 rounded-2xl flex flex-col items-center justify-center text-sm font-medium transition active:scale-95",
                isSelected
                  ? "ring-2 ring-offset-1 ring-offset-background"
                  : "",
                status === "done"
                  ? `bg-green-500/20 text-green-400 border border-green-500/30 ${isSelected ? "ring-green-400" : ""}`
                  : status === "today"
                  ? `bg-gold text-black border border-gold ${isSelected ? "ring-gold" : ""}`
                  : status === "future"
                  ? `bg-card border border-card-border text-muted/40 ${isSelected ? "ring-card-border" : ""}`
                  : `bg-card border border-card-border text-muted ${isSelected ? "ring-card-border" : ""}`,
              ].join(" ")}
            >
              <span className="text-[10px] font-medium opacity-70">Day</span>
              <span className="text-lg font-bold">{day}</span>
              {status === "done" && <span className="text-[10px]">✓</span>}
              {status === "today" && !isCompleted && <span className="text-[9px] font-bold uppercase tracking-wide">Today</span>}
            </button>
          );
        })}
      </div>
      </div>{/* end relative -mx-4 */}

      {/* ── Workout preview card ── */}
      {selectedWorkout ? (
        <div className="bg-card border border-card-border rounded-2xl overflow-hidden">
          {/* Accent bar */}
          <div className={`h-1 w-full ${isCompleted ? "bg-green-400" : "bg-gold"}`} />

          <div className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                {/* Label row */}
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <p className={`text-xs font-bold uppercase tracking-wider ${isCompleted ? "text-green-400" : "text-gold"}`}>
                    {isToday ? "Today · " : ""}Day {selectedDay}
                  </p>
                  {isCompleted && (
                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-medium">
                      Done ✓
                    </span>
                  )}
                  {/* future days have no badge */}
                </div>
                <h2 className="text-xl font-bold">{selectedWorkout.title}</h2>
                {selectedWorkout.description && (
                  <p className="text-sm text-muted mt-1 line-clamp-2">
                    {selectedWorkout.description}
                  </p>
                )}
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ml-3 flex-shrink-0 ${isCompleted ? "bg-green-500/10" : "bg-gold/10"}`}>
                <Dumbbell className={`w-5 h-5 ${isCompleted ? "text-green-400" : "text-gold"}`} />

              </div>
            </div>

            {/* Exercise preview */}
            {exercises.length > 0 && (
              <div className="mt-3 space-y-1.5">
                {exercises.map((name, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-muted">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isCompleted ? "bg-green-400/50" : "bg-gold/50"}`} />
                    <span className="truncate">{name}</span>
                  </div>
                ))}
                <p className="text-xs text-muted/60 pl-3.5">+ more exercises</p>
              </div>
            )}

            {/* CTA button */}
            <button
              onClick={() => router.push(`/dashboard/day/${selectedDay}`)}
              className={`mt-4 w-full py-3.5 rounded-xl font-bold text-center flex items-center justify-center gap-2 transition active:scale-[0.98] ${
                isCompleted
                  ? "bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/15"
                  : "bg-gold text-black hover:bg-yellow-400"
              }`}
            >
              <Flame className="w-4 h-4" />
              {isCompleted
                ? `Review Day ${selectedDay}`
                : `Start Day ${selectedDay}`}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-card border border-card-border rounded-2xl p-5 text-center">
          <p className="text-muted text-sm">No workout found for Day {selectedDay}.</p>
        </div>
      )}
    </div>
  );
}
