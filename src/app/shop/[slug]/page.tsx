import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Tag } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AddToCartButton from "@/components/shop/AddToCartButton";
import { getProductBySlug, getProducts } from "@/lib/supabase/queries";
import type { Farmer, Category } from "@/lib/supabase/types";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product not found — Cabo Natural Way" };
  return {
    title: `${product.name} — Cabo Natural Way`,
    description: product.description ?? `${product.name} — fresh from Baja California farms.`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const farmer = product.farmer as Farmer | undefined;
  const category = product.category as Category | undefined;

  // Related products (same category, exclude current)
  const related = category
    ? (await getProducts(category.slug))
        .filter((p) => p.id !== product.id)
        .slice(0, 4)
    : [];

  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 lg:px-20 py-10">
        {/* Back + breadcrumb */}
        <div className="flex items-center gap-2 text-[13px] text-[#6B5B4B] mb-8">
          <Link
            href="/shop"
            className="flex items-center gap-1.5 hover:text-[#2D5016] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Shop
          </Link>
          {category && (
            <>
              <span className="text-gray-300">/</span>
              <Link
                href={`/shop?category=${category.slug}`}
                className="hover:text-[#2D5016] transition-colors"
              >
                {category.icon} {category.name}
              </Link>
            </>
          )}
          <span className="text-gray-300">/</span>
          <span className="text-[#2D5016] font-medium truncate max-w-[160px]">{product.name}</span>
        </div>

        {/* Product hero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">

          {/* Left — visual */}
          <div className="flex flex-col gap-4">
            <div className="aspect-square rounded-3xl bg-gradient-to-br from-[#2D5016]/8 to-[#E8A838]/10 border border-gray-100 flex items-center justify-center relative overflow-hidden">
              {product.badge && (
                <span
                  className="absolute top-5 left-5 text-[11px] font-bold px-3 py-1.5 rounded-full text-white shadow-md"
                  style={{ backgroundColor: product.badge_color || "#2D5016" }}
                >
                  {product.badge}
                </span>
              )}
              {!product.in_stock && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10 rounded-3xl">
                  <span className="bg-gray-800 text-white text-[13px] font-bold px-4 py-2 rounded-full">
                    Out of Stock
                  </span>
                </div>
              )}
              <span className="text-[120px] select-none">{product.image_emoji}</span>
            </div>
          </div>

          {/* Right — info */}
          <div className="flex flex-col justify-center">
            {/* Category */}
            {category && (
              <Link
                href={`/shop?category=${category.slug}`}
                className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-[.15em] uppercase text-[#C4602A] hover:text-[#2D5016] transition-colors mb-4"
              >
                <Tag className="w-3 h-3" />
                {category.name}
              </Link>
            )}

            <h1 className="font-heading text-4xl lg:text-5xl font-bold text-[#2D5016] leading-tight mb-3">
              {product.name}
            </h1>

            <p className="text-[16px] text-[#6B5B4B] mb-6 leading-relaxed">
              {product.description ?? "Fresh from the farms of Baja California."}
            </p>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-8">
              <span className="font-heading text-4xl font-bold text-[#2D5016]">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-[15px] text-[#6B5B4B]">{product.unit}</span>
            </div>

            {/* Add to cart */}
            <div className="mb-8">
              <AddToCartButton product={product} />
            </div>

            {/* Farmer */}
            {farmer && (
              <div className="bg-[#2D5016]/5 rounded-2xl p-5 flex items-start gap-4 border border-[#2D5016]/10">
                <div className="w-12 h-12 rounded-full bg-[#2D5016]/10 flex items-center justify-center text-2xl flex-shrink-0">
                  {farmer.avatar_emoji}
                </div>
                <div>
                  <p className="text-[11px] font-semibold tracking-wider uppercase text-[#C4602A] mb-0.5">
                    Grown by
                  </p>
                  <p className="font-heading text-[16px] font-bold text-[#2D5016]">
                    {farmer.name}
                  </p>
                  <p className="text-[12px] text-[#6B5B4B] flex items-center gap-1 mt-0.5">
                    <span>📍</span> {farmer.location}
                  </p>
                  {farmer.bio && (
                    <p className="text-[12px] text-[#6B5B4B] mt-2 leading-relaxed line-clamp-2">
                      {farmer.bio}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Freshness promise */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              {[
                { icon: "🌱", label: "100% organic" },
                { icon: "🚐", label: "Same-day delivery" },
                { icon: "🤝", label: "Direct from farm" },
              ].map((badge) => (
                <div
                  key={badge.label}
                  className="bg-white rounded-xl border border-gray-100 py-3 text-center shadow-sm"
                >
                  <span className="text-xl block mb-1">{badge.icon}</span>
                  <span className="text-[11px] font-medium text-[#6B5B4B]">{badge.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading text-2xl font-bold text-[#2D5016]">
                More from {category?.name}
              </h2>
              <Link
                href={`/shop?category=${category?.slug}`}
                className="text-[13px] font-medium text-[#2D5016] hover:text-[#C4602A] transition-colors"
              >
                View all →
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/shop/${p.slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-5 text-center"
                >
                  <span className="text-5xl block mb-3">{p.image_emoji}</span>
                  <p className="font-semibold text-[14px] text-[#2D5016] mb-1 group-hover:text-[#C4602A] transition-colors leading-tight">
                    {p.name}
                  </p>
                  <p className="text-[13px] font-bold text-[#2D5016]">
                    ${p.price.toFixed(2)}{" "}
                    <span className="font-normal text-[#6B5B4B]">{p.unit}</span>
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
