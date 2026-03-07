// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// DANGER FITNESS — BRAND CONFIGURATION
// Single-trainer subscription platform for MX riders.
// Haiden Deegan's actual training regimen — one program, no tiers.
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

// ── Types ────────────────────────────────────────────────────────────────────

export interface TrainerConfig {
  name: string;
  firstName: string;
  specialty: string;
  handle: string;
  photo: string;
  bioPhoto?: string;
  bio: string;
  quotes: string[];
  gradient: string;
}

export interface Regiment {
  name: string;
  description: string;
  /** Cycling distance per day */
  cyclingMiles: number;
  /** Moto practice duration */
  motoHours: number;
  /** Gym session duration */
  gymHours: number;
  features: string[];
}

export interface WeekDay {
  day: string;
  type: "training" | "travel" | "race" | "recovery";
  label: string;
  description: string;
}

export interface HRZone {
  zone: number;
  name: string;
  /** Percentage of max HR — low end */
  minPct: number;
  /** Percentage of max HR — high end */
  maxPct: number;
  description: string;
  color: string;
}

export interface SubscriptionConfig {
  displayName: string;
  price: number;
  priceFormatted: string;
  priceDollars: string;
  priceCents: string;
  description: string;
  features: string[];
  pillLabel: string;
}

export interface TestimonialConfig {
  quote: string;
  name: string;
  result: string;
  program: string;
}

export interface ReelConfig {
  src: string;
  specialty: string;
  name: string;
}

export interface StatConfig {
  value: string;
  label: string;
}

// ── Brand Config ─────────────────────────────────────────────────────────────

