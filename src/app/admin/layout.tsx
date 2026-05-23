import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminBreadcrumb from "@/components/admin/AdminBreadcrumb";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // No user → render children as-is (login page).
  // The proxy handles redirecting unauthenticated users away from protected routes.
  if (!user) return <>{children}</>;

  return (
    <div className="min-h-screen flex bg-[#F4F4F0]">

      <AdminSidebar email={user.email ?? ""} />

      <div className="ml-60 flex-1 min-h-screen">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-30">
          <AdminBreadcrumb />
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#2D5016]/10 flex items-center justify-center text-sm font-bold text-[#2D5016]">
              {user.email?.[0]?.toUpperCase() ?? "A"}
            </div>
            <span className="text-[13px] text-gray-500 hidden sm:block">{user.email}</span>
          </div>
        </header>

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
