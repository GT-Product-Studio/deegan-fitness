import Link from "next/link";
import Image from "next/image";
import { Star, ChevronRight, Instagram } from "lucide-react";
import { UnifiedPlanSection } from "@/app/components/unified-plan-section";
import { createClient } from "@/lib/supabase/server";
import { brand } from "@/config/brand";

const tA = brand.trainers.trainerA;
const tB = brand.trainers.trainerB;

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ t?: string }>;
}) {
  const { t } = await searchParams;
  const initialTrainer: "trainerA" | "trainerB" | "couples" =
    t === "trainerB" ? "trainerB" : t === "couples" ? "couples" : "trainerA";

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <>
      <main className="min-h-screen bg-background text-foreground pb-20 md:pb-0">

        {/* ── NAV ── */}
        <nav className="sticky top-0 z-50 bg-[#0d0d0d] border-b border-white/10" style={{ paddingTop: "env(safe-area-inset-top)" }}>
          <div className="max-w-7xl mx-auto px-5 md:px-6 h-14 md:h-16 flex items-center justify-between gap-4">
            <Link href="/" className="shrink-0">
              <span className="font-display text-2xl md:text-3xl tracking-widest text-white">
                {brand.nav.logoPrefix} <span className="text-gold">{brand.nav.logoAccent}</span>
              </span>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              {[
                { label: "Plans", href: "#plans" },
                { label: "Trainers", href: "#trainers" },
                { label: "Results", href: "#results" },
              ].map(({ label, href }) => (
                <Link key={label} href={href} className="text-xs font-bold tracking-widest uppercase text-white/60 hover:text-white transition">
                  {label}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-3">
              {user ? (
                <Link href="/dashboard" className="text-xs font-bold tracking-widest uppercase text-white/50 hover:text-white transition">
                  Dashboard
                </Link>
              ) : (
                <Link href="/login" className="text-xs font-bold tracking-widest uppercase text-white/50 hover:text-white transition">
                  Log In
                </Link>
              )}
              <Link href="#plans" className="hidden md:block bg-army text-white px-5 py-2.5 text-xs font-bold tracking-widest uppercase hover:bg-army-light transition">
                Get Started
              </Link>
            </div>
          </div>
        </nav>

        {/* ── HERO — always 50/50 side by side ── */}
        <section className="relative flex flex-row w-full h-[62svh] md:h-[92svh]">

          {/* Full-height centre divider */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20 z-10 pointer-events-none" />

          {/* Trainer A */}
          <div className="relative overflow-hidden group flex-1">
            <Image
              src={tA.photo}
              alt={tA.name}
              fill
              priority
              quality={95}
              sizes="50vw"
              className="object-cover object-top group-hover:scale-105 transition duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
            <div className="absolute top-4 left-4 md:top-8 md:left-8">
              <span className="text-white/25 font-display text-3xl md:text-6xl uppercase tracking-widest leading-none">{brand.hero.trainerALabel}</span>
            </div>
            <div className="absolute bottom-0 left-0 p-4 md:p-12">
              <p className="hidden md:block text-gold text-[10px] font-bold tracking-[0.3em] uppercase mb-2">{tA.specialty}</p>
              <h2 className="font-display text-[clamp(1.6rem,5vw,5rem)] text-white uppercase leading-none">{tA.firstName}<br />{tA.name.replace(tA.firstName, "").trim()}</h2>
              <Link
                href="/?t=trainerA#plans"
                className="mt-3 md:mt-6 inline-flex items-center gap-2 bg-white text-foreground px-4 md:px-7 py-2.5 md:py-3.5 text-[10px] md:text-xs font-bold tracking-widest uppercase hover:bg-gold hover:text-white transition"
              >
                {brand.hero.ctaTrainerA} <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>

          {/* Centre badge */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
            <div className="bg-black/50 backdrop-blur-md border border-white/20 px-4 py-3 md:px-6 md:py-4 text-center">
              <p className="font-display text-white text-base md:text-2xl tracking-[0.4em] uppercase leading-none">{brand.hero.centerBadgeTop}</p>
              <p className="text-white/50 text-[8px] md:text-[10px] tracking-[0.25em] uppercase mt-0.5">{brand.hero.centerBadgeBottom}</p>
            </div>
          </div>

          {/* Trainer B */}
          <div className="relative overflow-hidden group flex-1">
            <Image
              src={tB.photo}
              alt={tB.name}
              fill
              priority
              quality={95}
              sizes="50vw"
              className="object-cover object-top group-hover:scale-105 transition duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10" />
            <div className="absolute top-4 right-4 md:top-8 md:right-8">
              <span className="text-white/25 font-display text-3xl md:text-6xl uppercase tracking-widest leading-none">{brand.hero.trainerBLabel}</span>
            </div>
            <div className="absolute bottom-0 left-0 p-4 md:p-12">
              <p className="hidden md:block text-gold text-[10px] font-bold tracking-[0.3em] uppercase mb-2">{tB.specialty}</p>
              <h2 className="font-display text-[clamp(1.6rem,5vw,5rem)] text-white uppercase leading-none">{tB.firstName}<br />{tB.name.replace(tB.firstName, "").trim()}</h2>
              <Link
                href="/?t=trainerB#plans"
                className="mt-3 md:mt-6 inline-flex items-center gap-2 bg-white text-foreground px-4 md:px-7 py-2.5 md:py-3.5 text-[10px] md:text-xs font-bold tracking-widest uppercase hover:bg-gold hover:text-white transition"
              >
                {brand.hero.ctaTrainerB} <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIAL STRIP ── */}
        <section className="border-b border-card-border bg-white">
          <div className="max-w-5xl mx-auto px-5 md:px-6 py-12 md:py-14 flex flex-col md:flex-row items-center gap-6 md:gap-8">
            <div className="flex-1 text-center md:text-left">
              <p className="text-base md:text-xl font-semibold leading-snug text-foreground max-w-md">
                &ldquo;{brand.hero.featuredQuote}&rdquo;
              </p>
            </div>
            <div className="hidden md:block w-px h-20 bg-card-border" />
            <div className="text-center md:text-left">
              <div className="flex gap-1 justify-center md:justify-start mb-2">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-gold text-gold" />)}
              </div>
              <p className="font-bold text-sm tracking-wide uppercase">{brand.hero.featuredQuoteAuthor}</p>
              <p className="text-muted text-xs tracking-widest uppercase mt-0.5">{brand.hero.featuredQuoteProgram}</p>
            </div>
          </div>
        </section>

        {/* ── UNIFIED PLAN SECTION ── */}
        <UnifiedPlanSection
          initialTrainer={initialTrainer}
          defaultTab={t ? "programs" : "membership"}
        />

        {/* ── TRAINING REELS ── */}
        <section className="py-14 md:py-16 bg-card border-b border-card-border">
          <div className="max-w-7xl mx-auto px-5 md:px-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-foreground">Training Reels</h2>
              <div className="flex items-center gap-1.5 text-muted text-xs tracking-widest uppercase font-bold">
                <Instagram className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{brand.social.instagramHandle}</span>
              </div>
            </div>
            {/* Horizontal scroll on mobile, 3-col on desktop */}
            <div className="flex gap-3 overflow-x-auto md:grid md:grid-cols-3 md:overflow-visible pb-2 md:pb-0 -mx-5 md:mx-0 px-5 md:px-0 snap-x snap-mandatory">
              {brand.reels.map(({ src, specialty, name }) => (
                <div key={name} className="relative flex-shrink-0 w-52 md:w-auto h-80 md:h-auto md:aspect-[9/16] overflow-hidden bg-foreground snap-start">
                  <video
                    src={src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="none"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-0 left-0 p-4 md:p-5">
                    <p className="text-gold text-[10px] font-bold tracking-[0.3em] uppercase mb-0.5">{specialty}</p>
                    <p className="font-display text-2xl md:text-3xl text-white uppercase leading-none">{name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TRAINERS ── */}
        <section id="trainers" className="px-5 md:px-6 py-16 md:py-20 bg-card border-b border-card-border scroll-mt-14">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-foreground mb-8">Your Trainers</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="group border border-card-border overflow-hidden">
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Image src={tA.bioPhoto ?? tA.photo} alt={tA.name} fill className="object-cover object-[50%_58%] group-hover:scale-105 transition duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 md:p-8">
                    <p className="text-gold text-xs font-bold tracking-[0.3em] uppercase mb-1">{tA.specialty}</p>
                    <h3 className="font-display text-4xl md:text-5xl text-white uppercase leading-none">{tA.name}</h3>
                  </div>
                </div>
                <div className="bg-white p-6 md:p-8">
                  <p className="text-sm text-muted leading-relaxed mb-5">{tA.bio}</p>
                  <Link href="/?t=trainerA#plans" className="inline-flex items-center gap-1 text-xs font-bold tracking-widest uppercase text-army hover:text-army-light transition">
                    {brand.hero.ctaTrainerA} <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
              <div className="group border border-card-border overflow-hidden">
                <div className="relative aspect-[3/2] overflow-hidden">
                  <Image src={tB.bioPhoto ?? tB.photo} alt={tB.name} fill className="object-cover object-top group-hover:scale-105 transition duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6 md:p-8">
                    <p className="text-gold text-xs font-bold tracking-[0.3em] uppercase mb-1">{tB.specialty}</p>
                    <h3 className="font-display text-4xl md:text-5xl text-white uppercase leading-none">{tB.name}</h3>
                  </div>
                </div>
                <div className="bg-white p-6 md:p-8">
                  <p className="text-sm text-muted leading-relaxed mb-5">{tB.bio}</p>
                  <Link href="/?t=trainerB#plans" className="inline-flex items-center gap-1 text-xs font-bold tracking-widest uppercase text-army hover:text-army-light transition">
                    {brand.hero.ctaTrainerB} <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section id="results" className="px-5 md:px-6 py-16 md:py-20 scroll-mt-14">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-sm font-bold tracking-[0.3em] uppercase text-foreground mb-8">Real Results</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {brand.testimonials.landing.map(({ quote, name, result, program }) => (
                <div key={name} className="border border-card-border p-7 md:p-8 bg-white">
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-gold text-gold" />)}
                  </div>
                  <p className="text-foreground/80 text-sm leading-relaxed mb-6">&ldquo;{quote}&rdquo;</p>
                  <div className="border-t border-card-border pt-5">
                    <p className="font-bold text-xs tracking-widest uppercase">{name}</p>
                    <p className="text-gold text-xs tracking-widest uppercase mt-1">{result}</p>
                    <p className="text-muted text-xs mt-1">{program}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FINAL CTA ── */}
        <section className="border-t border-card-border px-5 md:px-6 py-20 md:py-24 text-center bg-white">
          <h2 className="font-display text-[clamp(2.5rem,8vw,6rem)] uppercase leading-none">
            Ready to Start?
          </h2>
          <p className="mt-4 text-muted text-sm max-w-md mx-auto leading-relaxed">
            Pick your trainer, choose your challenge, and transform.
          </p>
          <Link href="#plans" className="mt-8 inline-block bg-army text-white px-10 py-4 text-xs font-bold tracking-widest uppercase hover:bg-army-light transition">
            Browse Programs
          </Link>
        </section>



      </main>

    </>
  );
}
