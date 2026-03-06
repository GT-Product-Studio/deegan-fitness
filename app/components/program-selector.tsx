"use client";

import { useRouter, useSearchParams } from "next/navigation";

export interface AccessibleProgram {
  trainer: string;
  tier: string;
  label: string;
  shortLabel: string;
}

interface ProgramSelectorProps {
  programs: AccessibleProgram[];
  activeTrainer: string;
  activeTier: string;
}

export function ProgramSelector({ programs, activeTrainer, activeTier }: ProgramSelectorProps) {
  const router = useRouter();

  if (programs.length <= 1) return null;

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
      {programs.map((p) => {
        const isActive = p.trainer === activeTrainer && p.tier === activeTier;
        return (
          <button
            key={`${p.trainer}-${p.tier}`}
            onClick={() => router.push(`/dashboard?trainer=${p.trainer}&tier=${p.tier}`)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold tracking-widest uppercase transition-all ${
              isActive
                ? "bg-gold text-black"
                : "bg-card border border-card-border text-muted hover:text-foreground"
            }`}
          >
            {p.shortLabel}
          </button>
        );
      })}
    </div>
  );
}
