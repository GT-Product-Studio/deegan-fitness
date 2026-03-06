"use client";

import { brand } from "@/config/brand";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui, sans-serif",
          backgroundColor: "#ffffff",
          color: "#111111",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          padding: "1rem",
        }}
      >
        <div style={{ textAlign: "center", maxWidth: "24rem" }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            {brand.nav.logoPrefix} <span style={{ color: "#C8A800" }}>{brand.nav.logoAccent}</span>
          </h1>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "1rem" }}>
            Something went wrong
          </h2>
          <p style={{ color: "#777", fontSize: "0.875rem", marginBottom: "1.5rem" }}>
            An unexpected error occurred. Please try again.
          </p>
          <button
            onClick={reset}
            style={{
              backgroundColor: "#2e3a1e",
              color: "#ffffff",
              border: "none",
              padding: "0.75rem 2rem",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.15em",
              textTransform: "uppercase" as const,
              cursor: "pointer",
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}
