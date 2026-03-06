import {
  brand,
  type Trainer,
  type Tier,
  type SubscriptionPlan,
  getProgramConfig,
} from "@/config/brand";

export type { Trainer, Tier, SubscriptionPlan };

// ── One-time programs ─────────────────────────────────────────────────────────

export interface PlanInfo {
  trainer: Trainer;
  tier: Tier;
  name: string;
  price: number;
  priceFormatted: string;
  description: string;
  stripePriceId: string;
}

const PRICE_IDS: Record<string, string> = {
  "trainerA-30": process.env.NEXT_PUBLIC_STRIPE_PRICE_TRAINER_A_30 || "price_trainerA_30",
  "trainerA-60": process.env.NEXT_PUBLIC_STRIPE_PRICE_TRAINER_A_60 || "price_trainerA_60",
  "trainerA-90": process.env.NEXT_PUBLIC_STRIPE_PRICE_TRAINER_A_90 || "price_trainerA_90",
  "trainerB-30": process.env.NEXT_PUBLIC_STRIPE_PRICE_TRAINER_B_30 || "price_trainerB_30",
  "trainerB-60": process.env.NEXT_PUBLIC_STRIPE_PRICE_TRAINER_B_60 || "price_trainerB_60",
  "trainerB-90": process.env.NEXT_PUBLIC_STRIPE_PRICE_TRAINER_B_90 || "price_trainerB_90",
  "couples-ab":  process.env.NEXT_PUBLIC_STRIPE_PRICE_COUPLES_AB   || "price_couples_ab",
};

function buildPlan(trainer: Trainer, tier: Tier): PlanInfo | null {
  const cfg = getProgramConfig(trainer, tier);
  if (!cfg) return null;
  return {
    trainer,
    tier,
    name: `${brand.trainers[trainer].name} — ${cfg.name}`,
    price: cfg.price,
    priceFormatted: cfg.priceFormatted,
    description: cfg.description,
    stripePriceId: PRICE_IDS[`${trainer}-${tier}`] ?? "",
  };
}

export const plans: PlanInfo[] = (
  [
    ["trainerA", "30"],
    ["trainerA", "60"],
    ["trainerA", "90"],
    ["trainerB", "30"],
    ["trainerB", "60"],
    ["trainerB", "90"],
    ["couples", "ab"],
  ] as [Trainer, Tier][]
)
  .map(([t, tier]) => buildPlan(t, tier))
  .filter((p): p is PlanInfo => p !== null);

export function getPlan(trainer: Trainer, tier: Tier): PlanInfo | undefined {
  return plans.find((p) => p.trainer === trainer && p.tier === tier);
}

// ── Subscription plans ────────────────────────────────────────────────────────

export interface SubscriptionInfo {
  planType: SubscriptionPlan;
  name: string;
  price: number;
  priceFormatted: string;
  description: string;
  features: string[];
  includes?: string;
  stripePriceId: string;
}

export const subscriptionPlans: SubscriptionInfo[] = [
  {
    planType: "monthly",
    name: brand.subscriptions.monthly.displayName,
    price: brand.subscriptions.monthly.price,
    priceFormatted: brand.subscriptions.monthly.priceFormatted,
    description: brand.subscriptions.monthly.description,
    features: [...brand.subscriptions.monthly.features],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY || "price_monthly",
  },
  {
    planType: "vip",
    name: `${brand.shortName} ${brand.subscriptions.vip.displayName}`,
    price: brand.subscriptions.vip.price,
    priceFormatted: brand.subscriptions.vip.priceFormatted,
    description: brand.subscriptions.vip.description,
    features: [...brand.subscriptions.vip.features],
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_VIP || "price_vip",
  },
];

export function getSubscriptionPlan(
  planType: SubscriptionPlan,
): SubscriptionInfo | undefined {
  return subscriptionPlans.find((p) => p.planType === planType);
}
