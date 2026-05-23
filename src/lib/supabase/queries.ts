import { createClient } from "./server";
import type { Product, Category, Farmer, Order } from "./types";

// ── PRODUCTS ─────────────────────────────────────────────────

export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*), farmer:farmers(*)")
    .eq("featured", true)
    .order("sort_order");

  if (error) { console.error(error); return []; }
  return data as Product[];
}

export async function getProducts(categorySlug?: string): Promise<Product[]> {
  const supabase = await createClient();

  let query = supabase
    .from("products")
    .select("*, category:categories(*), farmer:farmers(*)")
    .order("sort_order");

  if (categorySlug) {
    // filter by joining through category slug
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .single();

    if (cat) query = query.eq("category_id", cat.id);
    else return [];
  }

  const { data, error } = await query;
  if (error) { console.error(error); return []; }
  return data as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*), farmer:farmers(*)")
    .eq("slug", slug)
    .single();

  if (error) { console.error(error); return null; }
  return data as Product;
}

// ── CATEGORIES ───────────────────────────────────────────────

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  if (error) { console.error(error); return []; }
  return data as Category[];
}

// ── FARMERS ──────────────────────────────────────────────────

export async function getFarmers(): Promise<Farmer[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("farmers")
    .select("*")
    .eq("active", true)
    .order("created_at");

  if (error) { console.error(error); return []; }
  return data as Farmer[];
}

// ── ORDERS ───────────────────────────────────────────────────

export async function createOrder(order: {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  delivery_address?: string;
  delivery_notes?: string;
  subtotal: number;
  delivery_fee: number;
  total: number;
  items: Array<{
    product_id: string;
    product_name: string;
    unit_price: number;
    quantity: number;
  }>;
}): Promise<Order | null> {
  const supabase = await createClient();
  const { items, ...orderData } = order;

  const { data: newOrder, error: orderError } = await supabase
    .from("orders")
    .insert(orderData)
    .select()
    .single();

  if (orderError) { console.error(orderError); return null; }

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(items.map((item) => ({ ...item, order_id: newOrder.id })));

  if (itemsError) { console.error(itemsError); return null; }
  return newOrder as Order;
}
