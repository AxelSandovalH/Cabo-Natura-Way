import { headers } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { getStripe } from "@/lib/stripe";

// Service-role client — bypasses RLS so the webhook can update any order
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

  if (!sig) {
    return new Response("Missing stripe-signature header", { status: 400 });
  }

  let event: import("stripe").Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("[webhook] signature verification failed:", err.message);
    return new Response(`Webhook error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const orderId = session.metadata?.order_id;

    if (!orderId) {
      console.error("[webhook] checkout.session.completed — no order_id in metadata");
      return new Response("Missing order_id", { status: 400 });
    }

    const supabase = adminSupabase();
    const { error } = await supabase
      .from("orders")
      .update({
        status:            "confirmed",
        stripe_payment_id: (session.payment_intent as string) ?? session.id,
      })
      .eq("id", orderId);

    if (error) {
      console.error("[webhook] failed to update order:", error.message);
      return new Response("DB update failed", { status: 500 });
    }

    console.log(`[webhook] order ${orderId} confirmed`);
  }

  return new Response(null, { status: 200 });
}
