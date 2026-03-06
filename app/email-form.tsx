"use client";

import { useState } from "react";
import { Loader2, CheckCircle } from "lucide-react";

export default function EmailForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? "Something went wrong.");
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex items-center justify-center gap-2 text-white py-3">
        <CheckCircle className="w-5 h-5 text-primary" />
        <span className="text-sm font-semibold">You&apos;re in! We&apos;ll be in touch.</span>
      </div>
    );
  }

  return (
    <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={handleSubmit}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email address" required
        className="flex-1 bg-white/10 border border-white/20 text-white placeholder-white/40 px-5 py-3.5 text-sm focus:outline-none focus:border-white/60 transition" />
      <button type="submit" disabled={loading}
        className="bg-primary text-black px-8 py-3.5 text-xs font-bold tracking-widest uppercase hover:bg-primary-dark transition shrink-0 disabled:opacity-50 flex items-center justify-center gap-2">
        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
        Send It
      </button>
      {error && <p className="text-zone-redline text-xs text-center sm:text-left">{error}</p>}
    </form>
  );
}
