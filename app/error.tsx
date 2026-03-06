"use client";

import Link from "next/link";
import { brand } from "@/config/brand";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="text-center max-w-sm">
        <Link href="/" className="block mb-8">
          <h1 className="font-display text-3xl tracking-widest">
            {brand.nav.logoPrefix} <span className="text-gold">{brand.nav.logoAccent}</span>
          </h1>
        </Link>

        <p className="text-rose text-[10px] font-bold tracking-[0.3em] uppercase mb-3">
          Error
        </p>
        <h2 className="font-display text-4xl uppercase leading-none mb-4">
          Something Broke
        </h2>
        <p className="text-muted text-sm leading-relaxed mb-8">
          We hit an unexpected error. Try again, or head back to the homepage.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={reset}
            className="w-full bg-army text-white py-4 text-xs font-bold tracking-widest uppercase hover:bg-army-light transition"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="w-full block border border-card-border py-4 text-xs font-bold tracking-widest uppercase hover:bg-card transition text-center"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
