"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Crown, CreditCard, LogOut, User, CheckCircle, Zap } from "lucide-react";
import { brand, TRAINER_LABELS, TIER_LABELS } from "@/config/brand";

type Profile = {
  full_name: string | null;
  email: string | null;
  trainer: string | null;
  tier: string | null;
  stripe_customer_id: string | null;
};

type Subscription = {
  plan_type: "monthly" | "vip";
  status: string;
  current_period_end: string | null;
};

type UserPlan = {
  trainer: string;
  tier: string;
  created_at: string;
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
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [portalLoading, setPortalLoading] = useState(false);
  const [portalError, setPortalError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const [{ data: prof }, { data: sub }, { data: plan }] = await Promise.all([
        supabase.from("profiles").select("full_name, email, trainer, tier, stripe_customer_id").eq("id", user.id).single(),
        supabase.from("subscriptions").select("plan_type, status, current_period_end").eq("user_id", user.id).eq("status", "active").order("plan_type", { ascending: false }).maybeSingle(),
        supabase.from("user_plans").select("trainer, tier, created_at").eq("user_id", user.id).order("created_at", { ascending: false }).maybeSingle(),
      ]);

      setProfile(prof);
      setSubscription(sub);
      setUserPlan(plan);
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
          <div key={i} className="h-24 rounded-2xl bg-card border border-card-border" />
        ))}
      </div>
    );
  }

  const isVip = subscription?.plan_type === "vip";
  const isMonthly = subscription?.plan_type === "monthly";
  const hasSubscription = !!subscription;

  const vipName = `${brand.shortName} ${brand.subscriptions.vip.displayName}`;
  const monthlyName = brand.subscriptions.monthly.displayName;

  return (
    <div className="space-y-4 pb-6">

      {/* Header */}
      <div className="pt-2 pb-1">
        <h1 className="font-display text-3xl uppercase leading-none">Account</h1>
        <p className="text-muted text-sm mt-1">{profile?.email}</p>
      </div>

      {/* Subscription status */}
      {hasSubscription && (
        <div className={`rounded-2xl border p-5 ${isVip ? "bg-foreground border-gold/30" : "bg-card border-card-border"}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${isVip ? "bg-gold/20" : "bg-army/10"}`}>
              {isVip ? <Crown className="w-4 h-4 text-gold" /> : <Zap className="w-4 h-4 text-army" />}
            </div>
            <div>
              <p className={`text-[10px] font-bold tracking-[0.25em] uppercase ${isVip ? "text-gold" : "text-army"}`}>
                {isVip ? "VIP Member" : "Monthly Member"}
              </p>
              <p className={`font-bold text-sm leading-tight ${isVip ? "text-white" : "text-foreground"}`}>
                {isVip ? vipName : monthlyName}
              </p>
            </div>
            <div className="ml-auto">
              <span className={`text-[9px] font-bold px-2 py-1 tracking-widest uppercase ${isVip ? "bg-gold text-black" : "bg-army/20 text-army"}`}>
                Active
              </span>
            </div>
          </div>

          <div className={`space-y-2 text-sm ${isVip ? "text-white/70" : "text-muted"}`}>
            <div className="flex justify-between">
              <span>Plan</span>
              <span className={`font-semibold ${isVip ? "text-white" : "text-foreground"}`}>
                {isVip ? `${brand.subscriptions.vip.priceFormatted} / month` : `${brand.subscriptions.monthly.priceFormatted} / month`}
              </span>
            </div>
            {subscription.current_period_end && (
              <div className="flex justify-between">
                <span>Next billing date</span>
                <span className={`font-semibold ${isVip ? "text-white" : "text-foreground"}`}>
                  {formatDate(subscription.current_period_end)}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={handleBillingPortal}
            disabled={portalLoading}
            className={`mt-4 w-full flex items-center justify-center gap-2 py-3 text-xs font-bold tracking-widest uppercase transition ${
              isVip
                ? "bg-gold text-black hover:bg-gold/90"
                : "bg-army text-white hover:bg-army-light"
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            {portalLoading ? "Opening…" : "Manage Billing & Cancel"}
          </button>
          {portalError && (
            <p className="mt-2 text-xs text-red-400 text-center">{portalError}</p>
          )}
        </div>
      )}

      {/* One-time plan */}
      {userPlan && (
        <div className="bg-card border border-card-border rounded-2xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-xl bg-army/10 flex items-center justify-center shrink-0">
              <CheckCircle className="w-4 h-4 text-army" />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted">One-Time Purchase</p>
              <p className="font-bold text-sm leading-tight">
                {userPlan.tier === "ab"
                  ? brand.programs["couples-ab"].name
                  : `${TRAINER_LABELS[userPlan.trainer] ?? "Your Trainer"}'s ${TIER_LABELS[userPlan.tier] ?? "Challenge"}`}
              </p>
            </div>
          </div>
          <div className="space-y-2 text-sm text-muted">
            <div className="flex justify-between">
              <span>Purchased</span>
              <span className="font-semibold text-foreground">{formatDate(userPlan.created_at)}</span>
            </div>
            <div className="flex justify-between">
              <span>Access</span>
              <span className="font-semibold text-foreground">Lifetime</span>
            </div>
          </div>
        </div>
      )}

      {/* No active plan */}
      {!hasSubscription && !userPlan && (
        <div className="bg-card border border-card-border rounded-2xl p-5 text-center">
          <p className="text-muted text-sm mb-4">You don&apos;t have an active plan.</p>
          <button
            onClick={() => router.push("/programs")}
            className="w-full bg-army text-white py-3 text-xs font-bold tracking-widest uppercase hover:bg-army-light transition"
          >
            Browse Programs
          </button>
        </div>
      )}

      {/* Profile info */}
      <div className="bg-card border border-card-border rounded-2xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-xl bg-card-border flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-muted" />
          </div>
          <p className="font-bold text-sm">Profile</p>
        </div>
        <div className="space-y-2 text-sm text-muted">
          {profile?.full_name && (
            <div className="flex justify-between">
              <span>Name</span>
              <span className="font-semibold text-foreground">{profile.full_name}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Email</span>
            <span className="font-semibold text-foreground">{profile?.email}</span>
          </div>
        </div>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-4 text-xs font-bold tracking-widest uppercase text-muted border border-card-border hover:text-foreground hover:border-foreground/30 transition rounded-2xl"
      >
        <LogOut className="w-3.5 h-3.5" />
        Sign Out
      </button>

    </div>
  );
}
