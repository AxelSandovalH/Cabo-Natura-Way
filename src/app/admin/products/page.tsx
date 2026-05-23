import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { deleteProductAction, toggleProductFieldAction } from "@/app/admin/actions";
import type { Product } from "@/lib/supabase/types";
import AdminToggle from "@/components/admin/AdminToggle";
import AdminDeleteBtn from "@/components/admin/AdminDeleteBtn";

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
          <p className="text-[14px] text-gray-500 mt-1">{products?.length ?? 0} products total</p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 bg-[#2D5016] hover:bg-[#3D6B1F] text-white rounded-xl px-5 h-10 text-[13px] font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[640px] text-[13px]">
          <thead>
            <tr className="text-left border-b border-gray-100 bg-gray-50">
              <th className="px-6 py-3.5 font-semibold text-gray-500">Product</th>
              <th className="px-6 py-3.5 font-semibold text-gray-500">Category</th>
              <th className="px-6 py-3.5 font-semibold text-gray-500">Farmer</th>
              <th className="px-6 py-3.5 font-semibold text-gray-500">Price</th>
              <th className="px-6 py-3.5 font-semibold text-gray-500 text-center">In Stock</th>
              <th className="px-6 py-3.5 font-semibold text-gray-500 text-center">Featured</th>
              <th className="px-6 py-3.5" />
            </tr>
          </thead>
          <tbody>
            {(products as Product[])?.map((p) => (
              <tr key={p.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{p.image_emoji}</span>
                    <div>
                      <p className="font-semibold text-gray-800">{p.name}</p>
                      <p className="text-[11px] text-gray-400">{p.unit}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {p.category ? `${(p.category as any).icon} ${(p.category as any).name}` : "—"}
                </td>
                <td className="px-6 py-4 text-gray-500">
                  {p.farmer ? (p.farmer as any).name : "—"}
                </td>
                <td className="px-6 py-4 font-bold text-[#2D5016]">
                  ${p.price}
                </td>
                <td className="px-6 py-4 text-center">
                  <AdminToggle
                    id={p.id}
                    field="in_stock"
                    value={p.in_stock}
                    action={toggleProductFieldAction}
                  />
                </td>
                <td className="px-6 py-4 text-center">
                  <AdminToggle
                    id={p.id}
                    field="featured"
                    value={p.featured}
                    action={toggleProductFieldAction}
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 justify-end">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="p-2 rounded-lg text-gray-400 hover:text-[#2D5016] hover:bg-[#2D5016]/8 transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <AdminDeleteBtn id={p.id} action={deleteProductAction} label="product" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
