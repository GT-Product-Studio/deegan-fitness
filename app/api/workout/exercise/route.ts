import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * POST /api/workout/exercise — Start tracking an exercise
 * Body: { sessionId, exerciseId }
 */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { sessionId, exerciseId } = await request.json();
  if (!sessionId || !exerciseId) {
    return NextResponse.json({ error: "sessionId and exerciseId required" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Verify session belongs to user
  const { data: session } = await admin
    .from("workout_sessions")
    .select("id")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .eq("status", "active")
    .single();

  if (!session) {
    return NextResponse.json({ error: "No active session found" }, { status: 404 });
  }

  const { data: timestamp, error } = await admin
    .from("exercise_timestamps")
    .upsert(
      {
        session_id: sessionId,
        exercise_id: exerciseId,
        started_at: new Date().toISOString(),
        ended_at: null,
      },
      { onConflict: "session_id,exercise_id" }
    )
    .select()
    .single();

  if (error) {
    console.error("Failed to start exercise:", error);
    return NextResponse.json({ error: "Failed to start exercise" }, { status: 500 });
  }

  return NextResponse.json({ timestamp });
}

/**
 * PATCH /api/workout/exercise — Complete an exercise
 * Body: { sessionId, exerciseId }
 */
export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { sessionId, exerciseId } = await request.json();
  if (!sessionId || !exerciseId) {
    return NextResponse.json({ error: "sessionId and exerciseId required" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Verify session belongs to user
  const { data: session } = await admin
    .from("workout_sessions")
    .select("id")
    .eq("id", sessionId)
    .eq("user_id", user.id)
    .single();

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const { data: timestamp, error } = await admin
    .from("exercise_timestamps")
    .update({ ended_at: new Date().toISOString() })
    .eq("session_id", sessionId)
    .eq("exercise_id", exerciseId)
    .select()
    .single();

  if (error) {
    console.error("Failed to complete exercise:", error);
    return NextResponse.json({ error: "Failed to complete exercise" }, { status: 500 });
  }

  return NextResponse.json({ timestamp });
}
