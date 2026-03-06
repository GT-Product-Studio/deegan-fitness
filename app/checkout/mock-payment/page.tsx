"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Loader2, ArrowLeft, Lock, CreditCard, ShieldCheck } from "lucide-react";
import { brand } from "@/config/brand";

export default function MockPaymentPage() {
  const router = useRouter();

  useEffect(() => {
    if (process.env.NEXT_PUBLIC_ENABLE_MOCK_CHECKOUT !== "true") {
      router.replace("/");
    }
  }, [router]);

  if (process.env.NEXT_PUBLIC_ENABLE_MOCK_CHECKOUT !== "true") {
    return null;
  }

  const [emailVal, setEmail] = useState("");
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
    if (!emailVal || !emailVal.includes("@")) e.email = "Enter a valid email";
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
    setTimeout(() => {
      router.push(`/checkout/success?mock=true&email=${encodeURIComponent(emailVal)}`);
    }, 1400);
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-white/10 bg-card px-6 h-14 flex items-center justify-between shrink-0">
        <Link href="/" className="font-display text-xl font-bold tracking-wider uppercase">
          {brand.nav.logoPrefix} <span className="text-primary">{brand.nav.logoAccent}</span>
        </Link>
        <div className="flex items-center gap-2 text-muted text-xs font-bold tracking-widest uppercase">
          <Lock className="w-3.5 h-3.5 text-primary" />
          Secure Checkout
        </div>
      </header>

      <div className="bg-zone-tempo/10 border-b border-zone-tempo/20 px-6 py-2.5 flex items-center justify-center gap-2">
        <span className="bg-zone-tempo text-black text-[9px] font-bold px-2 py-0.5 tracking-widest uppercase rounded-sm">Test Mode</span>
        <p className="text-zone-tempo text-xs font-medium">No real charges are made.</p>
      </div>

      <div className="px-6 py-4 border-b border-white/10 bg-card-elevated">
        <Link href="/checkout" className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-white transition font-bold tracking-widest uppercase">
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </Link>
      </div>

      <div className="flex-1 flex items-start justify-center px-5 py-10">
        <div className="w-full max-w-md space-y-6">
          <div className="bg-card border border-white/10 p-5 flex justify-between items-center">
            <div>
              <p className="font-bold text-sm text-white">{brand.subscription.displayName}</p>
              <p className="text-muted text-xs mt-0.5">Monthly subscription</p>
            </div>
            <p className="font-display text-2xl font-bold text-white">{brand.subscription.priceFormatted}/mo</p>
          </div>

          <div className="bg-card border border-white/10 p-7 space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <CreditCard className="w-4 h-4 text-muted" />
              <p className="text-xs font-bold tracking-[0.3em] uppercase text-muted">Payment Details</p>
            </div>

            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-muted mb-1.5">Email</label>
              <input type="email" value={emailVal} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                className={`w-full border px-4 py-3 text-sm bg-background text-white focus:outline-none focus:border-primary transition ${errors.email ? "border-zone-redline" : "border-white/10"}`} />
              {errors.email && <p className="text-zone-redline text-[11px] mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-muted mb-1.5">Card Number</label>
              <input type="text" value={cardNumber} onChange={e => setCardNumber(formatCardNumber(e.target.value))} placeholder="1234 5678 9012 3456"
                className={`w-full border px-4 py-3 text-sm bg-background text-white font-mono focus:outline-none focus:border-primary transition ${errors.cardNumber ? "border-zone-redline" : "border-white/10"}`} />
              {errors.cardNumber ? <p className="text-zone-redline text-[11px] mt-1">{errors.cardNumber}</p> : <p className="text-muted text-[11px] mt-1">Test: 4242 4242 4242 4242</p>}
            </div>

            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-muted mb-1.5">Name on Card</label>
              <input type="text" value={cardName} onChange={e => setCardName(e.target.value)} placeholder="John Smith"
                className={`w-full border px-4 py-3 text-sm bg-background text-white focus:outline-none focus:border-primary transition ${errors.cardName ? "border-zone-redline" : "border-white/10"}`} />
              {errors.cardName && <p className="text-zone-redline text-[11px] mt-1">{errors.cardName}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-muted mb-1.5">Expiry</label>
                <input type="text" value={expiry} onChange={e => setExpiry(formatExpiry(e.target.value))} placeholder="MM/YY"
                  className={`w-full border px-4 py-3 text-sm bg-background text-white font-mono focus:outline-none focus:border-primary transition ${errors.expiry ? "border-zone-redline" : "border-white/10"}`} />
              </div>
              <div>
                <label className="block text-[10px] font-bold tracking-widest uppercase text-muted mb-1.5">CVC</label>
                <input type="text" value={cvc} onChange={e => setCvc(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="123"
                  className={`w-full border px-4 py-3 text-sm bg-background text-white font-mono focus:outline-none focus:border-primary transition ${errors.cvc ? "border-zone-redline" : "border-white/10"}`} />
              </div>
            </div>

            <button onClick={handlePay} disabled={loading}
              className="w-full bg-primary text-black py-4 text-sm font-bold tracking-widest uppercase hover:bg-primary-dark transition disabled:opacity-60 flex items-center justify-center gap-2 mt-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</> : `Subscribe — ${brand.subscription.priceFormatted}/mo`}
            </button>
          </div>

          <div className="flex items-center justify-center gap-6 text-muted text-xs">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-primary" /> SSL Encrypted</span>
            <span className="flex items-center gap-1.5"><Lock className="w-3.5 h-3.5 text-primary" /> Powered by Stripe</span>
          </div>
        </div>
      </div>
    </div>
  );
}
