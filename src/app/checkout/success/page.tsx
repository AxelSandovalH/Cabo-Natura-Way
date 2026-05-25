import Link from "next/link";
import { CheckCircle2, MessageCircle } from "lucide-react";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import CartClearer from "@/components/checkout/CartClearer";
import { stripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false, follow: false },
};

export default async function CheckoutSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  let orderId: string | null   = null;
  let customerName             = "";
  let customerPhone: string | null = null;
  let total                    = 0;
  let deliveryAddress          = "";

  if (session_id) {
    try {
      const session = await stripe.checkout.sessions.retrieve(session_id);
      orderId = session.metadata?.order_id ?? null;

      if (orderId) {
        const supabase = await createClient();
        const { data } = await supabase
          .from("orders")
          .select("customer_name, customer_phone, total, delivery_address")
          .eq("id", orderId)
          .single();

        if (data) {
          customerName    = data.customer_name;
          customerPhone   = data.customer_phone;
          total           = data.total;
          deliveryAddress = data.delivery_address ?? "";
        }
      }
    } catch (err) {
      console.error("[success page]", err);
    }
  }

  const shortId     = orderId?.slice(0, 8).toUpperCase() ?? "—";
  const waContact   = customerPhone
    ? `+${customerPhone.replace(/\D/g, "")}`
    : "cabonaturalway.com";
  const waMsg = encodeURIComponent(
    `Hi! I just completed order #${shortId} on Cabo Natural Way.`
  );

  return (
    <>
      <Navbar />
      {/* Clear cart once payment is confirmed */}
      <CartClearer />

      <div className="min-h-[80vh] flex items-center justify-center px-6 py-16">
        <div className="max-w-md w-full text-center">

          {/* Check icon */}
          <div className="w-20 h-20 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>

          <h1 className="font-heading text-3xl font-bold text-[#2D5016] mb-2">
            Payment confirmed! 🎉
          </h1>
          <p className="text-[15px] text-[#6B5B4B] mb-6">
            {customerName
              ? `Thanks, ${customerName.split(" ")[0]}!`
              : "Thanks!"}{" "}
            Your order is confirmed. We'll contact you via WhatsApp to arrange delivery.
          </p>

          {/* Order card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-left space-y-3 mb-6">
            <div className="flex justify-between text-[13px]">
              <span className="text-gray-500">Order number</span>
              <span className="font-mono font-semibold text-[#2D5016] text-[12px]">
                #{shortId}
              </span>
            </div>
            {total > 0 && (
              <div className="flex justify-between text-[13px]">
                <span className="text-gray-500">Amount paid</span>
                <span className="font-bold text-[#2D5016]">${total.toFixed(2)} USD</span>
              </div>
            )}
            {deliveryAddress && (
              <div className="flex justify-between text-[13px] gap-4">
                <span className="text-gray-500 flex-shrink-0">Delivering to</span>
                <span className="font-medium text-gray-700 text-right">{deliveryAddress}</span>
              </div>
            )}
            <div className="pt-3 border-t border-gray-100">
              <p className="text-[12px] text-[#6B5B4B] flex items-start gap-2">
                <span className="text-lg leading-none">📱</span>
                We'll reach out to confirm your delivery window. Usually within 30 minutes.
              </p>
            </div>
          </div>

          {/* WhatsApp button */}
          <a
            href={`https://wa.me/526241234567?text=${waMsg}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full h-12 bg-[#25D366] hover:bg-[#1ebe5a] text-white rounded-full font-semibold text-[14px] transition-colors mb-3"
          >
            <MessageCircle className="w-4 h-4" />
            Message us on WhatsApp
          </a>

          <div className="flex gap-3 justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-[#2D5016] hover:bg-[#3D6B1F] text-white rounded-full px-8 h-11 font-semibold text-[14px] transition-colors"
            >
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="inline-flex items-center justify-center text-[14px] text-[#6B5B4B] hover:text-[#2D5016] px-4 h-11 transition-colors"
            >
              Home
            </Link>
          </div>

        </div>
      </div>
    </>
  );
}
