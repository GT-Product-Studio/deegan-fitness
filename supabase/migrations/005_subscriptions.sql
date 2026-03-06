-- Migration 005: subscriptions table

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('monthly', 'vip')),
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'incomplete')),
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_policies WHERE policyname = 'Users can view own subscriptions' AND tablename = 'subscriptions') THEN
    CREATE POLICY "Users can view own subscriptions"
      ON subscriptions FOR SELECT
      USING (auth.uid() = user_id);
  END IF;
END $$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_policies WHERE policyname = 'Service role can manage subscriptions' AND tablename = 'subscriptions') THEN
    CREATE POLICY "Service role can manage subscriptions"
      ON subscriptions FOR ALL
      TO service_role
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS subscriptions_stripe_sub_id_idx ON subscriptions (stripe_subscription_id);
CREATE INDEX IF NOT EXISTS subscriptions_user_id_idx ON subscriptions (user_id);
