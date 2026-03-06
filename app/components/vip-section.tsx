import { Crown, Calendar, MessageCircle, ExternalLink } from "lucide-react";
import { brand } from "@/config/brand";

const tA = brand.trainers.trainerA;
const tB = brand.trainers.trainerB;

interface VipSectionProps {
  trainerASessionDate?: string | null;
  trainerBSessionDate?: string | null;
  discordInviteUrl?: string | null;
}

function formatSessionDate(iso: string | null | undefined) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  } catch {
    return null;
  }
}

export function VipSection({ trainerASessionDate, trainerBSessionDate, discordInviteUrl }: VipSectionProps) {
  const trainerADate = formatSessionDate(trainerASessionDate);
  const trainerBDate = formatSessionDate(trainerBSessionDate);

  return (
    <div className="rounded-2xl overflow-hidden border border-gold/30 bg-gradient-to-br from-foreground to-foreground/90">

      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-gold/20 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gold/20 flex items-center justify-center shrink-0">
          <Crown className="w-4 h-4 text-gold" />
        </div>
        <div>
          <p className="text-gold text-[10px] font-bold tracking-[0.25em] uppercase">VIP Member</p>
          <p className="text-white font-bold text-sm leading-tight">{brand.shortName} {brand.subscriptions.vip.displayName}</p>
        </div>
        <span className="ml-auto text-[9px] font-bold px-2 py-1 bg-gold text-black tracking-widest uppercase">
          Active
        </span>
      </div>

      <div className="p-5 space-y-3">

        {/* Discord — primary CTA */}
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-4 h-4 text-gold shrink-0" />
            <p className="text-white/60 text-xs font-bold tracking-widest uppercase">Your VIP Community</p>
          </div>
          <p className="text-white/40 text-xs mb-3">
            Live sessions, Q&amp;As, and coaching from {tA.firstName} &amp; {tB.firstName} all happen here.
          </p>
          {discordInviteUrl ? (
            <a
              href={discordInviteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-white px-4 py-2.5 text-xs font-bold tracking-widest uppercase hover:opacity-90 transition"
              style={{ backgroundColor: brand.colors.discordBrandColor }}
            >
              Join Discord <ExternalLink className="w-3 h-3" />
            </a>
          ) : (
            <p className="text-white/30 text-xs italic">Discord invite coming — check your email</p>
          )}
        </div>

        {/* Upcoming live sessions */}
        <div className="bg-white/5 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-gold shrink-0" />
            <p className="text-white/60 text-xs font-bold tracking-widest uppercase">Upcoming Live Sessions</p>
          </div>

          <div className="space-y-3">
            {/* Trainer A */}
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
              <div>
                <p className="text-white text-xs font-bold">{tA.name}</p>
                <p className="text-white/50 text-xs mt-0.5">
                  {trainerADate ?? "Schedule coming soon"}
                </p>
                {trainerADate && (
                  <p className="text-gold text-[10px] font-bold tracking-widest uppercase mt-0.5">In Discord · #live-qa</p>
                )}
              </div>
            </div>

            {/* Trainer B */}
            <div className="flex items-start gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
              <div>
                <p className="text-white text-xs font-bold">{tB.name}</p>
                <p className="text-white/50 text-xs mt-0.5">
                  {trainerBDate ?? "Schedule coming soon"}
                </p>
                {trainerBDate && (
                  <p className="text-gold text-[10px] font-bold tracking-widest uppercase mt-0.5">In Discord · #live-qa</p>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
