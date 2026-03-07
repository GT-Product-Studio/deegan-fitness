import { NextRequest, NextResponse } from "next/server";
import { getPolarAuthUrl } from "@/lib/wearables/polar";

/**
 * GET /api/wearables/debug
 * Shows the exact OAuth URLs being generated for debugging
 */
export async function GET(request: NextRequest) {
  const baseUrl = request.nextUrl.origin;
  const polarCallbackUrl = `${baseUrl}/api/wearables/polar/callback`;
  
  let polarAuthUrl = "ERROR";
  try {
    polarAuthUrl = getPolarAuthUrl(polarCallbackUrl);
  } catch (e) {
    polarAuthUrl = `Error: ${e instanceof Error ? e.message : String(e)}`;
  }

  return NextResponse.json({
    baseUrl,
    polar: {
      callbackUrl: polarCallbackUrl,
      authUrl: polarAuthUrl,
      registeredCallbackUrl: "https://deegan-fitness.vercel.app/api/wearables/polar/callback",
      match: polarCallbackUrl === "https://deegan-fitness.vercel.app/api/wearables/polar/callback",
      clientId: process.env.POLAR_CLIENT_ID ? `${process.env.POLAR_CLIENT_ID.substring(0, 8)}...` : "NOT SET",
      clientSecretSet: !!process.env.POLAR_CLIENT_SECRET,
    },
    envCheck: {
      POLAR_CLIENT_ID: !!process.env.POLAR_CLIENT_ID,
      POLAR_CLIENT_SECRET: !!process.env.POLAR_CLIENT_SECRET,
      SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    instructions: {
      step1: "Verify 'match' is true above",
      step2: "If steviecbic@gmail.com already authorized: go to https://flow.polar.com/settings/authorizations to revoke",
      step3: "Try auth URL in incognito, log in with stephencbickel41@gmail.com",
    }
  });
}
