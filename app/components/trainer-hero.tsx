import Image from "next/image";
import { brand, getTrainerConfig } from "@/config/brand";

const tA = brand.trainers.trainerA;
const tB = brand.trainers.trainerB;
const tC = brand.trainers.couples;

interface TrainerHeroProps {
  trainer: string;
  dayNumber: number;
  tier: string;
  firstName?: string | null;
}

export function TrainerHero({ trainer, dayNumber, tier, firstName }: TrainerHeroProps) {
  const isTrainerA = trainer === "trainerA";
  const isTrainerB = trainer === "trainerB";
  const isCouples = trainer === "couples";

  const cfg = getTrainerConfig(trainer);
  const quotes = cfg?.quotes ?? tA.quotes;
  const quote = quotes[dayNumber % quotes.length];

  const totalDays = tier === "ab" ? 21 : parseInt(tier);
  const pct = Math.min(Math.round((dayNumber / totalDays) * 100), 100);

  const greeting = firstName ? `Hey, ${firstName.split(" ")[0]} 👋` : "Hey 👋";

  const gradientBg = cfg?.gradient ?? tA.gradient;

  const dayLabel = tier === "ab" ? `Day ${dayNumber} of 21` : `Day ${dayNumber} of ${tier}`;

  return (
    <div className="relative rounded-2xl overflow-hidden bg-card border border-card-border">
      <div className="absolute inset-0 opacity-10" style={{ background: gradientBg }} />

      <div className="relative flex items-center gap-4 p-4">
        {/* Trainer avatar(s) */}
        {isCouples ? (
          <div className="flex-shrink-0 flex -space-x-4">
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-gold/40 ring-2 ring-gold/10 z-10">
              <Image src={tA.photo} alt={tA.name} fill className="object-cover object-top" sizes="56px" />
            </div>
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-gold/40 ring-2 ring-gold/10">
              <Image src={tB.photo} alt={tB.name} fill className="object-cover object-top" sizes="56px" />
            </div>
          </div>
        ) : (
          <div className="flex-shrink-0 relative w-16 h-16 rounded-full overflow-hidden border-2 border-gold/40 ring-2 ring-gold/10">
            <Image
              src={isTrainerA ? tA.photo : tB.photo}
              alt={isTrainerA ? tA.name : tB.name}
              fill
              className="object-cover object-top"
              sizes="64px"
            />
          </div>
        )}

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted font-medium">{greeting}</p>
          <p className="text-sm font-bold text-foreground leading-snug">
            {isCouples ? (
              <>Your coaches are <span className="text-gold">{tC.name}</span></>
            ) : (
              <>Your coach today is <span className="text-gold">{isTrainerA ? tA.name : tB.name}</span></>
            )}
          </p>
          <p className="text-xs text-muted mt-1 leading-relaxed italic line-clamp-2">
            &ldquo;{quote}&rdquo;
          </p>
        </div>
      </div>

      {/* Day progress bar */}
      <div className="relative px-4 pb-3">
        <div className="flex justify-between text-xs text-muted mb-1">
          <span>{dayLabel}</span>
          <span>{pct}% through</span>
        </div>
        <div className="h-1.5 bg-card-border rounded-full overflow-hidden">
          <div
            className="h-full bg-gold rounded-full transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    </div>
  );
}
