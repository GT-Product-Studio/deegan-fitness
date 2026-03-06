"use client";

import { useSearchParams, useRouter, redirect } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import Link from "next/link";
import { Loader2, ArrowLeft, Lock, CreditCard, ShieldCheck } from "lucide-react";
import { brand, getProgramConfig, TRAINER_LABELS } from "@/config/brand";

function getPlanLabel(trainer: string, tier: string) {
  const program = getProgramConfig(trainer, tier);
  if (!program) return { name: "Challenge", price: "$49.99", trainer: brand.name };
  return {
    name: program.name,
    price: program.priceFormatted,
    trainer: TRAINER_LABELS[trainer] ?? brand.name,
  };
}

function MockPaymentContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Gate mock checkout behind env flag — disabled in production
  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ENABLE_MOCK_CHECKOUT !== "true") {
      router.replace("/");
    }
  }, [router]);

  if (process.env.NEXT_PUBLIC_ENABLE_MOCK_CHECKOUT !== "true") {
    return null;
  }

  const trainer = searchParams.get("trainer") || "trainerA";
  const tier = searchParams.get("tier") || "30";
  const plan = getPlanLabel(trainer, tier);

  const [email, setEmail] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [expiry, setExpiry] = useState("12/28");
  const [cvc, setCvc] = useState("242");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function formatCardNumber(val: string) {
    return val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
  }

  function formatExpiry(val: string) {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!email || !email.includes("@")) e.email = "Enter a valid email";
    if (!cardName.trim()) e.cardName = "Name is required";
    if (cardNumber.replace(/\s/g, "").length < 16) e.cardNumber = "Enter a valid card number";
    if (expiry.length < 5) e.expiry = "Enter a valid expiry";
    if (cvc.length < 3) e.cvc = "Enter CVC";
    return e;
  }

  function handlePay() {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setLoading(true);
    // Simulate a brief payment processing delay, then redirect to success
    setTimeout(() => {
      router.push(
        `/checkout/success?mock=true&trainer=${trainer}&tier=${tier}&email=${encodeURIComponent(email)}`
      );
    }, 1400);
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">

      {/* Header */}
      <header className="border-b border-card-border bg-white px-6 h-14 flex items-center justify-between shrink-0">
        <Link href="/" className="font-display text-2xl tracking-widest">
          {brand.nav.logoPrefix} <span className="text-gold">{brand.nav.logoAccent}</span>
        </Link>
        <div className="flex items-center gap-2 text-muted text-xs font-bold tracking-widest uppercase">
          <Lock className="w-3.5 h-3.5 text-army" />
          Secure Checkout
        </div>
      </header>

      {/* Test mode banner */}
      <div className="bg-amber-50 border-b border-amber-200 px-6 py-2.5 flex items-center justify-center gap-2">
        <span className="bg-amber-400 text-black text-[9px] font-bold px-2 py-0.5 tracking-widest uppercase rounded-sm">Test Mode</span>
        <p className="text-amber-800 text-xs font-medium">
          This is a preview of the payment flow. No real charges are made.
        </p>
      </div>

      {/* Back */}
      <div className="px-6 py-4 border-b border-card-border bg-card">
        <Link
          href={`/checkout?trainer=${trainer}&tier=${tier}`}
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition font-bold tracking-widest uppercase"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </Link>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-start justify-center px-5 py-10">
        <div className="w-full max-w-md space-y-6">

          {/* Order summary pill */}
          <div className="bg-white border border-card-border p-5 flex justify-between items-center">
            <div>
              <p className="font-bold text-sm">{plan.name}</p>
              <p className="text-muted text-xs mt-0.5">{plan.trainer}</p>
            </div>
            <p className="font-display text-2xl font-bold">{plan.price}</p>
          </div>

          {/* Payment form */}
          <div className="bg-white border border-card-border p-7 space-y-5">

            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="w-4 h-4 text-muted" />
              <p className="text-xs font-bold tracking-[0.3em] uppercase text-muted">Payment Details</p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-muted mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={`w-full border px-4 py-3 text-sm bg-background focus:outline-none focus:border-army transition ${
                  errors.email ? "border-red-400" : "border-card-border"
                }`}
              />
              {errors.email && <p className="text-red-500 text-[11px] mt-1">{errors.email}</p>}
            </div>

            {/* Card number */}
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-muted mb-1.5">
                Card Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={cardNumber}
                  onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                  placeholder="1234 5678 9012 3456"
                  className={`w-full border px-4 py-3 text-sm bg-background focus:outline-none focus:border-army transition pr-12 font-mono ${
                    errors.cardNumber ? "border-red-400" : "border-card-border"
                  }`}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 opacity-50">
                  <div className="w-6 h-4 rounded-sm bg-blue-600" />
                  <div className="w-6 h-4 rounded-sm bg-red-500" />
                </div>
              </div>
              {errors.cardNumber
                ? <p className="text-red-500 text-[11px] mt-1">{errors.cardNumber}</p>
                : <p className="text-muted text-[11px] mt-1">Test card: 4242 4242 4242 4242</p>
              }
            </div>

            {/* Name on card */}
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-muted mb-1.5">
                Name on Card
              </label>
              <input
                type="text"
                value={cardName}
                onChange={e => setCardName(e.target.value)}
                placeholder="John Smith"
                className={`w-full border px-4 py-3 text-sm bg-background focus:outline-none focus:border-army transition ${
                  errors.cardName ? "border-red-400" : "border-card-border"
                }`}
              />
              {errors.cardName && <p className="text-red-500 text-[11px] mt-1">{errors.cardName}</p>}
            </div>

            {/* Expiry + CVC */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-muted mb-1.5">
                  Expiry
                </label>
                <input
                  type="text"
                  value={expiry}
                  onChange={e => setExpiry(formatExpiry(e.target.value))}
                  placeholder="MM/YY"
                  className={`w-full border px-4 py-3 text-sm bg-background focus:outline-none focus:border-army transition font-mono ${
                    errors.expiry ? "border-red-400" : "border-card-border"
                  }`}
                />
                {errors.expiry && <p className="text-red-500 text-[11px] mt-1">{errors.expiry}</p>}
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-muted mb-1.5">
                  CVC
                </label>
                <input
                  type="text"
                  value={cvc}
                  onChange={e => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  placeholder="123"
                  className={`w-full border px-4 py-3 text-sm bg-background focus:outline-none focus:border-army transition font-mono ${
                    errors.cvc ? "border-red-400" : "border-card-border"
                  }`}
                />
                {errors.cvc && <p className="text-red-500 text-[11px] mt-1">{errors.cvc}</p>}
              </div>
            </div>

            {/* Pay button */}
            <button
              onClick={handlePay}
              disabled={loading}
              className="w-full bg-army text-white py-4 text-sm font-bold tracking-widest uppercase hover:bg-army-light transition disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing…
                </>
              ) : (
                `Pay ${plan.price} →`
              )}
            </button>

          </div>

          {/* Trust row */}
          <div className="flex items-center justify-center gap-6 text-muted text-xs">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-army" /> SSL Encrypted
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-army" /> Powered by Stripe
            </span>
          </div>

          <p className="text-muted text-[11px] text-center leading-relaxed">
            By completing your purchase you agree to our{" "}
            <Link href="/terms" className="underline hover:text-foreground">Terms of Service</Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>.
          </p>

        </div>
      </div>
    </div>
  );
}

export default function MockPaymentPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-army" />
      </div>
    }>
      <MockPaymentContent />
    </Suspense>
  );
}
