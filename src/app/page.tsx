import Link from "next/link";
import { ArrowRight, Truck, Leaf, Users, CreditCard } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HomeProductCard from "@/components/HomeProductCard";
import { getFeaturedProducts, getCategories, getFarmers } from "@/lib/supabase/queries";
import type { Product, Category, Farmer } from "@/lib/supabase/types";

/* ── STATIC DATA ────────────────────────────────────────────── */

const trustItems = [
  { icon: <Leaf className="w-4 h-4" />,       label: "100% Organic",        sub: "Verified producers" },
  { icon: <Truck className="w-4 h-4" />,      label: "Same-day Delivery",   sub: "Cabo SL & SJD"      },
  { icon: <Users className="w-4 h-4" />,      label: "Direct from Farmers", sub: "No middlemen"       },
  { icon: <CreditCard className="w-4 h-4" />, label: "Easy Checkout",       sub: "USD & MXN"          },
];

const steps = [
  { n: "1", title: "Browse & Choose",  desc: "Explore products sourced from vetted farms across Baja California. Every item has a story." },
  { n: "2", title: "We Curate & Pack", desc: "We pick up directly from the farmer, inspect quality, and pack your order fresh the same day." },
  { n: "3", title: "Delivered to You", desc: "Same-day or next-day delivery across Cabo San Lucas and San José del Cabo." },
];

/* ── SUB-COMPONENTS ─────────────────────────────────────────── */

function CategoryCard({ cat }: { cat: Category }) {
  const colorMap: Record<string, string> = {
    vegetables:    "bg-[#2D5016]/7  border-[#2D5016]/12",
    fruits:        "bg-[#E8A838]/10 border-[#E8A838]/20",
    "spring-water":"bg-[#2D7ABA]/7  border-[#2D7ABA]/12",
    "herbs-spices":"bg-[#C4602A]/7  border-[#C4602A]/15",
    "honey-jams":  "bg-[#E8A838]/10 border-[#E8A838]/20",
  };
  const color = colorMap[cat.slug] ?? "bg-[#2D5016]/7 border-[#2D5016]/12";

  return (
    <Link
      href={`/shop?category=${cat.slug}`}
      className={`group rounded-2xl border p-7 text-center hover:-translate-y-1 hover:shadow-lg transition-all duration-200 ${color}`}
    >
      <span className="text-4xl mb-3 block">{cat.icon}</span>
      <h3 className="font-heading text-[15px] font-semibold text-[#2D5016] mb-1">{cat.name}</h3>
      <p className="text-[12px] text-[#6B5B4B] leading-snug">{cat.description}</p>
    </Link>
  );
}


function FarmerCard({ farmer }: { farmer: Farmer }) {
  return (
    <div className="bg-white rounded-2xl p-7 flex gap-5 items-start shadow-sm hover:shadow-md transition-shadow">
      <div className="w-14 h-14 rounded-full bg-[#2D5016]/10 flex items-center justify-center text-3xl flex-shrink-0">
        {farmer.avatar_emoji}
      </div>
      <div>
        <h3 className="font-heading text-[17px] font-semibold text-[#2D5016] mb-1">
          {farmer.name}
        </h3>
        <p className="text-[11px] font-semibold text-[#C4602A] tracking-wide mb-2">
          📍 {farmer.location}
        </p>
        <p className="text-[13px] text-[#6B5B4B] leading-relaxed">{farmer.bio}</p>
      </div>
    </div>
  );
}

/* ── PAGE (Server Component — fetches data at request time) ── */

