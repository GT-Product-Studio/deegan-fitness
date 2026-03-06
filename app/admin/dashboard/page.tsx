import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";
import { Users, DollarSign, TrendingUp, ShoppingBag, Activity, Crown } from "lucide-react";
import { brand, TRAINER_LABELS as BRAND_TRAINER_LABELS, TIER_LABELS as BRAND_TIER_LABELS } from "@/config/brand";

// ── Derived from brand config ─────────────────────────────────────────────────
const ONE_TIME_PRICES: Record<string, number> = Object.fromEntries(
  Object.entries(brand.programs).map(([key, p]) => [key, p.price])
);

const ONE_TIME_LABELS: Record<string, string> = Object.fromEntries(
  Object.entries(brand.programs).map(([key, p]) => {
    const [trainerSlug] = key.split("-");
    const trainerName = BRAND_TRAINER_LABELS[trainerSlug] ?? trainerSlug;
    return [key, `${trainerName} — ${p.name}`];
  })
);

const SUB_PRICES: Record<string, number> = Object.fromEntries(
  Object.entries(brand.subscriptions).map(([key, s]) => [key, s.price])
);

const SUB_LABELS: Record<string, string> = Object.fromEntries(
  Object.entries(brand.subscriptions).map(([key, s]) => [key, s.displayName])
);

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

function trainerBadge(trainer: string) {
  const styles: Record<string, string> = {
    trainerA: "bg-army/20 text-army-light border border-army/30",
    trainerB: "bg-gold/10 text-gold border border-gold/30",
    couples:  "bg-white/10 text-white/70 border border-white/20",
  };
  return {
    cls:   styles[trainer] ?? "bg-white/10 text-white/50",
    label: BRAND_TRAINER_LABELS[trainer] ?? trainer,
  };
}

function subBadge(planType: string) {
  return planType === "vip"
    ? { cls: "bg-gold/20 text-gold border border-gold/40", label: "VIP 👑" }
    : { cls: "bg-blue-500/10 text-blue-400 border border-blue-500/30", label: "Monthly" };
}

