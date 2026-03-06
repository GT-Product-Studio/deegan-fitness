"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Loader2, ArrowLeft, Check, ShieldCheck, Star, Lock, Users } from "lucide-react";
import { brand, getProgramConfig, getTrainerConfig } from "@/config/brand";
import type { Trainer, Tier } from "@/lib/stripe-products";

const tA = brand.trainers.trainerA;
const tB = brand.trainers.trainerB;
const tCouples = brand.trainers.couples;

// Build plan details from config
function getPlanDetails(key: string) {
  const parts = key.split("-");
  const trainer = parts[0] as Trainer;
  const tier = parts.slice(1).join("-") as Tier;
  const program = getProgramConfig(trainer, tier);
  const trainerCfg = getTrainerConfig(trainer);
  const testimonial = brand.testimonials.checkout[key];
  if (!program || !trainerCfg) return null;

  const isCouples = trainer === "couples";

  return {
    name: program.name,
    trainer: trainerCfg.name,
    trainerHandle: trainerCfg.handle,
    photo: isCouples ? null : trainerCfg.photo,
    specialty: isCouples ? `${brand.hero.trainerALabel} & ${brand.hero.trainerBLabel} · Core` : trainerCfg.specialty,
    price: program.priceFormatted,
    priceNote: "One-time · Yours to keep",
    description: program.checkoutDescription,
    features: program.checkoutFeatures,
    quote: testimonial?.quote ?? "",
    quoteAuthor: testimonial?.name ?? "",
    quoteResult: testimonial?.result ?? "",
    isCouples,
  };
}

function CheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const trainer = (searchParams.get("trainer") || "trainerA") as Trainer;
  const tier = (searchParams.get("tier") || "30") as Tier;

  const plan = getPlanDetails(`${trainer}-${tier}`);

  function handleCheckout() {
    router.push(`/checkout/mock-payment?trainer=${trainer}&tier=${tier}`);
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted mb-4">Invalid plan selected.</p>
          <Link href="/#plans" className="text-army hover:underline font-bold text-sm uppercase tracking-widest">
            View Programs
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Top bar */}
      <header className="border-b border-card-border bg-white px-6 h-14 flex items-center justify-between shrink-0" style={{ paddingTop: "env(safe-area-inset-top)", height: "calc(3.5rem + env(safe-area-inset-top))" }}>
        <Link href="/" className="font-display text-2xl tracking-widest">
          {brand.nav.logoPrefix} <span className="text-gold">{brand.nav.logoAccent}</span>
        </Link>
        <div className="flex items-center gap-2 text-muted text-xs font-bold tracking-widest uppercase">
          <Lock className="w-3.5 h-3.5 text-army" />
          Secure Checkout
        </div>
      </header>

      {/* Back link */}
      <div className="px-6 py-4 border-b border-card-border bg-card">
        <Link href="/#plans" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition font-bold tracking-widest uppercase">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Programs
        </Link>
      </div>

      {/* Split layout */}
      <div className="flex-1 grid lg:grid-cols-2">

        {/* ── LEFT: Trainer + plan details ── */}
        <div className="border-r border-card-border flex flex-col">

          {/* Trainer photo / couples hero */}
          {plan.isCouples ? (
            <div className="relative h-72 lg:h-96 overflow-hidden bg-army flex items-center justify-center">
              <div className="relative z-10 text-center">
                <div className="w-16 h-16 rounded-full bg-gold/20 border-2 border-gold/40 flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-gold" />
                </div>
                <p className="text-gold text-[10px] font-bold tracking-[0.3em] uppercase mb-2">{plan.specialty}</p>
                <h2 className="font-display text-4xl md:text-5xl text-white uppercase leading-none">{plan.name}</h2>
                <p className="text-white/50 text-xs mt-2 tracking-widest">{plan.trainerHandle}</p>
              </div>
              {/* subtle bg texture */}
              <div className="absolute inset-0 bg-gradient-to-br from-army via-army to-black/60" />
            </div>
          ) : (
            <div className="relative h-72 lg:h-96 overflow-hidden">
              <Image
                src={plan.photo!}
                alt={plan.trainer}
                fill
                className="object-cover object-top"
                quality={100}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 p-8">
                <p className="text-gold text-[10px] font-bold tracking-[0.3em] uppercase mb-1">{plan.specialty}</p>
                <h2 className="font-display text-5xl text-white uppercase leading-none">{plan.trainer}</h2>
                <p className="text-white/50 text-xs mt-1 tracking-widest">{plan.trainerHandle}</p>
              </div>
            </div>
          )}

          {/* Plan name + description */}
          <div className="p-8 border-b border-card-border">
            <p className="text-gold text-[10px] font-bold tracking-[0.3em] uppercase mb-2">Your Program</p>
            <h3 className="font-display text-4xl uppercase leading-none mb-3">{plan.name}</h3>
            <p className="text-muted text-sm leading-relaxed">{plan.description}</p>
          </div>

          {/* Features */}
          <div className="p-8 border-b border-card-border">
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-5">What&apos;s Included</p>
            <ul className="space-y-3">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-muted">
                  <Check className="w-4 h-4 text-army shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Testimonial */}
          <div className="p-8 bg-card flex-1">
            <div className="flex gap-0.5 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />)}
            </div>
            <p className="text-sm leading-relaxed text-foreground mb-4">&ldquo;{plan.quote}&rdquo;</p>
            <p className="text-xs font-bold uppercase tracking-widest">{plan.quoteAuthor}</p>
            <p className="text-muted text-xs mt-0.5">{plan.quoteResult}</p>
          </div>

        </div>

        {/* ── RIGHT: Order summary + CTA ── */}
        <div className="flex flex-col p-8 lg:p-12 bg-white">
          <div className="max-w-md w-full mx-auto flex flex-col gap-8">

            {/* Order summary */}
            <div>
              <p className="text-xs font-bold tracking-[0.3em] uppercase mb-6">Order Summary</p>
              <div className="border border-card-border p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-sm">{plan.name}</p>
                    <p className="text-muted text-xs mt-0.5">{plan.trainer}</p>
                  </div>
                  <p className="font-bold text-sm">{plan.price}</p>
                </div>
                <div className="border-t border-card-border pt-4 flex justify-between items-center">
                  <p className="text-xs font-bold tracking-widest uppercase">Total</p>
                  <div className="text-right">
                    <p className="text-3xl font-bold">{plan.price}</p>
                    <p className="text-muted text-xs mt-0.5">{plan.priceNote}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="space-y-4">
              <button
                onClick={handleCheckout}
                className="w-full bg-army text-white py-5 text-sm font-bold tracking-widest uppercase hover:bg-army-light transition flex items-center justify-center gap-2"
              >
                Continue to Payment →
              </button>
              <div className="flex items-center justify-center gap-2 text-muted">
                <ShieldCheck className="w-4 h-4 text-army shrink-0" />
                <p className="text-xs">Secure checkout · 256-bit SSL encryption</p>
              </div>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-4 pt-2">
              {[
                { icon: ShieldCheck, label: "Secure", sub: "Stripe payments" },
                { icon: Lock, label: "Private", sub: "Your data is safe" },
                { icon: Check, label: "Guaranteed", sub: "Yours to keep" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="text-center p-4 border border-card-border">
                  <Icon className="w-5 h-5 text-army mx-auto mb-2" />
                  <p className="text-xs font-bold uppercase tracking-widest">{label}</p>
                  <p className="text-muted text-[10px] mt-0.5">{sub}</p>
                </div>
              ))}
            </div>

            <p className="text-muted text-xs text-center leading-relaxed">
              By completing your purchase you agree to our{" "}
              <Link href="/terms" className="underline hover:text-foreground transition">Terms of Service</Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline hover:text-foreground transition">Privacy Policy</Link>.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-army" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