export default async function Home() {
  // Fetch all data in parallel
  const [products, categories, farmers] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
    getFarmers(),
  ]);

  return (
    <>
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-[92vh] grid grid-cols-1 lg:grid-cols-2 items-center gap-12 px-6 lg:px-20 py-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute right-0 bottom-0 w-[520px] h-[520px] rounded-full bg-[#E8A838]/10 blur-3xl" />
          <div className="absolute left-0 top-1/4 w-[300px] h-[300px] rounded-full bg-[#2D5016]/5 blur-3xl" />
        </div>

        <div className="relative max-w-xl">
          <div className="inline-flex items-center gap-2 bg-[#2D5016]/8 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-[#E8A838]" />
            <span className="text-[11px] font-semibold tracking-[.14em] uppercase text-[#2D5016]">
              Fresh from Baja&apos;s Ranchos
            </span>
          </div>

          <h1 className="font-heading text-5xl lg:text-6xl font-bold leading-[1.08] text-[#2D5016] mb-6 text-balance">
            The <em className="not-italic text-[#C4602A]">purest</em> taste of Baja, delivered.
          </h1>

          <p className="text-[17px] font-light leading-relaxed text-[#6B5B4B] mb-10 max-w-md">
            Organic produce, artisan goods, and fresh spring water — sourced
            directly from the farmers of Los Cabos and the Baja peninsula.
          </p>

          <div className="flex items-center gap-5 flex-wrap">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-[#2D5016] hover:bg-[#3D6B1F] text-[#FAFAF7] rounded-full px-8 h-11 text-[14px] font-semibold tracking-wide transition-colors shadow-lg shadow-[#2D5016]/25"
            >
              Explore Products
            </Link>
            <Link
              href="/farmers"
              className="flex items-center gap-2 text-[14px] font-medium text-[#2D5016] hover:text-[#C4602A] transition-colors"
            >
              Meet our farmers <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <div className="relative flex justify-center">
          <div className="relative w-[360px] h-[460px] rounded-[180px_180px_0_0] bg-gradient-to-b from-[#a8c87a] via-[#3D6B1F] to-[#1e3a0e] flex items-center justify-center overflow-hidden shadow-2xl">
            <span className="text-[110px] select-none">🌵</span>
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </div>
          <div className="absolute bottom-8 -left-4 bg-white rounded-2xl px-4 py-3 shadow-xl flex items-center gap-3">
            <span className="text-3xl">💧</span>
            <div>
              <p className="text-[13px] font-semibold text-[#2D5016]">Pure Spring Water</p>
              <p className="text-[11px] text-[#6B5B4B]">Local source · Cabo</p>
            </div>
          </div>
          <div className="absolute top-10 -right-4 bg-[#E8A838] text-white rounded-xl px-4 py-2 shadow-lg">
            <p className="text-[11px] font-bold tracking-[.08em] uppercase">100% Natural</p>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div className="bg-[#2D5016] px-6 lg:px-20 py-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          {trustItems.map((t, i) => (
            <div key={i} className="flex items-center gap-2.5 text-white/80">
              {t.icon}
              <span className="text-[13px]">
                <strong className="text-white font-semibold">{t.label}</strong>
                {" · "}{t.sub}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── CATEGORIES (from DB) ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-20 py-20">
        <p className="text-[11px] font-semibold tracking-[.2em] uppercase text-[#C4602A] mb-3">
          Browse by Category
        </p>
        <h2 className="font-heading text-4xl font-bold text-[#2D5016] mb-12">
          What are you looking for <em className="not-italic text-[#C4602A]">today?</em>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => <CategoryCard key={cat.id} cat={cat} />)}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS (from DB) ── */}
      <section className="bg-[#2D5016]/4 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <p className="text-[11px] font-semibold tracking-[.2em] uppercase text-[#C4602A] mb-3">
            Featured This Week
          </p>
          <h2 className="font-heading text-4xl font-bold text-[#2D5016] mb-12">
            From ranch to your <em className="not-italic text-[#C4602A]">door</em>
          </h2>

          {products.length === 0 ? (
            <p className="text-[#6B5B4B]">No products available right now — check back soon.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
              {products.map((p) => <HomeProductCard key={p.id} product={p} />)}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/shop"
              className="inline-flex items-center justify-center border border-[#2D5016] text-[#2D5016] hover:bg-[#2D5016] hover:text-white rounded-full px-10 h-11 font-semibold transition-colors"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="max-w-7xl mx-auto px-6 lg:px-20 py-20">
        <p className="text-[11px] font-semibold tracking-[.2em] uppercase text-[#C4602A] mb-3 text-center">
          How It Works
        </p>
        <h2 className="font-heading text-4xl font-bold text-[#2D5016] mb-16 text-center">
          Farm fresh in <em className="not-italic text-[#C4602A]">3 simple steps</em>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {steps.map((s) => (
            <div key={s.n}>
              <div className="w-12 h-12 rounded-full bg-[#2D5016] text-[#FAFAF7] flex items-center justify-center font-heading text-xl font-bold mx-auto mb-5">
                {s.n}
              </div>
              <h3 className="font-heading text-xl font-semibold text-[#2D5016] mb-3">{s.title}</h3>
              <p className="text-[14px] text-[#6B5B4B] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FARMERS (from DB) ── */}
      <section className="bg-[#2D5016]/4 py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-20">
          <p className="text-[11px] font-semibold tracking-[.2em] uppercase text-[#C4602A] mb-3">
            Our Producers
          </p>
          <h2 className="font-heading text-4xl font-bold text-[#2D5016] mb-12">
            The people behind your <em className="not-italic text-[#C4602A]">food</em>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {farmers.map((f) => <FarmerCard key={f.id} farmer={f} />)}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="px-6 lg:px-20 py-16">
        <div className="max-w-7xl mx-auto relative bg-gradient-to-br from-[#2D5016] to-[#1a3009] rounded-3xl px-8 lg:px-16 py-16 text-center overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#E8A838]/15 blur-3xl pointer-events-none" />
          <h2 className="font-heading text-4xl lg:text-5xl font-bold text-[#FAFAF7] mb-4 relative">
            Ready to eat <em className="not-italic text-[#E8A838]">real food?</em>
          </h2>
          <p className="text-white/70 text-[16px] mb-10 relative">
            Join hundreds of families and expats in Cabo who get their weekly fresh box.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center bg-[#E8A838] hover:bg-[#d4962e] text-[#2D5016] rounded-full px-10 h-12 font-bold text-[15px] shadow-lg shadow-[#E8A838]/30 relative transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
