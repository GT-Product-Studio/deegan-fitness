import Link from "next/link";
import { brand } from "@/config/brand";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="text-center max-w-sm">
        <Link href="/" className="block mb-8">
          <h1 className="font-display text-3xl tracking-widest">
            {brand.nav.logoPrefix} <span className="text-gold">{brand.nav.logoAccent}</span>
          </h1>
        </Link>

        <p className="text-gold text-[10px] font-bold tracking-[0.3em] uppercase mb-3">
          404
        </p>
        <h2 className="font-display text-4xl uppercase leading-none mb-4">
          Page Not Found
        </h2>
        <p className="text-muted text-sm leading-relaxed mb-8">
          This page doesn&apos;t exist. Maybe it moved, maybe it was never here.
          Either way, let&apos;s get you back on track.
        </p>
        <Link
          href="/"
          className="inline-block bg-army text-white px-8 py-4 text-xs font-bold tracking-widest uppercase hover:bg-army-light transition"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
