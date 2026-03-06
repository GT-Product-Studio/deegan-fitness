import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getStripe } from "@/lib/stripe";
import { sendAccessEmail } from "@/lib/email";
import { brand, TRAINER_LABELS, TIER_LABELS } from "@/config/brand";

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  try {
    const { session_id } = await request.json() as { session_id: string };

    if (!session_id) {
      return NextResponse.json({ error: "Missing session_id" }, { status: 400 });
    }

    // Verify Stripe payment
    const stripeSession = await getStripe().checkout.sessions.retrieve(session_id);
    if (stripeSession.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not confirmed" }, { status: 400 });
    }

    const email = stripeSession.customer_details?.email;
    const { trainer, tier } = stripeSession.metadata ?? {};

    if (!email || !trainer || !tier) {
      return NextResponse.json({ error: "Missing session data" }, { status: 400 });
    }

    const trainerName = TRAINER_LABELS[trainer] ?? "Your Trainer";
    const tierName = TIER_LABELS[tier] ?? "Your Challenge";
    const planName = tier === "ab" ? TIER_LABELS["ab"] : `${trainerName}'s ${tierName}`;

    const supabaseAdmin = getSupabaseAdmin();
    const now = new Date().toISOString();

    // Create user if they don't exist yet
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find((u) => u.email === email);

    let userId: string;

    if (existingUser) {
      userId = existingUser.id;
    } else {
      const { data: newUser, error } = await supabaseAdmin.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { pending_stripe_session: session_id },
      });
      if (error || !newUser?.user) {
        return NextResponse.json({ error: error?.message ?? "Failed to create user" }, { status: 500 });
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

    // Link plan regardless (idempotent)
    await supabaseAdmin
      .from("profiles")
      .update({ trainer, tier, started_at: now, stripe_session_id: session_id })
      .eq("id", userId);

    await supabaseAdmin.from("user_plans").upsert(
      { user_id: userId, trainer, tier, started_at: now, purchased_at: now },
      { onConflict: "user_id,trainer,tier" }
    );

    // Generate magic link — route through auth callback so the session is established server-side
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? brand.domain;
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: { redirectTo: `${appUrl}/auth/callback?next=/dashboard` },
    });

    if (linkError || !linkData?.properties?.action_link) {
      return NextResponse.json({ error: "Failed to generate access link" }, { status: 500 });
    }

    // Send the email
    await sendAccessEmail({
      to: email,
      planName,
      trainerName,
      magicLink: linkData.properties.action_link,
    });

    return NextResponse.json({ ok: true, email });
  } catch (err) {
    console.error("send-access-link error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
