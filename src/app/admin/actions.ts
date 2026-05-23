"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/* ── AUTH ─────────────────────────────────────────────────── */

export async function loginAction(formData: FormData) {
  const email    = formData.get("email")    as string;
  const password = formData.get("password") as string;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };
  redirect("/admin");
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

/* ── PRODUCTS ─────────────────────────────────────────────── */

export async function upsertProductAction(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string | null;

  const name    = (formData.get("name")    as string).trim();
  const rawSlug = (formData.get("slug")    as string | null)?.trim();
  const slug    = rawSlug || name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const payload = {
    name,
    slug,
    description:  (formData.get("description")  as string).trim() || null,
    price:        parseFloat(formData.get("price") as string),
    unit:         (formData.get("unit")          as string).trim(),
    image_emoji:  (formData.get("image_emoji")   as string).trim() || "🌿",
    image_url:    (formData.get("image_url")     as string).trim() || null,
    category_id:  (formData.get("category_id")   as string) || null,
    farmer_id:    (formData.get("farmer_id")      as string) || null,
    badge:        (formData.get("badge")          as string).trim() || null,
    badge_color:  (formData.get("badge_color")    as string).trim() || "#2D5016",
    in_stock:     formData.get("in_stock")    === "true",
    featured:     formData.get("featured")    === "true",
  };

  if (id) {
    const { error } = await supabase.from("products").update(payload).eq("id", id);
    if (error) return { error: error.message };
  } else {
    const { error } = await supabase.from("products").insert(payload);
    if (error) return { error: error.message };
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
  redirect("/admin/products");
}

export async function reorderProductsAction(orderedIds: string[]): Promise<void> {
  const supabase = await createClient();
  await supabase.from("products").upsert(
    orderedIds.map((id, i) => ({ id, sort_order: i }))
  );
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
}

export async function deleteProductAction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
}

export async function toggleProductFieldAction(
  id: string,
  field: "in_stock" | "featured",
  value: boolean
) {
  const supabase = await createClient();
  await supabase.from("products").update({ [field]: value }).eq("id", id);
  revalidatePath("/admin/products");
  revalidatePath("/shop");
  revalidatePath("/");
}

/* ── ORDERS ───────────────────────────────────────────────── */

export async function updateOrderStatusAction(id: string, status: string) {
  const supabase = await createClient();
  await supabase.from("orders").update({ status }).eq("id", id);
  revalidatePath("/admin/orders");
}

/* ── FARMERS ──────────────────────────────────────────────── */

export async function upsertFarmerAction(formData: FormData) {
  const supabase = await createClient();
  const id = formData.get("id") as string | null;

  const payload = {
    name:         (formData.get("name")         as string).trim(),
    location:     (formData.get("location")     as string).trim(),
    bio:          (formData.get("bio")           as string).trim() || null,
    avatar_emoji: (formData.get("avatar_emoji") as string).trim() || "👨‍🌾",
    active:       formData.get("active") !== "false",
  };

  if (id) {
    await supabase.from("farmers").update(payload).eq("id", id);
  } else {
    await supabase.from("farmers").insert(payload);
  }

  revalidatePath("/admin/farmers");
  revalidatePath("/");
  redirect("/admin/farmers");
}

export async function deleteFarmerAction(id: string) {
  const supabase = await createClient();
  await supabase.from("farmers").delete().eq("id", id);
  revalidatePath("/admin/farmers");
}
