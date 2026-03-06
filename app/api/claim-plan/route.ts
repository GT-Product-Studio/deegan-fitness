import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is required");
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export async function POST(request: NextRequest) {
  try {
    const { session_id, password } = await request.json() as { session_id: string; password: string };

    if (!session_id || !password || password.length < 6) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Verify Stripe session
    const stripe = getStripe();
    const stripeSession = await stripe.checkout.sessions.retrieve(session_id);

    if (stripeSession.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not completed" }, { status: 400 });
    }

    const email = stripeSession.customer_details?.email;
    const { trainer, tier } = stripeSession.metadata || {};

    if (!email || !trainer || !tier) {
      return NextResponse.json({ error: "Missing session data" }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();
    const now = new Date().toISOString();

    // Check if account already exists for this email
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find((u) => u.email === email);

    let userId: string;

    if (existingUser) {
      // Account already exists — do NOT overwrite their password.
      // The success page should have routed them to ReturningUserForm instead.
      // Return an error so ClaimForm surfaces a helpful message if it somehow fires.
      return NextResponse.json(
        { error: "An account with this email already exists. Please log in instead." },
        { status: 409 }
      );
    } else {
      // Create new account — email confirmed immediately (they verified it via Stripe)
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

      if (createError || !newUser?.user) {
        return NextResponse.json({ error: createError?.message || "Failed to create account" }, { status: 500 });
      }

      userId = newUser.user.id;

      // Create profile
      await supabaseAdmin.from("profiles").upsert({
        id: userId,
        email,
        trainer,
        tier,
        started_at: now,
        stripe_session_id: session_id,
      });
    }

    // Link the plan
    await supabaseAdmin
      .from("profiles")
      .update({ trainer, tier, started_at: now, stripe_session_id: session_id })
      .eq("id", userId);

    await supabaseAdmin
      .from("user_plans")
      .upsert(
        { user_id: userId, trainer, tier, started_at: now, purchased_at: now },
        { onConflict: "user_id,trainer,tier" }
      );

    // Sign in to get a session the client can use
    const { data: signInData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !signInData?.session) {
      return NextResponse.json({ error: "Account created but sign-in failed — please log in manually." }, { status: 500 });
    }

    return NextResponse.json({
      access_token: signInData.session.access_token,
      refresh_token: signInData.session.refresh_token,
    });
  } catch (err) {
    console.error("Claim plan error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
