"use client";

import { useState } from "react";
import { ShoppingCart, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart/CartContext";
import type { Product } from "@/lib/supabase/types";

const bgMap: Record<string, string> = {
  "💧": "from-sky-100 to-sky-200",
  "🍋": "from-yellow-100 to-yellow-200",
  "🥬": "from-green-100 to-green-200",
  "🍯": "from-amber-100 to-amber-200",
  "🍊": "from-orange-100 to-orange-200",
  "🌿": "from-emerald-100 to-emerald-200",
};

export default function HomeProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [flash, setFlash] = useState(false);
  const bg = bgMap[product.image_emoji] ?? "from-green-100 to-green-200";

  function handleAdd() {
    addItem(product);
    setFlash(true);
    setTimeout(() => setFlash(false), 1600);
  }

  return (
    <div className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:-translate-y-1 hover:shadow-xl transition-all duration-200">
      <div className={`relative h-48 bg-gradient-to-br ${bg} flex items-center justify-center`}>
        <span className="text-7xl transition-transform duration-300 group-hover:scale-110 select-none">
          {product.image_emoji}
        </span>
        {product.badge && (
          <Badge
            className="absolute top-3 left-3 text-white border-0 text-[9px] tracking-[.08em] uppercase"
            style={{ backgroundColor: product.badge_color }}
          >
            {product.badge}
          </Badge>
        )}
      </div>

      <div className="p-5">
        <p className="text-[10px] font-semibold tracking-[.12em] uppercase text-[#A89880] mb-1">
          {product.farmer?.name ?? "Local Farm"} · {product.farmer?.location?.split(",")[1]?.trim() ?? "Cabo"}
        </p>
        <h3 className="font-heading text-[17px] font-semibold text-[#2D5016] mb-1.5">
          {product.name}
        </h3>
        <p className="text-[12px] text-[#6B5B4B] leading-relaxed mb-4 line-clamp-2">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-[18px] font-bold text-[#2D5016]">
            ${product.price}{" "}
            <span className="text-[12px] font-normal text-[#6B5B4B]">{product.unit}</span>
          </span>
          <Button
            size="sm"
            onClick={handleAdd}
            className={`rounded-full px-4 text-[12px] font-semibold flex items-center gap-1.5 transition-all duration-300 ${
              flash
                ? "bg-[#E8A838] hover:bg-[#E8A838] text-white scale-95"
                : "bg-[#2D5016] hover:bg-[#3D6B1F] text-white"
            }`}
          >
            {flash ? <><Check className="w-3 h-3" />Added!</> : <><ShoppingCart className="w-3 h-3" />Add</>}
          </Button>
        </div>
      </div>
    </div>
  );
}
