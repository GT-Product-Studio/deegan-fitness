"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { CreditCard, LogOut, User, Zap } from "lucide-react";
import { brand } from "@/config/brand";

type Profile = {
  full_name: string | null;
  email: string | null;
  training_level: string | null;
  stripe_customer_id: string | null;
};

type Subscription = {
  plan_type: string;
  status: string;
  current_period_end: string | null;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function AccountPage() {
  const router = useRouter();
  const supabase = createClient();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const [{ data: prof }, { data: sub }] = await Promise.all([
        supabase.from("profiles").select("full_name, email, training_level, stripe_customer_id").eq("id", user.id).single(),
        supabase.from("subscriptions").select("plan_type, status, current_period_end").eq("user_id", user.id).eq("status", "active").maybeSingle(),
      ]);

      setProfile(prof);
      setSubscription(sub);
      setLoading(false);
    }
    load();
  }, [supabase, router]);

  async function handleBillingPortal() {
    setPortalLoading(true);
    setPortalError(null);
    try {
      const res = await fetch("/api/billing-portal", { method: "POST" });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setPortalError(data.error ?? "Something went wrong. Try again.");
        setPortalLoading(false);
      }
    } catch {
      setPortalError("Something went wrong. Try again.");
      setPortalLoading(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) {
    return (
      <div className="space-y-4 pb-6 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 rounded-2xl bg-card border border-white/10" />
        ))}
      </div>
    );
  }

  const hasSubscription = !!subscription;

  return (
    <div className="space-y-4 pb-6">

      <div className="pt-2 pb-1">
        <h1 className="font-display text-3xl font-bold uppercase leading-none">Account</h1>
        <p className="text-muted text-sm mt-1">{profile?.email}</p>
      </div>

      {/* Subscription status */}
      {hasSubscription && (
        <div className="rounded-2xl border border-primary/30 bg-card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
              <Zap className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-primary text-[10px] font-bold tracking-[0.25em] uppercase">Active Subscriber</p>
              <p className="font-bold text-sm leading-tight text-white">{brand.subscription.displayName}</p>
            </div>
            <div className="ml-auto">
              <span className="text-[9px] font-bold px-2 py-1 tracking-widest uppercase bg-primary text-black">
                Active
              </span>
            </div>
          </div>

          <div className="space-y-2 text-sm text-muted">
            <div className="flex justify-between">
              <span>Plan</span>
              <span className="font-semibold text-white">{brand.subscription.priceFormatted} / month</span>
            </div>
            <div className="flex justify-between">
              <span>Program</span>
              <span className="font-semibold text-white">The Regiment</span>
            </div>
            {subscription.current_period_end && (
              <div className="flex justify-between">
                <span>Next billing date</span>
                <span className="font-semibold text-white">{formatDate(subscription.current_period_end)}</span>
              </div>
            )}
          </div>

          <button
            onClick={handleBillingPortal}
            disabled={portalLoading}
            className="mt-4 w-full flex items-center justify-center gap-2 py-3 text-xs font-bold tracking-widest uppercase transition bg-primary text-black hover:bg-primary-dark"
          >
            <CreditCard className="w-3.5 h-3.5" />
            {portalLoading ? "Opening..." : "Manage Billing & Cancel"}
          </button>
          {portalError && (
            <p className="mt-2 text-xs text-zone-redline text-center">{portalError}</p>
          )}
        </div>
      )}

      {/* No subscription */}
      {!hasSubscription && (
        <div className="bg-card border border-white/10 rounded-2xl p-5 text-center">
          <p className="text-muted text-sm mb-4">You don&apos;t have an active subscription.</p>
          <button
            onClick={() => router.push("/checkout")}
            className="w-full bg-primary text-black py-3 text-xs font-bold tracking-widest uppercase hover:bg-primary-dark transition"
          >
            Subscribe — {brand.subscription.priceFormatted}/mo
          </button>
        </div>
      )}

      {/* Profile info */}
      <div className="bg-card border border-white/10 rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-muted" />
          </div>
          <p className="font-bold text-sm text-white">Profile</p>
        </div>
        <div className="space-y-2 text-sm text-muted">
          {profile?.full_name && (
            <div className="flex justify-between">
              <span>Name</span>
              <span className="font-semibold text-white">{profile.full_name}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Email</span>
            <span className="font-semibold text-white">{profile?.email}</span>
          </div>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-4 text-xs font-bold tracking-widest uppercase text-muted border border-white/10 hover:text-white hover:border-white/30 transition rounded-2xl"
      >
        <LogOut className="w-3.5 h-3.5" />
        Sign Out
      </button>

    </div>
  );
}
