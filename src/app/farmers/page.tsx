import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getFarmers } from "@/lib/supabase/queries";
import type { Farmer } from "@/lib/supabase/types";

export const metadata = {
  title: "Our Farmers — Cabo Natural Way",
  description: "Meet the farmers and producers of Baja California behind every product we deliver.",
};

function FarmerCard({ farmer }: { farmer: Farmer }) {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      {/* Header band */}
      <div className="h-24 bg-gradient-to-br from-[#2D5016] to-[#3D6B1F] flex items-center justify-center relative">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #E8A838 0%, transparent 60%), radial-gradient(circle at 70% 80%, #C4602A 0%, transparent 40%)" }}
        />
        <span className="text-6xl relative z-10">{farmer.avatar_emoji}</span>
      </div>

      {/* Content */}
      <div className="p-6">
        <h2 className="font-heading text-xl font-bold text-[#2D5016] mb-1">
          {farmer.name}
        </h2>
        <p className="text-[12px] font-semibold text-[#C4602A] tracking-wide mb-4 flex items-center gap-1">
          <span>📍</span> {farmer.location}
        </p>
        {farmer.bio && (
          <p className="text-[14px] text-[#6B5B4B] leading-relaxed">
            {farmer.bio}
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 pb-6">
        <Link
          href={`/shop`}
          className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#2D5016] hover:text-[#C4602A] transition-colors"
        >
          Shop their products <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

export default async function FarmersPage() {
  const farmers = await getFarmers();

  return (
    <>
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#2D5016] to-[#1a3009] px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[11px] font-semibold tracking-[.2em] uppercase text-[#E8A838] mb-4">
            The People Behind Your Food
          </p>
          <h1 className="font-heading text-5xl lg:text-6xl font-bold text-white mb-6">
            Our Farmers & <em className="not-italic text-[#E8A838]">Producers</em>
          </h1>
          <p className="text-white/70 text-[17px] max-w-2xl mx-auto leading-relaxed">
            Every product we deliver comes directly from the hands of these dedicated farmers
            across Baja California. No middlemen, no cold storage warehouses — just fresh,
            honest food from people who love what they grow.
          </p>
        </div>
      </div>

      {/* Values strip */}
      <div className="bg-[#E8A838]/10 border-y border-[#E8A838]/20 px-6 lg:px-20 py-6">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-8">
          {[
            { icon: "🤝", label: "Direct partnerships", sub: "We buy directly from each farm" },
            { icon: "🌱", label: "Verified organic", sub: "No pesticides or synthetic inputs" },
            { icon: "📍", label: "Locally sourced", sub: "All within 200km of Cabo" },
            { icon: "💰", label: "Fair prices", sub: "Farmers receive 70%+ of sale price" },
          ].map((v) => (
            <div key={v.label} className="flex items-center gap-3 text-center sm:text-left">
              <span className="text-2xl">{v.icon}</span>
              <div>
                <p className="text-[13px] font-semibold text-[#2D5016]">{v.label}</p>
                <p className="text-[11px] text-[#6B5B4B]">{v.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Farmers grid */}
      <main className="max-w-7xl mx-auto px-6 lg:px-20 py-20">
        {farmers.length === 0 ? (
          <div className="text-center py-20">
            <span className="text-6xl mb-4 block">👨‍🌾</span>
            <p className="font-heading text-xl text-[#2D5016]">Meet our farmers soon</p>
          </div>
        ) : (
          <>
            <p className="text-[13px] text-[#6B5B4B] mb-10">
              <span className="font-bold text-[#2D5016]">{farmers.length}</span> producers
              currently in our network
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {farmers.map((f) => (
                <FarmerCard key={f.id} farmer={f} />
              ))}
            </div>
          </>
        )}
      </main>

      {/* CTA */}
      <section className="px-6 lg:px-20 pb-20">
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-[#2D5016] to-[#1a3009] rounded-3xl px-8 lg:px-16 py-14 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-[#E8A838]/10 blur-3xl pointer-events-none" />
          <h2 className="font-heading text-3xl lg:text-4xl font-bold text-white mb-4 relative">
            Ready to taste the difference?
          </h2>
          <p className="text-white/60 mb-8 relative">
            Every purchase supports a local Baja family farm.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 bg-[#E8A838] hover:bg-[#d4962e] text-[#2D5016] rounded-full px-8 h-12 font-bold text-[15px] transition-colors shadow-lg relative"
          >
            Shop Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
