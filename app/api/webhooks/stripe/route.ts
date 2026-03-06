import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

function getSupabaseAdmin() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required");
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

// ── One-time plan link ────────────────────────────────────────────────────────

async function linkPlan(
  userId: string,
  trainer: string,
  tier: string,
  stripeCustomerId: string | null,
  sessionId: string
) {
  const db = getSupabaseAdmin();
  const now = new Date().toISOString();

  await db.from("profiles").update({
    trainer,
    tier,
    started_at: now,
    ...(stripeCustomerId ? { stripe_customer_id: stripeCustomerId } : {}),
    stripe_session_id: sessionId,
  }).eq("id", userId);

  await db.from("user_plans").upsert(
    { user_id: userId, trainer, tier, started_at: now, purchased_at: now },
    { onConflict: "user_id,trainer,tier" }
  );
}

// ── Subscription upsert ───────────────────────────────────────────────────────

async function upsertSubscription(
  userId: string,
  planType: string,
  stripeSubscriptionId: string,
  stripeCustomerId: string,
  status: string,
  currentPeriodEnd: number | null
) {
  const db = getSupabaseAdmin();
  await db.from("subscriptions").upsert(
    {
      user_id: userId,
      plan_type: planType,
      stripe_subscription_id: stripeSubscriptionId,
      stripe_customer_id: stripeCustomerId,
      status,
      current_period_end: currentPeriodEnd
        ? new Date(currentPeriodEnd * 1000).toISOString()
        : null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_subscription_id" }
  );
}

// ── Look up user by stripe customer id ───────────────────────────────────────

async function getUserIdByCustomerId(customerId: string): Promise<string | null> {
  const db = getSupabaseAdmin();
  const { data } = await db
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .maybeSingle();
  return data?.id ?? null;
}

// ── POST ──────────────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Webhook signature verification failed:", message);
    return NextResponse.json({ error: message }, { status: 400 });
  }

  const db = getSupabaseAdmin();

  // ── checkout.session.completed ────────────────────────────────────────────
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const stripeCustomerId = typeof session.customer === "string" ? session.customer : null;
    const customerEmail = session.customer_details?.email;

    // ── Subscription purchase ──────────────────────────────────────────────
    if (session.mode === "subscription") {
      const planType = session.metadata?.planType;
      const stripeSubId = typeof session.subscription === "string" ? session.subscription : null;
      if (!planType || !stripeSubId || !stripeCustomerId) return NextResponse.json({ received: true });

      // Resolve user id
      let userId = session.client_reference_id || session.metadata?.userId || null;
      if (!userId && customerEmail) {
        const { data } = await db.from("profiles").select("id").eq("email", customerEmail).maybeSingle();
        userId = data?.id ?? null;
      }
      if (!userId) return NextResponse.json({ received: true });

      // Fetch subscription to get period end
      const sub = await getStripe().subscriptions.retrieve(stripeSubId);

      // Update stripe_customer_id on profile
      await db.from("profiles").update({ stripe_customer_id: stripeCustomerId }).eq("id", userId);

      await upsertSubscription(
        userId, planType, stripeSubId, stripeCustomerId,
        "active", (sub as unknown as { current_period_end: number }).current_period_end ?? null
      );

      return NextResponse.json({ received: true });
    }

    // ── One-time purchase ──────────────────────────────────────────────────
    const { trainer, tier } = session.metadata ?? {};
    if (!trainer || !tier) return NextResponse.json({ received: true });

    let userId = session.client_reference_id || session.metadata?.userId || null;
    if (userId) {
      await linkPlan(userId, trainer, tier, stripeCustomerId, session.id);
      return NextResponse.json({ received: true });
    }

    if (customerEmail) {
      const { data: existing } = await db.from("profiles").select("id").eq("email", customerEmail).single();
      if (existing) await linkPlan(existing.id, trainer, tier, stripeCustomerId, session.id);
    }
  }

  // ── customer.subscription.updated ────────────────────────────────────────
  if (event.type === "customer.subscription.updated") {
    const sub = event.data.object as Stripe.Subscription;
    const customerId = typeof sub.customer === "string" ? sub.customer : null;
    if (!customerId) return NextResponse.json({ received: true });

    const userId = await getUserIdByCustomerId(customerId);
    if (!userId) return NextResponse.json({ received: true });

    const planType = (sub.metadata?.planType as string) || "monthly";
    await upsertSubscription(
      userId, planType, sub.id, customerId,
      sub.status, (sub as unknown as { current_period_end: number }).current_period_end ?? null
    );
  }

  // ── customer.subscription.deleted ────────────────────────────────────────
  if (event.type === "customer.subscription.deleted") {
    const sub = event.data.object as Stripe.Subscription;

    await db.from("subscriptions")
      .update({ status: "canceled", updated_at: new Date().toISOString() })
      .eq("stripe_subscription_id", sub.id);
  }

  return NextResponse.json({ received: true });
}
