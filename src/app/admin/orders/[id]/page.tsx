import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

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

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*, items:order_items(id, product_id, product_name, quantity, unit_price, subtotal)")
    .eq("id", id)
    .single();

  if (!order) notFound();

  const shortId = order.id.slice(0, 8).toUpperCase();
  const items   = (order.items ?? []) as Array<{
    id: string;
    product_id: string | null;
    product_name: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
  }>;

  const waText = encodeURIComponent(
    `Hi ${order.customer_name}! Your Cabo Natural Way order #${shortId} is `
  );

  return (
    <div className="max-w-4xl">

      {/* Back + header */}
      <div className="mb-8">
        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-1.5 text-[13px] text-gray-400 hover:text-[#2D5016] transition-colors mb-4"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> All orders
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold text-[#2D5016]">
              Order <span className="text-[#C4602A]">#{shortId}</span>
            </h1>
            <p className="text-[13px] text-gray-400 mt-0.5">
              {new Date(order.created_at).toLocaleString("en-US", {
                weekday: "long", year: "numeric", month: "long",
                day: "numeric", hour: "2-digit", minute: "2-digit",
              })}
            </p>
          </div>

          {/* Status selector */}
          <OrderStatusSelect
            orderId={order.id}
            currentStatus={order.status}
            colors={STATUS_COLORS}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left: items + totals ── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Items table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-heading text-[15px] font-bold text-[#2D5016]">Items</h2>
            </div>

            <table className="w-full">
              <thead>
                <tr className="bg-[#FAFAF7]">
                  <th className="px-6 py-3 text-left text-[11px] font-semibold tracking-wider text-gray-400 uppercase">Product</th>
                  <th className="px-4 py-3 text-center text-[11px] font-semibold tracking-wider text-gray-400 uppercase">Qty</th>
                  <th className="px-4 py-3 text-right text-[11px] font-semibold tracking-wider text-gray-400 uppercase">Unit</th>
                  <th className="px-6 py-3 text-right text-[11px] font-semibold tracking-wider text-gray-400 uppercase">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-[14px] font-medium text-gray-800">
                      {item.product_name}
                    </td>
                    <td className="px-4 py-4 text-[14px] text-gray-500 text-center">
                      ×{item.quantity}
                    </td>
                    <td className="px-4 py-4 text-[14px] text-gray-500 text-right">
                      ${item.unit_price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 text-[14px] font-semibold text-[#2D5016] text-right">
                      ${(item.unit_price * item.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Totals */}
            <div className="px-6 py-4 border-t border-gray-100 bg-[#FAFAF7] space-y-2">
              <div className="flex justify-between text-[13px] text-gray-500">
                <span>Subtotal</span>
                <span>${order.subtotal?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[13px] text-gray-500">
                <span>Delivery fee</span>
                <span>{order.delivery_fee === 0 ? "Free" : `$${order.delivery_fee?.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-[15px] font-bold text-[#2D5016] pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>${order.total?.toFixed(2)} USD</span>
              </div>
            </div>
          </div>

          {/* Delivery notes */}
          {order.delivery_notes && (
            <div className="bg-[#E8A838]/10 rounded-2xl border border-[#E8A838]/30 px-6 py-4">
              <p className="text-[11px] font-semibold tracking-wider uppercase text-[#E8A838] mb-1.5">
                Delivery notes
              </p>
              <p className="text-[14px] text-[#6B5B4B] leading-relaxed">
                {order.delivery_notes}
              </p>
            </div>
          )}
        </div>

        {/* ── Right: customer + actions ── */}
        <div className="space-y-6">

          {/* Customer info */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
            <h2 className="font-heading text-[15px] font-bold text-[#2D5016]">Customer</h2>

            <div className="space-y-3">
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">Name</p>
                <p className="text-[14px] font-semibold text-gray-800">{order.customer_name}</p>
              </div>

              <a
                href={`mailto:${order.customer_email}`}
                className="flex items-center gap-2 text-[13px] text-[#2D5016] hover:text-[#C4602A] transition-colors group"
              >
                <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="truncate">{order.customer_email}</span>
              </a>

              {order.customer_phone && (
                <a
                  href={`tel:${order.customer_phone}`}
                  className="flex items-center gap-2 text-[13px] text-[#2D5016] hover:text-[#C4602A] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                  {order.customer_phone}
                </a>
              )}

              {order.delivery_address && (
                <div className="flex items-start gap-2 text-[13px] text-gray-500">
                  <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <span>{order.delivery_address}</span>
                </div>
              )}
            </div>
          </div>

          {/* WhatsApp quick message */}
          {order.customer_phone && (
            <a
              href={`https://wa.me/${order.customer_phone.replace(/\D/g, "")}?text=${waText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full h-11 bg-[#25D366] hover:bg-[#1ebe5a] text-white rounded-xl text-[13px] font-semibold transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Message on WhatsApp
            </a>
          )}

          {/* Status card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-heading text-[15px] font-bold text-[#2D5016] mb-4">Status</h2>

            {/* Timeline */}
            <div className="space-y-2">
              {(["pending","confirmed","preparing","out_for_delivery","delivered"] as const).map((s, i, arr) => {
                const statusOrder = arr.indexOf(order.status as any);
                const thisOrder   = arr.indexOf(s);
                const done        = thisOrder <= statusOrder && order.status !== "cancelled";
                const active      = s === order.status;
                return (
                  <div key={s} className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] font-bold transition-colors ${
                      active ? "bg-[#2D5016] text-white ring-4 ring-[#2D5016]/20"
                      : done  ? "bg-[#2D5016]/20 text-[#2D5016]"
                               : "bg-gray-100 text-gray-300"
                    }`}>
                      {done && !active ? "✓" : i + 1}
                    </div>
                    <span className={`text-[13px] ${active ? "font-semibold text-[#2D5016]" : done ? "text-gray-500" : "text-gray-300"}`}>
                      {STATUS_LABELS[s]}
                    </span>
                  </div>
                );
              })}
              {order.status === "cancelled" && (
                <div className="flex items-center gap-3 mt-1">
                  <div className="w-5 h-5 rounded-full bg-red-100 text-red-500 flex-shrink-0 flex items-center justify-center text-[10px] font-bold">✕</div>
                  <span className="text-[13px] font-semibold text-red-500">Cancelled</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
