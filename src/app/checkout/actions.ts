"use server";

import { getStripe } from "@/lib/stripe";

const SITE_URL           = process.env.NEXT_PUBLIC_SITE_URL ?? "https://cabonaturalway.com";
const DELIVERY_FEE       = 5_00;   // cents
const FREE_DELIVERY_THRESHOLD = 50; // USD

export interface CartItem {
  id:          string;
  name:        string;
  price:       number;
  quantity:    number;
  image_emoji: string;
  unit:        string;
}

export async function createCheckoutSessionAction(
  itemsJson: string
): Promise<{ url: string | null; error: string | null }> {
  let items: CartItem[];
  try {
    items = JSON.parse(itemsJson);
    if (!items.length) return { url: null, error: "Your cart is empty." };
  } catch {
    return { url: null, error: "Invalid cart data." };
  }

  const subtotal    = items.reduce((s, i) => s + i.price * i.quantity, 0);
  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;

  // Compact item metadata for the webhook (stays under 500 chars for typical carts)
  const itemsMeta = JSON.stringify(
    items.map((i) => ({ id: i.id, n: i.name, p: i.price, q: i.quantity }))
  );

  const lineItems = [
    ...items.map((item) => ({
      price_data: {
        currency:     "usd",
        unit_amount:  Math.round(item.price * 100),
        product_data: { name: item.name },
      },
      quantity: item.quantity,
    })),
    ...(deliveryFee > 0
      ? [{ price_data: { currency: "usd", unit_amount: deliveryFee, product_data: { name: "Delivery fee" } }, quantity: 1 }]
      : []),
  ];

  try {
    const session = await getStripe().checkout.sessions.create({
      mode:       "payment",
      line_items: lineItems,
      // Stripe collects customer info
      shipping_address_collection: { allowed_countries: ["MX", "US", "CA"] },
      phone_number_collection:     { enabled: true },
      custom_fields: [
        {
          key:      "delivery_notes",
          label:    { type: "custom", custom: "Delivery notes (optional)" },
          type:     "text",
          optional: true,
        },
      ],
      metadata: {
        items:        itemsMeta,
        subtotal_usd: subtotal.toFixed(2),
        delivery_fee: (deliveryFee / 100).toFixed(2),
      },
      success_url: `${SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url:  `${SITE_URL}/checkout`,
    });

    return { url: session.url, error: null };
  } catch (err: any) {
    console.error("[stripe]", err.message);
    return { url: null, error: "Payment setup failed. Please try again." };
  }
}
