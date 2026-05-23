import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { upsertProductAction } from "@/app/admin/actions";
import ProductForm from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const isNew = id === "new";

  const [{ data: product }, { data: categories }, { data: farmers }] =
    await Promise.all([
      isNew
        ? Promise.resolve({ data: null })
        : supabase.from("products").select("*").eq("id", id).single(),
      supabase.from("categories").select("id, name, icon").order("sort_order"),
      supabase.from("farmers").select("id, name").eq("active", true).order("name"),
    ]);

  if (!isNew && !product) notFound();

  return (
    <div className="max-w-2xl">
      <h1 className="font-heading text-3xl font-bold text-[#2D5016] mb-8">
        {isNew ? "Add Product" : "Edit Product"}
      </h1>
      <ProductForm
        product={product}
        categories={categories ?? []}
        farmers={farmers ?? []}
        action={upsertProductAction}
      />
    </div>
  );
}
