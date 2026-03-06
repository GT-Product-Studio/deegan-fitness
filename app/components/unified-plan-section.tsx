"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Check, Users, Crown, Zap, ChevronRight } from "lucide-react";
import { brand, getProgramConfig } from "@/config/brand";

const tA = brand.trainers.trainerA;
const tB = brand.trainers.trainerB;
const pA30 = getProgramConfig("trainerA", "30")!;
const pB30 = getProgramConfig("trainerB", "30")!;
const pCouples = getProgramConfig("couples", "ab")!;
const monthly = brand.subscriptions.monthly;
const vip = brand.subscriptions.vip;

// ── Types ─────────────────────────────────────────────────────────────────────

type Tab = "membership" | "programs";

// ── Subscribe button (straight to Stripe) ────────────────────────────────────

function SubscribeButton({
  planType,
  label,
  className,
}: {
  planType: "monthly" | "vip";
  label: string;
  className: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function go() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planType }),
      });
      const data = await res.json();
      if (data.url) router.push(data.url);
      else setLoading(false);
    } catch {
      setLoading(false);
    }
  }

  return (
    <button onClick={go} disabled={loading} className={className}>
      {loading ? "Loading…" : label}
    </button>
  );
}

// ── Buy Now button (one-time → /checkout) ─────────────────────────────────────

function BuyButton({
  trainer,
  tier,
  popular,
}: {
  trainer: string;
  tier: string;
  popular?: boolean;
}) {
  const router = useRouter();
  return (
    <button
      onClick={() => router.push(`/checkout?trainer=${trainer}&tier=${tier}`)}
      className={`w-full flex items-center justify-center gap-2 py-4 text-xs font-bold tracking-widest uppercase transition ${
        popular
          ? "bg-white text-army hover:bg-white/90"
          : "bg-army text-white hover:bg-army-light"
      }`}
    >
      Start Challenge <ChevronRight className="w-3.5 h-3.5" />
    </button>
  );
}

// ── Membership tab ────────────────────────────────────────────────────────────

function MembershipCards() {
  return (
    <div className="grid md:grid-cols-2 gap-px bg-card-border border border-card-border">

      {/* Monthly */}
      <div className="flex flex-col p-7 md:p-8 bg-white">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-army/10 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-army" />
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted">Monthly</p>
            <p className="font-display text-xl uppercase leading-none">{monthly.displayName}</p>
          </div>
        </div>

        <div className="flex items-baseline gap-1.5 mb-0.5">
          <span className="font-display text-6xl leading-none">{monthly.priceDollars}</span>
          <span className="text-sm font-bold text-muted">{monthly.priceCents}</span>
        </div>
        <p className="text-xs tracking-widest uppercase text-muted mb-6">Per month · Cancel anytime</p>

        <ul className="space-y-2.5 mb-8 flex-1">
          {monthly.features.map((f) => (
            <li key={f} className="flex items-center gap-2.5 text-sm text-muted">
              <Check className="w-3.5 h-3.5 shrink-0 text-army" />{f}
            </li>
          ))}
        </ul>

        <SubscribeButton
          planType="monthly"
          label="Join Monthly →"
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
            <p className="font-display text-xl uppercase leading-none text-white">{brand.shortName} {vip.displayName}</p>
          </div>
        </div>

        <div className="flex items-baseline gap-1.5 mb-0.5">
          <span className="font-display text-6xl leading-none text-white">{vip.priceDollars}</span>
          <span className="text-sm font-bold text-white/40">{vip.priceCents}</span>
        </div>
        <p className="text-xs tracking-widest uppercase text-white/40 mb-6">Per month · Cancel anytime</p>

        <ul className="space-y-2.5 mb-8 flex-1">
          {vip.features.map((f) => (
            <li key={f} className="flex items-center gap-2.5 text-sm text-white/80">
              <Check className="w-3.5 h-3.5 shrink-0 text-gold" />{f}
            </li>
          ))}
        </ul>

        <SubscribeButton
          planType="vip"
          label={`Join ${brand.shortName} ${vip.displayName} →`}
          className="w-full bg-gold text-black py-4 text-xs font-bold tracking-widest uppercase hover:bg-gold/90 transition"
        />
      </div>
    </div>
  );
}

