import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/workout — Start a workout session
 * Body: { workoutId, dayNumber }
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { workoutId, dayNumber } = await request.json();
  if (!workoutId || !dayNumber) {
    return NextResponse.json({ error: "workoutId and dayNumber required" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Check for existing active session
  const { data: existing } = await admin
    .from("workout_sessions")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  if (existing) {
    // Abandon the old session
    await admin
      .from("workout_sessions")
      .update({ status: "abandoned", ended_at: new Date().toISOString() })
      .eq("id", existing.id);
  }

  const { data: session, error } = await admin
    .from("workout_sessions")
    .insert({
      user_id: user.id,
      workout_id: workoutId,
      day_number: dayNumber,
      started_at: new Date().toISOString(),
      status: "active",
    })
    .select()
    .single();

  if (error) {
    console.error("Failed to start workout session:", error);
    return NextResponse.json({ error: "Failed to start session" }, { status: 500 });
  }

  return NextResponse.json({ session });
}

/**
 * PATCH /api/workout — End a workout session
 * Body: { sessionId }
 */
export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { sessionId } = await request.json();
  if (!sessionId) {
    return NextResponse.json({ error: "sessionId required" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: session, error } = await admin
    .from("workout_sessions")
    .update({
      status: "completed",
      ended_at: new Date().toISOString(),
    })
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("Failed to end workout session:", error);
    return NextResponse.json({ error: "Failed to end session" }, { status: 500 });
  }

  return NextResponse.json({ session });
}

/**
 * GET /api/workout?workoutId=... — Get active session for a workout
 */
export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const workoutId = request.nextUrl.searchParams.get("workoutId");

  const admin = createAdminClient();

  // Get most recent session for this workout (active or completed)
  const query = admin
    .from("workout_sessions")
    .select("*, exercise_timestamps(*)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1);

  if (workoutId) {
    query.eq("workout_id", workoutId);
  } else {
    query.eq("status", "active");
  }

  const { data: sessions, error } = await query;

  if (error) {
    console.error("Failed to fetch workout session:", error);
    return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 });
  }

  return NextResponse.json({ session: sessions?.[0] || null });
}
