import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { syncWearableData } from "@/lib/wearables/sync";

/**
 * POST /api/wearables/sync
 * Triggers a manual sync of the user's wearable data
 */
export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await syncWearableData(user.id);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Sync error:", error);
    return NextResponse.json(
      { error: "Sync failed" },
      { status: 500 }
    );
  }
}
