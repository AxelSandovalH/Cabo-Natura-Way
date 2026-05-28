import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { getStripe } from "@/lib/stripe";
import { sendAdminOrderNotification, sendCustomerConfirmation } from "@/lib/email";
import type { OrderItem } from "@/lib/supabase/types";

function adminSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: Request) {
  const body      = await request.text();
  const headerMap = await headers();
  const sig       = headerMap.get("stripe-signature");

  if (!sig) return new Response("Missing stripe-signature", { status: 400 });

  let event: import("stripe").Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err: any) {
    console.error("[webhook] signature failed:", err.message);
    return new Response(`Webhook error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    // Parse items from metadata
    let cartItems: Array<{ id: string; n: string; p: number; q: number }> = [];
    try { cartItems = JSON.parse(session.metadata?.items ?? "[]"); } catch {}

    const subtotal     = parseFloat(session.metadata?.subtotal_usd ?? "0");
    const delivery_fee = parseFloat(session.metadata?.delivery_fee  ?? "0");
    const total        = subtotal + delivery_fee;

    // Customer info from Stripe
    const customer_name    = session.customer_details?.name    ?? "Customer";
    const customer_email   = session.customer_details?.email   ?? "";
    const customer_phone   = session.customer_details?.phone   ?? null;
    const shipping         = (session as any).shipping_details?.address;
    const delivery_address = shipping
      ? [shipping.line1, shipping.line2, shipping.city, shipping.state, shipping.country]
          .filter(Boolean).join(", ")
      : null;

    const delivery_notes = (session.custom_fields ?? [])
      .find((f: any) => f.key === "delivery_notes")
      ?.text?.value ?? null;

    const supabase = adminSupabase();

    // Create order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        customer_name,
        customer_email,
        customer_phone,
        delivery_address,
        delivery_notes,
        status:            "confirmed",
        subtotal,
        delivery_fee,
        total,
        stripe_payment_id: (session.payment_intent as string) ?? session.id,
      })
      .select()
      .single();

    if (orderError) {
      console.error("[webhook] order insert failed:", orderError.message);
      return new Response("DB error", { status: 500 });
    }

    // Create order items
    if (cartItems.length) {
      await supabase.from("order_items").insert(
        cartItems.map((i) => ({
          order_id:     order.id,
          product_id:   i.id,
          product_name: i.n,
          unit_price:   i.p,
          quantity:     i.q,
          subtotal:     i.p * i.q,
        }))
      );
    }

    // Send emails (non-blocking)
    const orderItems: OrderItem[] = cartItems.map((i, idx) => ({
      id:           `${order.id}-${idx}`,
      order_id:     order.id,
      product_id:   i.id,
      product_name: i.n,
      unit_price:   i.p,
      quantity:     i.q,
      subtotal:     i.p * i.q,
      created_at:   order.created_at,
    }));

    void Promise.allSettled([
      sendAdminOrderNotification(order, orderItems),
      sendCustomerConfirmation(order, orderItems),
    ]).then((results) => {
      results.forEach((r) => {
        if (r.status === "rejected") console.error("[email]", r.reason);
      });
    });

    console.log(`[webhook] order ${order.id} created and confirmed`);
  }

  return new Response(null, { status: 200 });
}
