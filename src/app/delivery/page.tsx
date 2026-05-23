import Link from "next/link";
import { MapPin, Clock, Truck, CheckCircle2, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Delivery — Cabo Natural Way",
  description: "Same-day delivery across Cabo San Lucas and San José del Cabo. Free delivery on orders over $50.",
};

const zones = [
  {
    name: "Cabo San Lucas",
    icon: "🏖️",
    areas: ["Centro / Marina", "Pedregal", "Miraflores", "Diamante", "El Tezal", "Lomas del Sol"],
    time: "Same day",
    fee: "$5 USD (free over $50)",
  },
  {
    name: "San José del Cabo",
    icon: "🌵",
    areas: ["Centro Histórico", "Fonatur", "Las Palmas", "Brisas del Mar", "Ventanas", "Puerto Los Cabos"],
    time: "Same day",
    fee: "$5 USD (free over $50)",
  },
  {
    name: "Corridor",
    icon: "🛣️",
    areas: ["Palmilla", "Puerto Chileno", "Cabo del Sol", "Querencia", "Chileno Bay"],
    time: "Same day",
    fee: "$5 USD (free over $50)",
  },
];

const faq = [
  {
    q: "What time do you deliver?",
    a: "We typically deliver between 9 AM and 6 PM. After placing your order we'll contact you via WhatsApp to confirm a delivery window that works for you.",
  },
  {
    q: "Can I schedule a delivery for a specific time?",
    a: "Yes! Just leave a note in the 'Delivery Notes' field during checkout, or message us on WhatsApp after ordering. We'll do our best to accommodate.",
  },
  {
    q: "What if I'm not home?",
    a: "Let us know a safe place to leave your order (with a neighbor, reception desk, security gate, etc.) or we'll message you 15 minutes before arrival.",
  },
  {
    q: "Do you deliver to hotels and vacation rentals?",
    a: "Absolutely — that's one of our most common use cases. Just include the hotel name and room/villa number in the delivery address.",
  },
  {
    q: "How fresh are the products on delivery?",
    a: "We pick up from the farm the same morning as your delivery. Most products go from field to your door in under 8 hours.",
  },
  {
    q: "Do you deliver outside Los Cabos?",
    a: "Currently we only serve the Los Cabos corridor. Message us on WhatsApp if you're nearby — we'll see what we can do.",
  },
];