export const brand = {

  // ─── Site Identity ───────────────────────────────────────────────────────────
  name: "Danger Fitness",
  shortName: "DANGER",
  tagline: "Train Like a Champion",
  description:
    "Haiden Deegan's real MX training regimen — road cycling, motocross practice, and gym work. Synced to your watch. Race the champ.",
  domain: "https://deegan-fitness.vercel.app",
  supportEmail: "support@dangerfitness.com",
  fromEmail: "Danger Fitness <noreply@dangerfitness.com>",
  packageName: "danger-fitness",

  // ─── Navigation / Logo ───────────────────────────────────────────────────────
  nav: {
    logoPrefix: "DANGER",
    logoAccent: "FITNESS",
    adminLogoPrefix: "DANGER",
    adminLogoAccent: "ADMIN",
    dashboardLogoPrefix: "DANGER",
    dashboardLogoAccent: "Fitness",
  },

  // ─── Hero Section ────────────────────────────────────────────────────────────
  hero: {
    headline: "TRAIN LIKE DANGER",
    subheadline: "The exact regiment that built a two-time champion.",
    ctaLabel: "Start Training — $19.99/mo",
    ctaSecondaryLabel: "See the Program",
    heroImage: "/images/deegan/deegan-sx-11.jpg",
    heroVideo: "/videos/braap_hero.mp4",
    /** Featured quote below the hero */
    featuredQuote:
      "50 miles on the bike. 2 hours on the track. Hour and a half in the gym. Every single day.",
    featuredQuoteAuthor: "Haiden Deegan",
    featuredQuoteProgram: "Daily Regiment",
  },

  // ─── Proof Bar (Stats) ──────────────────────────────────────────────────────
  stats: [
    { value: "2×", label: "SMX Champion" },
    { value: "1.5M", label: "Instagram" },
    { value: "210", label: "Avg Peak BPM" },
    { value: "200+", label: "Miles/Week" },
  ] satisfies StatConfig[],

  // ─── Trainer ─────────────────────────────────────────────────────────────────
  trainer: {
    name: "Haiden Deegan",
    firstName: "Haiden",
    age: 19,
    hometown: "Temecula, CA",
    specialty: "Motocross & Supercross",
    handle: "@haidendeegan",
    photo: "/images/deegan/deegan-sx-9.jpg",
    bioPhoto: "/images/deegan/deegan-1.jpg",
    heroPhoto: "/images/deegan/deegan-hero-poster.jpg",
    stadiumPhoto: "/images/deegan/deegan-sx-1.jpg",
    bio: "Two-time 250cc SuperMotocross Champion. Two-time AMA Motocross 250cc Champion. 2025 AMA Supercross 250cc West Champion. At 19, Haiden Deegan is the most dominant young rider in motocross — and his edge isn't just talent. It's the regiment. 50 miles on the road bike. 2 hours on the track. An hour and a half in the gym. Every single day. Now you can train the same way.",
    titles: [
      "2× 250cc SMX Champion",
      "2× AMA Motocross 250cc Champion",
      "2025 AMA Supercross 250cc West Champion",
    ],
    team: "Monster Energy Yamaha Star Racing",
    quotes: [
      "The bike doesn't lie. You either put the work in or you didn't.",
      "50 miles before most people wake up.",
      "Recovery isn't rest. Recovery is preparation.",
      "Heart rate doesn't care about excuses.",
      "Race week doesn't start Saturday. It starts Monday.",
      "You can't fake fitness on race day.",
      "The regiment is the edge.",
    ],
    gradient: "linear-gradient(135deg, #0A0A0A, #29F000)",
  } satisfies TrainerConfig & {
    age: number;
    hometown: string;
    titles: string[];
    team: string;
    heroPhoto: string;
    stadiumPhoto: string;
  },

  // ─── The Regiment (Haiden's actual daily training) ────────────────────────────
  regiment: {
    name: "The Regiment",
    description: "Haiden's actual daily training. No shortcuts. No excuses.",
    cyclingMiles: 50,
    motoHours: 2,
    gymHours: 1.5,
    features: [
      "50-mile daily road ride",
      "2-hr moto practice",
      "1.5-hr gym session",
      "Exact HR zone targets",
      "Haiden's race-week structure",
      "Benchmark against Haiden's stats",
      "Recovery programming",
      "Race-week schedule adjustments",
    ],
  } satisfies Regiment,

  // ─── Weekly Regiment Structure ───────────────────────────────────────────────
  weekSchedule: [
    {
      day: "Monday",
      type: "training",
      label: "FULL SEND",
      description: "Road bike + Moto + Gym — the full regiment",
    },
    {
      day: "Tuesday",
      type: "training",
      label: "FULL SEND",
      description: "Road bike + Moto + Gym — build on yesterday",
    },
    {
      day: "Wednesday",
      type: "training",
      label: "FULL SEND",
      description: "Road bike + Moto + Gym — midweek push",
    },
    {
      day: "Thursday",
      type: "travel",
      label: "TRAVEL / TRAIN",
      description: "Travel day on race weeks — gym + mobility if home",
    },
    {
      day: "Friday",
      type: "travel",
      label: "TRAVEL / PREP",
      description: "Pre-race prep on race weeks — light session if home",
    },
    {
      day: "Saturday",
      type: "race",
      label: "RACE DAY",
      description: "Race or full training day if off-week",
    },
    {
      day: "Sunday",
      type: "recovery",
      label: "RECOVER",
      description: "Active recovery — mobility, stretching, rest",
    },
  ] satisfies WeekDay[],

  // ─── Heart Rate Zones ────────────────────────────────────────────────────────
  hrZones: [
    {
      zone: 1,
      name: "Recovery",
      minPct: 50,
      maxPct: 60,
      description: "Easy effort. Warm-up, cool-down, active recovery.",
      color: "#808080",
    },
    {
      zone: 2,
      name: "Endurance",
      minPct: 60,
      maxPct: 70,
      description: "Aerobic base. Long road rides live here.",
      color: "#29F000",
    },
    {
      zone: 3,
      name: "Tempo",
      minPct: 70,
      maxPct: 80,
      description: "Sustained effort. Moto practice pace.",
      color: "#FFD700",
    },
    {
      zone: 4,
      name: "Threshold",
      minPct: 80,
      maxPct: 90,
      description: "Race pace. Where champions are made.",
      color: "#FF6B00",
    },
    {
      zone: 5,
      name: "Redline",
      minPct: 90,
      maxPct: 100,
      description: "Max effort. Sprint finishes. Holeshots.",
      color: "#FF0000",
    },
  ] satisfies HRZone[],

  // ─── Haiden's Benchmark Stats ────────────────────────────────────────────────
  benchmarks: {
    weeklyMiles: 200,
    dailyCyclingMiles: 50,
    dailyMotoHours: 2,
    dailyGymHours: 1.5,
    peakHR: 210,
    restingHR: 42,
    avgRideHR: 145,
    avgMotoHR: 175,
    avgGymHR: 155,
  },

  // ─── Subscription ────────────────────────────────────────────────────────────
  subscription: {
    displayName: "The Danger Challenge",
    price: 19.99,
    priceFormatted: "$19.99",
    priceDollars: "$19",
    priceCents: ".99",
    description:
      "Haiden's exact daily training regiment — HR zone training, benchmark tracking, and race-week programming.",
    features: [
      "Haiden's actual daily regiment",
      "Weekly programming that follows the race season",
      "Heart rate zone training guides",
      "Garmin & Polar watch sync",
      "Benchmark your stats against Haiden's",
      "Monthly 30-day challenge + leaderboard",
      "Race-week schedule adjustments",
      "Cancel anytime",
    ],
    pillLabel: "$19.99/mo · Cancel anytime",
  } satisfies SubscriptionConfig,

  // ─── Wearable Integration ───────────────────────────────────────────────────
  wearables: {
    garmin: {
      name: "Garmin",
      logo: "/images/garmin-logo.svg",
      apiName: "Garmin Connect",
      oauthType: "OAuth2 PKCE",
      dataPoints: ["heart_rate", "activities", "daily_summary", "stress"],
    },
    polar: {
      name: "Polar",
      logo: "/images/polar-logo.svg",
      apiName: "Polar AccessLink",
      oauthType: "OAuth2",
      dataPoints: ["heart_rate", "activities", "training_load", "recovery"],
    },
  },

  // ─── Reels / Videos ──────────────────────────────────────────────────────────
  reels: [
    {
      src: "/videos/braap_hero.mp4",
      specialty: "Motocross",
      name: "Haiden Deegan",
    },
  ] satisfies ReelConfig[],

  // ─── Social ──────────────────────────────────────────────────────────────────
  social: {
    instagramHandle: "@haidendeegan",
    tiktokHandle: "@haidendeegan",
    youtubeHandle: "@DangerBoyDeegan",
  },

  // ─── Theme Colors ────────────────────────────────────────────────────────────
  // Monster Energy green + dark MX aesthetic
  colors: {
    /** Primary accent — Monster Energy green */
    primary: "#29F000",
    primaryDark: "#22D400",
    /** Background — near-black */
    background: "#0A0A0A",
    backgroundCard: "#111111",
    backgroundElevated: "#1A1A1A",
    /** Text */
    textPrimary: "#FFFFFF",
    textSecondary: "#A0A0A0",
    textMuted: "#666666",
    /** Borders */
    border: "#222222",
    borderLight: "#333333",
    /** HR Zone colors (also defined in hrZones above) */
    zoneRecovery: "#808080",
    zoneEndurance: "#29F000",
    zoneTempo: "#FFD700",
    zoneThreshold: "#FF6B00",
    zoneRedline: "#FF0000",
    /** Email */
    emailAccent: "#29F000",
    emailDarkBg: "#0A0A0A",
    emailCardBg: "#111111",
    emailBorder: "#222222",
    emailMuted: "#888888",
  },

  // ─── Legal ───────────────────────────────────────────────────────────────────
  legal: {
    entityName: "Danger Fitness",
  },
} as const;

// ── Derived helpers ──────────────────────────────────────────────────────────

/** Calculate personal HR zones based on max heart rate */
export function calculateHRZones(maxHR: number) {
  return brand.hrZones.map((zone) => ({
    ...zone,
    minBPM: Math.round(maxHR * (zone.minPct / 100)),
    maxBPM: Math.round(maxHR * (zone.maxPct / 100)),
  }));
}
