// Auto-generated types for Cabo Natural Way database
// Regenerate with: npx supabase gen types typescript --project-id YOUR_PROJECT_ID

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string | null;
  sort_order: number;
  created_at: string;
}

export interface Farmer {
  id: string;
  name: string;
  location: string;
  bio: string | null;
  avatar_url: string | null;
  avatar_emoji: string;
  active: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  unit: string;
  image_url: string | null;
  image_emoji: string;
  category_id: string | null;
  farmer_id: string | null;
  badge: string | null;
  badge_color: string;
  in_stock: boolean;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // joined
  category?: Category;
  farmer?: Farmer;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  delivery_address: string | null;
  delivery_notes: string | null;
  status: OrderStatus;
  subtotal: number;
  delivery_fee: number;
  total: number;
  stripe_payment_id: string | null;
  created_at: string;
  updated_at: string;
  // joined
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string | null;
  product_name: string;
  unit_price: number;
  quantity: number;
  subtotal: number;
  created_at: string;
  // joined
  product?: Product;
}
