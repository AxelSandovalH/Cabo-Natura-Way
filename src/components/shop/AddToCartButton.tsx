"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useCart } from "@/lib/cart/CartContext";
import type { Product } from "@/lib/supabase/types";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  if (!product.in_stock) {
    return (
      <button
        disabled
        className="w-full h-14 rounded-2xl bg-gray-100 text-gray-400 font-semibold text-[15px] cursor-not-allowed"
      >
        Out of Stock
      </button>
    );
  }

  return (
    <button
      onClick={handleAdd}
      className={`w-full h-14 rounded-2xl font-bold text-[15px] flex items-center justify-center gap-3 transition-all shadow-lg ${
        added
          ? "bg-emerald-500 text-white shadow-emerald-500/25"
          : "bg-[#2D5016] hover:bg-[#3D6B1F] text-white shadow-[#2D5016]/25"
      }`}
    >
      {added ? (
        <>
          <Check className="w-5 h-5" />
          Added to Cart!
        </>
      ) : (
        <>
          <ShoppingCart className="w-5 h-5" />
          Add to Cart · ${product.price.toFixed(2)}
        </>
      )}
    </button>
  );
}
