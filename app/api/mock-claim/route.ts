import { NextRequest, NextResponse } from "next/server";
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
  // Gate mock claim behind env flag — disabled in production
  if (process.env.ENABLE_MOCK_CHECKOUT !== "true") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const { email, password, trainer, tier } = await request.json() as {
      email: string;
      password: string;
      trainer: string;
      tier: string;
    };

    if (!email || !password || password.length < 6 || !trainer || !tier) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const supabaseAdmin = getSupabaseAdmin();
    const now = new Date().toISOString();

    // Check if account already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
    const existingUser = existingUsers?.users?.find((u) => u.email === email);

    let userId: string;

    if (existingUser) {
      userId = existingUser.id;
      // Update their active plan
      await supabaseAdmin
        .from("profiles")
        .update({ trainer, tier, started_at: now })
        .eq("id", userId);
    } else {
      // Create new account
      const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

      if (createError || !newUser?.user) {
        return NextResponse.json({ error: createError?.message || "Failed to create account" }, { status: 500 });
      }

      userId = newUser.user.id;

      await supabaseAdmin.from("profiles").upsert({
        id: userId,
        email,
        trainer,
        tier,
        started_at: now,
      });
    }

    // Add to user_plans
    await supabaseAdmin
      .from("user_plans")
      .upsert(
        { user_id: userId, trainer, tier, started_at: now, purchased_at: now },
        { onConflict: "user_id,trainer,tier" }
      );

    // Sign in and return session tokens
    const { data: signInData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !signInData?.session) {
      return NextResponse.json({ error: "Account created but sign-in failed — please log in." }, { status: 500 });
    }

    return NextResponse.json({
      access_token: signInData.session.access_token,
      refresh_token: signInData.session.refresh_token,
    });
  } catch (err) {
    console.error("Mock claim error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