// ── Data fetching ─────────────────────────────────────────────────────────────
async function getData() {
  const db = createAdminClient();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [
    { data: plans },
    { data: subs },
    { data: recentPlans },
    { data: recentSubs },
    { data: allUsers },
    { count: weekSignups },
  ] = await Promise.all([
    db.from("user_plans").select("trainer, tier, purchased_at, user_id"),
    db.from("subscriptions").select("plan_type, status, created_at, user_id, current_period_end"),
    db.from("user_plans")
      .select("trainer, tier, purchased_at, profiles!user_plans_user_id_fkey(email, full_name)")
      .order("purchased_at", { ascending: false })
      .limit(15),
    db.from("subscriptions")
      .select("plan_type, status, created_at, profiles!subscriptions_user_id_fkey(email, full_name)")
      .order("created_at", { ascending: false })
      .limit(15),
    db.from("profiles")
      .select("id, email, full_name, trainer, tier, started_at, created_at")
      .order("created_at", { ascending: false })
      .limit(100),
    db.from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", weekAgo),
  ]);

  // One-time plan breakdown
  const planCounts: Record<string, number> = {};
  for (const p of plans ?? []) {
    const key = `${p.trainer}-${p.tier}`;
    if (ONE_TIME_LABELS[key]) planCounts[key] = (planCounts[key] ?? 0) + 1;
  }

  // Subscription breakdown
  const subCounts: Record<string, number> = { monthly: 0, vip: 0 };
  const activeSubs = (subs ?? []).filter((s) => s.status === "active");
  for (const s of activeSubs) {
    subCounts[s.plan_type] = (subCounts[s.plan_type] ?? 0) + 1;
  }

  // Total unique customers (union of one-time buyers + subscribers)
  const allBuyerIds = new Set([
    ...(plans ?? []).map((p) => p.user_id),
    ...(subs ?? []).map((s) => s.user_id),
  ]);
  const totalCustomers = allBuyerIds.size;

  // Estimated revenue
  const oneTimeRevenue = Object.entries(planCounts).reduce(
    (sum, [key, cnt]) => sum + (ONE_TIME_PRICES[key] ?? 0) * cnt, 0
  );
  const subRevenue = Object.entries(subCounts).reduce(
    (sum, [key, cnt]) => sum + (SUB_PRICES[key] ?? 0) * cnt, 0
  );
  const estimatedRevenue = oneTimeRevenue + subRevenue;

  // Stripe revenue
  let stripeRevenue: number | null = null;
  if (process.env.STRIPE_SECRET_KEY) {
    try {
      const stripe = getStripe();
      const charges = await stripe.charges.list({ limit: 100 });
      stripeRevenue = charges.data
        .filter((c) => c.paid && !c.refunded)
        .reduce((sum, c) => sum + c.amount, 0) / 100;
    } catch { /* invalid key — fall through */ }
  }

  const revenue = stripeRevenue ?? estimatedRevenue;
  const revenueIsEstimate = stripeRevenue === null;
  const totalSold = Object.values(planCounts).reduce((a, b) => a + b, 0)
    + Object.values(subCounts).reduce((a, b) => a + b, 0);

  // Recent sales: merge one-time + subscriptions, sort by date
  type Sale =
    | { type: "plan"; trainer: string; tier: string; date: string; email: string | null; name: string | null }
    | { type: "sub"; planType: string; status: string; date: string; email: string | null; name: string | null };

  const planSales: Sale[] = (recentPlans ?? []).map((r) => {
    const p = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles;
    return {
      type: "plan",
      trainer: r.trainer,
      tier: r.tier,
      date: r.purchased_at,
      email: p?.email ?? null,
      name: p?.full_name ?? null,
    };
  });

  const subSales: Sale[] = (recentSubs ?? []).map((r) => {
    const p = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles;
    return {
      type: "sub",
      planType: r.plan_type,
      status: r.status,
      date: r.created_at,
      email: p?.email ?? null,
      name: p?.full_name ?? null,
    };
  });

  const recentSales = [...planSales, ...subSales]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 20);

  return {
    totalCustomers,
    weekSignups: weekSignups ?? 0,
    revenue,
    revenueIsEstimate,
    planCounts,
    subCounts,
    totalSold,
    recentSales,
    allUsers: allUsers ?? [],
  };
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function AdminDashboardPage() {
  const {
    totalCustomers,
    weekSignups,
    revenue,
    revenueIsEstimate,
    planCounts,
    subCounts,
    totalSold,
    recentSales,
    allUsers,
  } = await getData();

  return (
    <div className="space-y-8">

      {/* Header */}
      <div>
        <p className="text-gold text-[10px] font-bold tracking-[0.3em] uppercase mb-1">{brand.name}</p>
        <h1 className="font-display text-4xl md:text-5xl uppercase leading-none">Sales Dashboard</h1>
        <p className="text-white/30 text-xs mt-2 tracking-widest uppercase">
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users,       label: "Total Customers",  value: totalCustomers.toLocaleString(), sub: "Buyers + subscribers",           color: "text-army-light",  bg: "bg-army/10 border-army/20"         },
          { icon: DollarSign,  label: "Revenue",          value: fmt(revenue),                   sub: revenueIsEstimate ? "Est. (Stripe pending)" : "Via Stripe", color: "text-gold", bg: "bg-gold/10 border-gold/20" },
          { icon: TrendingUp,  label: "New This Week",    value: weekSignups.toLocaleString(),    sub: "Last 7 days",                    color: "text-blue-400",    bg: "bg-blue-500/10 border-blue-500/20" },
          { icon: ShoppingBag, label: "Total Sold",       value: totalSold.toLocaleString(),      sub: "Plans + subscriptions",          color: "text-purple-400",  bg: "bg-purple-500/10 border-purple-500/20" },
        ].map(({ icon: Icon, label, value, sub, color, bg }) => (
          <div key={label} className={`border ${bg} rounded-none p-5`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bg}`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <p className="text-white/50 text-[10px] font-bold tracking-[0.2em] uppercase">{label}</p>
            </div>
            <p className="text-2xl md:text-3xl font-bold leading-none">{value}</p>
            <p className="text-white/30 text-xs mt-1.5 tracking-wide">{sub}</p>
          </div>
        ))}
      </div>

      {/* Plan breakdown */}
      <div>
        <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/40 mb-4">One-Time Programs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {Object.entries(ONE_TIME_LABELS).map(([key, label]) => {
            const count = planCounts[key] ?? 0;
            const price = ONE_TIME_PRICES[key] ?? 0;
            const [trainer] = key.split("-");
            const badge = trainerBadge(trainer);
            return (
              <div key={key} className="border border-white/10 bg-white/3 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 ${badge.cls}`}>{badge.label}</span>
                  <span className="text-white/30 text-xs">{fmt(price)}/once</span>
                </div>
                <p className="text-white/70 text-xs font-bold mb-3 leading-tight">{label}</p>
                <p className="text-2xl font-bold leading-none">{count}</p>
                <p className="text-white/30 text-[10px] mt-1">{fmt(count * price)} est. revenue</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subscription breakdown */}
      <div>
        <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/40 mb-4">
          <Crown className="inline w-3 h-3 mr-1.5 mb-0.5" />Active Subscriptions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {(["monthly", "vip"] as const).map((key) => {
            const count = subCounts[key] ?? 0;
            const price = SUB_PRICES[key];
            const badge = subBadge(key);
            return (
              <div key={key} className="border border-white/10 bg-white/3 p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 ${badge.cls}`}>{badge.label}</span>
                  <span className="text-white/30 text-xs">{fmt(price)}/mo</span>
                </div>
                <p className="text-white/70 text-xs font-bold mb-3 leading-tight">{SUB_LABELS[key]}</p>
                <p className="text-2xl font-bold leading-none">{count}</p>
                <p className="text-white/30 text-[10px] mt-1">{fmt(count * price)}/mo recurring</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Sales */}
      <div>
        <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/40 mb-4 flex items-center gap-2">
          <Activity className="w-3.5 h-3.5" /> Recent Sales
        </h2>
        <div className="border border-white/10 overflow-hidden">
          {recentSales.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-white/30 text-sm">No sales yet — Stripe integration pending.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  {["Customer", "Product", "Type", "Amount", "Date"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-bold tracking-[0.2em] uppercase text-white/30">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentSales.map((sale, i) => {
                  if (sale.type === "plan") {
                    const key = `${sale.trainer}-${sale.tier}`;
                    const badge = trainerBadge(sale.trainer);
                    return (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/3 transition">
                        <td className="px-4 py-3">
                          <p className="font-medium text-white/90 text-xs">{sale.name || sale.email || "—"}</p>
                          {sale.name && <p className="text-white/30 text-[11px] mt-0.5">{sale.email}</p>}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 ${badge.cls}`}>{badge.label}</span>
                            <span className="text-white/60 text-xs">{ONE_TIME_LABELS[key] ?? key}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3"><span className="text-white/30 text-xs">One-time</span></td>
                        <td className="px-4 py-3"><span className="text-gold font-bold text-xs">{fmt(ONE_TIME_PRICES[key] ?? 0)}</span></td>
                        <td className="px-4 py-3 text-white/40 text-xs">{sale.date ? fmtDate(sale.date) : "—"}</td>
                      </tr>
                    );
                  } else {
                    const badge = subBadge(sale.planType);
                    return (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/3 transition">
                        <td className="px-4 py-3">
                          <p className="font-medium text-white/90 text-xs">{sale.name || sale.email || "—"}</p>
                          {sale.name && <p className="text-white/30 text-[11px] mt-0.5">{sale.email}</p>}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 ${badge.cls}`}>{badge.label}</span>
                            <span className="text-white/60 text-xs">{SUB_LABELS[sale.planType] ?? sale.planType}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 ${sale.status === "active" ? "text-green-400 border border-green-500/30 bg-green-500/10" : "text-white/30 border border-white/10"}`}>
                            {sale.status}
                          </span>
                        </td>
                        <td className="px-4 py-3"><span className="text-gold font-bold text-xs">{fmt(SUB_PRICES[sale.planType] ?? 0)}/mo</span></td>
                        <td className="px-4 py-3 text-white/40 text-xs">{sale.date ? fmtDate(sale.date) : "—"}</td>
                      </tr>
                    );
                  }
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* All Users */}
      <div>
        <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/40 mb-4">All Users ({allUsers.length})</h2>
        <div className="border border-white/10 overflow-x-auto">
          {allUsers.length === 0 ? (
            <div className="p-8 text-center"><p className="text-white/30 text-sm">No users yet.</p></div>
          ) : (
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  {["Email", "Name", "Plan", "Started", "Joined"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-bold tracking-[0.2em] uppercase text-white/30">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allUsers.map((u) => {
                  const planKey = u.trainer && u.tier ? `${u.trainer}-${u.tier}` : null;
                  const badge = planKey && ONE_TIME_LABELS[planKey] ? trainerBadge(u.trainer!) : null;
                  return (
                    <tr key={u.id} className="border-b border-white/5 hover:bg-white/3 transition">
                      <td className="px-4 py-3 text-white/70 text-xs font-mono">{u.email}</td>
                      <td className="px-4 py-3 text-white/50 text-xs">{u.full_name || <span className="text-white/20">—</span>}</td>
                      <td className="px-4 py-3">
                        {badge && planKey ? (
                          <div className="flex items-center gap-2">
                            <span className={`text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 ${badge.cls}`}>{badge.label}</span>
                            <span className="text-white/50 text-xs">{ONE_TIME_LABELS[planKey]}</span>
                          </div>
                        ) : <span className="text-white/20 text-xs">—</span>}
                      </td>
                      <td className="px-4 py-3 text-white/40 text-xs">{u.started_at ? fmtDate(u.started_at) : <span className="text-white/20">—</span>}</td>
                      <td className="px-4 py-3 text-white/30 text-xs">{u.created_at ? fmtDate(u.created_at) : "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

    </div>
  );
}
