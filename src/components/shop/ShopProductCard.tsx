"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart/CartContext";
import type { Product } from "@/lib/supabase/types";

const emojiGradients: Record<string, string> = {
  "💧": "from-sky-50    to-sky-100",
  "🍋": "from-yellow-50 to-yellow-100",
  "🥬": "from-green-50  to-green-100",
  "🍯": "from-amber-50  to-amber-100",
  "🍊": "from-orange-50 to-orange-100",
  "🌿": "from-emerald-50 to-emerald-100",
  "🍅": "from-red-50    to-red-100",
  "🥕": "from-orange-50 to-orange-100",
};

export default function ShopProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [flash, setFlash] = useState(false);

  const bg = emojiGradients[product.image_emoji] ?? "from-green-50 to-green-100";
  const farmerCity = product.farmer?.location?.split(",")[1]?.trim() ?? "Baja";

  function handleAdd() {
    addItem(product);
    setFlash(true);
    setTimeout(() => setFlash(false), 1600);
  }

  return (
    <article className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-200 flex flex-col">

      {/* image — clicking navigates to detail page */}
      <Link href={`/shop/${product.slug}`} className={`relative h-52 bg-gradient-to-br ${bg} flex items-center justify-center flex-shrink-0 block`}>
        <span className="text-[80px] transition-transform duration-300 group-hover:scale-110 select-none">
          {product.image_emoji}
        </span>

        {product.badge && (
          <Badge
            className="absolute top-3 left-3 text-white border-0 text-[9px] font-bold tracking-[.1em] uppercase"
            style={{ backgroundColor: product.badge_color }}
          >
            {product.badge}
          </Badge>
        )}

        {!product.in_stock && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
            <span className="bg-[#6B5B4B] text-white text-[11px] font-semibold px-3 py-1.5 rounded-full">
              Out of stock
            </span>
          </div>
        )}
      </Link>

      {/* info */}
      <div className="p-5 flex flex-col flex-1">
        <p className="text-[10px] font-semibold tracking-[.12em] uppercase text-[#A89880] mb-1">
          {product.farmer?.name ?? "Local Farm"} · {farmerCity}
        </p>

        <Link href={`/shop/${product.slug}`}>
          <h2 className="font-heading text-[17px] font-semibold text-[#2D5016] hover:text-[#C4602A] transition-colors mb-1.5 leading-snug">
            {product.name}
          </h2>
        </Link>

        {product.category && (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#6B5B4B] bg-[#2D5016]/6 rounded-full px-2.5 py-0.5 w-fit mb-3">
            {product.category.icon} {product.category.name}
          </span>
        )}

        <p className="text-[12px] text-[#6B5B4B] leading-relaxed mb-4 line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-[#2D5016]/8">
          <div>
            <span className="text-[20px] font-bold text-[#2D5016]">${product.price}</span>
            <span className="text-[12px] text-[#6B5B4B] ml-1">{product.unit}</span>
          </div>

          <Button
            size="sm"
            disabled={!product.in_stock}
            onClick={handleAdd}
            className={`rounded-full px-4 text-[12px] font-semibold flex items-center gap-1.5 transition-all duration-300 ${
              flash
                ? "bg-[#E8A838] hover:bg-[#E8A838] text-white scale-95"
                : "bg-[#2D5016] hover:bg-[#3D6B1F] text-white"
            }`}
          >
            {flash ? (
              <><Check className="w-3.5 h-3.5" /> Added!</>
            ) : (
              <><ShoppingCart className="w-3.5 h-3.5" /> Add</>
            )}
          </Button>
        </div>
      </div>
    </article>
  );
}
