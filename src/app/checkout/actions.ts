"use server";

import { createOrder } from "@/lib/supabase/queries";
import { sendAdminOrderNotification, sendCustomerConfirmation } from "@/lib/email";
import { stripe } from "@/lib/stripe";
import type { Order, OrderItem } from "@/lib/supabase/types";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cabonaturalway.com";

export interface PlaceOrderResult {
  order:     Order | null;
  stripeUrl: string | null;
  error:     string | null;
}

export async function placeOrderAction(
  formData: FormData
): Promise<PlaceOrderResult> {
  const customer_name    = (formData.get("customer_name")    as string)?.trim();
  const customer_email   = (formData.get("customer_email")   as string)?.trim();
  const customer_phone   = (formData.get("customer_phone")   as string)?.trim() || null;
  const delivery_address = (formData.get("delivery_address") as string)?.trim();
  const delivery_notes   = (formData.get("delivery_notes")   as string)?.trim() || null;
  const subtotal         = parseFloat(formData.get("subtotal")     as string);
  const delivery_fee     = parseFloat(formData.get("delivery_fee") as string);
  const total            = parseFloat(formData.get("total")        as string);
  const itemsJson        = formData.get("items") as string;

  if (!customer_name || !customer_email || !delivery_address) {
    return { order: null, stripeUrl: null, error: "Please fill in all required fields." };
  }
  if (isNaN(subtotal) || isNaN(delivery_fee) || isNaN(total)) {
    return { order: null, stripeUrl: null, error: "Invalid order totals." };
  }

  let items: Array<{
    product_id:   string;
    product_name: string;
    unit_price:   number;
    quantity:     number;
  }>;

  try {
    const cartItems = JSON.parse(itemsJson) as Array<{
      id: string; name: string; price: number; quantity: number;
    }>;
    if (!cartItems.length) {
      return { order: null, stripeUrl: null, error: "Your cart is empty." };
    }
    items = cartItems.map((item) => ({
      product_id:   item.id,
      product_name: item.name,
      unit_price:   item.price,
      quantity:     item.quantity,
    }));
  } catch {
    return { order: null, stripeUrl: null, error: "Invalid cart data. Please refresh and try again." };
  }

  // ── 1. Create order in DB ─────────────────────────────────
  const order = await createOrder({
    customer_name,
    customer_email,
    customer_phone:   customer_phone   ?? undefined,
    delivery_address: delivery_address ?? undefined,
    delivery_notes:   delivery_notes   ?? undefined,
    subtotal,
    delivery_fee,
    total,
    items,
  });

  if (!order) {
    return { order: null, stripeUrl: null, error: "Something went wrong placing your order. Please try again." };
  }

  // ── 2. Send notification emails (non-blocking) ────────────
  const orderItems: OrderItem[] = items.map((item, i) => ({
    id:           `${order.id}-${i}`,
    order_id:     order.id,
    product_id:   item.product_id,
    product_name: item.product_name,
    unit_price:   item.unit_price,
    quantity:     item.quantity,
    subtotal:     item.unit_price * item.quantity,
    created_at:   order.created_at,
  }));

  void Promise.allSettled([
    sendAdminOrderNotification(order, orderItems),
    sendCustomerConfirmation(order, orderItems),
  ]).then((results) => {
    results.forEach((r) => {
      if (r.status === "rejected") console.error("[email] failed:", r.reason);
    });
  });

  // ── 3. Create Stripe Checkout Session ─────────────────────
  try {
    const lineItems = [
      ...items.map((item) => ({
        price_data: {
          currency:     "usd",
          unit_amount:  Math.round(item.unit_price * 100),
          product_data: { name: item.product_name },
        },
        quantity: item.quantity,
      })),
      ...(delivery_fee > 0
        ? [{
            price_data: {
              currency:     "usd",
              unit_amount:  Math.round(delivery_fee * 100),
              product_data: { name: "Delivery fee" },
            },
            quantity: 1,
          }]
        : []),
    ];

    const session = await stripe.checkout.sessions.create({
      mode:           "payment",
      line_items:     lineItems,
      customer_email: customer_email,
      metadata:       { order_id: order.id },
      success_url:    `${SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:     `${SITE_URL}/checkout`,
      payment_intent_data: {
        metadata: { order_id: order.id },
      },
    });

    return { order, stripeUrl: session.url, error: null };
  } catch (err: any) {
    console.error("[stripe] session creation failed:", err.message);
    // Order is already created — return it so the client knows the order exists
    // even though Stripe failed. The user will need to retry payment.
    return {
      order,
      stripeUrl: null,
      error: "Payment setup failed. Your order was saved — please contact us on WhatsApp to complete payment.",
    };
  }
}
