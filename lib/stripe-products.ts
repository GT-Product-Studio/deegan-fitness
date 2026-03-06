import { brand } from "@/config/brand";

export interface SubscriptionInfo {
  name: string;
  price: number;
  priceFormatted: string;
  description: string;
  features: string[];
  stripePriceId: string;
}

export const subscriptionPlan: SubscriptionInfo = {
  name: brand.subscription.displayName,
  price: brand.subscription.price,
  priceFormatted: brand.subscription.priceFormatted,
  description: brand.subscription.description,
  features: [...brand.subscription.features],
  stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_SUBSCRIPTION || "price_subscription",
};
