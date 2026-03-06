import { createClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const challengeId = request.nextUrl.searchParams.get("challenge_id");

  let query = supabase
    .from("activity_logs")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (challengeId) {
    query = query.eq("challenge_id", challengeId);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ activities: data });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { activity_type, value, date, hr_avg, hr_max, notes, challenge_id } =
    body;

  // Validate required fields
  if (!activity_type || !value || !date) {
    return NextResponse.json(
      { error: "activity_type, value, and date are required" },
      { status: 400 }
    );
  }

  if (!["cycling", "moto", "gym"].includes(activity_type)) {
    return NextResponse.json(
      { error: "activity_type must be cycling, moto, or gym" },
      { status: 400 }
    );
  }

  if (typeof value !== "number" || value <= 0) {
    return NextResponse.json(
      { error: "value must be a positive number" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("activity_logs")
    .insert({
      user_id: user.id,
      challenge_id: challenge_id || null,
      activity_type,
      value,
      date,
      hr_avg: hr_avg || null,
      hr_max: hr_max || null,
      notes: notes || null,
      source: "manual",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ activity: data }, { status: 201 });
}
