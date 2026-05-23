"use client";

import Link from "next/link";
import { ShoppingCart, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import AgaveLogo from "@/components/AgaveLogo";
import { useCart } from "@/lib/cart/CartContext";

const navLinks = [
  { href: "/shop",     label: "Shop"        },
  { href: "/farmers",  label: "Our Farmers" },
  { href: "/about",    label: "About"       },
  { href: "/delivery", label: "Delivery"    },
];

export default function Navbar() {
  const { totalItems, openCart } = useCart();

  return (
    <nav className="sticky top-0 z-50 bg-[#FAFAF7]/95 backdrop-blur-sm border-b border-[#2D5016]/12">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 h-16 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 flex-shrink-0">
          <AgaveLogo size={36} />
          <div className="leading-tight">
            <p className="font-heading text-[13px] font-bold tracking-[.16em] uppercase text-[#2D5016]">
              Cabo Natural Way
            </p>
            <p className="text-[9px] font-medium tracking-[.25em] uppercase text-[#6B5B4B]">
              Baja Farm to Table
            </p>
          </div>
        </Link>

        {/* Desktop links */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="text-[13px] font-medium tracking-wide text-[#6B5B4B] hover:text-[#2D5016] transition-colors"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-2">

          {/* Cart button */}
          <button
            onClick={openCart}
            aria-label={`Open cart — ${totalItems} items`}
            className="relative p-2 rounded-full text-[#2D5016] hover:bg-[#2D5016]/8 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#E8A838] text-white text-[9px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 shadow-sm">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            )}
          </button>

          {/* Desktop CTA */}
          <Link
            href="/shop"
            className="hidden md:inline-flex items-center bg-[#2D5016] hover:bg-[#3D6B1F] text-[#FAFAF7] rounded-full px-6 h-9 text-[13px] font-semibold tracking-wide transition-colors"
          >
            Shop Now
          </Link>

          {/* Mobile menu */}
          <Sheet>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="md:hidden text-[#2D5016]" />
              }
            >
              <Menu className="w-5 h-5" />
            </SheetTrigger>
            <SheetContent side="right" className="bg-[#FAFAF7] w-72">
              <div className="flex flex-col gap-6 mt-8">
                {navLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    className="font-heading text-xl font-semibold text-[#2D5016] hover:text-[#C4602A] transition-colors"
                  >
                    {l.label}
                  </Link>
                ))}
                <Link
                  href="/shop"
                  className="mt-4 inline-flex items-center justify-center bg-[#2D5016] text-[#FAFAF7] rounded-full px-6 h-9 font-semibold text-[14px] transition-colors hover:bg-[#3D6B1F]"
                >
                  Shop Now
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>

      </div>
    </nav>
  );
}
