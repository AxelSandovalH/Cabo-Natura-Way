"use server";

import { createOrder } from "@/lib/supabase/queries";
import { sendAdminOrderNotification, sendCustomerConfirmation } from "@/lib/email";
import type { Order, OrderItem } from "@/lib/supabase/types";

export interface PlaceOrderResult {
  order: Order | null;
  error: string | null;
}

export async function placeOrderAction(
  formData: FormData
): Promise<PlaceOrderResult> {
  const customer_name    = (formData.get("customer_name")    as string)?.trim();
  const customer_email   = (formData.get("customer_email")   as string)?.trim();
  const customer_phone   = (formData.get("customer_phone")   as string)?.trim() || null;
  const delivery_address = (formData.get("delivery_address") as string)?.trim();
  const delivery_notes   = (formData.get("delivery_notes")   as string)?.trim() || null;
  const subtotal         = parseFloat(formData.get("subtotal")    as string);
  const delivery_fee     = parseFloat(formData.get("delivery_fee") as string);
  const total            = parseFloat(formData.get("total")       as string);
  const itemsJson        = formData.get("items") as string;

  if (!customer_name || !customer_email || !delivery_address) {
    return { order: null, error: "Please fill in all required fields." };
  }

  if (isNaN(subtotal) || isNaN(delivery_fee) || isNaN(total)) {
    return { order: null, error: "Invalid order totals." };
  }

  let items: Array<{
    product_id: string;
    product_name: string;
    unit_price: number;
    quantity: number;
  }>;

  try {
    const cartItems = JSON.parse(itemsJson) as Array<{
      id: string;
      name: string;
      price: number;
      quantity: number;
    }>;

    if (!cartItems.length) {
      return { order: null, error: "Your cart is empty." };
    }

    items = cartItems.map((item) => ({
      product_id:   item.id,
      product_name: item.name,
      unit_price:   item.price,
      quantity:     item.quantity,
    }));
  } catch {
    return { order: null, error: "Invalid cart data. Please refresh and try again." };
  }

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
    return { order: null, error: "Something went wrong placing your order. Please try again." };
  }

  // Build OrderItem shape so emails can render the line items
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

  // Fire both emails — non-blocking so a mail failure never breaks the order
  void Promise.allSettled([
    sendAdminOrderNotification(order, orderItems),
    sendCustomerConfirmation(order, orderItems),
  ]).then((results) => {
    results.forEach((r) => {
      if (r.status === "rejected") {
        console.error("[email] failed to send:", r.reason);
      }
    });
  });

  return { order, error: null };
}
