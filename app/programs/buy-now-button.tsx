"use client";

import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";

interface BuyNowButtonProps {
  trainer: string;
  tier: string;
  popular?: boolean;
}

export function BuyNowButton({ trainer, tier, popular }: BuyNowButtonProps) {
  const router = useRouter();

  function handleBuy() {
    router.push(`/checkout?trainer=${trainer}&tier=${tier}`);
  }

  return (
    <button
      onClick={handleBuy}
      className={`mt-auto w-full flex items-center justify-center gap-2 py-4 text-xs font-bold tracking-widest uppercase transition ${
        popular
          ? "bg-white text-army hover:bg-white/90"
          : "bg-army text-white hover:bg-army-light"
      }`}
    >
      Start Challenge
      <ChevronRight className="w-3.5 h-3.5" />
    </button>
  );
}
