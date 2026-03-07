import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { exchangePolarToken, registerPolarUser } from "@/lib/wearables/polar";

/**
 * GET /api/wearables/callback/polar?code=...
 * Handles Polar OAuth callback
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const baseUrl = request.nextUrl.origin;

  if (!user) {
    return NextResponse.redirect(`${baseUrl}/login`);
  }

  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");

  if (error || !code) {
    console.error("Polar OAuth error:", error);
    return NextResponse.redirect(
      `${baseUrl}/dashboard/account?error=polar_auth_denied`
    );
  }

  try {
    const redirectUri = `${baseUrl}/api/wearables/callback/polar`;
    const tokens = await exchangePolarToken(code, redirectUri);

    // Register user with Polar AccessLink
    await registerPolarUser(tokens.access_token, tokens.x_user_id);

    // Store connection (Polar tokens don't expire — no refresh needed)
    const { error: dbError } = await supabase
      .from("wearable_connections")
      .upsert(
        {
          user_id: user.id,
          provider: "polar",
          access_token: tokens.access_token,
          provider_user_id: tokens.x_user_id.toString(),
          scopes: "accesslink.read_all",
          connected_at: new Date().toISOString(),
          sync_status: "active",
        },
        { onConflict: "user_id,provider" }
      );

    if (dbError) {
      console.error("Failed to store Polar connection:", dbError);
      return NextResponse.redirect(
        `${baseUrl}/dashboard/account?error=polar_save_failed`
      );
    }

    return NextResponse.redirect(
      `${baseUrl}/dashboard/account?success=polar_connected`
    );
  } catch (err) {
    console.error("Polar callback error:", err);
    return NextResponse.redirect(
      `${baseUrl}/dashboard/account?error=polar_connect_failed`
    );
  }
}
