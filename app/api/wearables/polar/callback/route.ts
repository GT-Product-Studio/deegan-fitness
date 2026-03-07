import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { exchangePolarToken, registerPolarUser } from "@/lib/wearables/polar";

/**
 * GET /api/wearables/polar/callback?code=...
 * Handles Polar OAuth callback
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const baseUrl = request.nextUrl.origin;

  if (!user) {
    console.error("Polar callback: user not authenticated");
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
    // Use the registered redirect URI — must match admin portal exactly
    const redirectUri = `${baseUrl}/api/wearables/polar/callback`;
    console.log("Polar callback: exchanging code for token, redirectUri:", redirectUri);
    const tokens = await exchangePolarToken(code, redirectUri);
    console.log("Polar callback: got tokens, user_id:", tokens.x_user_id);

    // Register user with Polar AccessLink
    await registerPolarUser(tokens.access_token, tokens.x_user_id);
    console.log("Polar callback: user registered with AccessLink");

    // Use admin client to bypass RLS for this server-side operation
    const admin = createAdminClient();
    const { error: dbError } = await admin
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

    console.log("Polar callback: connection saved successfully for user", user.id);
    return NextResponse.redirect(
      `${baseUrl}/dashboard/account?success=polar_connected`
    );
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("Polar callback error:", errorMsg);
    return NextResponse.redirect(
      `${baseUrl}/dashboard/account?error=polar_connect_failed&detail=${encodeURIComponent(errorMsg)}`
    );
  }
}
