"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

interface Workout {
  id: string;
  day_number: number;
}

interface DayStripProps {
  days: number[];
  workouts: Workout[];
  completedWorkoutIds: string[];
  currentDay: number;
}

export function DayStrip({ days, workouts, completedWorkoutIds, currentDay }: DayStripProps) {
  const stripRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLAnchorElement>(null);
  const completedSet = new Set(completedWorkoutIds);

  // Scroll the active day pill into the center of the strip on mount
  useEffect(() => {
    if (activeRef.current && stripRef.current) {
      const strip = stripRef.current;
      const pill = activeRef.current;
      const pillCenter = pill.offsetLeft + pill.offsetWidth / 2;
      strip.scrollLeft = pillCenter - strip.offsetWidth / 2;
    }
  }, []);

  return (
    <div
      ref={stripRef}
      className="flex gap-2 overflow-x-auto hide-scrollbar py-1 -mx-4 px-4"
    >
      {days.map((day) => {
        const workout = workouts.find((w) => w.day_number === day);
        const isCompleted = workout && completedSet.has(workout.id);
        const isCurrent = day === currentDay;
        const isFuture = day > currentDay;

        return (
          <Link
            key={day}
            href={`/dashboard/day/${day}`}
            ref={isCurrent ? activeRef : undefined}
            className={`flex-shrink-0 w-14 h-16 rounded-2xl flex flex-col items-center justify-center text-sm font-medium transition active:scale-95 ${
              isCompleted
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : isCurrent
                ? "bg-gold text-black border border-gold"
                : isFuture
                ? "bg-card border border-card-border text-muted/40"
                : "bg-card border border-card-border text-muted"
            }`}
          >
            <span className="text-[10px] font-medium opacity-70">Day</span>
            <span className="text-lg font-bold">{day}</span>
            {isCompleted && <span className="text-[10px]">✓</span>}
          </Link>
        );
      })}
    </div>
  );
}
