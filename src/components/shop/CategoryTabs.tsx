"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import type { Category } from "@/lib/supabase/types";

interface Props {
  categories: Category[];
  active?: string;
}

export default function CategoryTabs({ categories, active }: Props) {
  return (
    <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-hide">
      {/* All tab */}
      <Link
        href="/shop"
        className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-medium transition-all ${
          !active
            ? "bg-[#2D5016] text-white shadow-sm"
            : "text-[#6B5B4B] hover:text-[#2D5016] hover:bg-[#2D5016]/8"
        }`}
      >
        🌿 All
      </Link>

      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/shop?category=${cat.slug}`}
          className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-medium transition-all ${
            active === cat.slug
              ? "bg-[#2D5016] text-white shadow-sm"
              : "text-[#6B5B4B] hover:text-[#2D5016] hover:bg-[#2D5016]/8"
          }`}
        >
          {cat.icon} {cat.name}
        </Link>
      ))}
    </div>
  );
}
