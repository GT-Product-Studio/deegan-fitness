/**
 * Wearable data sync — pulls from Polar/Garmin and writes to activity_logs
 */

import { createClient } from "@/lib/supabase/server";
import {
  getPolarExercises,
  getPolarExerciseZones,
  mapPolarSport,
  parsePolarDuration,
  polarZonesToMinutes,
} from "./polar";
import {
  getGarminActivities,
  mapGarminActivity,
  metersToMiles,
  secondsToHours,
} from "./garmin";

interface SyncResult {
  synced: number;
  skipped: number;
  errors: string[];
}

/**
 * Sync a user's wearable data to activity_logs
 */
export async function syncWearableData(userId: string): Promise<SyncResult> {
  const supabase = await createClient();

  // Get user's wearable connections
  const { data: connections } = await supabase
    .from("wearable_connections")
    .select("*")
    .eq("user_id", userId)
    .eq("sync_status", "active");

  if (!connections || connections.length === 0) {
    return { synced: 0, skipped: 0, errors: ["No active wearable connections"] };
  }

  let totalSynced = 0;
  let totalSkipped = 0;
  const errors: string[] = [];

  // Get current active challenge
  const now = new Date();
  const { data: challenge } = await supabase
    .from("challenges")
    .select("id")
    .eq("active", true)
    .lte("starts_at", now.toISOString())
    .gte("ends_at", now.toISOString())
    .single();

  for (const conn of connections) {
    try {
      if (conn.provider === "polar") {
        const result = await syncPolarData(supabase, userId, conn, challenge?.id);
        totalSynced += result.synced;
        totalSkipped += result.skipped;
        errors.push(...result.errors);
      } else if (conn.provider === "garmin") {
        const result = await syncGarminData(supabase, userId, conn, challenge?.id);
        totalSynced += result.synced;
        totalSkipped += result.skipped;
        errors.push(...result.errors);
      }

      // Update last sync time
      await supabase
        .from("wearable_connections")
        .update({ last_sync_at: new Date().toISOString() })
        .eq("id", conn.id);
    } catch (err) {
      errors.push(`${conn.provider}: ${err instanceof Error ? err.message : "Unknown error"}`);
    }
  }

  return { synced: totalSynced, skipped: totalSkipped, errors };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function syncPolarData(supabase: any, userId: string, conn: any, challengeId?: string): Promise<SyncResult> {
  let synced = 0;
  let skipped = 0;
  const errors: string[] = [];

  try {
    const exercises = await getPolarExercises(conn.access_token);

    for (const exercise of exercises) {
      const activityType = mapPolarSport(exercise.sport, exercise.detailed_sport_info);
      if (!activityType) {
        skipped++;
        continue;
      }

      // Calculate value based on type
      let value: number;
      if (activityType === "cycling") {
        value = Math.round((exercise.distance / 1609.344) * 10) / 10; // meters to miles
      } else {
        value = parsePolarDuration(exercise.duration); // hours
      }

      const date = exercise.start_time.split("T")[0]; // YYYY-MM-DD

      // Check if already synced (prevent duplicates)
      const { data: existing } = await supabase
        .from("activity_logs")
        .select("id")
        .eq("user_id", userId)
        .eq("activity_type", activityType)
        .eq("date", date)
        .eq("source", "polar")
        .limit(1);

      if (existing && existing.length > 0) {
        skipped++;
        continue;
      }

      // Get HR zones if available
      let hrZoneMinutes = null;
      try {
        const zones = await getPolarExerciseZones(conn.access_token, exercise.id);
        if (zones.length > 0) {
          hrZoneMinutes = polarZonesToMinutes(zones);
        }
      } catch {
        // Zone data not critical
      }

      const { error } = await supabase.from("activity_logs").insert({
        user_id: userId,
        challenge_id: challengeId || null,
        activity_type: activityType,
        value,
        date,
        source: "polar",
        hr_avg: exercise.heart_rate?.average || null,
        hr_max: exercise.heart_rate?.maximum || null,
        hr_zone_minutes: hrZoneMinutes,
        notes: `${exercise.sport} — synced from Polar`,
      });

      if (error) {
        errors.push(`Polar insert error: ${error.message}`);
      } else {
        synced++;
      }
    }
  } catch (err) {
    errors.push(`Polar sync error: ${err instanceof Error ? err.message : "Unknown"}`);
  }

  return { synced, skipped, errors };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function syncGarminData(supabase: any, userId: string, conn: any, challengeId?: string): Promise<SyncResult> {
  let synced = 0;
  let skipped = 0;
  const errors: string[] = [];

  try {
    // Sync last 7 days
    const endTime = Math.floor(Date.now() / 1000);
    const startTime = endTime - 7 * 24 * 60 * 60;

    const activities = await getGarminActivities(conn.access_token, startTime, endTime);

    for (const activity of activities) {
      const activityType = mapGarminActivity(activity.activityType);
      if (!activityType) {
        skipped++;
        continue;
      }

      let value: number;
      if (activityType === "cycling") {
        value = metersToMiles(activity.distanceInMeters);
      } else {
        value = secondsToHours(activity.durationInSeconds);
      }

      const date = new Date(activity.startTimeInSeconds * 1000)
        .toISOString()
        .split("T")[0];

      // Check for duplicates
      const { data: existing } = await supabase
        .from("activity_logs")
        .select("id")
        .eq("user_id", userId)
        .eq("activity_type", activityType)
        .eq("date", date)
        .eq("source", "garmin")
        .limit(1);

      if (existing && existing.length > 0) {
        skipped++;
        continue;
      }

      const { error } = await supabase.from("activity_logs").insert({
        user_id: userId,
        challenge_id: challengeId || null,
        activity_type: activityType,
        value,
        date,
        source: "garmin",
        hr_avg: activity.averageHeartRateInBeatsPerMinute || null,
        hr_max: activity.maxHeartRateInBeatsPerMinute || null,
        notes: `${activity.activityName || activity.activityType} — synced from Garmin`,
      });

      if (error) {
        errors.push(`Garmin insert error: ${error.message}`);
      } else {
        synced++;
      }
    }
  } catch (err) {
    errors.push(`Garmin sync error: ${err instanceof Error ? err.message : "Unknown"}`);
  }

  return { synced, skipped, errors };
}
