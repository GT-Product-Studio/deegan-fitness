import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
  typescript: true,
});

export const PRICE_ID = process.env.STRIPE_PRICE_ID!;

// Client-side Stripe loader (for checkout redirects if needed)
export function getStripe() {
  return stripe;
}
