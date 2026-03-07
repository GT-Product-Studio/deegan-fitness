import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { exchangeGarminToken } from "@/lib/wearables/garmin";

/**
 * GET /api/wearables/callback/garmin?code=...
 * Handles Garmin OAuth callback
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
    console.error("Garmin OAuth error:", error);
    return NextResponse.redirect(
      `${baseUrl}/dashboard/account?error=garmin_auth_denied`
    );
  }

  try {
    const redirectUri = `${baseUrl}/api/wearables/callback/garmin`;
    const tokens = await exchangeGarminToken(code, redirectUri);

    // Calculate token expiry
    const expiresAt = new Date(
      Date.now() + tokens.expires_in * 1000
    ).toISOString();

    // Store connection
    const { error: dbError } = await supabase
      .from("wearable_connections")
      .upsert(
        {
          user_id: user.id,
          provider: "garmin",
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          token_expires_at: expiresAt,
          scopes: "activity_api health_api",
          connected_at: new Date().toISOString(),
          sync_status: "active",
        },
        { onConflict: "user_id,provider" }
      );

    if (dbError) {
      console.error("Failed to store Garmin connection:", dbError);
      return NextResponse.redirect(
        `${baseUrl}/dashboard/account?error=garmin_save_failed`
      );
    }

    return NextResponse.redirect(
      `${baseUrl}/dashboard/account?success=garmin_connected`
    );
  } catch (err) {
    console.error("Garmin callback error:", err);
    return NextResponse.redirect(
      `${baseUrl}/dashboard/account?error=garmin_connect_failed`
    );
  }
}
