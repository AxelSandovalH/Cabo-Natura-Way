"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import ImageUpload from "@/components/admin/ImageUpload";
import type { Product, Category, Farmer } from "@/lib/supabase/types";

interface Props {
  product: Product | null;
  categories: Pick<Category, "id" | "name" | "icon">[];
  farmers: Pick<Farmer, "id" | "name">[];
  action: (formData: FormData) => Promise<any>;
}

const input = "w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-[14px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#2D5016] focus:ring-2 focus:ring-[#2D5016]/10 transition";
const label = "block text-[12px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wide";

export default function ProductForm({ product, categories, farmers, action }: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await action(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {product && <input type="hidden" name="id" value={product.id} />}
      {/* Fixed defaults — keeps DB columns happy without showing pickers */}
      <input type="hidden" name="image_emoji" value="🌿" />
      <input type="hidden" name="badge_color" value="#2D5016" />

      {/* Photo */}
      <div>
        <label className={label}>Photo</label>
        <ImageUpload currentUrl={product?.image_url} emoji="🌿" />
      </div>

      {/* Name */}
      <div>
        <label className={label}>Product Name *</label>
        <input
          name="name"
          required
          defaultValue={product?.name ?? ""}
          placeholder="e.g. Organic Lemons"
          className={input}
        />
      </div>

      {/* Description */}
      <div>
        <label className={label}>Description</label>
        <textarea
          name="description"
          defaultValue={product?.description ?? ""}
          rows={3}
          placeholder="Brief description…"
          className={`${input} h-auto pt-3 resize-none`}
        />
      </div>

      {/* Price + Unit */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Price (USD) *</label>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={product?.price ?? ""}
            placeholder="0.00"
            className={input}
          />
        </div>
        <div>
          <label className={label}>Unit *</label>
          <input
            name="unit"
            required
            defaultValue={product?.unit ?? ""}
            placeholder="e.g. / kg, / box"
            className={input}
          />
        </div>
      </div>

      {/* Category + Farmer */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className={label}>Category</label>
          <select name="category_id" defaultValue={product?.category_id ?? ""} className={input}>
            <option value="">— None —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={label}>Farmer</label>
          <select name="farmer_id" defaultValue={product?.farmer_id ?? ""} className={input}>
            <option value="">— None —</option>
            {farmers.map((f) => (
              <option key={f.id} value={f.id}>{f.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Badge */}
      <div>
        <label className={label}>Badge <span className="font-normal normal-case text-gray-400">(optional — e.g. New, Popular)</span></label>
        <input
          name="badge"
          defaultValue={product?.badge ?? ""}
          placeholder="Leave blank for no badge"
          className={input}
        />
      </div>

      {/* Toggles */}
      <div className="flex gap-8 pt-1">
        <Toggle name="in_stock"  label="In Stock"  defaultValue={product?.in_stock ?? true} />
        <Toggle name="featured"  label="Featured"  defaultValue={product?.featured ?? false} />
      </div>

      {error && (
        <p className="px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-[13px] text-red-600">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={pending}
          className="bg-[#2D5016] hover:bg-[#3D6B1F] disabled:opacity-60 text-white font-semibold text-[14px] rounded-xl px-8 h-11 transition-colors"
        >
          {pending ? "Saving…" : product ? "Save Changes" : "Create Product"}
        </button>
        <Link href="/admin/products" className="text-[14px] text-gray-400 hover:text-gray-600 px-4 h-11 flex items-center transition-colors">
          Cancel
        </Link>
      </div>
    </form>
  );
}

function Toggle({ name, label, defaultValue }: { name: string; label: string; defaultValue: boolean }) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <input type="hidden" name={name} value="false" />
      <input type="checkbox" name={name} value="true" defaultChecked={defaultValue} className="sr-only peer" />
      <div className="relative w-11 h-6 bg-gray-200 peer-checked:bg-[#2D5016] rounded-full transition-colors after:content-[''] after:absolute after:top-1 after:left-1 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow after:transition-transform peer-checked:after:translate-x-5" />
      <span className="text-[13px] font-medium text-gray-600">{label}</span>
    </label>
  );
}
