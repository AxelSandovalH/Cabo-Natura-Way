import Link from "next/link";
import AgaveLogo from "@/components/AgaveLogo";

const shopLinks = [
  { href: "/shop", label: "All Products" },
  { href: "/shop/water", label: "Spring Water" },
  { href: "/shop/vegetables", label: "Vegetables" },
  { href: "/shop/fruits", label: "Fruits" },
  { href: "/shop/honey", label: "Honey & More" },
];

const companyLinks = [
  { href: "/about", label: "Our Story" },
  { href: "/farmers", label: "Our Farmers" },
  { href: "/sustainability", label: "Sustainability" },
];

const helpLinks = [
  { href: "/delivery", label: "Delivery Areas" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
  { href: "https://wa.me/", label: "WhatsApp" },
];

export default function Footer() {
  return (
    <footer className="bg-[#1a2e0a] text-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-3 mb-4">
            <AgaveLogo size={36} />
            <div className="leading-tight">
              <p className="font-heading text-[13px] font-bold tracking-[.16em] uppercase text-[#FAFAF7]">
                Cabo Natural Way
              </p>
              <p className="text-[9px] font-medium tracking-[.25em] uppercase text-white/50">
                Baja Farm to Table
              </p>
            </div>
          </div>
          <p className="text-sm text-white/55 leading-relaxed">
            Connecting the farmers of Baja California with families,
            expats and travelers who care about what they eat.
          </p>
        </div>

        {/* Shop */}
        <div>
          <h4 className="text-[11px] font-bold tracking-[.18em] uppercase text-[#E8A838] mb-4">
            Shop
          </h4>
          <ul className="space-y-2.5">
            {shopLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-[13px] text-white/60 hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-[11px] font-bold tracking-[.18em] uppercase text-[#E8A838] mb-4">
            Company
          </h4>
          <ul className="space-y-2.5">
            {companyLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-[13px] text-white/60 hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="text-[11px] font-bold tracking-[.18em] uppercase text-[#E8A838] mb-4">
            Help
          </h4>
          <ul className="space-y-2.5">
            {helpLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-[13px] text-white/60 hover:text-white transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-10 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-white/40">
          <span>© 2026 Cabo Natural Way. All rights reserved.</span>
          <span>Made with love in Baja California Sur 🌵</span>
        </div>
      </div>
    </footer>
  );
}
