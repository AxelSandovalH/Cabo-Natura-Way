"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Loader2, CreditCard } from "lucide-react";
import Navbar from "@/components/Navbar";
import { useCart } from "@/lib/cart/CartContext";
import { createCheckoutSessionAction } from "./actions";

const DELIVERY_FEE            = 5;
const FREE_DELIVERY_THRESHOLD = 50;

export default function CheckoutPage() {
  const { items, subtotal } = useCart();

  const [hydrated, setHydrated]       = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isPending, startTransition]  = useTransition();

  useEffect(() => { setHydrated(true); }, []);

  const deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
  const total       = subtotal + deliveryFee;

  function handlePay() {
    setServerError(null);
    startTransition(async () => {
      const { url, error } = await createCheckoutSessionAction(JSON.stringify(items));
      if (error || !url) {
        setServerError(error ?? "Something went wrong. Please try again.");
      } else {
        window.location.href = url;
      }
    });
  }

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

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6">
          <span className="text-6xl mb-4">🛒</span>
          <h1 className="font-heading text-2xl font-bold text-[#2D5016] mb-2">Your cart is empty</h1>
          <p className="text-[14px] text-[#6B5B4B] mb-6">Add some fresh Baja products before checking out.</p>
          <Link href="/shop" className="inline-flex items-center gap-2 bg-[#2D5016] hover:bg-[#3D6B1F] text-white rounded-full px-8 h-11 font-semibold text-[14px] transition-colors">
            Browse the Shop
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-lg mx-auto px-6 py-10">

        <Link href="/shop" className="inline-flex items-center gap-1.5 text-[13px] text-[#6B5B4B] hover:text-[#2D5016] transition-colors mb-8">
          <ArrowLeft className="w-3.5 h-3.5" /> Continue shopping
        </Link>

        <h1 className="font-heading text-3xl font-bold text-[#2D5016] mb-8">Checkout</h1>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-[#2D5016]" />
            <h2 className="font-heading text-[16px] font-semibold text-[#2D5016]">Order Summary</h2>
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
                  <p className="text-[11px] text-gray-400">{item.unit} × {item.quantity}</p>
                </div>
                <p className="text-[13px] font-bold text-[#2D5016] flex-shrink-0">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </li>
            ))}
          </ul>

          {/* Totals */}
          <div className="px-6 py-4 border-t border-gray-100 space-y-2.5">
            {subtotal < FREE_DELIVERY_THRESHOLD && (
              <div className="bg-[#E8A838]/10 rounded-xl px-4 py-3 mb-3">
                <p className="text-[12px] text-[#6B5B4B]">
                  Add <strong className="text-[#2D5016]">${(FREE_DELIVERY_THRESHOLD - subtotal).toFixed(2)}</strong> more for <strong className="text-[#2D5016]">free delivery</strong> 🚐
                </p>
                <div className="mt-2 h-1.5 bg-[#E8A838]/20 rounded-full overflow-hidden">
                  <div className="h-full bg-[#E8A838] rounded-full transition-all duration-500" style={{ width: `${Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100)}%` }} />
                </div>
              </div>
            )}
            <div className="flex justify-between text-[13px] text-[#6B5B4B]">
              <span>Subtotal</span><span className="font-medium text-gray-800">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[13px] text-[#6B5B4B]">
              <span>Delivery</span>
              <span className={deliveryFee === 0 ? "font-semibold text-[#2D5016]" : "font-medium text-gray-800"}>
                {deliveryFee === 0 ? "🎉 Free" : `$${deliveryFee.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between text-[15px] font-bold text-[#2D5016] pt-2 border-t border-gray-100">
              <span>Total</span><span>${total.toFixed(2)} USD</span>
            </div>
          </div>

          {serverError && (
            <div className="mx-6 mb-4 px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-[13px] text-red-600">
              {serverError}
            </div>
          )}

          {/* Pay button */}
          <div className="px-6 pb-6">
            <button
              onClick={handlePay}
              disabled={isPending}
              className="w-full flex items-center justify-center gap-2 bg-[#2D5016] hover:bg-[#3D6B1F] disabled:opacity-60 text-white rounded-full h-12 font-semibold text-[14px] transition-colors shadow-lg shadow-[#2D5016]/20"
            >
              {isPending
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Preparing payment…</>
                : <><CreditCard className="w-4 h-4" /> Pay · ${total.toFixed(2)} USD</>
              }
            </button>
            <p className="text-center text-[11px] text-gray-400 mt-3">
              Stripe will ask for your address and contact info 🔒
            </p>
          </div>
        </div>

      </div>
    </>
  );
}
