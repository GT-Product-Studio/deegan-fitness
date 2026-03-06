import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/stripe";
import { Users, DollarSign, TrendingUp, Activity } from "lucide-react";
import { brand } from "@/config/brand";

function fmt(n: number) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

async function getData() {
  const db = createAdminClient();
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const [
    { data: subs },
    { data: recentSubs },
    { data: allUsers },
    { count: weekSignups },
  ] = await Promise.all([
    db.from("subscriptions").select("plan_type, status, created_at, user_id, current_period_end"),
    db.from("subscriptions")
      .select("plan_type, status, created_at, profiles!subscriptions_user_id_fkey(email, full_name)")
      .order("created_at", { ascending: false })
      .limit(20),
    db.from("profiles")
      .select("id, email, full_name, created_at")
      .order("created_at", { ascending: false })
      .limit(100),
    db.from("profiles")
      .select("*", { count: "exact", head: true })
      .gte("created_at", weekAgo),
  ]);

  const activeSubs = (subs ?? []).filter((s) => s.status === "active");
  const totalSubscribers = activeSubs.length;

  // Revenue
  let revenue = totalSubscribers * brand.subscription.price;
  let revenueIsEstimate = true;
  if (process.env.STRIPE_SECRET_KEY) {
    try {
      const stripe = getStripe();
      const charges = await stripe.charges.list({ limit: 100 });
      revenue = charges.data.filter((c) => c.paid && !c.refunded).reduce((sum, c) => sum + c.amount, 0) / 100;
      revenueIsEstimate = false;
    } catch { /* ignore */ }
  }

  type Sale = { date: string; email: string | null; name: string | null; status: string };
  const recentSales: Sale[] = (recentSubs ?? []).map((r) => {
    const p = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles;
    return {
      date: r.created_at,
      email: p?.email ?? null,
      name: p?.full_name ?? null,
      status: r.status,
    };
  });

  return {
    totalSubscribers,
    weekSignups: weekSignups ?? 0,
    revenue,
    revenueIsEstimate,
    recentSales,
    allUsers: allUsers ?? [],
  };
}

export default async function AdminDashboardPage() {
  const { totalSubscribers, weekSignups, revenue, revenueIsEstimate, recentSales, allUsers } = await getData();

  return (
    <div className="space-y-8">
      <div>
        <p className="text-primary text-[10px] font-bold tracking-[0.3em] uppercase mb-1">{brand.name}</p>
        <h1 className="font-display text-4xl md:text-5xl font-bold uppercase leading-none text-white">Admin Dashboard</h1>
        <p className="text-white/30 text-xs mt-2 tracking-widest uppercase">
          {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { icon: Users, label: "Active Subscribers", value: totalSubscribers.toLocaleString(), sub: `@ ${brand.subscription.priceFormatted}/mo`, color: "text-primary", bg: "bg-primary/10 border-primary/20" },
          { icon: DollarSign, label: "Revenue", value: fmt(revenue), sub: revenueIsEstimate ? "Estimated" : "Via Stripe", color: "text-zone-tempo", bg: "bg-zone-tempo/10 border-zone-tempo/20" },
          { icon: TrendingUp, label: "New This Week", value: weekSignups.toLocaleString(), sub: "Last 7 days", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
        ].map(({ icon: Icon, label, value, sub, color, bg }) => (
          <div key={label} className={`border ${bg} p-5`}>
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${bg}`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <p className="text-white/50 text-[10px] font-bold tracking-[0.2em] uppercase">{label}</p>
            </div>
            <p className="text-2xl md:text-3xl font-bold leading-none text-white">{value}</p>
            <p className="text-white/30 text-xs mt-1.5">{sub}</p>
          </div>
        ))}
      </div>

      {/* Recent Subscriptions */}
      <div>
        <h2 className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/40 mb-4 flex items-center gap-2">
          <Activity className="w-3.5 h-3.5" /> Recent Subscriptions
        </h2>
        <div className="border border-white/10 overflow-hidden">
          {recentSales.length === 0 ? (
            <div className="p-8 text-center"><p className="text-white/30 text-sm">No subscriptions yet.</p></div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  {["Customer", "Status", "Amount", "Date"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-bold tracking-[0.2em] uppercase text-white/30">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentSales.map((sale, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/3 transition">
                    <td className="px-4 py-3">
                      <p className="font-medium text-white/90 text-xs">{sale.name || sale.email || "—"}</p>
                      {sale.name && <p className="text-white/30 text-[11px] mt-0.5">{sale.email}</p>}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 ${sale.status === "active" ? "text-primary border border-primary/30 bg-primary/10" : "text-white/30 border border-white/10"}`}>
                        {sale.status}
                      </span>
                    </td>
                    <td className="px-4 py-3"><span className="text-primary font-bold text-xs">{brand.subscription.priceFormatted}/mo</span></td>
                    <td className="px-4 py-3 text-white/40 text-xs">{sale.date ? fmtDate(sale.date) : "—"}</td>
                  </tr>
                ))}
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
                  {["Email", "Name", "Joined"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[10px] font-bold tracking-[0.2em] uppercase text-white/30">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allUsers.map((u: { id: string; email: string; full_name: string | null; created_at: string }) => (
                  <tr key={u.id} className="border-b border-white/5 hover:bg-white/3 transition">
                    <td className="px-4 py-3 text-white/70 text-xs font-mono">{u.email}</td>
                    <td className="px-4 py-3 text-white/50 text-xs">{u.full_name || <span className="text-white/20">—</span>}</td>
                    <td className="px-4 py-3 text-white/30 text-xs">{u.created_at ? fmtDate(u.created_at) : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
