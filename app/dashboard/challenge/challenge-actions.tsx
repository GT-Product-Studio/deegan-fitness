"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { ActivityLogger } from "@/app/components/activity-logger";
import { useRouter } from "next/navigation";

export function ChallengeActions({ challengeId }: { challengeId: string }) {
  const [showLogger, setShowLogger] = useState(false);
  const router = useRouter();

  return (
    <>
      <button
        onClick={() => setShowLogger(true)}
        className="w-full bg-primary text-black font-display font-bold uppercase tracking-wider py-3.5 rounded-2xl hover:bg-primary-dark transition flex items-center justify-center gap-2"
      >
        <Plus className="w-5 h-5" />
        Log Activity
      </button>

      {showLogger && (
        <ActivityLogger
          challengeId={challengeId}
          onClose={() => setShowLogger(false)}
          onSuccess={() => router.refresh()}
        />
      )}
    </>
  );
}
