// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// BRAND CONFIGURATION
// Edit this file to customise the entire platform for your influencer brand.
// Every brand-specific string in the app reads from this config.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ── Types ────────────────────────────────────────────────────────────────────

export interface TrainerConfig {
  name: string;
  firstName: string;
  specialty: string;
  handle: string;
  photo: string;
  /** Optional separate photo for the trainer bio section (falls back to photo) */
  bioPhoto?: string;
  bio: string;
  quotes: string[];
  /** CSS gradient used as accent background on dashboard hero */
  gradient: string;
}

export interface ProgramConfig {
  /** Display name shown on cards & checkout, e.g. "30-Day Sculpt Challenge" */
  name: string;
  price: number;
  priceFormatted: string;
  /** Dollar portion for split display, e.g. "$49" */
  priceDollars: string;
  /** Cents portion, e.g. ".99" */
  priceCents: string;
  /** Short blurb for cards */
  description: string;
  /** Longer description for checkout page */
  checkoutDescription: string;
  /** Bullet-point features for checkout */
  checkoutFeatures: string[];
  /** Bullet-point features for the landing-page program card */
  cardFeatures: string[];
  /** Duration label, e.g. "30 Days" */
  durationLabel: string;
  /** Total number of days */
  totalDays: number;
}

export interface TestimonialConfig {
  quote: string;
  name: string;
  result: string;
  program: string;
}

export interface SubscriptionConfig {
  displayName: string;
  price: number;
  priceFormatted: string;
  priceDollars: string;
  priceCents: string;
  description: string;
  features: string[];
  /** Short pill label for success page, e.g. "$39.99/mo · Cancel anytime" */
  pillLabel: string;
}

export interface ReelConfig {
  src: string;
  specialty: string;
  name: string;
}

// ── Brand Config ─────────────────────────────────────────────────────────────

