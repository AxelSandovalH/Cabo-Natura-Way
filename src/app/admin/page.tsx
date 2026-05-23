import Link from "next/link";
import {
  Package, ShoppingBag, Users, TrendingUp,
  ArrowRight, Clock, ArrowUpRight, BarChart2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import RevenueChart    from "@/components/admin/RevenueChart";
import TopProductsChart from "@/components/admin/TopProductsChart";

const STATUS_COLORS: Record<string, string> = {
  pending:          "bg-yellow-100 text-yellow-800",
  confirmed:        "bg-blue-100   text-blue-800",
  preparing:        "bg-purple-100 text-purple-800",
  out_for_delivery: "bg-orange-100 text-orange-800",
  delivered:        "bg-green-100  text-green-800",
  cancelled:        "bg-red-100    text-red-800",
};

const STATUS_LABELS: Record<string, string> = {
  pending:          "Pending",
  confirmed:        "Confirmed",
  preparing:        "Preparing",
  out_for_delivery: "Out for delivery",
  delivered:        "Delivered",
  cancelled:        "Cancelled",
};

// Build ISO date string N days ago
function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: productCount },
    { count: orderCount },
    { count: farmerCount },
    { data: recentOrders },
    { data: allOrders },
    { data: orderItems },
  ] = await Promise.all([
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*",   { count: "exact", head: true }),
    supabase.from("farmers").select("*",  { count: "exact", head: true }).eq("active", true),
    supabase
      .from("orders")
      .select("id, customer_name, total, status, created_at")
      .order("created_at", { ascending: false })
      .limit(6),
    supabase
      .from("orders")
      .select("total, status, created_at")
      .gte("created_at", daysAgo(30)),
    supabase
      .from("order_items")
      .select("product_name, quantity")
      .gte("created_at", daysAgo(30)),
  ]);

  // ── Derived stats ──────────────────────────────────────────
  const nonCancelledOrders = allOrders?.filter((o) => o.status !== "cancelled") ?? [];
  const totalRevenue = nonCancelledOrders.reduce((s, o) => s + (o.total ?? 0), 0);

  // ── Revenue by day (last 30) ───────────────────────────────
  const last30 = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().slice(0, 10);
  });

  const revenueByDay = last30.map((isoDay) => {
    const dayOrders = nonCancelledOrders.filter(
      (o) => o.created_at.slice(0, 10) === isoDay
    );
    const date = new Date(isoDay + "T12:00:00");
    return {
      day:     date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      revenue: dayOrders.reduce((s, o) => s + (o.total ?? 0), 0),
      orders:  dayOrders.length,
    };
  });

  // ── Orders by status ───────────────────────────────────────
  const statusMap: Record<string, number> = {};
  allOrders?.forEach((o) => {
    statusMap[o.status] = (statusMap[o.status] ?? 0) + 1;
  });
  const statusEntries = Object.entries(statusMap).sort((a, b) => b[1] - a[1]);
  const totalStatusOrders = allOrders?.length ?? 1;

  // ── Top products ───────────────────────────────────────────
  const productMap: Record<string, number> = {};
  orderItems?.forEach((item) => {
    productMap[item.product_name] =
      (productMap[item.product_name] ?? 0) + item.quantity;
  });
  const topProducts = Object.entries(productMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, qty]) => ({
      name: name.length > 22 ? name.slice(0, 20) + "…" : name,
      qty,
    }));

  const stats = [
    { label: "Total Products", value: productCount ?? 0,            icon: Package,     color: "bg-[#2D5016]/8  text-[#2D5016]",        href: "/admin/products" },
    { label: "Total Orders",   value: orderCount ?? 0,              icon: ShoppingBag, color: "bg-[#E8A838]/10 text-[#C4602A]",         href: "/admin/orders"   },
    { label: "Active Farmers", value: farmerCount ?? 0,             icon: Users,       color: "bg-[#2D7ABA]/8  text-[#2D7ABA]",         href: "/admin/farmers"  },
    { label: "Revenue (30d)",  value: `$${totalRevenue.toFixed(2)}`,icon: TrendingUp,  color: "bg-emerald-50   text-emerald-700",        href: "/admin/orders"   },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-[#2D5016]">Dashboard</h1>
        <p className="text-[14px] text-gray-500 mt-1">Welcome back. Here's what's happening.</p>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md hover:border-[#2D5016]/20 transition-all group relative overflow-hidden"
          >
            <ArrowUpRight className="absolute top-4 right-4 w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 group-hover:text-[#2D5016] transition-all" />
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <p className="text-[13px] text-gray-500 mb-1">{s.label}</p>
            <p className="font-heading text-2xl font-bold text-gray-800">{s.value}</p>
          </Link>
        ))}
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

        {/* Revenue area chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center gap-2 mb-1">
            <BarChart2 className="w-4 h-4 text-[#2D5016]" />
            <h2 className="font-heading text-[15px] font-bold text-[#2D5016]">Revenue</h2>
            <span className="ml-auto text-[11px] text-gray-400">Last 30 days</span>
          </div>
          <p className="text-[12px] text-gray-400 mb-5">Non-cancelled orders only</p>
          <RevenueChart data={revenueByDay} />
        </div>

        {/* Orders by status */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="font-heading text-[15px] font-bold text-[#2D5016] mb-5">
            Orders by status
          </h2>
          {statusEntries.length === 0 ? (
            <p className="text-[13px] text-gray-300 text-center py-12">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {statusEntries.map(([status, count]) => {
                const pct = Math.round((count / totalStatusOrders) * 100);
                return (
                  <div key={status}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[12px] text-gray-600">
                        {STATUS_LABELS[status] ?? status}
                      </span>
                      <span className="text-[12px] font-bold text-gray-700">
                        {count} <span className="font-normal text-gray-400">({pct}%)</span>
                      </span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${pct}%`,
                          backgroundColor:
                            status === "delivered"        ? "#2D5016" :
                            status === "out_for_delivery" ? "#C4602A" :
                            status === "preparing"        ? "#7C3AED" :
                            status === "confirmed"        ? "#2563EB" :
                            status === "cancelled"        ? "#EF4444" :
                                                           "#E8A838",
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Top products ── */}
      {topProducts.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="font-heading text-[15px] font-bold text-[#2D5016]">Top products</h2>
            <span className="ml-auto text-[11px] text-gray-400">Last 30 days · by units sold</span>
          </div>
          <p className="text-[12px] text-gray-400 mb-5">Most ordered items</p>
          <TopProductsChart data={topProducts} />
        </div>
      )}

      {/* ── Recent orders table ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-heading text-lg font-semibold text-[#2D5016] flex items-center gap-2">
            <Clock className="w-4 h-4" /> Recent Orders
          </h2>
          <Link
            href="/admin/orders"
            className="text-[12px] text-[#2D5016] font-medium flex items-center gap-1 hover:text-[#C4602A] transition-colors"
          >
            View all <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {!recentOrders?.length ? (
          <div className="px-6 py-12 text-center text-gray-400 text-[14px]">
            No orders yet — share the store link!
          </div>
        ) : (
          <table className="w-full min-w-[480px] text-[13px]">
            <thead>
              <tr className="text-left border-b border-gray-100">
                <th className="px-6 py-3 font-semibold text-gray-500">Customer</th>
                <th className="px-6 py-3 font-semibold text-gray-500">Total</th>
                <th className="px-6 py-3 font-semibold text-gray-500">Status</th>
                <th className="px-6 py-3 font-semibold text-gray-500">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-3.5 font-medium text-gray-800">
                    <Link href={`/admin/orders/${order.id}`} className="hover:text-[#2D5016] transition-colors">
                      {order.customer_name}
                    </Link>
                  </td>
                  <td className="px-6 py-3.5 font-bold text-[#2D5016]">${order.total?.toFixed(2)}</td>
                  <td className="px-6 py-3.5">
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-[11px] font-semibold capitalize ${STATUS_COLORS[order.status] ?? "bg-gray-100 text-gray-600"}`}>
                      {order.status?.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-gray-400">
                    {new Date(order.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
