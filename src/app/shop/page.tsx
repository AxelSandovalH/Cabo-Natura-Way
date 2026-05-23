import Link from "next/link";
import { SlidersHorizontal } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getProducts, getCategories } from "@/lib/supabase/queries";
import ShopProductCard from "@/components/shop/ShopProductCard";
import CategoryTabs from "@/components/shop/CategoryTabs";
import type { Category } from "@/lib/supabase/types";

/* ── helpers ── */
function buildTitle(slug: string | undefined, categories: Category[]) {
  if (!slug) return { heading: "All Products", sub: "Everything fresh from Baja's ranchos" };
  const cat = categories.find((c) => c.slug === slug);
  return {
    heading: cat?.name ?? "Products",
    sub: cat?.description ?? "Fresh from local farms",
  };
}

/* ── page ── */
export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;

  const [products, categories] = await Promise.all([
    getProducts(category),
    getCategories(),
  ]);

  const { heading, sub } = buildTitle(category, categories);

  return (
    <>
      <Navbar />

      {/* ── PAGE HEADER ── */}
      <div className="bg-gradient-to-br from-[#2D5016] to-[#1a3009] px-6 lg:px-20 py-14">
        <div className="max-w-7xl mx-auto">
          {/* breadcrumb */}
          <div className="flex items-center gap-2 text-white/50 text-[12px] mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white">Shop</span>
            {category && (
              <>
                <span>/</span>
                <span className="text-[#E8A838] capitalize">{heading}</span>
              </>
            )}
          </div>

          <h1 className="font-heading text-4xl lg:text-5xl font-bold text-white mb-3">
            {heading}
          </h1>
          <p className="text-white/60 text-[16px]">{sub}</p>
        </div>
      </div>

      {/* ── CATEGORY TABS ── */}
      <div className="sticky top-16 z-40 bg-[#FAFAF7]/95 backdrop-blur-sm border-b border-[#2D5016]/10 px-6 lg:px-20">
        <div className="max-w-7xl mx-auto">
          <CategoryTabs categories={categories} active={category} />
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main className="max-w-7xl mx-auto px-6 lg:px-20 py-12">

        {/* result count */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-[13px] text-[#6B5B4B]">
            <span className="font-semibold text-[#2D5016]">{products.length}</span>
            {" "}product{products.length !== 1 ? "s" : ""} available
          </p>
          <div className="flex items-center gap-2 text-[13px] text-[#6B5B4B]">
            <SlidersHorizontal className="w-4 h-4" />
            <span>Sorted by featured</span>
          </div>
        </div>

        {/* grid */}
        {products.length === 0 ? (
          <EmptyState category={category} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((p) => (
              <ShopProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </main>

      {/* ── FRESHNESS BANNER ── */}
      <div className="bg-[#2D5016]/5 border-y border-[#2D5016]/10 px-6 lg:px-20 py-10 mt-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-heading text-xl font-semibold text-[#2D5016] mb-1">
              Don&apos;t see what you&apos;re looking for?
            </h3>
            <p className="text-[14px] text-[#6B5B4B]">
              Our catalog changes weekly based on what&apos;s fresh. Message us on WhatsApp
              and we&apos;ll source it for you.
            </p>
          </div>
          <a
            href="https://wa.me/526241234567"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5a] text-white rounded-full px-6 h-11 font-semibold text-[14px] transition-colors shadow-md"
          >
            <span className="text-lg">💬</span> WhatsApp us
          </a>
        </div>
      </div>

      <Footer />
    </>
  );
}

/* ── EMPTY STATE ── */
function EmptyState({ category }: { category?: string }) {
  return (
    <div className="text-center py-24">
      <span className="text-6xl mb-6 block">🌾</span>
      <h3 className="font-heading text-2xl font-semibold text-[#2D5016] mb-3">
        Nothing here yet
      </h3>
      <p className="text-[#6B5B4B] mb-8 max-w-sm mx-auto">
        {category
          ? "We're working on getting fresh products in this category. Check back soon."
          : "The shop is being stocked. Come back shortly!"}
      </p>
      <Link
        href="/shop"
        className="inline-flex items-center justify-center bg-[#2D5016] text-white rounded-full px-8 h-11 font-semibold text-[14px] hover:bg-[#3D6B1F] transition-colors"
      >
        View all products
      </Link>
    </div>
  );
}
