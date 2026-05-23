"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, ShoppingBag, Users, LogOut, ExternalLink, X,
} from "lucide-react";
import AgaveLogo from "@/components/AgaveLogo";
import { logoutAction } from "@/app/admin/actions";

const navItems = [
  { href: "/admin",          label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products",  icon: Package          },
  { href: "/admin/orders",   label: "Orders",    icon: ShoppingBag      },
  { href: "/admin/farmers",  label: "Farmers",   icon: Users            },
];

function isActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === "/admin";
  return pathname.startsWith(href);
}

interface Props {
  email: string;
  mobileOpen?: boolean;
  onClose?: () => void;
}

export default function AdminSidebar({ email, mobileOpen, onClose }: Props) {
  const pathname = usePathname();

  return (
    <aside
      className={`
        w-60 flex-shrink-0 bg-[#1a2e0a] flex flex-col fixed inset-y-0 left-0 z-40
        transition-transform duration-300 ease-in-out
        ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
    >
      {/* Logo + mobile close */}
      <div className="px-5 py-6 border-b border-white/10 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-3" onClick={onClose}>
          <AgaveLogo size={32} />
          <div>
            <p className="font-heading text-[11px] font-bold tracking-[.16em] uppercase text-white">
              Cabo Natural Way
            </p>
            <p className="text-[9px] text-white/40 tracking-wider mt-0.5">Admin Panel</p>
          </div>
        </Link>
        <button
          onClick={onClose}
          className="lg:hidden text-white/40 hover:text-white transition-colors p-1"
          aria-label="Close menu"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all ${
                active
                  ? "bg-white/12 text-white"
                  : "text-white/55 hover:text-white hover:bg-white/8"
              }`}
            >
              <Icon
                className={`w-4 h-4 flex-shrink-0 transition-colors ${
                  active ? "text-[#E8A838]" : ""
                }`}
              />
              {label}
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#E8A838]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 border-t border-white/10 space-y-0.5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-white/40 hover:text-white hover:bg-white/8 transition-all"
        >
          <ExternalLink className="w-4 h-4 flex-shrink-0" />
          View Store
        </Link>

        <div className="px-3 py-2 text-[11px] text-white/25 truncate">{email}</div>

        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-white/40 hover:text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            Sign Out
          </button>
        </form>
      </div>
    </aside>
  );
}
