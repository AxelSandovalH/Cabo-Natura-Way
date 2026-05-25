"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft, ShoppingBag, CreditCard, Loader2,
  User, Truck,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { useCart } from "@/lib/cart/CartContext";
import { placeOrderAction } from "./actions";

const DELIVERY_FEE          = 5;
const FREE_DELIVERY_THRESHOLD = 50;

/* ─────────────────────────────────────────── */
export default function CheckoutPage() {
  const { items, subtotal } = useCart();

  const [hydrated, setHydrated]       = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition]  = useTransition();

  // Wait for cart to hydrate from localStorage before rendering
  useEffect(() => { setHydrated(true); }, []);

  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total       = subtotal + deliveryFee;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setServerError(null);

    const formData = new FormData(e.currentTarget);
    formData.set("items",        JSON.stringify(items));
    formData.set("subtotal",     subtotal.toFixed(2));
    formData.set("delivery_fee", deliveryFee.toFixed(2));
    formData.set("total",        total.toFixed(2));

    startTransition(async () => {
      const result = await placeOrderAction(formData);
      if (result.error) {
        setServerError(result.error);
      } else if (result.stripeUrl) {
        // Redirect to Stripe hosted checkout (cart cleared on success page)
        window.location.href = result.stripeUrl;
      }
    });
  }

  // ── Skeleton while hydrating ────────────────────────────────
  if (!hydrated) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-6 h-6 text-[#2D5016] animate-spin" />
        </div>
      </>
    );
  }

  // ── Empty cart ──────────────────────────────────────────────
  if (hydrated && items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
          <span className="text-6xl mb-4">🛒</span>
          <h1 className="font-heading text-2xl font-bold text-[#2D5016] mb-2">
            Your cart is empty
          </h1>
          <p className="text-[14px] text-[#6B5B4B] mb-6">
            Add some fresh Baja products before checking out.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#2D5016] hover:bg-[#3D6B1F] text-white rounded-full px-8 h-11 font-semibold text-[14px] transition-colors"
          >
            Browse the Shop
          </Link>
        </div>
      </>
    );
  }

  // ── Checkout form ───────────────────────────────────────────
  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10">
        {/* Back link */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-[13px] text-[#6B5B4B] hover:text-[#2D5016] transition-colors mb-8"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Continue shopping
        </Link>

        <h1 className="font-heading text-3xl font-bold text-[#2D5016] mb-8">Checkout</h1>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8 items-start">

            {/* ── LEFT: Customer details ── */}
            <div className="space-y-6">
              <SectionCard title="Your Details" icon={User}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field
                    name="customer_name"
                    label="Full Name"
                    placeholder="e.g. Sarah Johnson"
                    required
                    autoComplete="name"
                  />
                  <Field
                    name="customer_email"
                    label="Email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                  />
                </div>
                <Field
                  name="customer_phone"
                  label="WhatsApp / Phone"
                  type="tel"
                  placeholder="+52 624 100 0000"
                  autoComplete="tel"
                  hint="We'll confirm your order via WhatsApp"
                />
              </SectionCard>

              <SectionCard title="Delivery" icon={Truck}>
                <Field
                  name="delivery_address"
                  label="Delivery Address"
                  placeholder="Street, colonia, unit number, Cabo San Lucas…"
                  required
                  autoComplete="street-address"
                />
                <Field
                  name="delivery_notes"
                  label="Delivery Notes"
                  placeholder="Gate code, landmarks, best time to deliver…"
                  multiline
                />
              </SectionCard>
            </div>

            {/* ── RIGHT: Order summary ── */}
            <div className="lg:sticky lg:top-24 space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#2D5016]" />
                  <h2 className="font-heading text-[16px] font-semibold text-[#2D5016]">
                    Order Summary
                  </h2>
                  <span className="ml-auto text-[12px] text-gray-400">
                    {items.reduce((s, i) => s + i.quantity, 0)} items
                  </span>
                </div>

                {/* Items */}
                <ul className="divide-y divide-gray-50">
                  {items.map((item) => (
                    <li key={item.id} className="px-6 py-3.5 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#2D5016]/6 flex items-center justify-center text-xl flex-shrink-0">
                        {item.image_emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-gray-800 truncate">{item.name}</p>
                        <p className="text-[11px] text-gray-400">{item.farmer_name} · {item.unit}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-[13px] font-bold text-[#2D5016]">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-[11px] text-gray-400">×{item.quantity}</p>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* Totals */}
                <div className="px-6 py-4 border-t border-gray-100 space-y-2.5">
                  {/* Free delivery progress */}
                  {subtotal < FREE_DELIVERY_THRESHOLD && (
                    <div className="bg-[#E8A838]/10 rounded-xl px-4 py-3 mb-3">
                      <p className="text-[12px] text-[#6B5B4B]">
                        Add{" "}
                        <strong className="text-[#2D5016]">
                          ${(FREE_DELIVERY_THRESHOLD - subtotal).toFixed(2)}
                        </strong>{" "}
                        more for <strong className="text-[#2D5016]">free delivery</strong> 🚐
                      </p>
                      <div className="mt-2 h-1.5 bg-[#E8A838]/20 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#E8A838] rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between text-[13px] text-[#6B5B4B]">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-800">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-[13px] text-[#6B5B4B]">
                    <span>Delivery</span>
                    <span className={deliveryFee === 0 ? "font-semibold text-[#2D5016]" : "font-medium text-gray-800"}>
                      {deliveryFee === 0 ? "🎉 Free" : `$${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-[15px] font-bold text-[#2D5016] pt-2 border-t border-gray-100">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>

                {/* Error */}
                {serverError && (
                  <div className="mx-6 mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-[13px] text-red-600">
                    {serverError}
                  </div>
                )}

                {/* Submit */}
                <div className="px-6 pb-6">
                  <button
                    type="submit"
                    disabled={isPending}
                    className="w-full flex items-center justify-center gap-2 bg-[#2D5016] hover:bg-[#3D6B1F] disabled:opacity-60 text-white rounded-full h-12 font-semibold text-[14px] transition-colors shadow-lg shadow-[#2D5016]/20"
                  >
                    {isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Redirecting to payment…
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        Pay · ${total.toFixed(2)}
                      </>
                    )}
                  </button>
                  <p className="text-center text-[11px] text-gray-400 mt-3">
                    Secure payment via Stripe 🔒
                  </p>
                </div>
              </div>
            </div>

          </div>
        </form>
      </div>
    </>
  );
}

/* ── Sub-components ──────────────────────────────────────────── */

function SectionCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
      <h2 className="font-heading text-[16px] font-semibold text-[#2D5016] flex items-center gap-2">
        <Icon className="w-4 h-4" />
        {title}
      </h2>
      {children}
    </div>
  );
}

function Field({
  name,
  label,
  type = "text",
  placeholder,
  required,
  hint,
  multiline,
  autoComplete,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  multiline?: boolean;
  autoComplete?: string;
}) {
  const base =
    "w-full px-4 rounded-xl border border-gray-200 bg-[#FAFAF7] text-[14px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#2D5016] focus:ring-2 focus:ring-[#2D5016]/10 transition";

  return (
    <div>
      <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">
        {label}
        {required && <span className="text-[#C4602A] ml-0.5">*</span>}
      </label>
      {multiline ? (
        <textarea
          name={name}
          placeholder={placeholder}
          rows={3}
          className={`${base} py-3 resize-none`}
          autoComplete={autoComplete}
        />
      ) : (
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className={`${base} h-11`}
        />
      )}
      {hint && <p className="text-[11px] text-gray-400 mt-1.5">{hint}</p>}
    </div>
  );
}
