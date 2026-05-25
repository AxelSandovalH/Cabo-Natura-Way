"use client";

import { useEffect } from "react";
import { useCart } from "@/lib/cart/CartContext";

/** Clears the cart once on mount — used by the Stripe success page. */
export default function CartClearer() {
  const { clearCart } = useCart();
  useEffect(() => { clearCart(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return null;
}
