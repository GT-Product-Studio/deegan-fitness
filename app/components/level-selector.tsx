"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { brand, type TrainingLevelId } from "@/config/brand";
import { createClient } from "@/lib/supabase/client";

interface LevelSelectorProps {
  currentLevel: string;
  userId: string;
}

export function LevelSelector({ currentLevel, userId }: LevelSelectorProps) {
  const router = useRouter();
  const [selected, setSelected] = useState(currentLevel);
  const [saving, setSaving] = useState(false);

  async function handleSelect(levelId: TrainingLevelId) {
    if (levelId === selected) return;
    setSelected(levelId);
    setSaving(true);

    const supabase = createClient();
    await supabase
      .from("profiles")
      .update({ training_level: levelId })
      .eq("id", userId);

    setSaving(false);
    router.refresh();
  }

  return (
    <div className="bg-card border border-white/10 rounded-2xl p-5">
      <h3 className="font-bold text-sm uppercase tracking-wider text-muted mb-4">Training Level</h3>
      <div className="grid grid-cols-3 gap-2">
        {(Object.values(brand.levels) as typeof brand.levels[TrainingLevelId][]).map((level) => {
          const isSelected = selected === level.id;
          return (
            <button
              key={level.id}
              onClick={() => handleSelect(level.id)}
              disabled={saving}
              className={`p-3 rounded-xl text-center transition-all border ${
                isSelected
                  ? "bg-primary/10 border-primary/40 text-white"
                  : "bg-card-elevated border-white/5 text-muted hover:border-white/20 hover:text-white"
              } disabled:opacity-50`}
            >
              <span className="text-lg block mb-1">{level.emoji}</span>
              <span className="font-display text-sm font-bold uppercase block">{level.name}</span>
              <span className="text-[10px] text-muted-dark block mt-0.5">
                {level.cyclingMiles}mi / {level.motoHours}hr / {level.gymHours}hr
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
