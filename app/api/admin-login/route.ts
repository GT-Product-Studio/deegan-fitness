import { NextResponse } from "next/server";
import { createHash, createHmac } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";

function makeSessionToken(username: string) {
  if (!process.env.ADMIN_SESSION_SECRET) {
    throw new Error("ADMIN_SESSION_SECRET environment variable is required");
  }
  return createHmac("sha256", process.env.ADMIN_SESSION_SECRET).update(username).digest("hex");
}

export async function POST(request: Request) {
  const { username, password } = await request.json();

  if (!username || !password) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }

  // Hash the submitted password the same way we stored it
  const submittedHash = createHash("sha256").update(password).digest("hex");

  // Look up in admin_credentials table
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("admin_credentials")
    .select("username, password_hash")
    .eq("username", username)
    .single();

  // Constant-time-ish delay to prevent timing attacks
  await new Promise((r) => setTimeout(r, 400));

  if (error || !data || data.password_hash !== submittedHash) {
    return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
  }

  const token = makeSessionToken(username);

  const response = NextResponse.json({ ok: true });
  response.cookies.set("hnh_admin", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  return response;
}
