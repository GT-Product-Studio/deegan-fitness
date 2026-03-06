import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { brand } from "@/config/brand";

export async function POST() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get the user's Stripe customer ID from their profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  if (!profile?.stripe_customer_id) {
    return NextResponse.json(
      { error: `No billing account found. Contact support at ${brand.supportEmail}` },
      { status: 404 }
    );
  }

  // If Stripe isn't configured, return a helpful error
  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: `Billing portal not yet available. Contact ${brand.supportEmail} to manage your subscription.` },
      { status: 503 }
    );
  }

  try {
    const { getStripe } = await import("@/lib/stripe");
    const stripe = getStripe();

    const session = await stripe.billingPortal.sessions.create({
      customer: profile.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/account`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Billing portal error:", err);
    return NextResponse.json({ error: "Failed to open billing portal" }, { status: 500 });
  }
}
