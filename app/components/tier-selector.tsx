"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

const TIERS = [
  {
    id: "grom",
    label: "GROM",
    emoji: "🟢",
    description: "4 days/week • 30-45 min sessions",
    detail: "For newer riders, weekend warriors, anyone building their base. Focused on fundamentals.",
  },
  {
    id: "factory",
    label: "FACTORY",
    emoji: "🔴",
    description: "5-6 days/week • 45-75 min sessions",
    detail: "For competitive riders chasing podiums. Race simulations, double sessions, serious volume.",
  },
] as const;

export function TierSelector({ currentTier }: { currentTier: string }) {
  const [selected, setSelected] = useState(currentTier || "grom");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function handleSelect(tierId: string) {
    setSelected(tierId);
    startTransition(async () => {
      await fetch("/api/update-tier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier: tierId }),
      });
      router.refresh();
    });
  }

  return (
    <div className="space-y-2">
      {TIERS.map((tier) => {
        const isSelected = selected === tier.id;
        return (
          <button
            key={tier.id}
            onClick={() => handleSelect(tier.id)}
            disabled={isPending}
            className={`w-full text-left p-4 rounded-xl border transition ${
              isSelected
                ? "bg-primary/10 border-primary/40"
                : "bg-card border-white/10 hover:border-white/20"
            } ${isPending ? "opacity-50" : ""}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-lg">{tier.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className={`font-display text-sm font-bold uppercase tracking-wider ${
                    isSelected ? "text-primary" : "text-white"
                  }`}>
                    {tier.label}
                  </span>
                  {isSelected && (
                    <span className="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full font-bold">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted mt-0.5">{tier.description}</p>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

export function TierBadge({ tier }: { tier: string }) {
  const config = TIERS.find((t) => t.id === tier) || TIERS[0];
  return (
    <span className="inline-flex items-center gap-1 text-xs bg-card-elevated border border-white/10 px-2 py-0.5 rounded-full">
      <span>{config.emoji}</span>
      <span className="font-bold tracking-wider uppercase">{config.label}</span>
    </span>
  );
}
