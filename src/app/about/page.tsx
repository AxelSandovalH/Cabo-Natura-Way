import Link from "next/link";
import { ArrowRight, Leaf, Users, Truck, Heart } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AgaveLogo from "@/components/AgaveLogo";

export const metadata = {
  title: "About Us — Cabo Natural Way",
  description: "The story behind Cabo Natural Way — connecting Baja California farmers with the people of Los Cabos.",
};

const values = [
  {
    icon: Leaf,
    title: "Naturally grown",
    desc: "Every product we source is grown without synthetic pesticides or fertilizers. We visit every farm personally before adding them to our network.",
  },
  {
    icon: Users,
    title: "Community first",
    desc: "We believe in a food system where farmers earn a fair living and families eat clean food. That's why we keep our margins transparent.",
  },
  {
    icon: Truck,
    title: "Same-day fresh",
    desc: "We pick up directly from the farm the morning of your delivery. Nothing sits in a warehouse. From the field to your door in hours.",
  },
  {
    icon: Heart,
    title: "Rooted in Baja",
    desc: "We live here, we eat here, we work here. Cabo Natural Way was born from a genuine love for the land and people of Baja California.",
  },
];

export default function AboutPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-br from-[#2D5016] to-[#1a3009] px-6 lg:px-20 py-24">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-[11px] font-semibold tracking-[.2em] uppercase text-[#E8A838] mb-5">
              Our Story
            </p>
            <h1 className="font-heading text-5xl lg:text-6xl font-bold text-white leading-[1.08] mb-6">
              Food the way <em className="not-italic text-[#E8A838]">nature</em> intended it.
            </h1>
            <p className="text-white/70 text-[17px] leading-relaxed mb-8">
              Cabo Natural Way started with a simple idea: the farmers of Baja California
              grow extraordinary food, but the people of Los Cabos rarely get to taste it.
              We set out to change that.
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 bg-[#E8A838] hover:bg-[#d4962e] text-[#2D5016] rounded-full px-8 h-12 font-bold text-[15px] transition-colors shadow-lg"
            >
              Shop Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Visual */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="w-72 h-72 rounded-full bg-white/8 border border-white/15 flex items-center justify-center">
                <AgaveLogo size={120} />
              </div>
              <div className="absolute -bottom-4 -left-8 bg-white rounded-2xl px-5 py-3 shadow-xl">
                <p className="text-[13px] font-bold text-[#2D5016]">Est. 2024</p>
                <p className="text-[11px] text-[#6B5B4B]">Los Cabos, BCS</p>
              </div>
              <div className="absolute -top-4 -right-4 bg-[#E8A838] rounded-xl px-4 py-2 shadow-lg">
                <p className="text-[12px] font-bold text-white">100% Local</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Origin story */}
      <section className="max-w-4xl mx-auto px-6 lg:px-20 py-20">
        <p className="text-[11px] font-semibold tracking-[.2em] uppercase text-[#C4602A] mb-4">
          How it started
        </p>
        <h2 className="font-heading text-4xl font-bold text-[#2D5016] mb-8">
          From a rancho in Banderillas to your doorstep
        </h2>
        <div className="space-y-5 text-[16px] text-[#6B5B4B] leading-relaxed">
          <p>
            It started with a supplier of fresh spring water at a local Korean tacos stand in
            Cabo San Lucas. He knew everyone — the avocado ranchers, the honey producers,
            the herb growers scattered across the Baja peninsula. Amazing food was being grown
            just a couple of hours away, yet the supermarkets were full of imported produce
            that had traveled thousands of kilometers.
          </p>
          <p>
            We saw an opportunity to connect those ranchos directly with the families,
            expats, and tourists who want to eat clean and support local. No complicated
            supply chains. No cold storage. Just a direct line from the farmer's field to
            your kitchen.
          </p>
          <p>
            Today, Cabo Natural Way works with a growing network of farmers across Los Cabos
            and the Baja peninsula. Each one is personally vetted. Each product is fresh.
            And every purchase puts money directly into the hands of a local family.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#2D5016]/4 px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] font-semibold tracking-[.2em] uppercase text-[#C4602A] mb-3">
              What we stand for
            </p>
            <h2 className="font-heading text-4xl font-bold text-[#2D5016]">
              Our values
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
                <div className="w-11 h-11 rounded-xl bg-[#2D5016]/8 flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-[#2D5016]" />
                </div>
                <h3 className="font-heading text-[17px] font-semibold text-[#2D5016] mb-3">
                  {title}
                </h3>
                <p className="text-[13px] text-[#6B5B4B] leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="max-w-7xl mx-auto px-6 lg:px-20 py-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
          {[
            { n: "15+",  label: "Farm partners" },
            { n: "50+",  label: "Products available" },
            { n: "200+", label: "Families served" },
            { n: "100%", label: "Baja grown" },
          ].map((s) => (
            <div key={s.label}>
              <p className="font-heading text-5xl font-bold text-[#2D5016] mb-2">{s.n}</p>
              <p className="text-[14px] text-[#6B5B4B]">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Farmers CTA */}
      <section className="px-6 lg:px-20 pb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Link
            href="/farmers"
            className="group bg-gradient-to-br from-[#2D5016] to-[#1a3009] rounded-3xl p-10 flex flex-col justify-between min-h-[200px] hover:shadow-xl transition-shadow relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full bg-[#E8A838]/10 blur-3xl" />
            <div>
              <span className="text-4xl">👨‍🌾</span>
              <h3 className="font-heading text-2xl font-bold text-white mt-4 mb-2">
                Meet our farmers
              </h3>
              <p className="text-white/60 text-[14px]">
                The real people behind every product.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[#E8A838] font-semibold text-[14px] mt-6">
              See all farmers <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/shop"
            className="group bg-[#E8A838]/10 border border-[#E8A838]/20 rounded-3xl p-10 flex flex-col justify-between min-h-[200px] hover:shadow-xl transition-shadow"
          >
            <div>
              <span className="text-4xl">🛒</span>
              <h3 className="font-heading text-2xl font-bold text-[#2D5016] mt-4 mb-2">
                Start shopping
              </h3>
              <p className="text-[#6B5B4B] text-[14px]">
                Fresh products, delivered today.
              </p>
            </div>
            <div className="flex items-center gap-2 text-[#2D5016] font-semibold text-[14px] mt-6">
              Browse the shop <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
