"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const labels: Record<string, string> = {
  admin:    "Dashboard",
  products: "Products",
  orders:   "Orders",
  farmers:  "Farmers",
  new:      "New",
};

export default function AdminBreadcrumb() {
  const pathname = usePathname();

  // Build segments: ["admin", "products", "abc-id"]
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((seg, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    // If segment looks like a UUID, label it "Edit"
    const isId = /^[0-9a-f-]{36}$/i.test(seg);
    const label = isId ? "Edit" : (labels[seg] ?? seg);
    return { href, label };
  });

  return (
    <nav className="flex items-center gap-1.5 text-[13px]">
      {crumbs.map((c, i) => (
        <span key={c.href} className="flex items-center gap-1.5">
          {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-gray-300" />}
          {i === crumbs.length - 1 ? (
            <span className="font-semibold text-[#2D5016]">{c.label}</span>
          ) : (
            <Link href={c.href} className="text-gray-400 hover:text-[#2D5016] transition-colors">
              {c.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
