"use client";

import { useState, useTransition } from "react";
import { loginAction } from "@/app/admin/actions";
import AgaveLogo from "@/components/AgaveLogo";

export default function AdminLogin() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await loginAction(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <AgaveLogo size={52} />
          <p className="font-heading text-[13px] font-bold tracking-[.18em] uppercase text-[#2D5016] mt-3">
            Cabo Natural Way
          </p>
          <p className="text-[11px] text-[#6B5B4B] tracking-wider mt-1">Admin Panel</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-[#2D5016]/10 p-8">
          <h1 className="font-heading text-2xl font-bold text-[#2D5016] mb-1">Welcome back</h1>
          <p className="text-[13px] text-[#6B5B4B] mb-7">Sign in to manage your store.</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[12px] font-semibold text-[#2D5016] mb-1.5 tracking-wide">
                Email
              </label>
              <input
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="admin@cabonatural.com"
                className="w-full h-11 px-4 rounded-xl border border-[#2D5016]/20 bg-[#FAFAF7] text-[14px] text-[#2D5016] placeholder:text-[#A89880] focus:outline-none focus:border-[#2D5016] focus:ring-2 focus:ring-[#2D5016]/10 transition"
              />
            </div>

            <div>
              <label className="block text-[12px] font-semibold text-[#2D5016] mb-1.5 tracking-wide">
                Password
              </label>
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full h-11 px-4 rounded-xl border border-[#2D5016]/20 bg-[#FAFAF7] text-[14px] text-[#2D5016] placeholder:text-[#A89880] focus:outline-none focus:border-[#2D5016] focus:ring-2 focus:ring-[#2D5016]/10 transition"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-[12px] px-4 py-3 rounded-xl">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={pending}
              className="w-full h-11 bg-[#2D5016] hover:bg-[#3D6B1F] disabled:opacity-60 text-white font-semibold text-[14px] rounded-xl transition-colors"
            >
              {pending ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        <p className="text-center text-[11px] text-[#A89880] mt-6">
          Cabo Natural Way © 2026
        </p>
      </div>
    </div>
  );
}
