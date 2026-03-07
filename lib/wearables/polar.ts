/**
 * Polar AccessLink API integration
 * Docs: https://www.polar.com/accesslink-api/
 * Register: https://admin.polaraccesslink.com
 */

const POLAR_AUTH_URL = "https://flow.polar.com/oauth2/authorization";
const POLAR_TOKEN_URL = "https://polarremote.com/v2/oauth2/token";
const POLAR_API_URL = "https://www.polaraccesslink.com/v3";

export interface PolarTokens {
  access_token: string;
  token_type: string;
  x_user_id: number; // Polar's internal user ID
}

export interface PolarExercise {
  id: string;
  upload_time: string;
  polar_user: string;
  device: string;
  start_time: string;
  duration: string; // ISO 8601 duration e.g. "PT1H30M"
  calories: number;
  distance: number; // meters
  heart_rate: {
    average: number;
    maximum: number;
  };
  training_load: number;
  sport: string;
  detailed_sport_info: string;
  has_route: boolean;
  club_id: number;
  club_name: string;
  zones?: PolarHRZone[];
}

export interface PolarHRZone {
  index: number;
  lower_limit: number;
  upper_limit: number;
  in_zone: string; // ISO 8601 duration
}

export interface PolarDailyActivity {
  date: string;
  created: string;
  calories: number;
  active_calories: number;
  duration: string;
  active_steps: number;
}

export interface PolarContinuousHR {
  date: string;
  heart_rate_samples: {
    sample_time: string;
    hr: number;
  }[];
}

/**
 * Build the Polar OAuth2 authorization URL
 * Note: Polar's authorization endpoint only needs response_type + client_id.
 * The redirect_uri and scopes are configured in the admin portal at
 * https://admin.polaraccesslink.com — passing them here can cause errors.
 */
export function getPolarAuthUrl(_redirectUri: string): string {
  const clientId = process.env.POLAR_CLIENT_ID;
  if (!clientId) throw new Error("POLAR_CLIENT_ID not set");

  const params = new URLSearchParams({
    response_type: "code",
    client_id: clientId,
  });

  return `${POLAR_AUTH_URL}?${params.toString()}`;
}

/**
 * Exchange authorization code for access token
 */
export async function exchangePolarToken(
  code: string,
  redirectUri: string
): Promise<PolarTokens> {
  const clientId = process.env.POLAR_CLIENT_ID;
  const clientSecret = process.env.POLAR_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("Polar credentials not set");

  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const res = await fetch(POLAR_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${basicAuth}`,
      Accept: "application/json",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Polar token exchange failed: ${res.status} ${text}`);
  }

  return res.json();
}

/**
 * Register user with Polar AccessLink (required after first auth)
 */
export async function registerPolarUser(
  accessToken: string,
  polarUserId: number
): Promise<void> {
  const res = await fetch(`${POLAR_API_URL}/users`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
    body: JSON.stringify({ "member-id": polarUserId.toString() }),
  });

  // 409 = already registered, which is fine
  if (!res.ok && res.status !== 409) {
    const text = await res.text();
    throw new Error(`Polar user registration failed: ${res.status} ${text}`);
  }
}

/**
 * Fetch recent exercises from Polar
 */
export async function getPolarExercises(
  accessToken: string
): Promise<PolarExercise[]> {
  const res = await fetch(`${POLAR_API_URL}/exercises`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch Polar exercises: ${res.status} ${text}`);
  }

  return res.json();
}

/**
 * Fetch a single exercise with HR zones
 */
export async function getPolarExerciseDetail(
  accessToken: string,
  exerciseId: string
): Promise<PolarExercise> {
  const res = await fetch(`${POLAR_API_URL}/exercises/${exerciseId}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch exercise detail: ${res.status}`);
  }

  return res.json();
}

/**
 * Fetch HR zones for an exercise
 */
export async function getPolarExerciseZones(
  accessToken: string,
  exerciseId: string
): Promise<PolarHRZone[]> {
  const res = await fetch(
    `${POLAR_API_URL}/exercises/${exerciseId}/heart-rate-zones`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    }
  );

  if (!res.ok) return [];

  const data = await res.json();
  return data.zone || [];
}

/**
 * Fetch continuous heart rate data
 */
export async function getPolarContinuousHR(
  accessToken: string,
  date: string // YYYY-MM-DD
): Promise<PolarContinuousHR | null> {
  const res = await fetch(
    `${POLAR_API_URL}/users/continuous-heart-rate/${date}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: "application/json",
      },
    }
  );

  if (!res.ok) return null;
  return res.json();
}

/**
 * Parse ISO 8601 duration (PT1H30M15S) to hours
 */
export function parsePolarDuration(duration: string): number {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;
  const hours = parseInt(match[1] || "0");
  const minutes = parseInt(match[2] || "0");
  const seconds = parseInt(match[3] || "0");
  return hours + minutes / 60 + seconds / 3600;
}

/**
 * Map Polar sport type to our activity type
 */
export function mapPolarSport(sport: string, detailedSport?: string): "cycling" | "moto" | "gym" | null {
  const s = (sport || "").toLowerCase();
  const d = (detailedSport || "").toLowerCase();

  // Cycling
  if (s.includes("cycling") || s.includes("biking") || d.includes("cycling") || d.includes("road_biking")) {
    return "cycling";
  }

  // Gym / strength / crossfit
  if (
    s.includes("strength") || s.includes("gym") || s.includes("crossfit") ||
    s.includes("weight") || d.includes("strength") || d.includes("gym") ||
    s.includes("circuit") || s.includes("functional")
  ) {
    return "gym";
  }

  // Motorsport / motocross — Polar may classify as "other"
  if (s.includes("motor") || s.includes("moto") || d.includes("motor") || d.includes("moto")) {
    return "moto";
  }

  return null;
}

/**
 * Convert Polar exercise HR zone durations to our format
 */
export function polarZonesToMinutes(zones: PolarHRZone[]): Record<string, number> {
  const result: Record<string, number> = {};
  zones.forEach((z) => {
    const minutes = Math.round(parsePolarDuration(z.in_zone) * 60);
    result[`z${z.index}`] = minutes;
  });
  return result;
}
