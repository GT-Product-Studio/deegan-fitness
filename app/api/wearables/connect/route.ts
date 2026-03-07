import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getPolarAuthUrl } from "@/lib/wearables/polar";
import { getGarminAuthUrl } from "@/lib/wearables/garmin";

/**
 * GET /api/wearables/connect?provider=polar|garmin
 * Redirects user to OAuth authorization page
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const provider = request.nextUrl.searchParams.get("provider");
  const baseUrl = request.nextUrl.origin;
  const redirectUri = `${baseUrl}/api/wearables/${provider}/callback`;

  try {
    let authUrl: string;

    if (provider === "polar") {
      authUrl = getPolarAuthUrl(redirectUri);
    } else if (provider === "garmin") {
      authUrl = getGarminAuthUrl(redirectUri);
    } else {
      return NextResponse.json(
        { error: "Invalid provider. Use 'polar' or 'garmin'" },
        { status: 400 }
      );
    }

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Wearable connect error:", error);
    return NextResponse.redirect(
      `${baseUrl}/dashboard/account?error=wearable_connect_failed`
    );
  }
}
