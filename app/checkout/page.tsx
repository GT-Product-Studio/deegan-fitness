"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Check, ShieldCheck, Lock, ArrowLeft, Loader2 } from "lucide-react";
import { brand } from "@/config/brand";

export default function CheckoutPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const sub = brand.subscription;

  async function handleCheckout() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planType: "subscription" }),
      });
      const data = await res.json();
      if (data.url) router.push(data.url);
      else setLoading(false);
    } catch {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">

      {/* Top bar */}
      <header className="border-b border-white/10 bg-card px-6 h-14 flex items-center justify-between shrink-0" style={{ paddingTop: "env(safe-area-inset-top)", height: "calc(3.5rem + env(safe-area-inset-top))" }}>
        <Link href="/" className="font-display text-xl font-bold tracking-wider uppercase">
          {brand.nav.logoPrefix} <span className="text-primary">{brand.nav.logoAccent}</span>
        </Link>
        <div className="flex items-center gap-2 text-muted text-xs font-bold tracking-widest uppercase">
          <Lock className="w-3.5 h-3.5 text-primary" />
          Secure Checkout
        </div>
      </header>

      {/* Back link */}
      <div className="px-6 py-4 border-b border-white/10 bg-card-elevated">
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-white transition font-bold tracking-widest uppercase">
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </Link>
      </div>

      {/* Split layout */}
      <div className="flex-1 grid lg:grid-cols-2">

        {/* LEFT: Program info */}
        <div className="border-r border-white/10 flex flex-col">
          <div className="relative h-64 lg:h-80 overflow-hidden">
            <Image
              src={brand.trainer.heroPhoto}
              alt={brand.trainer.name}
              fill
              quality={100}
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
            <div className="absolute bottom-0 left-0 p-8">
              <p className="text-primary text-[10px] font-bold tracking-[0.3em] uppercase mb-1">{brand.trainer.specialty}</p>
              <h2 className="font-display text-4xl font-bold text-white uppercase leading-none">{brand.trainer.name}</h2>
            </div>
          </div>

          <div className="p-8 border-b border-white/10">
            <p className="text-primary text-[10px] font-bold tracking-[0.3em] uppercase mb-2">Your Subscription</p>
            <h3 className="font-display text-3xl font-bold uppercase leading-none mb-3">{sub.displayName}</h3>
            <p className="text-muted text-sm leading-relaxed">{sub.description}</p>
          </div>

          <div className="p-8 border-b border-white/10">
            <p className="text-xs font-bold tracking-[0.3em] uppercase mb-5 text-white">What&apos;s Included</p>
            <ul className="space-y-3">
              {sub.features.map((f) => (
                <li key={f} className="flex items-center gap-3 text-sm text-muted">
                  <Check className="w-4 h-4 text-primary shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-8 bg-card flex-1">
            <p className="text-sm text-muted italic leading-relaxed">
              &ldquo;{brand.trainer.quotes[0]}&rdquo;
            </p>
            <p className="text-xs text-primary font-bold tracking-widest uppercase mt-3">{brand.trainer.name}</p>
          </div>
        </div>

        {/* RIGHT: Order summary + CTA */}
        <div className="flex flex-col p-8 lg:p-12 bg-card-elevated">
          <div className="max-w-md w-full mx-auto flex flex-col gap-8">

            <div>
              <p className="text-xs font-bold tracking-[0.3em] uppercase mb-6 text-white">Order Summary</p>
              <div className="border border-white/10 p-6 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-sm text-white">{sub.displayName}</p>
                    <p className="text-muted text-xs mt-0.5">Monthly subscription</p>
                  </div>
                  <p className="font-bold text-sm text-white">{sub.priceFormatted}/mo</p>
                </div>
                <div className="border-t border-white/10 pt-4 flex justify-between items-center">
                  <p className="text-xs font-bold tracking-widest uppercase text-white">Total</p>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-white">
                      {sub.priceDollars}<span className="text-lg text-muted">{sub.priceCents}</span>
                    </p>
                    <p className="text-muted text-xs mt-0.5">per month &middot; cancel anytime</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full bg-primary text-black py-5 text-sm font-bold tracking-widest uppercase hover:bg-primary-dark transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Start Training Now"
                )}
              </button>
              <div className="flex items-center justify-center gap-2 text-muted">
                <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
                <p className="text-xs">Secure checkout &middot; 256-bit SSL encryption</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2">
              {[
                { icon: ShieldCheck, label: "Secure", sub: "Stripe payments" },
                { icon: Lock, label: "Private", sub: "Your data is safe" },
                { icon: Check, label: "Flexible", sub: "Cancel anytime" },
              ].map(({ icon: Icon, label, sub: subText }) => (
                <div key={label} className="text-center p-4 border border-white/10">
                  <Icon className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-xs font-bold uppercase tracking-widest text-white">{label}</p>
                  <p className="text-muted text-[10px] mt-0.5">{subText}</p>
                </div>
              ))}
            </div>

            <p className="text-muted text-xs text-center leading-relaxed">
              By subscribing you agree to our{" "}
              <Link href="/terms" className="underline hover:text-white transition">Terms of Service</Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline hover:text-white transition">Privacy Policy</Link>.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
