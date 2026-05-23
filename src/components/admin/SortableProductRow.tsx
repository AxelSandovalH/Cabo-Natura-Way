"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Link from "next/link";
import Image from "next/image";
import { GripVertical, Pencil } from "lucide-react";
import AdminToggle from "@/components/admin/AdminToggle";
import AdminDeleteBtn from "@/components/admin/AdminDeleteBtn";
import { toggleProductFieldAction, deleteProductAction } from "@/app/admin/actions";
import type { Product } from "@/lib/supabase/types";

export default function SortableProductRow({ product: p }: { product: Product }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: p.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: "relative",
    zIndex:   isDragging ? 10 : "auto",
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
    >
      {/* Drag handle */}
      <td className="pl-4 pr-2 py-4 w-8">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-500 transition-colors touch-none"
          aria-label="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </button>
      </td>

      {/* Product */}
      <td className="px-4 py-4">
        <div className="flex items-center gap-3">
          {p.image_url ? (
            <div className="relative w-8 h-8 rounded-lg overflow-hidden flex-shrink-0">
              <Image src={p.image_url} alt={p.name} fill className="object-cover" sizes="32px" />
            </div>
          ) : (
            <span className="text-2xl leading-none">{p.image_emoji}</span>
          )}
          <div>
            <p className="font-semibold text-gray-800 text-[13px]">{p.name}</p>
            <p className="text-[11px] text-gray-400">{p.unit}</p>
          </div>
        </div>
      </td>

      {/* Category */}
      <td className="px-4 py-4 text-[13px] text-gray-500">
        {p.category ? `${(p.category as any).icon} ${(p.category as any).name}` : "—"}
      </td>

      {/* Farmer */}
      <td className="px-4 py-4 text-[13px] text-gray-500">
        {p.farmer ? (p.farmer as any).name : "—"}
      </td>

      {/* Price */}
      <td className="px-4 py-4 text-[13px] font-bold text-[#2D5016]">
        ${p.price}
      </td>

      {/* In Stock */}
      <td className="px-4 py-4 text-center">
        <AdminToggle id={p.id} field="in_stock" value={p.in_stock} action={toggleProductFieldAction} />
      </td>

      {/* Featured */}
      <td className="px-4 py-4 text-center">
        <AdminToggle id={p.id} field="featured" value={p.featured} action={toggleProductFieldAction} />
      </td>

      {/* Actions */}
      <td className="px-4 py-4">
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
  );
}
