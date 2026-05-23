"use client";

import { useState, useTransition } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { GripVertical } from "lucide-react";
import { reorderProductsAction } from "@/app/admin/actions";
import SortableProductRow from "@/components/admin/SortableProductRow";
import type { Product } from "@/lib/supabase/types";

export default function ProductSortTable({ initial }: { initial: Product[] }) {
  const [products, setProducts] = useState(initial);
  const [saving, startTransition] = useTransition();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor,   { activationConstraint: { delay: 200, tolerance: 5 } })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = products.findIndex((p) => p.id === active.id);
    const newIndex = products.findIndex((p) => p.id === over.id);
    const reordered = arrayMove(products, oldIndex, newIndex);

    // Optimistic UI
    setProducts(reordered);

    // Persist to DB
    startTransition(() =>
      reorderProductsAction(reordered.map((p) => p.id))
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden overflow-x-auto relative">

      {/* Saving indicator */}
      {saving && (
        <div className="absolute top-3 right-4 flex items-center gap-1.5 text-[11px] text-gray-400 z-20">
          <span className="w-3 h-3 border-2 border-gray-300 border-t-[#2D5016] rounded-full animate-spin" />
          Saving…
        </div>
      )}

      <table className="w-full min-w-[680px] text-[13px]">
        <thead>
          <tr className="text-left border-b border-gray-100 bg-gray-50">
            {/* handle col */}
            <th className="pl-4 pr-2 py-3.5 w-8">
              <GripVertical className="w-3.5 h-3.5 text-gray-300" />
            </th>
            <th className="px-4 py-3.5 font-semibold text-gray-500">Product</th>
            <th className="px-4 py-3.5 font-semibold text-gray-500">Category</th>
            <th className="px-4 py-3.5 font-semibold text-gray-500">Farmer</th>
            <th className="px-4 py-3.5 font-semibold text-gray-500">Price</th>
            <th className="px-4 py-3.5 font-semibold text-gray-500 text-center">In Stock</th>
            <th className="px-4 py-3.5 font-semibold text-gray-500 text-center">Featured</th>
            <th className="px-4 py-3.5" />
          </tr>
        </thead>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={products.map((p) => p.id)}
            strategy={verticalListSortingStrategy}
          >
            <tbody>
              {products.map((p) => (
                <SortableProductRow key={p.id} product={p} />
              ))}
            </tbody>
          </SortableContext>
        </DndContext>
      </table>
    </div>
  );
}
