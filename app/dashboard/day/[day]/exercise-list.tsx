"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { ExerciseModal } from "./exercise-modal";

interface Exercise {
  id: string;
  name: string;
  sets: number | null;
  reps: string | null;
  duration: string | null;
  video_url: string | null;
  thumbnail_url: string | null;
  notes: string | null;
  order_index: number;
}

interface ExerciseListProps {
  exercises: Exercise[];
  trainer: string;
}

export function ExerciseList({ exercises, trainer }: ExerciseListProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <div className="space-y-4">
        {exercises.map((exercise, index) => (
          <button
            key={exercise.id}
            onClick={() => setOpenIndex(index)}
            className="w-full text-left bg-card border border-card-border rounded-2xl overflow-hidden hover:border-gold/40 transition group"
          >
            {/* Thumbnail / video preview area */}
            <div className="relative bg-gradient-to-br from-card-border/50 to-card h-32 flex flex-col items-center justify-center gap-2 overflow-hidden">
              {exercise.thumbnail_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={exercise.thumbnail_url}
                  alt={exercise.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
              ) : null}
              <div className="relative z-10 w-12 h-12 rounded-full bg-black/30 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:bg-gold/20 group-hover:border-gold/40 transition">
                <Play className="w-5 h-5 text-white ml-0.5" />
              </div>
              {!exercise.video_url && (
                <p className="relative z-10 text-xs text-white/50">
                  Video coming soon
                </p>
              )}
            </div>

            {/* Exercise info */}
            <div className="p-4">
              <p className="text-xs text-gold font-medium mb-1">
                Exercise {index + 1}
              </p>
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
            </div>
          </button>
        ))}
      </div>

      {/* Modal — rendered outside the list for correct stacking */}
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