// ── One-time programs tab ──────────────────────────────────────────────────────

function ProgramCards({ initialTrainer }: { initialTrainer: "trainerA" | "trainerB" | "couples" }) {
  const carouselRef = useRef<HTMLDivElement>(null);
  const targetIndex = initialTrainer === "trainerA" ? 0 : initialTrainer === "trainerB" ? 2 : 1;
  const [activeIndex, setActiveIndex] = useState(targetIndex);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const el = carouselRef.current;
      if (!el) return;
      const child = el.children[targetIndex] as HTMLElement;
      if (!child) return;
      el.scrollLeft = child.offsetLeft - (el.offsetWidth - child.offsetWidth) / 2;
    });
    return () => cancelAnimationFrame(raf);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const onScroll = () => {
      const center = el.scrollLeft + el.offsetWidth / 2;
      const children = Array.from(el.children) as HTMLElement[];
      let closest = 0, minDist = Infinity;
      children.forEach((child, i) => {
        const dist = Math.abs(child.offsetLeft + child.offsetWidth / 2 - center);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      setActiveIndex(closest);
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  function scrollTo(i: number) {
    const el = carouselRef.current;
    if (!el) return;
    const child = el.children[i] as HTMLElement;
    if (!child) return;
    el.scrollTo({ left: child.offsetLeft - (el.offsetWidth - child.offsetWidth) / 2, behavior: "smooth" });
  }

  return (
    <>
      {/* Mobile carousel */}
      <div className="md:hidden -mx-5">
        <div
          ref={carouselRef}
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory hide-scrollbar px-[9vw] pb-1"
        >
          {/* Trainer A */}
          <div className="snap-center flex-shrink-0 w-[82vw] flex flex-col p-6 bg-white border border-card-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border-2 border-card-border">
                <Image src={tA.photo} alt={tA.name} fill className="object-cover object-top" />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted">{brand.hero.trainerALabel} Program</p>
                <p className="font-display text-base uppercase leading-none">{tA.name}</p>
              </div>
            </div>
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-muted mb-1">{pA30.durationLabel}</p>
            <div className="flex items-baseline gap-1.5 mb-0.5">
              <span className="font-display text-5xl leading-none">{pA30.priceDollars}</span>
              <span className="text-sm font-bold text-muted">{pA30.priceCents}</span>
            </div>
            <p className="text-[11px] tracking-widest uppercase text-muted mb-4">One-time · Yours to keep</p>
            <p className="text-sm font-bold mb-1">{pA30.name}</p>
            <p className="text-xs text-muted leading-relaxed mb-4">{pA30.description}</p>
            <ul className="space-y-1.5 mb-5 flex-1">
              {pA30.cardFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-muted">
                  <Check className="w-3 h-3 shrink-0 text-army" />{f}
                </li>
              ))}
            </ul>
            <BuyButton trainer="trainerA" tier="30" />
          </div>

          {/* Couples — featured center */}
          <div className="snap-center flex-shrink-0 w-[82vw] relative flex flex-col p-6 bg-army text-white">
            <span className="absolute top-4 right-4 bg-gold text-black text-[9px] font-bold px-2 py-0.5 tracking-widest uppercase">Fan Favorite</span>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-gold/20 border-2 border-gold/40 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 text-gold" />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold">{brand.hero.trainerALabel} &amp; {brand.hero.trainerBLabel}</p>
                <p className="font-display text-base uppercase leading-none text-white">{brand.trainers.couples.specialty}</p>
              </div>
            </div>
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-gold mb-1">{pCouples.durationLabel}</p>
            <div className="flex items-baseline gap-1.5 mb-0.5">
              <span className="font-display text-5xl leading-none text-white">{pCouples.priceDollars}</span>
              <span className="text-sm font-bold text-white/50">{pCouples.priceCents}</span>
            </div>
            <p className="text-[11px] tracking-widest uppercase text-white/40 mb-4">One-time · Yours to keep</p>
            <p className="text-sm font-bold text-white mb-1">{pCouples.name}</p>
            <p className="text-xs text-white/70 leading-relaxed mb-4">{pCouples.description}</p>
            <ul className="space-y-1.5 mb-5 flex-1">
              {pCouples.cardFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-white/80">
                  <Check className="w-3 h-3 shrink-0 text-gold" />{f}
                </li>
              ))}
            </ul>
            <BuyButton trainer="couples" tier="ab" popular />
          </div>

          {/* Trainer B */}
          <div className="snap-center flex-shrink-0 w-[82vw] flex flex-col p-6 bg-white border border-card-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border-2 border-card-border">
                <Image src={tB.photo} alt={tB.name} fill className="object-cover object-top" />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted">{brand.hero.trainerBLabel} Program</p>
                <p className="font-display text-base uppercase leading-none">{tB.name}</p>
              </div>
            </div>
            <p className="text-xs font-bold tracking-[0.3em] uppercase text-muted mb-1">{pB30.durationLabel}</p>
            <div className="flex items-baseline gap-1.5 mb-0.5">
              <span className="font-display text-5xl leading-none">{pB30.priceDollars}</span>
              <span className="text-sm font-bold text-muted">{pB30.priceCents}</span>
            </div>
            <p className="text-[11px] tracking-widest uppercase text-muted mb-4">One-time · Yours to keep</p>
            <p className="text-sm font-bold mb-1">{pB30.name}</p>
            <p className="text-xs text-muted leading-relaxed mb-4">{pB30.description}</p>
            <ul className="space-y-1.5 mb-5 flex-1">
              {pB30.cardFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-muted">
                  <Check className="w-3 h-3 shrink-0 text-army" />{f}
                </li>
              ))}
            </ul>
            <BuyButton trainer="trainerB" tier="30" />
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`rounded-full transition-all duration-200 ${activeIndex === i ? "w-6 h-2 bg-army" : "w-2 h-2 bg-card-border"}`}
            />
          ))}
        </div>
      </div>

      {/* Desktop grid */}
      <div className="hidden md:grid grid-cols-3 gap-px bg-card-border border border-card-border">

        {/* Trainer A */}
        <div className="flex flex-col p-7 bg-white">
          <div className="flex items-center gap-3 mb-5">
            <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-card-border">
              <Image src={tA.photo} alt={tA.name} fill className="object-cover object-top" />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted">{brand.hero.trainerALabel} Program</p>
              <p className="font-display text-lg uppercase leading-none">{tA.name}</p>
            </div>
          </div>
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-muted mb-2">{pA30.durationLabel}</p>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-display text-6xl leading-none">{pA30.priceDollars}</span>
            <span className="text-sm font-bold text-muted">{pA30.priceCents}</span>
          </div>
          <p className="text-xs tracking-widest uppercase text-muted mb-4">One-time · Yours to keep</p>
          <p className="text-sm font-bold mb-1">{pA30.name}</p>
          <p className="text-sm text-muted leading-relaxed mb-5">{pA30.description}</p>
          <ul className="space-y-2 mb-6 flex-1">
            {pA30.cardFeatures.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-muted">
                <Check className="w-3.5 h-3.5 shrink-0 text-army" />{f}
              </li>
            ))}
          </ul>
          <BuyButton trainer="trainerA" tier="30" />
        </div>

        {/* Couples — featured */}
        <div className="relative flex flex-col p-7 bg-army text-white">
          <span className="absolute top-5 right-5 bg-gold text-black text-[10px] font-bold px-2.5 py-1 tracking-widest uppercase">Fan Favorite</span>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-gold/20 border-2 border-gold/40 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-gold" />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold">{brand.hero.trainerALabel} &amp; {brand.hero.trainerBLabel}</p>
              <p className="font-display text-lg uppercase leading-none text-white">{brand.trainers.couples.specialty}</p>
            </div>
          </div>
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-gold mb-2">{pCouples.durationLabel}</p>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-display text-6xl leading-none text-white">{pCouples.priceDollars}</span>
            <span className="text-sm font-bold text-white/50">{pCouples.priceCents}</span>
          </div>
          <p className="text-xs tracking-widest uppercase text-white/40 mb-4">One-time · Yours to keep</p>
          <p className="text-sm font-bold text-white mb-1">{pCouples.name}</p>
          <p className="text-sm text-white/70 leading-relaxed mb-5">{pCouples.description}</p>
          <ul className="space-y-2 mb-6 flex-1">
            {pCouples.cardFeatures.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-white/80">
                <Check className="w-3.5 h-3.5 shrink-0 text-gold" />{f}
              </li>
            ))}
          </ul>
          <BuyButton trainer="couples" tier="ab" popular />
        </div>

        {/* Trainer B */}
        <div className="flex flex-col p-7 bg-white">
          <div className="flex items-center gap-3 mb-5">
            <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-card-border">
              <Image src={tB.photo} alt={tB.name} fill className="object-cover object-top" />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted">{brand.hero.trainerBLabel} Program</p>
              <p className="font-display text-lg uppercase leading-none">{tB.name}</p>
            </div>
          </div>
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-muted mb-2">{pB30.durationLabel}</p>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-display text-6xl leading-none">{pB30.priceDollars}</span>
            <span className="text-sm font-bold text-muted">{pB30.priceCents}</span>
          </div>
          <p className="text-xs tracking-widest uppercase text-muted mb-4">One-time · Yours to keep</p>
          <p className="text-sm font-bold mb-1">{pB30.name}</p>
          <p className="text-sm text-muted leading-relaxed mb-5">{pB30.description}</p>
          <ul className="space-y-2 mb-6 flex-1">
            {pB30.cardFeatures.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-muted">
                <Check className="w-3.5 h-3.5 shrink-0 text-army" />{f}
              </li>
            ))}
          </ul>
          <BuyButton trainer="trainerB" tier="30" />
        </div>

      </div>
    </>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

