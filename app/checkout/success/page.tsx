import { redirect } from "next/navigation";
import { CheckCircle } from "lucide-react";
import Link from "next/link";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { ClaimForm } from "./claim-form";
import { ReturningUserForm } from "./returning-user-form";
import { InstallPrompt } from "@/app/components/install-prompt";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { brand } from "@/config/brand";

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
  searchParams: Promise<{ session_id?: string; mock?: string; email?: string }>;
}) {
  const { session_id, mock, email } = await searchParams;

  // ── MOCK FLOW ──
  if (mock === "true") {
    const mockEmail = email ?? "you@example.com";
    return (
      <>
      <main className="min-h-screen flex items-center justify-center px-5 bg-background text-foreground">
        <div className="w-full max-w-sm text-center">
          <div className="flex justify-center mb-6">
            <span className="bg-amber-400 text-black text-[9px] font-bold px-2.5 py-1 tracking-widest uppercase rounded-sm">
              Test Mode
            </span>
          </div>
          <div className="w-16 h-16 bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <p className="text-primary text-xs font-bold tracking-[0.3em] uppercase mb-3">Subscription Active</p>
          <h1 className="font-display text-4xl font-bold uppercase leading-none mb-4">You&apos;re In.</h1>
          <p className="text-muted text-sm leading-relaxed mb-6">
            Your <strong className="text-white">{brand.subscription.displayName}</strong> subscription is active.
          </p>
          <Link
            href="/dashboard"
            className="block w-full bg-primary text-black py-4 text-xs font-bold tracking-widest uppercase hover:bg-primary-dark transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </main>
      <InstallPrompt position="top" />
      </>
    );
  }

  // No session_id → redirect home
  if (!session_id) redirect("/");

  // Fetch Stripe session
  const stripeSession = await getStripeSession(session_id);

  if (!stripeSession || stripeSession.payment_status !== "paid") {
    return <BasicSuccess />;
  }

  const stripeEmail = stripeSession.customer_details?.email ?? null;

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

  if (user && user.email === stripeEmail) {
    return (
      <>
      <main className="min-h-screen flex items-center justify-center px-5 bg-background text-foreground">
        <div className="w-full max-w-sm text-center">
          <div className="w-16 h-16 bg-primary/10 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <p className="text-primary text-xs font-bold tracking-[0.3em] uppercase mb-3">Subscription Active</p>
          <h1 className="font-display text-4xl font-bold uppercase leading-none mb-4">You&apos;re In!</h1>
          <p className="text-muted text-sm leading-relaxed mb-8">
            Your <strong className="text-white">{brand.subscription.displayName}</strong> is live. Let&apos;s get to work.
          </p>
          <Link
            href="/dashboard"
            className="block w-full bg-primary text-black py-4 text-xs font-bold tracking-widest uppercase hover:bg-primary-dark transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </main>
      <InstallPrompt position="top" />
      </>
    );
  }

  // Check if email already has an account
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

  return (
    <>
    <main className="min-h-screen flex items-center justify-center px-5 bg-background text-foreground">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="w-8 h-8 text-primary" />
          </div>
          <p className="text-primary text-xs font-bold tracking-[0.3em] uppercase mb-3">Subscription Active</p>
          <h1 className="font-display text-4xl font-bold uppercase leading-none mb-3">
            {emailHasAccount ? "Welcome Back." : "One Last Step."}
          </h1>
          <p className="text-muted text-sm leading-relaxed">
            {emailHasAccount
              ? "Log in to access your training dashboard."
              : "Set a password to create your account and start training."
            }
          </p>
        </div>

        <div className="flex items-center gap-3 bg-card border border-white/10 px-4 py-3 mb-6">
          <CheckCircle className="w-4 h-4 text-primary shrink-0" />
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-white">{brand.subscription.displayName}</p>
            <p className="text-xs text-muted mt-0.5">{brand.subscription.pillLabel}</p>
          </div>
        </div>

        {!stripeEmail ? (
          <div className="space-y-3 text-center">
            <p className="text-sm text-muted">
              Couldn&apos;t read your email from Stripe. Please log in or create an account.
            </p>
            <Link href="/signup" className="block w-full bg-primary text-black py-4 text-xs font-bold tracking-widest uppercase hover:bg-primary-dark transition">
              Create Account
            </Link>
            <Link href="/login" className="block w-full border border-white/10 py-4 text-xs font-bold tracking-widest uppercase text-white hover:bg-card transition">
              Log In
            </Link>
          </div>
        ) : emailHasAccount ? (
          <ReturningUserForm email={stripeEmail} planName={brand.subscription.displayName} />
        ) : (
          <ClaimForm sessionId={session_id} email={stripeEmail} planName={brand.subscription.displayName} />
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
    <main className="min-h-screen flex items-center justify-center px-5 bg-background text-foreground">
      <div className="w-full max-w-sm text-center">
        <div className="w-16 h-16 bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-primary" />
        </div>
        <h1 className="font-display text-4xl font-bold uppercase leading-none mb-4">You&apos;re In!</h1>
        <p className="text-muted text-sm leading-relaxed mb-8">
          Your subscription is active. Create an account or log in to start training.
        </p>
        <div className="space-y-3">
          <Link href="/signup" className="block w-full bg-primary text-black py-4 text-xs font-bold tracking-widest uppercase hover:bg-primary-dark transition">
            Create Account
          </Link>
          <Link href="/login" className="block w-full border border-white/10 py-4 text-xs font-bold tracking-widest uppercase text-white hover:bg-card transition">
            Log In
          </Link>
        </div>
      </div>
    </main>
    <InstallPrompt position="top" />
    </>
  );
}
