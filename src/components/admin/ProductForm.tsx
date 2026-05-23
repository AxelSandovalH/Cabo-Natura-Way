"use client";

import { useTransition } from "react";
import Link from "next/link";
import type { Product, Category, Farmer } from "@/lib/supabase/types";

const EMOJIS = ["🥬","🍊","💧","🌿","🍯","🍋","🍅","🥕","🌽","🫑","🍇","🥑","🥦","🫚","🧄","🧅"];

interface Props {
  product: Product | null;
  categories: Pick<Category, "id" | "name" | "icon">[];
  farmers: Pick<Farmer, "id" | "name">[];
  action: (formData: FormData) => Promise<any>;
}

export default function ProductForm({ product, categories, farmers, action }: Props) {
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => action(formData));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {product && <input type="hidden" name="id" value={product.id} />}

      {/* Name + emoji */}
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2">
          <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">Product Name *</label>
          <input
            name="name"
            required
            defaultValue={product?.name ?? ""}
            placeholder="e.g. Organic Lemons"
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">Emoji</label>
          <select name="image_emoji" defaultValue={product?.image_emoji ?? "🌿"} className={inputCls}>
            {EMOJIS.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">Description</label>
        <textarea
          name="description"
          defaultValue={product?.description ?? ""}
          rows={3}
          placeholder="Brief description of the product…"
          className={`${inputCls} resize-none`}
        />
      </div>

      {/* Price + unit */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">Price (USD) *</label>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={product?.price ?? ""}
            placeholder="0.00"
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">Unit *</label>
          <input
            name="unit"
            required
            defaultValue={product?.unit ?? ""}
            placeholder="e.g. / kg, / jug, / box"
            className={inputCls}
          />
        </div>
      </div>

      {/* Category + Farmer */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">Category</label>
          <select name="category_id" defaultValue={product?.category_id ?? ""} className={inputCls}>
            <option value="">— None —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{(c as any).icon} {c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">Farmer</label>
          <select name="farmer_id" defaultValue={product?.farmer_id ?? ""} className={inputCls}>
            <option value="">— None —</option>
            {farmers.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Badge */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">Badge Label</label>
          <input
            name="badge"
            defaultValue={product?.badge ?? ""}
            placeholder="e.g. New, Popular"
            className={inputCls}
          />
        </div>
        <div>
          <label className="block text-[12px] font-semibold text-gray-600 mb-1.5">Badge Color</label>
          <div className="flex gap-2">
            <input
              name="badge_color"
              defaultValue={product?.badge_color ?? "#2D5016"}
              type="color"
              className="h-11 w-14 rounded-xl border border-gray-200 cursor-pointer p-1"
            />
            <input
              defaultValue={product?.badge_color ?? "#2D5016"}
              readOnly
              className={`${inputCls} flex-1 font-mono text-[12px]`}
            />
          </div>
        </div>
      </div>

      {/* Toggles */}
      <div className="flex gap-8">
        <ToggleField name="in_stock"  label="In Stock"  defaultValue={product?.in_stock ?? true} />
        <ToggleField name="featured"  label="Featured"  defaultValue={product?.featured ?? false} />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="bg-[#2D5016] hover:bg-[#3D6B1F] disabled:opacity-60 text-white font-semibold text-[14px] rounded-xl px-8 h-11 transition-colors"
        >
          {pending ? "Saving…" : product ? "Save Changes" : "Create Product"}
        </button>
        <Link
          href="/admin/products"
          className="text-[14px] text-gray-400 hover:text-gray-600 px-4 h-11 flex items-center transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

function ToggleField({
  name, label, defaultValue,
}: { name: string; label: string; defaultValue: boolean }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer group">
      <input type="hidden" name={name} value="false" />
      <input
        type="checkbox"
        name={name}
        value="true"
        defaultChecked={defaultValue}
        className="sr-only peer"
      />
      <div className="relative w-11 h-6 bg-gray-200 peer-checked:bg-[#2D5016] rounded-full transition-colors after:content-[''] after:absolute after:top-1 after:left-1 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow after:transition-transform peer-checked:after:translate-x-5" />
      <span className="text-[13px] font-medium text-gray-600">{label}</span>
    </label>
  );
}

const inputCls = "w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-[14px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#2D5016] focus:ring-2 focus:ring-[#2D5016]/10 transition";
