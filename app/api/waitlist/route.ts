import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

// NOTE: Requires a "waitlist" table in Supabase:
//   CREATE TABLE IF NOT EXISTS waitlist (
//     id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
//     email text UNIQUE NOT NULL,
//     created_at timestamptz DEFAULT now()
//   );
//   ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

export async function POST(request: NextRequest) {
  try {
    const { email } = (await request.json()) as { email?: string };

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email required" },
        { status: 400 }
      );
    }

    const db = createAdminClient();

    // Upsert — if email already exists, just succeed silently (don't leak info)
    const { error } = await db
      .from("waitlist")
      .upsert({ email: email.toLowerCase().trim() }, { onConflict: "email" });

    if (error) {
      console.error("Waitlist insert error:", error);
      return NextResponse.json(
        { error: "Something went wrong" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Waitlist error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
