import Link from "next/link";
import { Package, ShoppingBag, Users, TrendingUp, ArrowRight, Clock, ArrowUpRight } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

const STATUS_COLORS: Record<string, string> = {
  pending:          "bg-yellow-100 text-yellow-800",
  confirmed:        "bg-blue-100   text-blue-800",
  preparing:        "bg-purple-100 text-purple-800",
  out_for_delivery: "bg-orange-100 text-orange-800",
  delivered:        "bg-green-100  text-green-800",
  cancelled:        "bg-red-100    text-red-800",
};

export default async function AdminDashboard() {
  const supabase = await createClient();

  const [
    { count: productCount },
    { count: orderCount },
    { count: farmerCount },
    { data: recentOrders },
    { data: revenue },
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
      .select("total")
      .neq("status", "cancelled"),
  ]);

  const totalRevenue = revenue?.reduce((s, o) => s + (o.total ?? 0), 0) ?? 0;

  const stats = [
    { label: "Total Products", value: productCount ?? 0, icon: Package,     color: "bg-[#2D5016]/8  text-[#2D5016]", href: "/admin/products" },
    { label: "Total Orders",   value: orderCount ?? 0,   icon: ShoppingBag, color: "bg-[#E8A838]/10 text-[#C4602A]",  href: "/admin/orders"   },
    { label: "Active Farmers", value: farmerCount ?? 0,  icon: Users,       color: "bg-[#2D7ABA]/8  text-[#2D7ABA]",  href: "/admin/farmers"  },
    { label: "Total Revenue",  value: `$${totalRevenue.toFixed(2)}`, icon: TrendingUp, color: "bg-emerald-50 text-emerald-700", href: "/admin/orders" },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-[#2D5016]">Dashboard</h1>
        <p className="text-[14px] text-gray-500 mt-1">Welcome back. Here's what's happening today.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
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

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-heading text-lg font-semibold text-[#2D5016] flex items-center gap-2">
            <Clock className="w-4 h-4" /> Recent Orders
          </h2>
          <Link href="/admin/orders"
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
          <table className="w-full text-[13px]">
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
                  <td className="px-6 py-3.5 font-medium text-gray-800">{order.customer_name}</td>
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
