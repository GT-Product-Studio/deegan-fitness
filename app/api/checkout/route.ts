import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { getPlan, getSubscriptionPlan } from "@/lib/stripe-products";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Trainer, Tier, SubscriptionPlan } from "@/lib/stripe-products";

// ── Helpers ───────────────────────────────────────────────────────────────────

async function getCurrentUser() {
  try {
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
    return user ?? null;
  } catch {
    return null;
  }
}

// ── POST handler ──────────────────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as {
      // One-time purchase
      trainer?: Trainer;
      tier?: Tier;
      // Subscription
      planType?: SubscriptionPlan;
    };

    const user = await getCurrentUser();
    const userId = user?.id ?? null;
    const userEmail = user?.email ?? null;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

    // ── Subscription flow ────────────────────────────────────────────────────
    if (body.planType) {
      const subPlan = getSubscriptionPlan(body.planType);
      if (!subPlan) {
        return NextResponse.json({ error: "Invalid subscription plan" }, { status: 400 });
      }

      const session = await getStripe().checkout.sessions.create({
        mode: "subscription",
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: subPlan.name,
                description: subPlan.description,
              },
              unit_amount: Math.round(subPlan.price * 100),
              recurring: { interval: "month" },
            },
            quantity: 1,
          },
        ],
        ...(userEmail ? { customer_email: userEmail } : {}),
        metadata: {
          planType: body.planType,
          ...(userId ? { userId } : {}),
        },
        ...(userId ? { client_reference_id: userId } : {}),
        success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}&planType=${body.planType}`,
        cancel_url: `${appUrl}/#membership`,
      });

      return NextResponse.json({ url: session.url });
    }

    // ── One-time purchase flow ────────────────────────────────────────────────
    const { trainer, tier } = body;
    if (!trainer || !tier) {
      return NextResponse.json({ error: "trainer and tier required" }, { status: 400 });
    }

    const plan = getPlan(trainer, tier);
    if (!plan) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const session = await getStripe().checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: plan.name,
              description: plan.description,
            },
            unit_amount: Math.round(plan.price * 100),
          },
          quantity: 1,
        },
      ],
      ...(userEmail ? { customer_email: userEmail } : {}),
      metadata: {
        trainer,
        tier,
        ...(userId ? { userId } : {}),
      },
      ...(userId ? { client_reference_id: userId } : {}),
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/programs`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
