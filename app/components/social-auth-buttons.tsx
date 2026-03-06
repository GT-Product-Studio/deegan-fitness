"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2 } from "lucide-react";

type Provider = "google" | "apple";

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="17" height="20" viewBox="0 0 17 20" fill="currentColor">
      <path d="M14.044 10.497c-.022-2.63 2.148-3.902 2.245-3.965-1.224-1.789-3.126-2.034-3.802-2.06-1.621-.164-3.17.953-3.99.953-.82 0-2.088-.928-3.432-.903-1.763.026-3.393 1.025-4.304 2.601C-.147 9.897.756 14.847 2.63 17.527c.919 1.31 2.013 2.782 3.448 2.729 1.386-.056 1.909-.887 3.586-.887 1.677 0 2.148.887 3.607.857 1.493-.024 2.436-1.337 3.339-2.655.676-.972 1.107-1.947 1.304-2.556-.03-.012-2.845-1.09-2.87-4.518zM11.417 3.04C12.17 2.116 12.675.88 12.528-.367c-1.149.052-2.536.764-3.356 1.724-.735.85-1.38 2.088-1.208 3.32 1.281.097 2.588-.657 3.453-1.637z" />
    </svg>
  );
}

export function SocialAuthButtons({ redirectTo = "/dashboard" }: { redirectTo?: string }) {
  const [loading, setLoading] = useState<Provider | null>(null);

  async function handleOAuth(provider: Provider) {
    setLoading(provider);
    const supabase = createClient();

    const baseUrl =
      typeof window !== "undefined"
        ? window.location.origin
        : process.env.NEXT_PUBLIC_APP_URL!;

    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${baseUrl}/auth/callback?next=${redirectTo}`,
      },
    });

    // If we get here the redirect didn't happen
    setLoading(null);
  }

  return (
    <div className="space-y-3">
      {/* Google */}
      <button
        onClick={() => handleOAuth("google")}
        disabled={!!loading}
        className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-800 py-3 rounded-xl font-medium text-sm hover:bg-gray-50 transition disabled:opacity-60 shadow-sm"
      >
        {loading === "google" ? (
          <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
        ) : (
          <GoogleIcon />
        )}
        Continue with Google
      </button>

      {/* Apple — hidden until Apple OAuth is enabled in Supabase */}
      {/* TODO: uncomment when Apple provider is configured
      <button
        onClick={() => handleOAuth("apple")}
        disabled={!!loading}
        className="w-full flex items-center justify-center gap-3 bg-black text-white py-3 rounded-xl font-medium text-sm hover:bg-zinc-800 transition disabled:opacity-60"
      >
        {loading === "apple" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <AppleIcon />
        )}
        Continue with Apple
      </button>
      */}

      {/* Divider */}
      <div className="flex items-center gap-3 py-1">
        <div className="flex-1 h-px bg-card-border" />
        <span className="text-xs text-muted">or</span>
        <div className="flex-1 h-px bg-card-border" />
      </div>
    </div>
  );
}