export function UnifiedPlanSection({
  initialTrainer = "trainerA",
  defaultTab = "membership",
}: {
  initialTrainer?: "trainerA" | "trainerB" | "couples";
  defaultTab?: Tab;
}) {
  const [tab, setTab] = useState<Tab>(defaultTab);

  return (
    <section
      id="plans"
      className="px-5 md:px-6 py-14 md:py-16 bg-background border-b border-card-border scroll-mt-14"
    >
      <div className="max-w-7xl mx-auto">

        {/* Section header */}
        <div className="mb-8">
          <h2 className="font-display text-4xl md:text-6xl uppercase leading-none">
            {tab === "membership" ? "Join the Movement." : "Choose Your Challenge."}
          </h2>
          <p className="mt-3 text-muted text-sm max-w-sm leading-relaxed">
            {tab === "membership"
              ? "New challenge every month. Train with the best."
              : "Pay once. Own it forever."}
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex mb-8 border border-card-border w-fit">
          <button
            onClick={() => setTab("membership")}
            className={`px-6 py-3 text-xs font-bold tracking-widest uppercase transition ${
              tab === "membership"
                ? "bg-foreground text-white"
                : "bg-white text-muted hover:text-foreground"
            }`}
          >
            Membership
          </button>
          <button
            onClick={() => setTab("programs")}
            className={`px-6 py-3 text-xs font-bold tracking-widest uppercase transition border-l border-card-border ${
              tab === "programs"
                ? "bg-foreground text-white"
                : "bg-white text-muted hover:text-foreground"
            }`}
          >
            One-Time Programs
          </button>
        </div>

        {/* Content */}
        {tab === "membership" ? (
          <>
            <MembershipCards />
            <p className="mt-5 text-muted text-xs">
              Prefer to buy once?{" "}
              <button
                onClick={() => setTab("programs")}
                className="underline hover:text-foreground transition font-medium"
              >
                See one-time programs →
              </button>
            </p>
          </>
        ) : (
          <>
            <ProgramCards initialTrainer={initialTrainer} />
            <p className="mt-5 text-muted text-xs">
              Want ongoing coaching?{" "}
              <button
                onClick={() => setTab("membership")}
                className="underline hover:text-foreground transition font-medium"
              >
                See membership plans →
              </button>
            </p>
          </>
        )}

      </div>
    </section>
  );
}
