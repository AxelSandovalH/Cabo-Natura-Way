-- ============================================================
-- CABO NATURAL WAY — Database Schema
-- Run this in Supabase > SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ── CATEGORIES ──────────────────────────────────────────────
create table if not exists categories (
  id          uuid primary key default gen_random_uuid(),
  name        text        not null,
  slug        text        not null unique,
  icon        text        not null default '🌿',
  description text,
  sort_order  int         not null default 0,
  created_at  timestamptz not null default now()
);

-- ── FARMERS ─────────────────────────────────────────────────
create table if not exists farmers (
  id          uuid primary key default gen_random_uuid(),
  name        text        not null,
  location    text        not null,
  bio         text,
  avatar_url  text,
  avatar_emoji text       default '👨‍🌾',
  active      boolean     not null default true,
  created_at  timestamptz not null default now()
);

-- ── PRODUCTS ────────────────────────────────────────────────
create table if not exists products (
  id           uuid primary key default gen_random_uuid(),
  name         text        not null,
  slug         text        not null unique,
  description  text,
  price        numeric(10,2) not null,
  unit         text        not null default '/ unit',
  image_url    text,
  image_emoji  text        default '🌿',
  category_id  uuid        references categories(id) on delete set null,
  farmer_id    uuid        references farmers(id)    on delete set null,
  badge        text,                        -- "New", "Popular", etc.
  badge_color  text        default '#2D5016',
  in_stock     boolean     not null default true,
  featured     boolean     not null default false,
  sort_order   int         not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- auto-update updated_at
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger products_updated_at
  before update on products
  for each row execute procedure set_updated_at();

-- ── ORDERS ──────────────────────────────────────────────────
create type order_status as enum (
  'pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'
);

create table if not exists orders (
  id               uuid primary key default gen_random_uuid(),
  customer_name    text        not null,
  customer_email   text        not null,
  customer_phone   text,
  delivery_address text,
  delivery_notes   text,
  status           order_status not null default 'pending',
  subtotal         numeric(10,2) not null default 0,
  delivery_fee     numeric(10,2) not null default 0,
  total            numeric(10,2) not null default 0,
  stripe_payment_id text,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

create trigger orders_updated_at
  before update on orders
  for each row execute procedure set_updated_at();

-- ── ORDER ITEMS ──────────────────────────────────────────────
create table if not exists order_items (
  id          uuid primary key default gen_random_uuid(),
  order_id    uuid        not null references orders(id)   on delete cascade,
  product_id  uuid        references products(id)          on delete set null,
  product_name text       not null,   -- snapshot at time of purchase
  unit_price  numeric(10,2) not null,
  quantity    int         not null check (quantity > 0),
  subtotal    numeric(10,2) generated always as (unit_price * quantity) stored,
  created_at  timestamptz not null default now()
);

-- ── ROW LEVEL SECURITY ───────────────────────────────────────
-- Products and categories are public (read)
alter table categories  enable row level security;
alter table farmers     enable row level security;
alter table products    enable row level security;
alter table orders      enable row level security;
alter table order_items enable row level security;

-- Public can read catalog
create policy "Public read categories"  on categories  for select using (true);
create policy "Public read farmers"     on farmers     for select using (active = true);
create policy "Public read products"    on products    for select using (in_stock = true or in_stock = false);

-- Orders: anyone can insert (guest checkout), only service_role reads all
create policy "Anyone can place order"  on orders      for insert with check (true);
create policy "Anyone can add items"    on order_items for insert with check (true);

-- ── SEED DATA ────────────────────────────────────────────────
insert into categories (name, slug, icon, description, sort_order) values
  ('Vegetables',    'vegetables',    '🥬', 'Fresh greens and produce from local ranchos',    1),
  ('Fruits',        'fruits',        '🍊', 'Tropical and citrus fruits, picked daily',        2),
  ('Spring Water',  'spring-water',  '💧', 'Pure natural spring water from Baja sources',    3),
  ('Herbs & Spices','herbs-spices',  '🌿', 'Dried and fresh herbs, artisan grown',            4),
  ('Honey & Jams',  'honey-jams',    '🍯', 'Raw honey from desert wildflowers and artisan jams', 5)
on conflict (slug) do nothing;

insert into farmers (name, location, bio, avatar_emoji) values
  ('Don Roberto Valdez', 'Rancho El Aguaje, Cabo',
   'Third generation rancher. Supplies the purest spring water from the family''s natural well. Also grows seasonal herbs and chiles.',
   '👨‍🌾'),
  ('Familia Castillo', 'Rancho San Francisco, SJD',
   'Organic citrus and tropical fruit growers for over 20 years. Certified pesticide-free and passionate about soil health.',
   '👩‍🌾'),
  ('Apícola Baja', 'Todos Santos, BCS',
   'Small-batch desert honey harvested from cardon cactus blooms and native wildflowers. Zero additives, maximum flavor.',
   '🐝');

-- seed products (after categories and farmers exist)
do $$
declare
  cat_water   uuid := (select id from categories where slug = 'spring-water');
  cat_fruits  uuid := (select id from categories where slug = 'fruits');
  cat_vegs    uuid := (select id from categories where slug = 'vegetables');
  cat_honey   uuid := (select id from categories where slug = 'honey-jams');
  f_roberto   uuid := (select id from farmers where name = 'Don Roberto Valdez');
  f_castillo  uuid := (select id from farmers where name = 'Familia Castillo');
  f_apicola   uuid := (select id from farmers where name = 'Apícola Baja');
begin
  insert into products (name, slug, description, price, unit, image_emoji, category_id, farmer_id, badge, badge_color, featured, sort_order)
  values
    ('Natural Spring Water', 'natural-spring-water',
     '19L jug of pure, unprocessed spring water from a local Baja source.',
     8.00, '/ jug', '💧', cat_water, f_roberto, 'New', '#2D5016', true, 1),

    ('Organic Lemons', 'organic-lemons',
     'Sun-ripened Meyer lemons, hand-picked. No pesticides, ever.',
     5.00, '/ 2 kg', '🍋', cat_fruits, f_castillo, null, '#2D5016', true, 2),

    ('Mixed Greens Box', 'mixed-greens-box',
     'Spinach, arugula, kale — a weekly box for salads and smoothies.',
     14.00, '/ box', '🥬', cat_vegs, f_castillo, 'Popular', '#C4602A', true, 3),

    ('Wild Desert Honey', 'wild-desert-honey',
     'Raw, unfiltered honey from cardon cactus and desert wildflowers.',
     18.00, '/ 500 g', '🍯', cat_honey, f_apicola, null, '#2D5016', true, 4);
end;
$$;
