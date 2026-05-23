import Link from "next/link";
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

export default async function AdminOrders() {
  const supabase = await createClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*, items:order_items(id, product_name, quantity, unit_price)")
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-[#2D5016]">Orders</h1>
        <p className="text-[14px] text-gray-500 mt-1">{orders?.length ?? 0} orders total</p>
      </div>

      {!orders?.length ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 px-6 py-16 text-center">
          <span className="text-5xl mb-4 block">📦</span>
          <p className="font-heading text-xl text-[#2D5016] font-semibold mb-2">No orders yet</p>
          <p className="text-[14px] text-gray-400">Orders will appear here once customers check out.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 group hover:border-[#2D5016]/20 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                {/* Customer */}
                <div>
                  <p className="font-semibold text-gray-800 text-[15px]">{order.customer_name}</p>
                  <p className="text-[12px] text-gray-400 mt-0.5">{order.customer_email}</p>
                  {order.customer_phone && (
                    <p className="text-[12px] text-gray-400">{order.customer_phone}</p>
                  )}
                  {order.delivery_address && (
                    <p className="text-[12px] text-[#6B5B4B] mt-1">📍 {order.delivery_address}</p>
                  )}
                </div>

                {/* Status + total + view */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <OrderStatusSelect
                    orderId={order.id}
                    currentStatus={order.status}
                    colors={STATUS_COLORS}
                  />
                  <div className="text-right">
                    <p className="font-heading text-xl font-bold text-[#2D5016]">
                      ${order.total?.toFixed(2)}
                    </p>
                    <p className="text-[11px] text-gray-400">
                      {new Date(order.created_at).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })}
                    </p>
                  </div>
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="text-[12px] font-semibold text-[#2D5016] hover:text-[#C4602A] transition-colors whitespace-nowrap opacity-0 group-hover:opacity-100"
                  >
                    View →
                  </Link>
                </div>
              </div>

              {/* Items */}
              {order.items?.length > 0 && (
                <div className="border-t border-gray-100 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-[12px] text-gray-500">
                      <span>{item.product_name} × {item.quantity}</span>
                      <span className="font-medium text-gray-700">
                        ${(item.unit_price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Notes */}
              {order.delivery_notes && (
                <div className="mt-3 bg-[#E8A838]/8 rounded-xl px-4 py-2.5 text-[12px] text-[#6B5B4B]">
                  📝 {order.delivery_notes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
