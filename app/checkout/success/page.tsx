import { redirect } from "next/navigation";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { ClaimForm } from "./claim-form";
import { MockClaimForm } from "./mock-claim-form";
import { ReturningUserForm } from "./returning-user-form";
import { InstallPrompt } from "@/app/components/install-prompt";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { brand, TRAINER_LABELS, TIER_LABELS } from "@/config/brand";

// Subscription plan display helpers
const SUB_LABELS: Record<string, { name: string; pill: string }> = {
  monthly: { name: brand.subscriptions.monthly.displayName, pill: brand.subscriptions.monthly.pillLabel },
  vip:     { name: `${brand.shortName} ${brand.subscriptions.vip.displayName}`, pill: brand.subscriptions.vip.pillLabel },
};

async function getStripeSession(sessionId: string) {
  try {
    const { getStripe } = await import("@/lib/stripe");
    return await getStripe().checkout.sessions.retrieve(sessionId);
  } catch {
    return null;
  }
}

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string; mock?: string; trainer?: string; tier?: string; email?: string; planType?: string }>;
}) {
  const { session_id, mock, trainer, tier, email, planType } = await searchParams;

  // ── SUBSCRIPTION SUCCESS (mock or real redirect) ─────────────────────────
  if (planType === "monthly" || planType === "vip") {
    const sub = SUB_LABELS[planType];
    return (
      <>
      <main className="min-h-screen flex items-center justify-center px-5 bg-background">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-army/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-army" />
          </div>
          <p className="text-gold text-xs font-bold tracking-[0.3em] uppercase mb-3">
            You&apos;re a Member
          </p>
          <h1 className="font-display text-4xl uppercase leading-none mb-4">
            Welcome In.
          </h1>
          <p className="text-muted text-sm leading-relaxed mb-6">
            Your <strong className="text-foreground">{sub.name}</strong> membership is active. New challenges drop every month — start anytime.
          </p>
          {/* Plan pill */}
          <div className="flex items-center gap-3 bg-card border border-card-border px-4 py-3 mb-6 text-left">
            <CheckCircle className="w-4 h-4 text-gold shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest">{sub.name}</p>
              <p className="text-xs text-muted mt-0.5">{sub.pill}</p>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="block w-full bg-army text-white py-4 text-xs font-bold tracking-widest uppercase hover:bg-army-light transition"
          >
            Go to Dashboard →
          </Link>
          <p className="mt-4 text-xs text-muted">
            Manage your subscription anytime in{" "}
            <Link href="/dashboard/account" className="underline hover:text-foreground transition">
              Account Settings
            </Link>
          </p>
        </div>
      </main>
      <InstallPrompt position="top" />
      </>
    );
  }

  // ── MOCK FLOW ────────────────────────────────────────────────────────────────
  if (mock === "true") {
    const trainerName = TRAINER_LABELS[trainer ?? ""] ?? "Your Trainer";
    const tierName = TIER_LABELS[tier ?? ""] ?? "Your Challenge";
    const planName = tier === "ab"
      ? brand.programs["couples-ab"].name
      : `${trainerName}'s ${tierName}`;
    const mockEmail = email ?? "you@example.com";

    return (
      <>
      <main className="min-h-screen flex items-center justify-center px-5 bg-background">
        <div className="w-full max-w-sm">
          {/* Test mode badge */}
          <div className="flex justify-center mb-6">
            <span className="bg-amber-400 text-black text-[9px] font-bold px-2.5 py-1 tracking-widest uppercase rounded-sm">
              Test Mode Preview
            </span>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-army/10 flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-8 h-8 text-army" />
            </div>
            <p className="text-gold text-xs font-bold tracking-[0.3em] uppercase mb-3">
              Payment Confirmed
            </p>
            <h1 className="font-display text-4xl uppercase leading-none mb-3">
              One Last Step.
            </h1>
            <p className="text-muted text-sm leading-relaxed">
              Set a password to create your account and access{" "}
              <strong className="text-foreground">{planName}</strong>.
            </p>
          </div>

          {/* Plan pill */}
          <div className="flex items-center gap-3 bg-card border border-card-border px-4 py-3 mb-6">
            <CheckCircle className="w-4 h-4 text-gold shrink-0" />
            <div>
              <p className="text-xs font-bold uppercase tracking-widest">{planName}</p>
              <p className="text-xs text-muted mt-0.5">Yours to keep · Day-by-day workouts</p>
            </div>
          </div>

          <MockClaimForm email={mockEmail} planName={planName} trainer={trainer ?? "trainerA"} tier={tier ?? "30"} />
        </div>
      </main>
      <InstallPrompt position="top" />
      </>
    );
  }

  // ── REAL STRIPE FLOW ─────────────────────────────────────────────────────────

  // No session_id → redirect home
  if (!session_id) {
    redirect("/");
  }

  // Fetch Stripe session
  const stripeSession = await getStripeSession(session_id);

  // If Stripe isn't configured yet or session not found, show a basic success screen
  if (!stripeSession || stripeSession.payment_status !== "paid") {
    return <BasicSuccess />;
  }

  const stripeEmail = stripeSession.customer_details?.email ?? null;
  const { trainer: sTrainer, tier: sTier } = stripeSession.metadata ?? {};
  const trainerName = TRAINER_LABELS[sTrainer ?? ""] ?? "Your Trainer";
  const tierName = TIER_LABELS[sTier ?? ""] ?? "Your Challenge";
  const planName = sTier === "ab"
    ? brand.programs["couples-ab"].name
    : `${trainerName}'s ${tierName}`;

  // Check if user is already logged in
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll() {},
      },
    }
  );
  const { data: { user } } = await supabase.auth.getUser();

  // Logged-in user whose email matches the purchase — plan was linked by webhook
  if (user && user.email === stripeEmail) {
    return (
      <>
      <main className="min-h-screen flex items-center justify-center px-5 bg-background">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-army/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-army" />
          </div>
          <p className="text-gold text-xs font-bold tracking-[0.3em] uppercase mb-3">
            Payment Confirmed
          </p>
          <h1 className="font-display text-4xl uppercase leading-none mb-4">
            You&apos;re In!
          </h1>
          <p className="text-muted text-sm leading-relaxed mb-8">
            <strong className="text-foreground">{planName}</strong> is ready and waiting. Let&apos;s get to work.
          </p>
          <Link
            href="/dashboard"
            className="block w-full bg-army text-white py-4 text-xs font-bold tracking-widest uppercase hover:bg-army-light transition"
          >
            Go to Dashboard →
          </Link>
        </div>
      </main>
      <InstallPrompt position="top" />
      </>
    );
  }

  // Check if this email already has an account
  let emailHasAccount = false;
  if (stripeEmail) {
    const supabaseAdmin = createAdminClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    const { data: existingProfile } = await supabaseAdmin
      .from("profiles")
      .select("id")
      .eq("email", stripeEmail)
      .maybeSingle();
    emailHasAccount = !!existingProfile;
  }

  // Guest checkout — returning user logs in; new user sets a password
  return (
    <>
    <main className="min-h-screen flex items-center justify-center px-5 bg-background">
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-army/10 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-army" />
          </div>
          <p className="text-gold text-xs font-bold tracking-[0.3em] uppercase mb-3">
            Payment Confirmed
          </p>
          <h1 className="font-display text-4xl uppercase leading-none mb-3">
            {emailHasAccount ? "Welcome Back." : "One Last Step."}
          </h1>
          <p className="text-muted text-sm leading-relaxed">
            {emailHasAccount
              ? <>Log in to access your new plan.</>
              : <>Set a password to create your account and access{" "}
                  <strong className="text-foreground">{planName}</strong>.</>
            }
          </p>
        </div>

        {/* Plan pill */}
        <div className="flex items-center gap-3 bg-card border border-card-border px-4 py-3 mb-6">
          <CheckCircle className="w-4 h-4 text-gold shrink-0" />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest">{planName}</p>
            <p className="text-xs text-muted mt-0.5">Yours to keep · Day-by-day workouts</p>
          </div>
        </div>

        {!stripeEmail ? (
          <div className="space-y-3 text-center">
            <p className="text-sm text-muted">
              Couldn&apos;t read your email from Stripe. Please log in or create an account and your plan will be linked automatically.
            </p>
            <Link href="/signup" className="block w-full bg-army text-white py-4 text-xs font-bold tracking-widest uppercase hover:bg-army-light transition">
              Create Account
            </Link>
            <Link href="/login" className="block w-full border border-card-border py-4 text-xs font-bold tracking-widest uppercase hover:bg-card transition">
              Log In
            </Link>
          </div>
        ) : emailHasAccount ? (
          <ReturningUserForm email={stripeEmail} planName={planName} />
        ) : (
          <ClaimForm sessionId={session_id} email={stripeEmail} planName={planName} />
        )}
      </div>
    </main>
    <InstallPrompt position="top" />
    </>
  );
}

function BasicSuccess() {
  return (
    <>
    <main className="min-h-screen flex items-center justify-center px-5 bg-background">
      <div className="w-full max-w-sm text-center">
        <div className="w-16 h-16 bg-army/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-army" />
        </div>
        <h1 className="font-display text-4xl uppercase leading-none mb-4">You&apos;re In!</h1>
        <p className="text-muted text-sm leading-relaxed mb-8">
          Your payment was successful. Create an account or log in to access your program.
        </p>
        <div className="space-y-3">
          <Link href="/signup" className="block w-full bg-army text-white py-4 text-xs font-bold tracking-widest uppercase hover:bg-army-light transition">
            Create Account
          </Link>
          <Link href="/login" className="block w-full border border-card-border py-4 text-xs font-bold tracking-widest uppercase hover:bg-card transition">
            Log In
          </Link>
        </div>
      </div>
    </main>
    <InstallPrompt position="top" />
    </>
  );
}
