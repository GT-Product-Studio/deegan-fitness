"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Heart, Bike, Dumbbell, Timer, ArrowRight, Instagram, ExternalLink } from "lucide-react";
import { brand, type TrainingLevelId } from "@/config/brand";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0, 0, 0.2, 1] as const } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

export default function Home() {
  const [selectedLevel, setSelectedLevel] = useState<TrainingLevelId>("factory");
  const level = brand.levels[selectedLevel];

  return (
    <main className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5" style={{ paddingTop: "env(safe-area-inset-top)" }}>
        <div className="max-w-7xl mx-auto px-5 md:px-8 h-14 md:h-16 flex items-center justify-between">
          <Link href="/" className="shrink-0">
            <span className="font-display text-xl md:text-2xl font-bold tracking-wider text-white uppercase">
              {brand.nav.logoPrefix} <span className="text-primary">{brand.nav.logoAccent}</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: "Regiment", href: "#regiment" },
              { label: "Training", href: "#pillars" },
              { label: "About", href: "#about" },
            ].map(({ label, href }) => (
              <Link key={label} href={href} className="text-xs font-semibold tracking-widest uppercase text-white/50 hover:text-white transition">
                {label}
              </Link>
            ))}
          </div>
          <Link
            href="/checkout"
            className="bg-primary text-black px-5 py-2.5 text-xs font-bold tracking-widest uppercase hover:bg-primary-dark transition"
          >
            Subscribe
          </Link>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative h-[100svh] flex items-end">
        <Image
          src={brand.hero.heroImage}
          alt="Haiden Deegan mid-air whip"
          fill
          priority
          quality={100}
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-8 pb-16 md:pb-24 w-full">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
          >
            <motion.p variants={fadeUp} className="text-primary text-xs md:text-sm font-bold tracking-[0.3em] uppercase mb-4">
              {brand.trainer.team}
            </motion.p>
            <motion.h1 variants={fadeUp} className="font-display text-[clamp(3.5rem,12vw,9rem)] font-bold uppercase leading-[0.9] tracking-tight">
              {brand.hero.headline}
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-4 md:mt-6 text-white/70 text-base md:text-xl max-w-lg leading-relaxed">
              {brand.hero.subheadline}
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8 flex flex-col sm:flex-row items-start gap-4">
              <Link
                href="/checkout"
                className="bg-primary text-black px-8 py-4 text-sm font-bold tracking-widest uppercase hover:bg-primary-dark transition pulse-glow"
              >
                {brand.hero.ctaLabel}
              </Link>
              <Link
                href="#regiment"
                className="flex items-center gap-2 text-white/50 hover:text-white text-sm font-semibold tracking-widest uppercase transition group"
              >
                {brand.hero.ctaSecondaryLabel}
                <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <ChevronDown className="w-6 h-6 text-white/30" />
          </motion.div>
        </div>
      </section>

      {/* ── PROOF BAR ── */}
      <section className="border-y border-white/10 bg-card">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {brand.stats.map(({ value, label }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="py-6 md:py-8 px-4 md:px-8 text-center"
              >
                <p className="font-display text-3xl md:text-4xl font-bold text-primary">{value}</p>
                <p className="text-xs md:text-sm text-muted tracking-widest uppercase mt-1">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED QUOTE ── */}
      <section className="py-16 md:py-20 border-b border-white/5">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-5 md:px-8 text-center"
        >
          <p className="font-display text-2xl md:text-4xl font-medium uppercase leading-snug text-white/90">
            &ldquo;{brand.hero.featuredQuote}&rdquo;
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <div className="w-px h-6 bg-primary" />
            <p className="text-primary text-xs font-bold tracking-[0.3em] uppercase">{brand.hero.featuredQuoteAuthor}</p>
          </div>
        </motion.div>
      </section>

      {/* ── THE REGIMENT ── */}
      <section id="regiment" className="py-16 md:py-24 scroll-mt-16 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.p variants={fadeUp} className="text-primary text-xs font-bold tracking-[0.3em] uppercase mb-3">
              Weekly Structure
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-display text-4xl md:text-6xl font-bold uppercase leading-none mb-4">
              The Regiment
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted text-sm md:text-base max-w-lg mb-10 leading-relaxed">
              Mon-Wed: full send. Thu-Fri: travel or train. Saturday: race day. Sunday: recover.
              Every week follows this structure. Choose your intensity.
            </motion.p>
          </motion.div>

          {/* Level selector */}
          <div className="flex gap-2 mb-8">
            {(Object.values(brand.levels) as typeof brand.levels[TrainingLevelId][]).map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => setSelectedLevel(lvl.id)}
                className={`px-4 py-2.5 text-xs font-bold tracking-widest uppercase transition border ${
                  selectedLevel === lvl.id
                    ? "bg-primary text-black border-primary"
                    : "bg-transparent text-muted border-white/10 hover:border-white/30 hover:text-white"
                }`}
              >
                {lvl.emoji} {lvl.name}
              </button>
            ))}
          </div>

          {/* Level description */}
          <p className="text-muted text-sm mb-6 max-w-md">{level.description}</p>

          {/* Weekly grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2">
            {brand.weekSchedule.map((day) => {
              const isTraining = day.type === "training";
              const isRace = day.type === "race";
              const isRecovery = day.type === "recovery";

              return (
                <motion.div
                  key={day.day}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`p-4 border transition-all ${
                    isRace
                      ? "border-zone-redline/40 bg-zone-redline/5"
                      : isTraining
                      ? "border-primary/30 bg-primary/5"
                      : isRecovery
                      ? "border-white/5 bg-card"
                      : "border-white/5 bg-card/50"
                  }`}
                >
                  <p className="text-xs text-muted-dark font-semibold tracking-wider uppercase mb-1">
                    {day.day.slice(0, 3)}
                  </p>
                  <p className={`font-display text-sm font-bold uppercase leading-tight mb-2 ${
                    isRace ? "text-zone-redline" : isTraining ? "text-primary" : "text-muted"
                  }`}>
                    {day.label}
                  </p>
                  {isTraining && (
                    <div className="space-y-1 text-[11px] text-muted">
                      <p>{level.cyclingMiles}mi ride</p>
                      <p>{level.motoHours}hr moto</p>
                      <p>{level.gymHours}hr gym</p>
                    </div>
                  )}
                  {!isTraining && (
                    <p className="text-[11px] text-muted-dark leading-snug">{day.description}</p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── THREE PILLARS ── */}
      <section id="pillars" className="py-16 md:py-24 scroll-mt-16 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.p variants={fadeUp} className="text-primary text-xs font-bold tracking-[0.3em] uppercase mb-3">
              Training Pillars
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-display text-4xl md:text-6xl font-bold uppercase leading-none mb-12">
              Three Pillars. Every Day.
            </motion.h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: Bike,
                title: "Road Cycling",
                stat: `${brand.benchmarks.dailyCyclingMiles} miles`,
                desc: "50 miles before most people wake up. Zone 2-3 endurance base that builds the aerobic engine a moto racer needs.",
                zones: "HR Zone 2-3",
                image: "/images/deegan/deegan-5.jpg",
              },
              {
                icon: Timer,
                title: "Moto Practice",
                stat: `${brand.benchmarks.dailyMotoHours} hours`,
                desc: "2 hours on the track, every day. Sport-specific training at race pace. This is where the heart rate spikes.",
                zones: "HR Zone 3-5",
                image: "/images/deegan/deegan-sx-3.jpg",
              },
              {
                icon: Dumbbell,
                title: "Gym",
                stat: `${brand.benchmarks.dailyGymHours} hours`,
                desc: "1.5 hours of strength and conditioning. Upper body, core, legs. The physical armor for 30+ minute motos.",
                zones: "HR Zone 2-4",
                image: "/images/deegan/deegan-1.jpg",
              },
            ].map(({ icon: Icon, title, stat, desc, zones, image }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group border border-white/10 bg-card overflow-hidden hover:border-primary/30 transition-colors"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={image}
                    alt={title}
                    fill
                    quality={100}
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-5 h-5 text-primary" />
                      <span className="font-display text-xl font-bold uppercase text-white">{title}</span>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-baseline justify-between mb-3">
                    <span className="font-display text-3xl font-bold text-primary">{stat}</span>
                    <span className="text-xs text-muted tracking-widest uppercase">{zones}</span>
                  </div>
                  <p className="text-sm text-muted leading-relaxed">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HR ZONES ── */}
      <section className="py-16 md:py-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.p variants={fadeUp} className="text-primary text-xs font-bold tracking-[0.3em] uppercase mb-3">
              Heart Rate Training
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-display text-4xl md:text-6xl font-bold uppercase leading-none mb-4">
              Know Your Zones
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted text-sm max-w-lg mb-10 leading-relaxed">
              Every workout has a target heart rate zone. Train in the right zone and you train like a champion.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Zone bars */}
            <div className="space-y-3">
              {brand.hrZones.map((zone) => (
                <motion.div
                  key={zone.zone}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4 group"
                >
                  <div
                    className="w-12 h-12 flex items-center justify-center font-display text-2xl font-bold text-black shrink-0"
                    style={{ backgroundColor: zone.color }}
                  >
                    {zone.zone}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline justify-between mb-1">
                      <span className="font-bold text-sm text-white">{zone.name}</span>
                      <span className="text-xs text-muted">{zone.minPct}-{zone.maxPct}% max HR</span>
                    </div>
                    <div className="h-2 bg-white/5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${zone.maxPct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: zone.zone * 0.1 }}
                        className="h-full"
                        style={{ backgroundColor: zone.color }}
                      />
                    </div>
                    <p className="text-xs text-muted-dark mt-1">{zone.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Peak HR callout */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="border border-white/10 bg-card p-8 text-center"
            >
              <Heart className="w-8 h-8 text-zone-redline mx-auto mb-4" />
              <p className="font-display text-7xl md:text-8xl font-bold text-white leading-none">
                {brand.benchmarks.peakHR}
              </p>
              <p className="text-xs text-muted tracking-widest uppercase mt-2 mb-6">Avg Peak BPM</p>
              <div className="h-px bg-white/10 mb-6" />
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <p className="font-display text-2xl font-bold text-zone-endurance">{brand.benchmarks.avgRideHR}</p>
                  <p className="text-[10px] text-muted tracking-wider uppercase mt-0.5">Ride Avg</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-zone-threshold">{brand.benchmarks.avgMotoHR}</p>
                  <p className="text-[10px] text-muted tracking-wider uppercase mt-0.5">Moto Avg</p>
                </div>
                <div>
                  <p className="font-display text-2xl font-bold text-zone-tempo">{brand.benchmarks.avgGymHR}</p>
                  <p className="text-[10px] text-muted tracking-wider uppercase mt-0.5">Gym Avg</p>
                </div>
              </div>
              <div className="h-px bg-white/10 my-6" />
              <p className="text-xs text-muted">
                Resting HR: <span className="text-white font-bold">{brand.benchmarks.restingHR} BPM</span>
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── ABOUT HAIDEN ── */}
      <section id="about" className="py-16 md:py-24 scroll-mt-16 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-[3/4] overflow-hidden"
            >
              <Image
                src={brand.trainer.photo}
                alt={brand.trainer.name}
                fill
                quality={100}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <p className="text-primary text-xs font-bold tracking-[0.3em] uppercase">{brand.trainer.team}</p>
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={stagger}
            >
              <motion.p variants={fadeUp} className="text-primary text-xs font-bold tracking-[0.3em] uppercase mb-3">
                About
              </motion.p>
              <motion.h2 variants={fadeUp} className="font-display text-4xl md:text-5xl font-bold uppercase leading-none mb-6">
                {brand.trainer.name}
              </motion.h2>
              <motion.p variants={fadeUp} className="text-muted text-sm leading-relaxed mb-6">
                {brand.trainer.bio}
              </motion.p>
              <motion.div variants={fadeUp} className="space-y-2 mb-8">
                {brand.trainer.titles.map((title) => (
                  <div key={title} className="flex items-center gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                    <span className="text-sm text-white font-semibold">{title}</span>
                  </div>
                ))}
              </motion.div>
              <motion.div variants={fadeUp} className="flex items-center gap-4 text-xs text-muted">
                <span>{brand.trainer.age} years old</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>{brand.trainer.hometown}</span>
                <span className="w-1 h-1 rounded-full bg-white/20" />
                <span>{brand.social.instagramHandle}</span>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── BENCHMARK PREVIEW ── */}
      <section className="py-16 md:py-24 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-5 md:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.p variants={fadeUp} className="text-primary text-xs font-bold tracking-[0.3em] uppercase mb-3">
              Benchmark
            </motion.p>
            <motion.h2 variants={fadeUp} className="font-display text-4xl md:text-6xl font-bold uppercase leading-none mb-4">
              Race The Champ
            </motion.h2>
            <motion.p variants={fadeUp} className="text-muted text-sm max-w-lg mb-10 leading-relaxed">
              Connect your Garmin or Polar to see how your week stacks up against Haiden&apos;s. Real data. Real comparison.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="border border-white/10 bg-card overflow-hidden"
          >
            <div className="p-6 md:p-8 border-b border-white/10 flex items-center justify-between">
              <p className="font-display text-lg font-bold uppercase text-white">Your Week vs. Haiden&apos;s Week</p>
              <span className="text-xs text-muted tracking-widest uppercase hidden sm:block">Weekly Comparison</span>
            </div>
            <div className="grid grid-cols-3 divide-x divide-white/10">
              {[
                { label: "Cycling Miles", you: "0", haiden: `${brand.benchmarks.weeklyMiles}` },
                { label: "Moto Hours", you: "0", haiden: `${brand.benchmarks.dailyMotoHours * 3}` },
                { label: "Gym Hours", you: "0", haiden: `${brand.benchmarks.dailyGymHours * 3}` },
              ].map(({ label, you, haiden }) => (
                <div key={label} className="p-5 md:p-6">
                  <p className="text-[10px] md:text-xs text-muted tracking-widest uppercase mb-4">{label}</p>
                  <div className="flex items-end justify-between gap-3">
                    <div className="text-center flex-1">
                      <p className="font-display text-2xl md:text-3xl font-bold text-white/30">{you}</p>
                      <p className="text-[10px] text-muted-dark mt-1">You</p>
                    </div>
                    <div className="text-center flex-1">
                      <p className="font-display text-2xl md:text-3xl font-bold text-primary">{haiden}</p>
                      <p className="text-[10px] text-primary/60 mt-1">Haiden</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-6 md:p-8 border-t border-white/10 bg-card-elevated flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted">Connect your Garmin or Polar to race the champ</p>
              <div className="flex items-center gap-6 text-xs text-muted tracking-widest uppercase">
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  Garmin
                </span>
                <span className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  Polar
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <Image
          src="/images/deegan/deegan-1.jpg"
          alt="Haiden Deegan"
          fill
          quality={100}
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/75" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/30" />

        <div className="relative z-10 max-w-4xl mx-auto px-5 md:px-8 text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2 variants={fadeUp} className="font-display text-[clamp(2.5rem,8vw,6rem)] font-bold uppercase leading-[0.9]">
              The Regiment Is The Edge
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-6 text-white/60 text-sm md:text-base">
              {brand.subscription.priceFormatted}/mo &middot; All levels &middot; Cancel anytime
            </motion.p>
            <motion.div variants={fadeUp} className="mt-8">
              <Link
                href="/checkout"
                className="inline-flex items-center gap-3 bg-primary text-black px-10 py-5 text-sm font-bold tracking-widest uppercase hover:bg-primary-dark transition pulse-glow"
              >
                Start Training <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/5 bg-background">
        <div className="max-w-7xl mx-auto px-5 md:px-8 py-10 md:py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <span className="font-display text-lg font-bold tracking-wider uppercase text-white">
                {brand.nav.logoPrefix} <span className="text-primary">{brand.nav.logoAccent}</span>
              </span>
            </div>

            <div className="flex items-center gap-6">
              <a
                href={`https://instagram.com/${brand.social.instagramHandle.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-white transition"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={`https://tiktok.com/${brand.social.tiktokHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-white transition"
                aria-label="TikTok"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
              <a
                href={`https://youtube.com/${brand.social.youtubeHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted hover:text-white transition"
                aria-label="YouTube"
              >
                <ExternalLink className="w-5 h-5" />
              </a>
            </div>

            <div className="flex items-center gap-6 text-xs text-muted">
              <Link href="/terms" className="hover:text-white transition">Terms</Link>
              <Link href="/privacy" className="hover:text-white transition">Privacy</Link>
              <Link href="/login" className="hover:text-white transition">Log In</Link>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-xs text-muted-dark">
              &copy; {new Date().getFullYear()} {brand.legal.entityName}. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </main>
  );
}