export default function DeliveryPage() {
  return (
    <>
      <Navbar />

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#2D5016] to-[#1a3009] px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-[11px] font-semibold tracking-[.2em] uppercase text-[#E8A838] mb-4">
            Fast & Fresh
          </p>
          <h1 className="font-heading text-5xl lg:text-6xl font-bold text-white mb-6">
            Delivery <em className="not-italic text-[#E8A838]">info</em>
          </h1>
          <p className="text-white/70 text-[17px] max-w-xl mx-auto">
            Same-day delivery across Los Cabos. Order in the morning,
            receive fresh Baja produce at your door.
          </p>
        </div>
      </div>

      {/* Key facts */}
      <div className="bg-white border-b border-gray-100 px-6 lg:px-20 py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: Truck,         label: "Same-day delivery",    sub: "Order by 12 PM for same-day" },
            { icon: MapPin,        label: "Los Cabos corridor",   sub: "CSL · SJD · Corridor"        },
            { icon: CheckCircle2,  label: "Free over $50 USD",    sub: "$5 flat fee under threshold"  },
          ].map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-[#2D5016]/8 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-[#2D5016]" />
              </div>
              <div>
                <p className="text-[14px] font-semibold text-[#2D5016]">{label}</p>
                <p className="text-[12px] text-[#6B5B4B]">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Delivery zones */}
      <section className="max-w-7xl mx-auto px-6 lg:px-20 py-20">
        <p className="text-[11px] font-semibold tracking-[.2em] uppercase text-[#C4602A] mb-3">
          Coverage
        </p>
        <h2 className="font-heading text-4xl font-bold text-[#2D5016] mb-12">
          Delivery zones
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {zones.map((zone) => (
            <div key={zone.name} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-7">
              <div className="flex items-center gap-3 mb-5">
                <span className="text-3xl">{zone.icon}</span>
                <h3 className="font-heading text-xl font-bold text-[#2D5016]">{zone.name}</h3>
              </div>

              <ul className="space-y-2 mb-6">
                {zone.areas.map((area) => (
                  <li key={area} className="flex items-center gap-2 text-[13px] text-[#6B5B4B]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#E8A838] flex-shrink-0" />
                    {area}
                  </li>
                ))}
              </ul>

              <div className="border-t border-gray-100 pt-4 space-y-2">
                <div className="flex items-center gap-2 text-[13px]">
                  <Clock className="w-3.5 h-3.5 text-[#2D5016]" />
                  <span className="text-[#6B5B4B]">Delivery time:</span>
                  <span className="font-semibold text-[#2D5016]">{zone.time}</span>
                </div>
                <div className="flex items-center gap-2 text-[13px]">
                  <Truck className="w-3.5 h-3.5 text-[#2D5016]" />
                  <span className="text-[#6B5B4B]">Fee:</span>
                  <span className="font-semibold text-[#2D5016]">{zone.fee}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-[13px] text-[#6B5B4B]">
          Not sure if we deliver to your area?{" "}
          <a
            href="https://wa.me/526241234567"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#2D5016] font-semibold hover:text-[#C4602A] transition-colors"
          >
            Message us on WhatsApp ↗
          </a>
        </p>
      </section>

      {/* How it works */}
      <section className="bg-[#2D5016]/4 px-6 lg:px-20 py-20">
        <div className="max-w-7xl mx-auto">
          <p className="text-[11px] font-semibold tracking-[.2em] uppercase text-[#C4602A] mb-3">
            The process
          </p>
          <h2 className="font-heading text-4xl font-bold text-[#2D5016] mb-12">
            How delivery works
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { n: "1", icon: "🛒", title: "Place your order", desc: "Choose your products and fill in your delivery address at checkout." },
              { n: "2", icon: "📱", title: "We confirm via WhatsApp", desc: "Within 30 minutes we'll confirm your order and agree on a delivery window." },
              { n: "3", icon: "🌾", title: "We pick up fresh", desc: "We collect your order directly from the farm that same morning." },
              { n: "4", icon: "🚐", title: "Delivered to you", desc: "Our driver brings your order right to your door, cold and fresh." },
            ].map((step) => (
              <div key={step.n} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
                <div className="w-8 h-8 rounded-full bg-[#2D5016] text-white text-[13px] font-bold flex items-center justify-center mx-auto mb-4">
                  {step.n}
                </div>
                <span className="text-3xl block mb-3">{step.icon}</span>
                <h3 className="font-heading text-[15px] font-semibold text-[#2D5016] mb-2">{step.title}</h3>
                <p className="text-[13px] text-[#6B5B4B] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 lg:px-20 py-20">
        <p className="text-[11px] font-semibold tracking-[.2em] uppercase text-[#C4602A] mb-3">
          Questions
        </p>
        <h2 className="font-heading text-4xl font-bold text-[#2D5016] mb-10">
          Frequently asked
        </h2>
        <div className="space-y-4">
          {faq.map(({ q, a }) => (
            <div key={q} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h3 className="font-semibold text-[15px] text-[#2D5016] mb-2">{q}</h3>
              <p className="text-[14px] text-[#6B5B4B] leading-relaxed">{a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="px-6 lg:px-20 pb-20">
        <div className="max-w-7xl mx-auto bg-gradient-to-br from-[#2D5016] to-[#1a3009] rounded-3xl px-8 lg:px-16 py-14 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 rounded-full bg-[#E8A838]/10 blur-3xl pointer-events-none" />
          <div className="relative">
            <h2 className="font-heading text-3xl font-bold text-white mb-2">
              Still have questions?
            </h2>
            <p className="text-white/60 text-[15px]">
              We're on WhatsApp — usually respond in under 10 minutes.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 relative">
            <a
              href="https://wa.me/526241234567"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5a] text-white rounded-full px-7 h-12 font-bold text-[14px] transition-colors shadow-lg whitespace-nowrap"
            >
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
            </a>
            <Link
              href="/shop"
              className="inline-flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full px-7 h-12 font-semibold text-[14px] transition-colors whitespace-nowrap"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
