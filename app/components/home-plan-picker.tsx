"use client";

import { useEffect, useRef, useState } from "react";
import { BuyNowButton } from "@/app/programs/buy-now-button";
import { Check, Users } from "lucide-react";
import Image from "next/image";
import { brand, getProgramConfig } from "@/config/brand";

const trainerA = brand.trainers.trainerA;
const trainerB = brand.trainers.trainerB;
const couplesTrainer = brand.trainers.couples;
const programA30 = getProgramConfig("trainerA", "30")!;
const programB30 = getProgramConfig("trainerB", "30")!;
const programCouples = getProgramConfig("couples", "ab")!;

export function HomePlanPicker({ initialTrainer }: { initialTrainer?: "trainerA" | "trainerB" | "couples" }) {
  const carouselRef = useRef<HTMLDivElement>(null);
  // index: 0=trainerA, 1=couples, 2=trainerB
  const targetIndex = initialTrainer === "trainerA" ? 0 : initialTrainer === "trainerB" ? 2 : 1;
  const [activeIndex, setActiveIndex] = useState(targetIndex);

  // Scroll to the correct card on mount (rAF ensures layout is ready)
  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const carousel = carouselRef.current;
      if (!carousel) return;
      const child = carousel.children[targetIndex] as HTMLElement;
      if (!child) return;
      carousel.scrollLeft = child.offsetLeft - (carousel.offsetWidth - child.offsetWidth) / 2;
    });
    return () => cancelAnimationFrame(raf);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Track active dot on scroll
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const onScroll = () => {
      const center = carousel.scrollLeft + carousel.offsetWidth / 2;
      const children = Array.from(carousel.children) as HTMLElement[];
      let closest = 0;
      let minDist = Infinity;
      children.forEach((child, i) => {
        const childCenter = child.offsetLeft + child.offsetWidth / 2;
        const dist = Math.abs(center - childCenter);
        if (dist < minDist) { minDist = dist; closest = i; }
      });
      setActiveIndex(closest);
    };
    carousel.addEventListener("scroll", onScroll, { passive: true });
    return () => carousel.removeEventListener("scroll", onScroll);
  }, []);

  function scrollTo(index: number) {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const child = carousel.children[index] as HTMLElement;
    if (!child) return;
    carousel.scrollTo({
      left: child.offsetLeft - (carousel.offsetWidth - child.offsetWidth) / 2,
      behavior: "smooth",
    });
  }

  return (
    <>
      {/* ── MOBILE: snap carousel ── */}
      <div id="plan-cards" className="md:hidden -mx-5">
        <div
          ref={carouselRef}
          className="flex gap-3 overflow-x-auto snap-x snap-mandatory hide-scrollbar px-[9vw] pb-1"
        >

          {/* Trainer A */}
          <div className="snap-center flex-shrink-0 w-[82vw] relative flex flex-col p-6 bg-white border border-card-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border-2 border-card-border">
                <Image src={trainerA.photo} alt={trainerA.name} fill className="object-cover object-top" />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted">{brand.hero.ctaTrainerA}</p>
                <p className="font-display text-base uppercase leading-none text-foreground">{trainerA.name}</p>
              </div>
            </div>

            <p className="text-xs font-bold tracking-[0.3em] uppercase text-muted mb-1">{programA30.durationLabel}</p>
            <div className="flex items-baseline gap-1.5 mb-0.5">
              <span className="font-display text-5xl leading-none text-foreground">{programA30.priceDollars}</span>
              <span className="text-sm font-bold text-muted">{programA30.priceCents}</span>
            </div>
            <p className="text-[11px] tracking-widest uppercase text-muted mb-4">One-time · Yours to keep</p>

            <p className="text-sm font-bold text-foreground mb-1">{programA30.name}</p>
            <p className="text-xs text-muted leading-relaxed mb-4">
              {programA30.description}
            </p>

            <ul className="space-y-1.5 mb-5">
              {programA30.cardFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-muted">
                  <Check className="w-3 h-3 shrink-0 text-army" />{f}
                </li>
              ))}
            </ul>

            <div className="mt-auto">
              <BuyNowButton trainer="trainerA" tier="30" />
            </div>
          </div>

          {/* COUPLES — featured center */}
          <div className="snap-center flex-shrink-0 w-[82vw] relative flex flex-col p-6 bg-army text-white">
            <span className="absolute top-4 right-4 bg-gold text-black text-[9px] font-bold px-2 py-0.5 tracking-widest uppercase">
              Fan Favorite
            </span>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded-full bg-gold/20 border-2 border-gold/40 flex items-center justify-center shrink-0">
                <Users className="w-4 h-4 text-gold" />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold">{brand.hero.trainerALabel} &amp; {brand.hero.trainerBLabel}</p>
                <p className="font-display text-base uppercase leading-none text-white">{couplesTrainer.specialty}</p>
              </div>
            </div>

            <p className="text-xs font-bold tracking-[0.3em] uppercase text-gold mb-1">{programCouples.durationLabel}</p>
            <div className="flex items-baseline gap-1.5 mb-0.5">
              <span className="font-display text-5xl leading-none text-white">{programCouples.priceDollars}</span>
              <span className="text-sm font-bold text-white/50">{programCouples.priceCents}</span>
            </div>
            <p className="text-[11px] tracking-widest uppercase text-white/40 mb-4">One-time · Yours to keep</p>

            <p className="text-sm font-bold text-white mb-1">{programCouples.name}</p>
            <p className="text-xs text-white/70 leading-relaxed mb-4">
              {programCouples.description}
            </p>

            <ul className="space-y-1.5 mb-5">
              {programCouples.cardFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-white/80">
                  <Check className="w-3 h-3 shrink-0 text-gold" />{f}
                </li>
              ))}
            </ul>

            <div className="mt-auto">
              <BuyNowButton trainer="couples" tier="ab" popular />
            </div>
          </div>

          {/* Trainer B */}
          <div className="snap-center flex-shrink-0 w-[82vw] relative flex flex-col p-6 bg-white border border-card-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border-2 border-card-border">
                <Image src={trainerB.photo} alt={trainerB.name} fill className="object-cover object-top" />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted">{brand.hero.ctaTrainerB}</p>
                <p className="font-display text-base uppercase leading-none text-foreground">{trainerB.name}</p>
              </div>
            </div>

            <p className="text-xs font-bold tracking-[0.3em] uppercase text-muted mb-1">{programB30.durationLabel}</p>
            <div className="flex items-baseline gap-1.5 mb-0.5">
              <span className="font-display text-5xl leading-none text-foreground">{programB30.priceDollars}</span>
              <span className="text-sm font-bold text-muted">{programB30.priceCents}</span>
            </div>
            <p className="text-[11px] tracking-widest uppercase text-muted mb-4">One-time · Yours to keep</p>

            <p className="text-sm font-bold text-foreground mb-1">{programB30.name}</p>
            <p className="text-xs text-muted leading-relaxed mb-4">
              {programB30.description}
            </p>

            <ul className="space-y-1.5 mb-5">
              {programB30.cardFeatures.map((f) => (
                <li key={f} className="flex items-center gap-2 text-xs text-muted">
                  <Check className="w-3 h-3 shrink-0 text-army" />{f}
                </li>
              ))}
            </ul>

            <div className="mt-auto">
              <BuyNowButton trainer="trainerB" tier="30" />
            </div>
          </div>

        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-4">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={`rounded-full transition-all duration-200 ${
                activeIndex === i
                  ? "w-6 h-2 bg-army"
                  : "w-2 h-2 bg-card-border"
              }`}
            />
          ))}
        </div>
      </div>

      {/* ── DESKTOP: 3-col grid (unchanged) ── */}
      <div className="hidden md:grid grid-cols-3 gap-px bg-card-border border border-card-border">

        {/* Trainer A */}
        <div className="relative flex flex-col p-7 bg-white">
          <div className="flex items-center gap-3 mb-5">
            <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-card-border">
              <Image src={trainerA.photo} alt={trainerA.name} fill className="object-cover object-top" />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted">{brand.hero.ctaTrainerA}</p>
              <p className="font-display text-lg uppercase leading-none text-foreground">{trainerA.name}</p>
            </div>
          </div>

          <p className="text-xs font-bold tracking-[0.3em] uppercase text-muted mb-2">{programA30.durationLabel}</p>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-display text-6xl leading-none text-foreground">{programA30.priceDollars}</span>
            <span className="text-sm font-bold text-muted">{programA30.priceCents}</span>
          </div>
          <p className="text-xs tracking-widest uppercase text-muted mb-4">One-time · Yours to keep</p>

          <p className="text-sm font-bold text-foreground mb-1">{programA30.name}</p>
          <p className="text-sm text-muted leading-relaxed mb-5">
            {programA30.description}
          </p>

          <ul className="space-y-2 mb-6">
            {programA30.cardFeatures.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-muted">
                <Check className="w-3.5 h-3.5 shrink-0 text-army" />{f}
              </li>
            ))}
          </ul>

          <div className="mt-auto">
            <BuyNowButton trainer="trainerA" tier="30" />
          </div>
        </div>

        {/* COUPLES — featured center */}
        <div className="relative flex flex-col p-7 bg-army text-white">
          <span className="absolute top-5 right-5 bg-gold text-black text-[10px] font-bold px-2.5 py-1 tracking-widest uppercase">
            Fan Favorite
          </span>

          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-full bg-gold/20 border-2 border-gold/40 flex items-center justify-center shrink-0">
              <Users className="w-5 h-5 text-gold" />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gold">{brand.hero.trainerALabel} &amp; {brand.hero.trainerBLabel}</p>
              <p className="font-display text-lg uppercase leading-none text-white">{couplesTrainer.specialty}</p>
            </div>
          </div>

          <p className="text-xs font-bold tracking-[0.3em] uppercase text-gold mb-2">{programCouples.durationLabel}</p>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-display text-6xl leading-none text-white">{programCouples.priceDollars}</span>
            <span className="text-sm font-bold text-white/50">{programCouples.priceCents}</span>
          </div>
          <p className="text-xs tracking-widest uppercase text-white/40 mb-4">One-time · Yours to keep</p>

          <p className="text-sm font-bold text-white mb-1">{programCouples.name}</p>
          <p className="text-sm text-white/70 leading-relaxed mb-5">
            {programCouples.description}
          </p>

          <ul className="space-y-2 mb-6">
            {programCouples.cardFeatures.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-white/80">
                <Check className="w-3.5 h-3.5 shrink-0 text-gold" />{f}
              </li>
            ))}
          </ul>

          <div className="mt-auto">
            <BuyNowButton trainer="couples" tier="ab" popular />
          </div>
        </div>

        {/* Trainer B */}
        <div className="relative flex flex-col p-7 bg-white">
          <div className="flex items-center gap-3 mb-5">
            <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-card-border">
              <Image src={trainerB.photo} alt={trainerB.name} fill className="object-cover object-top" />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-muted">{brand.hero.ctaTrainerB}</p>
              <p className="font-display text-lg uppercase leading-none text-foreground">{trainerB.name}</p>
            </div>
          </div>

          <p className="text-xs font-bold tracking-[0.3em] uppercase text-muted mb-2">{programB30.durationLabel}</p>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-display text-6xl leading-none text-foreground">{programB30.priceDollars}</span>
            <span className="text-sm font-bold text-muted">{programB30.priceCents}</span>
          </div>
          <p className="text-xs tracking-widest uppercase text-muted mb-4">One-time · Yours to keep</p>

          <p className="text-sm font-bold text-foreground mb-1">{programB30.name}</p>
          <p className="text-sm text-muted leading-relaxed mb-5">
            {programB30.description}
          </p>

          <ul className="space-y-2 mb-6">
            {programB30.cardFeatures.map((f) => (
              <li key={f} className="flex items-center gap-2 text-sm text-muted">
                <Check className="w-3.5 h-3.5 shrink-0 text-army" />{f}
              </li>
            ))}
          </ul>

          <div className="mt-auto">
            <BuyNowButton trainer="trainerB" tier="30" />
          </div>
        </div>

      </div>
    </>
  );
}
