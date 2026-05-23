import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { upsertFarmerAction } from "@/app/admin/actions";
import FarmerForm from "@/components/admin/FarmerForm";

export default async function EditFarmerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";
  const supabase = await createClient();

  const { data: farmer } = isNew
    ? { data: null }
    : await supabase.from("farmers").select("*").eq("id", id).single();

  if (!isNew && !farmer) notFound();

  return (
    <div className="max-w-xl">
      <h1 className="font-heading text-3xl font-bold text-[#2D5016] mb-8">
        {isNew ? "Add Farmer" : "Edit Farmer"}
      </h1>
      <FarmerForm farmer={farmer} action={upsertFarmerAction} />
    </div>
  );
}
