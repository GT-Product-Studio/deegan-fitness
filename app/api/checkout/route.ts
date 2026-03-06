import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { subscriptionPlan } from "@/lib/stripe-products";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { planType?: string };
    const user = await getCurrentUser();
    const userId = user?.id ?? null;
    const userEmail = user?.email ?? null;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL!;

    const session = await getStripe().checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: subscriptionPlan.name,
              description: subscriptionPlan.description,
            },
            unit_amount: Math.round(subscriptionPlan.price * 100),
            recurring: { interval: "month" },
          },
          quantity: 1,
        },
      ],
      ...(userEmail ? { customer_email: userEmail } : {}),
      metadata: {
        planType: "subscription",
        ...(userId ? { userId } : {}),
      },
      ...(userId ? { client_reference_id: userId } : {}),
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
  }
}
