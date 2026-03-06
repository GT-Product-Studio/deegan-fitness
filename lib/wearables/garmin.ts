/**
 * Garmin Connect Developer Program API integration
 * Docs: https://developer.garmin.com/gc-developer-program/
 * Apply: https://www.garmin.com/en-US/forms/GarminConnectDeveloperAccess/
 *
 * NOTE: Requires approved business developer access.
 * Stephen needs to apply and get credentials before this works.
 */

const GARMIN_AUTH_URL = "https://connect.garmin.com/oAuth/authorize";
const GARMIN_TOKEN_URL = "https://connectapi.garmin.com/oauth-service/oauth/token";
const GARMIN_API_URL = "https://apis.garmin.com";

export interface GarminTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
}

export interface GarminActivity {
  activityId: number;
  activityName: string;
  startTimeInSeconds: number;
  startTimeOffsetInSeconds: number;
  activityType: string;
  durationInSeconds: number;
  distanceInMeters: number;
  averageHeartRateInBeatsPerMinute: number;
  maxHeartRateInBeatsPerMinute: number;
  activeKilocalories: number;
  averageSpeedInMetersPerSecond: number;
  startingLatitudeInDegree: number;
  startingLongitudeInDegree: number;
  deviceName: string;
}

export interface GarminHRSummary {
  calendarDate: string;
  startTimestampGMT: number;
  endTimestampGMT: number;
  maxHeartRate: number;
  minHeartRate: number;
  restingHeartRate: number;
  lastSevenDaysAvgRestingHeartRate: number;
  timelineMetrics: {
    heartRateValues: [number, number][]; // [timestamp, hr]
  };
}

/**
 * Build the Garmin OAuth2 authorization URL
 */
export function getGarminAuthUrl(redirectUri: string): string {
  const clientId = process.env.GARMIN_CLIENT_ID;
  if (!clientId) throw new Error("GARMIN_CLIENT_ID not set");

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: "activity_api health_api",
  });

  return `${GARMIN_AUTH_URL}?${params.toString()}`;
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeGarminToken(
  code: string,
  redirectUri: string
): Promise<GarminTokens> {
  const clientId = process.env.GARMIN_CLIENT_ID;
  const clientSecret = process.env.GARMIN_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("Garmin credentials not set");

  const res = await fetch(GARMIN_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Garmin token exchange failed: ${res.status} ${text}`);
  }

  return res.json();
}

/**
 * Refresh an expired Garmin access token
 */
export async function refreshGarminToken(
  refreshToken: string
): Promise<GarminTokens> {
  const clientId = process.env.GARMIN_CLIENT_ID;
  const clientSecret = process.env.GARMIN_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("Garmin credentials not set");

  const res = await fetch(GARMIN_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: clientId,
      client_secret: clientSecret,
    }),
  });

  if (!res.ok) {
    throw new Error(`Garmin token refresh failed: ${res.status}`);
  }

  return res.json();
}

/**
 * Fetch activities from Garmin (Activity API)
 */
export async function getGarminActivities(
  accessToken: string,
  startTimeInSeconds: number,
  endTimeInSeconds: number
): Promise<GarminActivity[]> {
  const res = await fetch(
    `${GARMIN_API_URL}/wellness-api/rest/activities?uploadStartTimeInSeconds=${startTimeInSeconds}&uploadEndTimeInSeconds=${endTimeInSeconds}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    }
  );

  if (!res.ok) {
    throw new Error(`Failed to fetch Garmin activities: ${res.status}`);
  }

  return res.json();
}

/**
 * Fetch daily heart rate summary
 */
export async function getGarminHRSummary(
  accessToken: string,
  date: string // YYYY-MM-DD
): Promise<GarminHRSummary | null> {
  const res = await fetch(
    `${GARMIN_API_URL}/wellness-api/rest/dailies?calendarDate=${date}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    }
  );

  if (!res.ok) return null;
  const data = await res.json();
  return data[0] || null;
}

/**
 * Map Garmin activity type to our activity type
 */
export function mapGarminActivity(activityType: string): "cycling" | "moto" | "gym" | null {
  const t = (activityType || "").toLowerCase();

  // Cycling
  if (t.includes("cycling") || t.includes("biking") || t === "road_biking" || t === "indoor_cycling") {
    return "cycling";
  }

  // Gym
  if (
    t.includes("strength") || t.includes("gym") || t.includes("crossfit") ||
    t.includes("weight_training") || t.includes("cardio") || t === "indoor_cardio" ||
    t.includes("circuit") || t.includes("hiit")
  ) {
    return "gym";
  }

  // Motorsport
  if (t.includes("motor") || t.includes("moto") || t === "other") {
    // "other" is ambiguous — might need user confirmation
    return null;
  }

  return null;
}

/**
 * Convert Garmin distance (meters) to miles
 */
export function metersToMiles(meters: number): number {
  return Math.round((meters / 1609.344) * 10) / 10;
}

/**
 * Convert Garmin duration (seconds) to hours
 */
export function secondsToHours(seconds: number): number {
  return Math.round((seconds / 3600) * 10) / 10;
}
