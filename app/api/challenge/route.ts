import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  // Get active challenge for current month
  const { data: challenge } = await supabase
    .from("challenges")
    .select("*")
    .eq("month", month)
    .eq("year", year)
    .eq("active", true)
    .single();

  if (!challenge) {
    return NextResponse.json({ challenge: null, stats: null, leaderboard: [] });
  }

  // Get user's stats from leaderboard view
  const { data: leaderboard } = await supabase
    .from("challenge_leaderboard")
    .select("*")
    .eq("challenge_id", challenge.id)
    .order("total_score", { ascending: false });

  const userStats = leaderboard?.find((row) => row.user_id === user.id) ?? null;

  return NextResponse.json({
    challenge,
    stats: userStats,
    leaderboard: leaderboard ?? [],
  });
}
