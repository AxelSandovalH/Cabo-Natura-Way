"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import AdminSidebar from "./AdminSidebar";
import AdminBreadcrumb from "./AdminBreadcrumb";

interface Props {
  email: string;
  children: React.ReactNode;
}

export default function AdminShell({ email, children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-[#F4F4F0]">

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <AdminSidebar
        email={email}
        mobileOpen={open}
        onClose={() => setOpen(false)}
      />

      {/* Main content */}
      <div className="flex-1 min-h-screen lg:ml-60">

        {/* Top bar */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-20">
          <div className="flex items-center gap-3">
            {/* Hamburger — mobile only */}
            <button
              onClick={() => setOpen(true)}
              className="lg:hidden p-2 rounded-xl text-[#2D5016] hover:bg-[#2D5016]/8 transition-colors -ml-1"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <AdminBreadcrumb />
          </div>

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#2D5016]/10 flex items-center justify-center text-sm font-bold text-[#2D5016]">
              {email[0]?.toUpperCase() ?? "A"}
            </div>
            <span className="text-[13px] text-gray-500 hidden sm:block">{email}</span>
          </div>
        </header>

        <main className="p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
