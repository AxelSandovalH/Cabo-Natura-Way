import Link from "next/link";
import { Plus, Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { deleteFarmerAction } from "@/app/admin/actions";
import AdminDeleteBtn from "@/components/admin/AdminDeleteBtn";

export default async function AdminFarmers() {
  const supabase = await createClient();
  const { data: farmers } = await supabase
    .from("farmers")
    .select("*")
    .order("created_at");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-heading text-3xl font-bold text-[#2D5016]">Farmers</h1>
          <p className="text-[14px] text-gray-500 mt-1">{farmers?.length ?? 0} producers total</p>
        </div>
        <Link
          href="/admin/farmers/new"
          className="inline-flex items-center gap-2 bg-[#2D5016] hover:bg-[#3D6B1F] text-white rounded-xl px-5 h-10 text-[13px] font-semibold transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Farmer
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {farmers?.map((f) => (
          <div key={f.id} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#2D5016]/10 flex items-center justify-center text-2xl flex-shrink-0">
                  {f.avatar_emoji}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-heading text-[16px] font-semibold text-[#2D5016]">{f.name}</h3>
                    {!f.active && (
                      <span className="text-[10px] font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        Inactive
                      </span>
                    )}
                  </div>
                  <p className="text-[12px] text-[#C4602A] font-medium mt-0.5">📍 {f.location}</p>
                  {f.bio && (
                    <p className="text-[12px] text-gray-500 mt-2 leading-relaxed line-clamp-2">{f.bio}</p>
                  )}
                </div>
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                <Link
                  href={`/admin/farmers/${f.id}`}
                  className="p-2 rounded-lg text-gray-400 hover:text-[#2D5016] hover:bg-[#2D5016]/8 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </Link>
                <AdminDeleteBtn id={f.id} action={deleteFarmerAction} label="farmer" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
