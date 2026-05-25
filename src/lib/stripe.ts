import Stripe from "stripe";

let _client: Stripe | null = null;

/** Lazy singleton — throws a clear error if the env var is missing. */
export function getStripe(): Stripe {
  if (!_client) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY env var is not set.");
    _client = new Stripe(key, { apiVersion: "2026-04-22.dahlia" });
  }
  return _client;
}
