"use client";

import { useState, useCallback } from "react";
import { ExerciseModal } from "./exercise-modal";
import { brand } from "@/config/brand";
import { BlockStats, type ActivityLog } from "./block-stats";
import { WorkoutTimer, ExerciseTracker } from "./workout-timer";

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

interface WorkoutSession {
  id: string;
  started_at: string;
  ended_at: string | null;
  status: string;
  exercise_timestamps: {
    id: string;
    exercise_id: string;
    started_at: string;
    ended_at: string | null;
  }[];
}

interface ExerciseListProps {
  exercises: Exercise[];
  trainer: string;
  activityLogs?: ActivityLog[];
  workoutId: string;
  dayNumber: number;
}

const BLOCK_CONFIG: Record<string, { emoji: string; label: string; accent: string; border: string }> = {
  cycling: { emoji: "🚴", label: "Road Ride", accent: "text-primary", border: "border-primary/30" },
  moto: { emoji: "🏍️", label: "Moto Practice", accent: "text-zone-threshold", border: "border-zone-threshold/30" },
  gym: { emoji: "🏋️", label: "Gym Session", accent: "text-zone-tempo", border: "border-zone-tempo/30" },
  recovery: { emoji: "🧘", label: "Recovery", accent: "text-muted", border: "border-white/10" },
  race: { emoji: "🏁", label: "Race Day", accent: "text-zone-redline", border: "border-zone-redline/30" },
};

function getHRZone(zoneNum: number) {
  return brand.hrZones.find((z) => z.zone === zoneNum);
}

export function ExerciseList({ exercises, trainer, activityLogs = [], workoutId, dayNumber }: ExerciseListProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [session, setSession] = useState<WorkoutSession | null>(null);

  const handleSessionChange = useCallback((s: WorkoutSession | null) => {
    setSession(s);
  }, []);

  const handleTimestampUpdate = useCallback(
    (timestamp: { id: string; exercise_id: string; started_at: string; ended_at: string | null }) => {
      setSession((prev) => {
        if (!prev) return prev;
        const existing = prev.exercise_timestamps.findIndex(
          (t) => t.exercise_id === timestamp.exercise_id
        );
        const newTimestamps = [...prev.exercise_timestamps];
        if (existing >= 0) {
          newTimestamps[existing] = timestamp;
        } else {
          newTimestamps.push(timestamp);
        }
        return { ...prev, exercise_timestamps: newTimestamps };
      });
    },
    []
  );

  // Group exercises by block
  const groups: { block: string; exercises: { exercise: Exercise; globalIndex: number }[] }[] = [];
  const blockOrder: string[] = [];

  exercises.forEach((exercise, index) => {
    const block = exercise.block || "gym";
    if (!blockOrder.includes(block)) {
      blockOrder.push(block);
      groups.push({ block, exercises: [] });
    }
    const group = groups.find((g) => g.block === block)!;
    group.exercises.push({ exercise, globalIndex: index });
  });

  return (
    <>
      {/* Workout Timer */}
      <WorkoutTimer
        workoutId={workoutId}
        dayNumber={dayNumber}
        exercises={exercises}
        onSessionChange={handleSessionChange}
      />

      <div className="space-y-6">
        {groups.map(({ block, exercises: blockExercises }) => {
          const config = BLOCK_CONFIG[block] || BLOCK_CONFIG.gym;
          return (
            <div key={block}>
              {/* Block header */}
              <div className={`flex items-center gap-2 mb-3 pb-2 border-b ${config.border}`}>
                <span className="text-lg">{config.emoji}</span>
                <h3 className={`font-display text-sm font-bold uppercase tracking-wider ${config.accent}`}>
                  {config.label}
                </h3>
                <span className="text-xs text-muted ml-auto">{blockExercises.length} exercise{blockExercises.length !== 1 ? "s" : ""}</span>
              </div>

              {/* Synced wearable stats for this block */}
              {activityLogs.length > 0 && (
                <BlockStats block={block} activities={activityLogs} />
              )}

              <div className="space-y-4">
                {blockExercises.map(({ exercise, globalIndex }) => {
                  const hrZone = exercise.hr_zone ? getHRZone(exercise.hr_zone) : null;
                  return (
                    <div
                      key={exercise.id}
                      className="bg-card border border-card-border rounded-2xl overflow-hidden hover:border-primary/40 transition group p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <button
                          onClick={() => setOpenIndex(globalIndex)}
                          className="flex-1 text-left"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <p className={`text-xs font-medium ${config.accent}`}>
                              {config.emoji} {config.label}
                            </p>
                            {hrZone && (
                              <span
                                className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                                style={{ backgroundColor: `${hrZone.color}20`, color: hrZone.color }}
                              >
                                Zone {hrZone.zone}
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-lg leading-tight">{exercise.name}</h3>

                          <div className="flex flex-wrap gap-2 mt-3">
                            {exercise.sets && (
                              <span className="bg-background rounded-lg px-3 py-1 text-sm">
                                <span className="text-muted">Sets </span>
                                <span className="font-bold">{exercise.sets}</span>
                              </span>
                            )}
                            {exercise.reps && (
                              <span className="bg-background rounded-lg px-3 py-1 text-sm">
                                <span className="text-muted">Reps </span>
                                <span className="font-bold">{exercise.reps}</span>
                              </span>
                            )}
                            {exercise.duration && (
                              <span className="bg-background rounded-lg px-3 py-1 text-sm">
                                <span className="text-muted">Time </span>
                                <span className="font-bold">{exercise.duration}</span>
                              </span>
                            )}
                          </div>

                          {exercise.notes && (
                            <p className="text-xs text-muted mt-2 line-clamp-1">{exercise.notes}</p>
                          )}
                        </button>

                        {/* Exercise tracker button */}
                        <ExerciseTracker
                          exerciseId={exercise.id}
                          session={session}
                          onUpdate={handleTimestampUpdate}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal */}
      {openIndex !== null && (
        <ExerciseModal
          exercises={exercises}
          currentIndex={openIndex}
          trainer={trainer}
          onClose={() => setOpenIndex(null)}
          onPrev={() => setOpenIndex((i) => Math.max(0, (i ?? 0) - 1))}
          onNext={() =>
            setOpenIndex((i) => Math.min(exercises.length - 1, (i ?? 0) + 1))
          }
        />
      )}
    </>
  );
}
