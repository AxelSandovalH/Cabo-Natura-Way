import Link from "next/link";
import { Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import ProductSortTable from "@/components/admin/ProductSortTable";
import type { Product } from "@/lib/supabase/types";

export default async function AdminProducts() {
  const supabase = await createClient();
  const { data: products } = await supabase
    .from("products")
    .select("*, category:categories(name, icon), farmer:farmers(name)")
    .order("sort_order");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-[#2D5016]">Products</h1>
          <p className="text-[14px] text-gray-500 mt-1">
            {products?.length ?? 0} products · drag <span className="text-gray-400">⠿</span> to reorder
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-[#2D5016] hover:bg-[#3D6B1F] text-white rounded-xl px-5 h-10 text-[13px] font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      {!products?.length ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm px-6 py-16 text-center">
          <span className="text-5xl mb-4 block">📦</span>
          <p className="font-heading text-xl text-[#2D5016] font-semibold mb-2">No products yet</p>
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-1.5 mt-2 text-[13px] font-semibold text-[#2D5016] hover:text-[#C4602A] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add your first product
          </Link>
        </div>
      ) : (
        <ProductSortTable initial={products as Product[]} />
      )}
    </div>
  );
}
