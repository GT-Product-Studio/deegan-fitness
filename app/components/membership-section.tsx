"use client";

import { Check, Crown, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { brand } from "@/config/brand";

const MONTHLY_FEATURES = brand.subscriptions.monthly.features;

const VIP_FEATURES = brand.subscriptions.vip.features;

function SubscribeButton({
  planType,
  className,
  label = "Get Started",
}: {
  planType: "monthly" | "vip";
  className?: string;
  label?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSubscribe() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planType }),
      });
      const data = await res.json();
      if (data.url) {
        router.push(data.url);
      }
    } catch {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleSubscribe}
      disabled={loading}
      className={className}
    >
      {loading ? "Loading…" : label}
    </button>
  );
}

export function MembershipSection() {
  return (
    <section id="membership" className="px-5 md:px-6 py-14 md:py-20 bg-background border-b border-card-border scroll-mt-14">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <p className="text-gold text-xs font-bold tracking-[0.3em] uppercase mb-3">Monthly Membership</p>
          <h2 className="font-display text-4xl md:text-6xl uppercase leading-none">
            Keep the Momentum.
          </h2>
          <p className="mt-3 text-muted text-sm max-w-sm leading-relaxed">
            New challenge every month. Train with the best, cancel anytime.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-px bg-card-border border border-card-border max-w-4xl">

          {/* Monthly Challenge */}
          <div className="relative flex flex-col p-7 md:p-8 bg-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-army/10 flex items-center justify-center shrink-0">
                <Zap className="w-5 h-5 text-army" />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted">Monthly</p>
                <p className="font-display text-xl uppercase leading-none">Monthly Challenge</p>
              </div>
            </div>

            <div className="mb-1">
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-6xl leading-none text-foreground">{brand.subscriptions.monthly.priceDollars}</span>
                <span className="text-sm font-bold text-muted">{brand.subscriptions.monthly.priceCents}</span>
              </div>
              <p className="text-xs tracking-widest uppercase text-muted mt-1">Per month · Cancel anytime</p>
            </div>

            <div className="h-px bg-card-border my-6" />

            <ul className="space-y-2.5 mb-8 flex-1">
              {MONTHLY_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-muted">
                  <Check className="w-3.5 h-3.5 shrink-0 text-army" />
                  {f}
                </li>
              ))}
            </ul>

            <SubscribeButton
              planType="monthly"
              label="Join Monthly"
              className="w-full bg-army text-white py-4 text-xs font-bold tracking-widest uppercase hover:bg-army-light transition"
            />
          </div>

          {/* VIP */}
          <div className="relative flex flex-col p-7 md:p-8 bg-foreground text-white">
            <span className="absolute top-5 right-5 bg-gold text-black text-[9px] font-bold px-2.5 py-1 tracking-widest uppercase">
              Best Value
            </span>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gold/20 border border-gold/30 flex items-center justify-center shrink-0">
                <Crown className="w-5 h-5 text-gold" />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold">VIP</p>
                <p className="font-display text-xl uppercase leading-none text-white">{brand.subscriptions.vip.displayName}</p>
              </div>
            </div>

            <div className="mb-1">
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-6xl leading-none text-white">{brand.subscriptions.vip.priceDollars}</span>
                <span className="text-sm font-bold text-white/40">{brand.subscriptions.vip.priceCents}</span>
              </div>
              <p className="text-xs tracking-widest uppercase text-white/40 mt-1">Per month · Cancel anytime</p>
            </div>

            <div className="h-px bg-white/10 my-6" />

            <ul className="space-y-2.5 mb-8 flex-1">
              {VIP_FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2.5 text-sm text-white/80">
                  <Check className="w-3.5 h-3.5 shrink-0 text-gold" />
                  {f}
                </li>
              ))}
            </ul>

            <SubscribeButton
              planType="vip"
              label={`Join ${brand.subscriptions.vip.displayName}`}
              className="w-full bg-gold text-black py-4 text-xs font-bold tracking-widest uppercase hover:bg-gold/90 transition"
            />
          </div>
        </div>

        <p className="mt-5 text-muted text-xs">
          One-time programs still available below — pay once, keep forever.
        </p>
      </div>
    </section>
  );
}
