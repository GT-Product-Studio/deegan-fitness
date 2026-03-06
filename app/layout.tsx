import type { Metadata, Viewport } from "next";
import { Inter, Oswald } from "next/font/google";
import "./globals.css";
import { PwaRegister } from "@/app/components/pwa-register";
import { brand } from "@/config/brand";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const oswald = Oswald({
  variable: "--font-oswald",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#0A0A0A",
};

const fullTitle = `${brand.name} — ${brand.tagline}`;

export const metadata: Metadata = {
  title: fullTitle,
  description: brand.description,
  metadataBase: new URL(brand.domain),

  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: brand.shortName,
    statusBarStyle: "black-translucent",
    startupImage: "/icons/apple-touch-icon.png",
  },
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [
      { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/icons/favicon-32.png",
  },

  openGraph: {
    title: fullTitle,
    description: brand.description,
    url: brand.domain,
    siteName: brand.name,
    images: [{ url: "/images/og-image.jpg", width: 1200, height: 630, alt: brand.name }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: fullTitle,
    description: brand.description,
    images: ["/images/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${oswald.variable} antialiased`}>
        {children}
        <PwaRegister />
      </body>
    </html>
  );
}
