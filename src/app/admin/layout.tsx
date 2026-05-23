import { createClient } from "@/lib/supabase/server";
import AdminShell from "@/components/admin/AdminShell";

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
    <AdminShell email={user.email ?? ""}>
      {children}
    </AdminShell>
  );
}
