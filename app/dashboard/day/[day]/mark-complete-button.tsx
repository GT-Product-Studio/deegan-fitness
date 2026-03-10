"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle, Loader2, Flame } from "lucide-react";

interface CelebrationOverlayProps {
  dayNumber: number;
  onDismiss: () => void;
  onKeepGoing: () => void;
}

function CelebrationOverlay({ dayNumber, onDismiss, onKeepGoing }: CelebrationOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [show, setShow] = useState(false);
  const onDismissRef = useRef(onDismiss);

  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    // Tiny delay so the CSS transition actually plays
    const showTimer = setTimeout(() => setShow(true), 30);

    // Fire confetti — runs exactly once on mount
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      import("canvas-confetti").then((mod) => {
        const shoot = mod.create(canvas, { resize: true, useWorker: false });

        shoot({
          particleCount: 100,
          spread: 80,
          origin: { x: 0.5, y: 0.1 },
          colors: ["#29F000", "#ffffff", "#22D400", "#66FF33"],
          gravity: 0.85,
        });

        setTimeout(() => {
          shoot({ particleCount: 60, spread: 80, angle: 60,  origin: { x: 0, y: 0.25 }, colors: ["#29F000", "#22D400", "#fff"] });
          shoot({ particleCount: 60, spread: 80, angle: 120, origin: { x: 1, y: 0.25 }, colors: ["#29F000", "#22D400", "#fff"] });
        }, 200);

        setTimeout(() => {
          shoot({ particleCount: 80, spread: 130, origin: { x: 0.5, y: 0.05 }, colors: ["#29F000", "#fff"], gravity: 1.0 });
        }, 500);
      });
    }

    const dismissTimer = setTimeout(() => onDismissRef.current(), 5500);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(dismissTimer);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // empty — fire once on mount only

  const overlay = (
    <div
      className="fixed inset-0"
      style={{ zIndex: 9999 }}
      onClick={onDismiss}
    >
      {/* Dark backdrop — fades in */}
      <div
        className="absolute inset-0 bg-black/85 transition-opacity duration-400"
        style={{ opacity: show ? 1 : 0 }}
      />

      {/* Centered card — scales + fades in */}
      <div
        className="absolute inset-0 flex items-center justify-center px-6"
        style={{ zIndex: 1 }}
      >
        <div
          className="w-full max-w-sm bg-[#0d0d0d] border border-white/10 rounded-3xl p-8 text-center transition-all duration-500 ease-out"
          style={{
            opacity: show ? 1 : 0,
            transform: show ? "scale(1) translateY(0)" : "scale(0.85) translateY(24px)",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Flame with layered glow rings */}
          <div className="relative flex justify-center mb-6">
            <div className="absolute w-28 h-28 rounded-full bg-primary/10 animate-ping" style={{ animationDuration: "2.2s" }} />
            <div className="absolute w-[5.5rem] h-[5.5rem] rounded-full bg-primary/10" />
            <div className="relative w-20 h-20 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center shadow-lg shadow-primary/20">
              <Flame className="w-10 h-10 text-primary" />
            </div>
          </div>

          <p className="text-primary text-[11px] font-bold tracking-[0.35em] uppercase mb-2">
            Workout Complete
          </p>
          <h2 className="font-display text-7xl text-white leading-none tracking-wide">
            Day {dayNumber}
          </h2>
          <p className="text-2xl font-bold text-primary mt-1">Complete 🔥</p>
          <p className="text-white/50 text-sm mt-4 leading-relaxed">
            You showed up. Keep the streak alive.
          </p>

          <button
            onClick={onKeepGoing}
            className="mt-7 w-full py-4 bg-primary text-black font-bold text-xs tracking-widest uppercase rounded-xl hover:bg-primary/90 transition"
          >
            Keep Going →
          </button>
        </div>
      </div>

      {/* Confetti canvas — on top of everything including the card */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 2 }}
      />
    </div>
  );

  return createPortal(overlay, document.body);
}

export function MarkCompleteButton({
  workoutId,
  isCompleted: initialCompleted,
  dayNumber = 1,
}: {
  workoutId: string;
  isCompleted: boolean;
  dayNumber?: number;
}) {
  const router = useRouter();
  const btnRef = useRef<HTMLButtonElement>(null);
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [loading, setLoading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  async function handleToggle() {
    if (loading) return;

    // Fire the pop animation first
    const btn = btnRef.current;
    if (btn) {
      btn.classList.remove("btn-pop");
      void btn.offsetWidth; // reflow to restart animation
      btn.classList.add("btn-pop");
    }

    setLoading(true);
    const supabase = createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (isCompleted) {
      await supabase
        .from("progress")
        .delete()
        .eq("user_id", user.id)
        .eq("workout_id", workoutId);
      setIsCompleted(false);
    } else {
      await supabase.from("progress").insert({
        user_id: user.id,
        workout_id: workoutId,
      });
      setIsCompleted(true);
      setShowCelebration(true);
    }

    setLoading(false);
    router.refresh();
  }

  return (
    <>
      {showCelebration && (
        <CelebrationOverlay
          dayNumber={dayNumber}
          onDismiss={() => setShowCelebration(false)}
          onKeepGoing={() => {
            setShowCelebration(false);
            router.push("/dashboard");
          }}
        />
      )}

      <button
        ref={btnRef}
        onClick={handleToggle}
        disabled={loading}
        className={`w-full py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 transition-colors duration-300 ${
          isCompleted
            ? "bg-primary/20 text-primary border-2 border-primary/50"
            : "bg-primary text-black shadow-lg shadow-primary/30"
        }`}
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : isCompleted ? (
          <>
            <CheckCircle className="w-5 h-5" />
            Completed ✓
          </>
        ) : (
          <>
            <Flame className="w-5 h-5" />
            Mark Day Complete
          </>
        )}
      </button>
    </>
  );
}
