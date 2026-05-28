"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import type { Farmer } from "@/lib/supabase/types";

interface Props {
  farmer: Farmer | null;
  action: (formData: FormData) => Promise<any>;
}

const input = "w-full h-11 px-4 rounded-xl border border-gray-200 bg-white text-[14px] text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#2D5016] focus:ring-2 focus:ring-[#2D5016]/10 transition";

export default function FarmerForm({ farmer, action }: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      const result = await action(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {farmer && <input type="hidden" name="id" value={farmer.id} />}
      {/* Keep emoji field with a fixed default so the DB column stays happy */}
      <input type="hidden" name="avatar_emoji" value="👨‍🌾" />

      <div>
        <label className="block text-[12px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Name *</label>
        <input
          name="name"
          required
          defaultValue={farmer?.name ?? ""}
          placeholder="e.g. Roberto Valdez"
          className={input}
        />
      </div>

      <div>
        <label className="block text-[12px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Location *</label>
        <input
          name="location"
          required
          defaultValue={farmer?.location ?? ""}
          placeholder="e.g. Rancho El Aguaje, Cabo"
          className={input}
        />
      </div>

      <div>
        <label className="block text-[12px] font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Bio</label>
        <textarea
          name="bio"
          defaultValue={farmer?.bio ?? ""}
          rows={4}
          placeholder="Brief story about this farmer…"
          className={`${input} h-auto pt-3 resize-none`}
        />
      </div>

      <label className="flex items-center gap-3 cursor-pointer select-none">
        <input type="hidden" name="active" value="false" />
        <input type="checkbox" name="active" value="true" defaultChecked={farmer?.active ?? true} className="sr-only peer" />
        <div className="relative w-11 h-6 bg-gray-200 peer-checked:bg-[#2D5016] rounded-full transition-colors after:content-[''] after:absolute after:top-1 after:left-1 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow after:transition-transform peer-checked:after:translate-x-5" />
        <span className="text-[13px] font-medium text-gray-600">Active (visible on site)</span>
      </label>

      {error && (
        <p className="px-4 py-3 bg-red-50 border border-red-100 rounded-xl text-[13px] text-red-600">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          disabled={pending}
          className="bg-[#2D5016] hover:bg-[#3D6B1F] disabled:opacity-60 text-white font-semibold text-[14px] rounded-xl px-8 h-11 transition-colors"
        >
          {pending ? "Saving…" : farmer ? "Save Changes" : "Add Farmer"}
        </button>
        <Link href="/admin/farmers" className="text-[14px] text-gray-400 hover:text-gray-600 px-4 h-11 flex items-center transition-colors">
          Cancel
        </Link>
      </div>
    </form>
  );
}
