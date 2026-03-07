"use client";

import { useState, useEffect, useCallback } from "react";
import { createBrowserClient } from "@supabase/ssr";

interface WorkoutSession {
  id: string;
  started_at: string;
  ended_at: string | null;
  status: string;
  exercise_timestamps: ExerciseTimestamp[];
}

interface ExerciseTimestamp {
  id: string;
  exercise_id: string;
  started_at: string;
  ended_at: string | null;
}

interface WorkoutTimerProps {
  workoutId: string;
  dayNumber: number;
  exercises: { id: string }[];
  onSessionChange: (session: WorkoutSession | null) => void;
}

function formatElapsed(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function WorkoutTimer({ workoutId, dayNumber, exercises, onSessionChange }: WorkoutTimerProps) {
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [elapsed, setElapsed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [starting, setStarting] = useState(false);

  // Load existing session on mount
  useEffect(() => {
    async function loadSession() {
      try {
        const res = await fetch(`/api/workout?workoutId=${workoutId}`);
        const data = await res.json();
        if (data.session) {
          setSession(data.session);
          onSessionChange(data.session);
        }
      } catch (err) {
        console.error("Failed to load session:", err);
      } finally {
        setLoading(false);
      }
    }
    loadSession();
  }, [workoutId]);

  // Tick the timer
  useEffect(() => {
    if (!session || session.status !== "active") return;

    const startTime = new Date(session.started_at).getTime();

    const tick = () => {
      setElapsed(Math.floor((Date.now() - startTime) / 1000));
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [session]);

  const startWorkout = useCallback(async () => {
    setStarting(true);
    try {
      const res = await fetch("/api/workout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workoutId, dayNumber }),
      });
      const data = await res.json();
      if (data.session) {
        const s = { ...data.session, exercise_timestamps: [] };
        setSession(s);
        onSessionChange(s);
      }
    } catch (err) {
      console.error("Failed to start workout:", err);
    } finally {
      setStarting(false);
    }
  }, [workoutId, dayNumber, onSessionChange]);

  const endWorkout = useCallback(async () => {
    if (!session) return;
    try {
      const res = await fetch("/api/workout", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: session.id }),
      });
      const data = await res.json();
      if (data.session) {
        const s = { ...session, ...data.session };
        setSession(s);
        onSessionChange(s);
      }
    } catch (err) {
      console.error("Failed to end workout:", err);
    }
  }, [session, onSessionChange]);

  if (loading) return null;

  // Completed session
  if (session?.status === "completed") {
    const startTime = new Date(session.started_at).getTime();
    const endTime = new Date(session.ended_at!).getTime();
    const totalSeconds = Math.floor((endTime - startTime) / 1000);
    const completedCount = session.exercise_timestamps?.filter((t) => t.ended_at).length || 0;

    return (
      <div className="bg-primary/10 border border-primary/30 rounded-xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-lg">✅</span>
            </div>
            <div>
              <p className="font-display text-sm font-bold text-primary uppercase tracking-wider">
                Workout Complete
              </p>
              <p className="text-xs text-muted">
                {formatElapsed(totalSeconds)} total · {completedCount}/{exercises.length} exercises tracked
              </p>
            </div>
          </div>
          <p className="text-xs text-muted">
            Sync your watch to see HR data
          </p>
        </div>
      </div>
    );
  }

  // No active session — show start button
  if (!session || session.status !== "active") {
    return (
      <div className="mb-6">
        <button
          onClick={startWorkout}
          disabled={starting}
          className="w-full py-4 rounded-xl font-display text-sm font-bold uppercase tracking-[0.15em]
                     bg-primary text-black hover:bg-primary-dark transition-all
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
          {starting ? "Starting..." : "Start Workout — Track with Watch"}
        </button>
        <p className="text-[10px] text-muted text-center mt-2 tracking-wider">
          START A TRAINING SESSION ON YOUR POLAR OR GARMIN WATCH FIRST
        </p>
      </div>
    );
  }

  // Active session — show timer + end button
  const completedCount = session.exercise_timestamps?.filter((t) => t.ended_at).length || 0;
  const activeExercise = session.exercise_timestamps?.find((t) => !t.ended_at);

  return (
    <div className="bg-primary/5 border border-primary/30 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse" />
          </div>
          <div>
            <p className="font-display text-2xl font-bold text-white tabular-nums">
              {formatElapsed(elapsed)}
            </p>
            <p className="text-[10px] text-muted tracking-wider uppercase">
              {completedCount}/{exercises.length} exercises · tracking
            </p>
          </div>
        </div>
        <button
          onClick={endWorkout}
          className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/40
                     text-red-400 text-xs font-bold uppercase tracking-wider
                     hover:bg-red-500/30 transition-all"
        >
          End Workout
        </button>
      </div>
    </div>
  );
}

/**
 * Per-exercise tracking button — renders inside each exercise card
 */
interface ExerciseTrackerProps {
  exerciseId: string;
  session: WorkoutSession | null;
  onUpdate: (timestamp: ExerciseTimestamp) => void;
}

export function ExerciseTracker({ exerciseId, session, onUpdate }: ExerciseTrackerProps) {
  const [loading, setLoading] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  const timestamp = session?.exercise_timestamps?.find((t) => t.exercise_id === exerciseId);
  const isStarted = !!timestamp && !timestamp.ended_at;
  const isCompleted = !!timestamp?.ended_at;

  // Tick for active exercise
  useEffect(() => {
    if (!isStarted || !timestamp) return;
    const startTime = new Date(timestamp.started_at).getTime();
    const tick = () => setElapsed(Math.floor((Date.now() - startTime) / 1000));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [isStarted, timestamp]);

  if (!session || session.status !== "active") return null;

  const handleStart = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/workout/exercise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: session.id, exerciseId }),
      });
      const data = await res.json();
      if (data.timestamp) onUpdate(data.timestamp);
    } catch (err) {
      console.error("Failed to start exercise:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/workout/exercise", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId: session.id, exerciseId }),
      });
      const data = await res.json();
      if (data.timestamp) onUpdate(data.timestamp);
    } catch (err) {
      console.error("Failed to complete exercise:", err);
    } finally {
      setLoading(false);
    }
  };

  if (isCompleted) {
    const startTime = new Date(timestamp!.started_at).getTime();
    const endTime = new Date(timestamp!.ended_at!).getTime();
    const totalSecs = Math.floor((endTime - startTime) / 1000);
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-muted tabular-nums">{formatElapsed(totalSecs)}</span>
        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
          <span className="text-sm">✅</span>
        </div>
      </div>
    );
  }

  if (isStarted) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-primary tabular-nums animate-pulse">{formatElapsed(elapsed)}</span>
        <button
          onClick={handleComplete}
          disabled={loading}
          className="w-7 h-7 rounded-full bg-primary/20 border border-primary/40
                     flex items-center justify-center hover:bg-primary/30 transition-all"
        >
          <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleStart}
      disabled={loading}
      className="w-7 h-7 rounded-full bg-white/5 border border-white/10
                 flex items-center justify-center hover:bg-white/10 hover:border-primary/30 transition-all
                 disabled:opacity-50"
    >
      <svg className="w-3.5 h-3.5 text-muted" viewBox="0 0 24 24" fill="currentColor">
        <path d="M8 5v14l11-7z" />
      </svg>
    </button>
  );
}