export const brand = {

  // ─── Site Identity ───────────────────────────────────────────────────────────
  name: "Your Brand Fitness",
  shortName: "YBF",
  tagline: "Transform Together",
  description:
    "Fitness challenges with your favourite trainers. Day-by-day programming, exercise videos, and real results.",
  /** Full site domain including protocol — used for metadata, sitemap, robots */
  domain: "https://yourbrand.com",
  supportEmail: "support@yourbrand.com",
  /** Resend "From" address. Override with RESEND_FROM_EMAIL env var. */
  fromEmail: "Your Brand Fitness <noreply@yourbrand.com>",
  /** npm package name — no spaces, lowercase */
  packageName: "influencer-fitness-template",

  // ─── Navigation / Logo ───────────────────────────────────────────────────────
  nav: {
    /** e.g. "YBF" in "YBF FITNESS" */
    logoPrefix: "YBF",
    /** e.g. "FITNESS" — rendered in the accent color */
    logoAccent: "FITNESS",
    adminLogoPrefix: "YBF",
    adminLogoAccent: "ADMIN",
    dashboardLogoPrefix: "YBF",
    dashboardLogoAccent: "Fitness",
  },

  // ─── Hero Section (Landing Page) ─────────────────────────────────────────────
  hero: {
    /** Label above Trainer A in the hero split (e.g. "His") */
    trainerALabel: "His",
    /** Label above Trainer B in the hero split (e.g. "Hers") */
    trainerBLabel: "Hers",
    centerBadgeTop: "YBF",
    centerBadgeBottom: "Fitness",
    ctaTrainerA: "His Programs",
    ctaTrainerB: "Her Programs",
    /** Quote in the testimonial strip below the hero */
    featuredQuote:
      "This program broke me down and built me back up in the best way possible.",
    featuredQuoteAuthor: "Jake M.",
    featuredQuoteProgram: "30-Day Challenge",
  },

  // ─── Trainers ────────────────────────────────────────────────────────────────
  // Internal slugs used in URLs, DB, and Stripe env vars:
  //   trainerA, trainerB, couples
  // Change these slugs project-wide if you prefer different identifiers.
  trainers: {
    trainerA: {
      name: "Trainer A Name",
      firstName: "TrainerA",
      specialty: "Strength & Conditioning",
      handle: "@trainera",
      photo: "/images/trainerA.jpg",
      bioPhoto: "/images/trainerA-bio.jpg",
      bio: "Trainer A biography goes here. Replace with your trainer's story, background, and credentials. This appears on the landing page trainer section.",
      quotes: [
        "Every rep counts. Every day matters.",
        "Discipline beats motivation.",
        "No shortcuts. Just work.",
        "Show up. Put in the work.",
        "Consistency beats intensity.",
        "Your future self is watching.",
        "The pain today is strength tomorrow.",
      ],
      gradient: "linear-gradient(135deg, #2e3a1e, #C8A800)",
    } satisfies TrainerConfig,

    trainerB: {
      name: "Trainer B Name",
      firstName: "TrainerB",
      specialty: "Sculpt & Tone",
      handle: "@trainerb",
      photo: "/images/trainerB.jpg",
      bioPhoto: "/images/trainerB-bio.jpg",
      bio: "Trainer B biography goes here. Replace with your trainer's story, background, and credentials. This appears on the landing page trainer section.",
      quotes: [
        "Strong is beautiful.",
        "Your body can do it — convince your mind.",
        "Sweat now, glow later.",
        "One workout at a time.",
        "You didn't come this far to only come this far.",
        "Feel the burn, love the result.",
        "Progress over perfection.",
      ],
      gradient: "linear-gradient(135deg, #4a1a2e, #C8A800)",
    } satisfies TrainerConfig,

    couples: {
      name: "Trainer A & Trainer B",
      firstName: "Both",
      specialty: "Together",
      handle: "@yourbrand",
      photo: "/images/trainerA.jpg", // not used directly for couples hero
      bio: "",
      quotes: [
        "Better together. Stronger together.",
        "The couple that trains together stays together.",
        "Push each other. Support each other.",
        "Two bodies, one mission.",
        "Your partner is your greatest accountability partner.",
        "21 days. Side by side.",
        "You signed up together. Now finish together.",
      ],
      gradient: "linear-gradient(135deg, #1a2e4a, #C8A800)",
    } satisfies TrainerConfig,
  },

  // ─── Programs (One-Time Purchases) ───────────────────────────────────────────
  // Keys match the pattern: {trainerSlug}-{tier}
  programs: {
    "trainerA-30": {
      name: "30-Day Strength Challenge",
      price: 49.99,
      priceFormatted: "$49.99",
      priceDollars: "$49",
      priceCents: ".99",
      description: "30 days of no-nonsense strength & conditioning.",
      checkoutDescription:
        "Build the habit. 30 days of strength & conditioning to kickstart your transformation.",
      checkoutFeatures: [
        "30-day structured plan",
        "Day-by-day workouts",
        "Exercise video library",
        "Progress tracking",
        "Yours to keep",
      ],
      cardFeatures: [
        "30 days of strength training",
        "Strength & conditioning workouts",
        "Exercise video library",
        "Progress tracking",
        "Yours to keep",
      ],
      durationLabel: "30 Days",
      totalDays: 30,
    } satisfies ProgramConfig,

    "trainerA-60": {
      name: "60-Day Strength Challenge",
      price: 69.99,
      priceFormatted: "$69.99",
      priceDollars: "$69",
      priceCents: ".99",
      description: "60-day muscle building program.",
      checkoutDescription: "60 days of progressive strength training.",
      checkoutFeatures: [],
      cardFeatures: [],
      durationLabel: "60 Days",
      totalDays: 60,
    } satisfies ProgramConfig,

    "trainerA-90": {
      name: "90-Day Strength Challenge",
      price: 89.99,
      priceFormatted: "$89.99",
      priceDollars: "$89",
      priceCents: ".99",
      description: "90-day total body transformation.",
      checkoutDescription: "90 days of total body transformation.",
      checkoutFeatures: [],
      cardFeatures: [],
      durationLabel: "90 Days",
      totalDays: 90,
    } satisfies ProgramConfig,

    "trainerB-30": {
      name: "30-Day Sculpt Challenge",
      price: 49.99,
      priceFormatted: "$49.99",
      priceDollars: "$49",
      priceCents: ".99",
      description: "30 days of sculpt & tone training.",
      checkoutDescription:
        "30 days of sculpt-focused training to build curves and boost confidence.",
      checkoutFeatures: [
        "30-day structured plan",
        "Day-by-day workouts",
        "Exercise video library",
        "Progress tracking",
        "Yours to keep",
      ],
      cardFeatures: [
        "30 days of sculpt & tone training",
        "Glute-focused programs",
        "Exercise video library",
        "Progress tracking",
        "Yours to keep",
      ],
      durationLabel: "30 Days",
      totalDays: 30,
    } satisfies ProgramConfig,

    "trainerB-60": {
      name: "60-Day Sculpt Challenge",
      price: 69.99,
      priceFormatted: "$69.99",
      priceDollars: "$69",
      priceCents: ".99",
      description: "60-day sculpt & burn program.",
      checkoutDescription: "60 days of progressive sculpt training.",
      checkoutFeatures: [],
      cardFeatures: [],
      durationLabel: "60 Days",
      totalDays: 60,
    } satisfies ProgramConfig,

    "trainerB-90": {
      name: "90-Day Sculpt Challenge",
      price: 89.99,
      priceFormatted: "$89.99",
      priceDollars: "$89",
      priceCents: ".99",
      description: "90-day full body transformation.",
      checkoutDescription: "90 days of full body sculpt transformation.",
      checkoutFeatures: [],
      cardFeatures: [],
      durationLabel: "90 Days",
      totalDays: 90,
    } satisfies ProgramConfig,

    "couples-ab": {
      name: "Couples AB Challenge",
      price: 29.99,
      priceFormatted: "$29.99",
      priceDollars: "$29",
      priceCents: ".99",
      description: "21 days of daily core work for two.",
      checkoutDescription:
        "21 days of daily core work designed for two. Same workout, done together — the perfect way to start your fitness journey as a couple.",
      checkoutFeatures: [
        "21-day core program",
        "Do it side-by-side every day",
        "Beginner-friendly & scalable",
        "Exercise video library",
        "Yours to keep",
      ],
      cardFeatures: [
        "21-day core program for two",
        "Do it side-by-side, every day",
        "Beginner-friendly & scalable",
        "Exercise video library",
        "Yours to keep",
      ],
      durationLabel: "21 Days",
      totalDays: 21,
    } satisfies ProgramConfig,
  },

  // ─── Subscriptions ───────────────────────────────────────────────────────────
  subscriptions: {
    monthly: {
      displayName: "Monthly Challenge",
      price: 39.99,
      priceFormatted: "$39.99",
      priceDollars: "$39",
      priceCents: ".99",
      description:
        "A fresh challenge every month. Full access to all programs.",
      features: [
        "Rotating monthly challenge from both trainers",
        "Full access to all programs",
        "Exercise video library",
        "Progress tracking",
        "Cancel anytime",
      ],
      pillLabel: "$39.99/mo · Cancel anytime",
    } satisfies SubscriptionConfig,

    vip: {
      displayName: "VIP",
      price: 199.99,
      priceFormatted: "$199.99",
      priceDollars: "$199",
      priceCents: ".99",
      description:
        "The full experience. Everything in Monthly Challenge plus live coaching.",
      features: [
        "Everything in Monthly Challenge",
        "Monthly live Q&A with Trainer A",
        "Monthly live Q&A with Trainer B",
        "Private coaching community",
        "VIP-only content drops",
        "Cancel anytime",
      ],
      pillLabel: "$199.99/mo · Cancel anytime",
    } satisfies SubscriptionConfig,
  },

  // ─── Testimonials ────────────────────────────────────────────────────────────
  testimonials: {
    /** Landing page testimonial cards */
    landing: [
      {
        quote:
          "The structure kept me accountable every single day — I dropped 14 lbs and actually kept it off.",
        name: "Jake M.",
        result: "Lost 14 lbs in 30 days",
        program: "30-Day Challenge",
      },
      {
        quote:
          "Started with the Couples AB Challenge to ease into it. Three weeks later we were both hooked.",
        name: "Chris & Taylor",
        result: "Core strength in 21 days",
        program: "Couples AB Challenge",
      },
      {
        quote:
          "The program is exactly what it promises — sculpt and tone. My results have never been better. The exercise videos make it easy to follow.",
        name: "Ashley R.",
        result: "Visible tone in 30 days",
        program: "30-Day Sculpt Challenge",
      },
    ] satisfies TestimonialConfig[],

    /** Per-program checkout testimonials. Keys match program keys. */
    checkout: {
      "trainerA-30": {
        quote:
          "The 30-day program got me into the best shape of my life. Worth every penny.",
        name: "Jake M.",
        result: "Lost 12 lbs",
      },
      "trainerB-30": {
        quote:
          "The 30-day program is no joke. My results have never been better.",
        name: "Ashley R.",
        result: "Visible muscle tone",
      },
      "couples-ab": {
        quote:
          "We did the Couples AB Challenge every morning before work. Three weeks later, we both had visible abs for the first time. Doing the next one together.",
        name: "Chris & Taylor",
        result: "Both got visible abs in 21 days",
      },
    } as Record<string, Omit<TestimonialConfig, "program">>,
  },

  // ─── Training Reels (Landing Page Video Section) ─────────────────────────────
  reels: [
    {
      src: "/videos/trainerA-workout.mp4",
      specialty: "Strength & Conditioning",
      name: "Trainer A",
    },
    {
      src: "/videos/workout3.mp4",
      specialty: "Together",
      name: "Trainer A & Trainer B",
    },
    {
      src: "/videos/trainerB-workout.mp4",
      specialty: "Sculpt & Tone",
      name: "Trainer B",
    },
  ] satisfies ReelConfig[],

  // ─── Social ──────────────────────────────────────────────────────────────────
  social: {
    instagramHandle: "@yourbrand",
  },

  // ─── Theme Colors ────────────────────────────────────────────────────────────
  // These are also defined in globals.css as CSS custom properties.
  // Update both places when changing brand colors.
  colors: {
    gold: "#C8A800",
    goldDark: "#a88c00",
    army: "#2e3a1e",
    armyLight: "#3d4d28",
    /** Email accent color */
    emailAccent: "#c9a84c",
    emailDarkBg: "#0a0a0a",
    emailCardBg: "#111111",
    emailBorder: "#222222",
    emailMuted: "#888888",
    discordBrandColor: "#5865F2",
  },

  // ─── Legal ───────────────────────────────────────────────────────────────────
  legal: {
    entityName: "Your Brand Fitness",
  },
} as const;

// ── Derived helpers ──────────────────────────────────────────────────────────

/** Internal trainer slugs — matches DB `trainer` column values */
export type Trainer = "trainerA" | "trainerB" | "couples";
export type Tier = "30" | "60" | "90" | "ab";
export type SubscriptionPlan = "monthly" | "vip";

/** Look up a trainer config by slug */
export function getTrainerConfig(slug: string): TrainerConfig | undefined {
  return (brand.trainers as Record<string, TrainerConfig>)[slug];
}

/** Look up a program config by "{trainer}-{tier}" key */
export function getProgramConfig(
  trainer: string,
  tier: string,
): ProgramConfig | undefined {
  return (brand.programs as Record<string, ProgramConfig>)[`${trainer}-${tier}`];
}

/** Trainer name lookup map — useful for quick label lookups */
export const TRAINER_LABELS: Record<string, string> = {
  trainerA: brand.trainers.trainerA.name,
  trainerB: brand.trainers.trainerB.name,
  couples: brand.trainers.couples.name,
};

/** Tier label lookup */
export const TIER_LABELS: Record<string, string> = {
  "30": "30-Day Challenge",
  "60": "60-Day Challenge",
  "90": "90-Day Challenge",
  ab: "Couples AB Challenge",
};
