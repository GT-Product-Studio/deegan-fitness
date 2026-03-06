import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { sendAccessEmail } from "@/lib/email";
import { brand } from "@/config/brand";

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

    const { getStripe } = await import("@/lib/stripe");
    const stripeSession = await getStripe().checkout.sessions.retrieve(session_id);
    if (stripeSession.payment_status !== "paid") {
      return NextResponse.json({ error: "Payment not confirmed" }, { status: 400 });
    }

    const email = stripeSession.customer_details?.email;
    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();
    const now = new Date().toISOString();

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

      await supabaseAdmin.from("profiles").upsert({
        id: userId,
        email,
        training_level: "regiment",
        started_at: now,
        stripe_session_id: session_id,
      });
    }

    // Generate magic link
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? brand.domain;
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: "magiclink",
      email,
      options: { redirectTo: `${appUrl}/auth/callback?next=/dashboard` },
    });

    if (linkError || !linkData?.properties?.action_link) {
      return NextResponse.json({ error: "Failed to generate access link" }, { status: 500 });
    }

    await sendAccessEmail({
      to: email,
      magicLink: linkData.properties.action_link,
    });

    return NextResponse.json({ ok: true, email });
  } catch (err) {
    console.error("send-access-link error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
